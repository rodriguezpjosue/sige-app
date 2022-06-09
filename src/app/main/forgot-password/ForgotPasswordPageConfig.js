import { lazy } from 'react';
import authRoles from '../../auth/authRoles';

const ClassicForgotPasswordPage = lazy(() => import('./ClassicForgotPasswordPage'));

const ForgotPasswordPageConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'forgot-password',
      element: <ClassicForgotPasswordPage />,
    },
  ],
};

export default ForgotPasswordPageConfig;
