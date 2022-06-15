import { lazy } from 'react';
import AperturaView from './apertura/AperturaView';
import SesionView from './apertura/SesionView';
import AperturaForm from './apertura/AperturaForm';

const AperturasApp = lazy(() => import('./AperturasApp'));

const AperturasAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
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
