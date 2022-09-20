import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLocalStorage from '../hooks/useLocalStorage';
import authService from '../services/authService';
import userService from '../services/userService';

const UserInfoContext = React.createContext();

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export default function UserInfoProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  const handleWindowClose = useCallback(() => {
    if (socket) socket.close();
    if (user)
      userService.updateUser(user._id, {
        online: false,
        lastSeen: new Date(),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVisibility = useCallback(() => {
    if (document.visibilityState === 'visible') {
      if (user) return userService.updateUser(user._id, { online: true });
    }

    if (document.visibilityState === 'hidden') {
      handleWindowClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    handleVisibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const ws = new WebSocket('wss://usmonbek-collection.herokuapp.com');
    ws.onopen = () => setSocket(ws);
    ws.onerror = () => toast.error('WebSocket error');

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleWindowClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;

    const controller = new AbortController();

    socket.addEventListener(
      'message',
      e => {
        const change = JSON.parse(e.data);
        if (
          !user ||
          change.documentKey._id !== user._id ||
          change.operationType !== 'update'
        )
          return;

        const { updatedFields } = change.updateDescription;
        if (change.ns.coll === 'sessions' && updatedFields.expires != null) {
          return setUser(prevUser => ({
            ...prevUser,
            expires: updatedFields.expires,
          }));
        }

        if (change.ns.coll === 'users' && updatedFields.active === false) {
          toast.error('You have been blocked');
          return logoutUser();
        }
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => setError('');
  }, [navigate, error]);

  const logoutUser = async () => {
    await userService.updateUser(user._id, {
      online: false,
      lastSeen: new Date(),
    });
    await authService.logout();
    setUser(null);
    navigate('/');
  };

  const loginUser = async data => {
    const response = await authService.login(data);
    parseData(response);
  };

  const registerUser = async ({ data }) => {
    const response = await authService.register(data);
    parseData(response);
  };

  const updateUser = async ({ id, data }) => {
    const response = await userService.updateUser(id, data);
    parseData(response);
  };

  function parseData(response) {
    if (response.statusText === 'OK') setUser(response.data);
    else setError(response.data.message);
  }

  const value = {
    user,
    socket,
    loginUser,
    registerUser,
    logoutUser,
    updateUser,
  };

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
}
