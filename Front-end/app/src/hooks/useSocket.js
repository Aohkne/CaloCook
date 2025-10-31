import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import socketManager from '@/configs/socketManager';

export const useSocket = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { isConnected } = useSelector((state) => state.chat);

  useEffect(() => {
    // Connect socket When user  authenticated + token
    if (isAuthenticated && token) {
      // console.log('User authenticated, connecting socket...');
      socketManager.connect();
    } else {
      // console.log('User not authenticated or no token, disconnecting socket...');
      socketManager.disconnect();
    }

    return () => {
      socketManager.disconnect();
    };
  }, [token, isAuthenticated]);

  return {
    isConnected,
    connect: socketManager.connect.bind(socketManager),
    disconnect: socketManager.disconnect.bind(socketManager)
  };
};
