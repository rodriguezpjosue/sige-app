import { lazy } from 'react';
import IntegranteView from './integrante/IntegranteView';
import IntegranteForm from './integrante/IntegranteForm';
import { authRoles } from '../../auth';

const IntegrantesApp = lazy(() => import('./IntegrantesApp'));

const IntegrantesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lider,
  routes: [
    {
      path: 'integrantes',
      element: <IntegrantesApp />,
      children: [
        {
          path: ':id',
          element: <IntegranteView />,
        },
        {
          path: ':id/edit',
          element: <IntegranteForm />,
        },
      ],
    },
  ],
};

export default IntegrantesAppConfig;
