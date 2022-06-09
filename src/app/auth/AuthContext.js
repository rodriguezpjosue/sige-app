import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import { Navigate } from 'react-router-dom';
import sigeService from './services/sigeService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    sigeService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Bienvenido nuevamente' }));

      /**
       * Sign in and retrieve user data with stored token
       */
      sigeService
        .signInWithToken()
        .then((user) => {
          success(user, 'Bienvenido nuevamente');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    sigeService.on('onLogin', (user) => {
      success(user, 'Bienvenido');
    });

    sigeService.on('onLogout', () => {
      pass('Hasta pronto');
      dispatch(logoutUser());
    });

    sigeService.on('onAutoLogout', (message) => {
      pass(message);
      dispatch(logoutUser());
    });

    sigeService.on('onNoAccessToken', () => {
      pass();
    });

    sigeService.on('onPasswordResetLink', () => {
      dispatch(
        showMessage({
          message: 'Revise su correo electrónico y siga las instrucciones que allí se indican. ',
          variant: 'success',
          autoHideDuration: 6000,
        })
      );
      setTimeout(() => {
        window.location = '/';
      }, 3000);
    });

    sigeService.init();

    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([
        dispatch(setUser(user)),
        // You can receive data in here before app initialization
      ]).then((values) => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
