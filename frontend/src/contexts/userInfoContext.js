import React, { useState, useContext, useEffect } from 'react';
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

  const navigate = useNavigate();

  useEffect(() => {
    if (error) toast.error(error);

    return () => {
      setError('');
    };
  }, [navigate, error]);

  const logoutUser = () => {
    authService.logout();
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
