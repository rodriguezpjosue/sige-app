import { lazy } from 'react';
import AperturaView from './apertura/AperturaView';
import SesionView from './apertura/SesionView';
import AperturaForm from './apertura/AperturaForm';
import { authRoles } from '../../auth';

const AperturasApp = lazy(() => import('./AperturasApp'));

const AperturasAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.tutor,
  routes: [
    {
      path: 'aperturas',
      element: <AperturasApp />,
      children: [
        {
          path: ':id',
          element: <AperturaView />,
        },
        {
          path: ':id/edit',
          element: <AperturaForm />,
        },
        {
          path: 'sesiones/:id',
          element: <SesionView />,
        },
      ],
    },
  ],
};

export default AperturasAppConfig;
