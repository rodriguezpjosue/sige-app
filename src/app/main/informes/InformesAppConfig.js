import { lazy } from 'react';
import IntegranteView from './integrante/IntegranteView';
import IntegranteForm from './integrante/IntegranteForm';

const IntegrantesApp = lazy(() => import('./IntegrantesApp'));

const IntegrantesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
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
