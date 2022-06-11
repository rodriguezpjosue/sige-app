import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Config from '../main/404/Error404Config';
import IntegrantesAppConfig from '../main/integrantes/IntegrantesAppConfig';
import InformesAppConfig from '../main/informes/InformesAppConfig';
import AperturasAppConfig from '../main/aperturas/AperturasAppConfig';
import ForgotPasswordPageConfig from '../main/forgot-password/ForgotPasswordPageConfig';

const routeConfigs = [
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  IntegrantesAppConfig,
  InformesAppConfig,
  Error404Config,
  ForgotPasswordPageConfig,
  AperturasAppConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/informes" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'integrantes',
    element: <Navigate to="/integrantes" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'informes',
    element: <Navigate to="/informes" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'aperturas',
    element: <Navigate to="/aperturas" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  // {
  //  path: '404',
  //  element: <Error404Page />,
  // },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
