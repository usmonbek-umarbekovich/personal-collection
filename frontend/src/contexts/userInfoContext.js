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

  const handleVisibility = useCallback(() => {
    if (document.visibilityState === 'visible') {
      if (user) return userService.updateUser(user._id, { online: true });
    }

    if (document.visibilityState === 'hidden') {
      if (socket) socket.close();
      if (user)
        userService.updateUser(user._id, {
          online: false,
          lastSeen: new Date(),
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    handleVisibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;

    const controller = new AbortController();

    socket.addEventListener(
      'message',
      e => {
        if (!user) return;
        const change = JSON.parse(e.data);
        if (!(change.ns.coll === 'users')) return;

        const userId = change.documentKey._id;
        if (change.operationType === 'update') {
          const { updatedFields } = change.updateDescription;
          if (updatedFields.active === false && userId === user._id) {
            toast.error('You have been blocked');
            logoutUser();
          }
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

  useEffect(() => {
    const ws = new WebSocket('wss://usmonbek-collection.herokuapp.com');
    ws.onopen = () => setSocket(ws);
    ws.onerror = () => toast.error('WebSocket error');
  }, []);

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
