import { lazy } from 'react';
import InformeView from './informe/InformeView';
import InformeForm from './informe/InformeForm';
import { authRoles } from '../../auth';

const InformesApp = lazy(() => import('./InformesApp'));

const InformesAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.lider,
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
