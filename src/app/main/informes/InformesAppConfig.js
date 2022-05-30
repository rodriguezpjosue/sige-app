import { lazy } from 'react';
import InformeView from './informe/InformeView';
import InformeForm from './informe/InformeForm';

const InformesApp = lazy(() => import('./InformesApp'));

const InformesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'informes',
      element: <InformesApp />,
      children: [
        {
          path: ':id',
          element: <InformeView />,
        },
        {
          path: ':id/edit',
          element: <InformeForm />,
        },
      ],
    },
  ],
};

export default InformesAppConfig;
