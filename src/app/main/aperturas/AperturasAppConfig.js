import { lazy } from 'react';
import AperturaView from './apertura/AperturaView';
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
      ],
    },
  ],
};

export default AperturasAppConfig;
