import Error404Page from './Error404Page';
import authRoles from '../../auth/authRoles';

const Error404Config = {
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
      path: '404',
      element: <Error404Page />,
    },
  ],
};

export default Error404Config;
