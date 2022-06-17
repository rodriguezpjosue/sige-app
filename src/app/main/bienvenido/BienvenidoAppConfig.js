import i18next from 'i18next';

import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import es from './i18n/es';
import Bienvenido from './Bienvenido';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);
i18next.addResourceBundle('es', 'examplePage', es);

const BienvenidoAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'bienvenido',
      element: <Bienvenido />,
    },
  ],
};

export default BienvenidoAppConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const Example = lazy(() => import('./Example'));

const ExampleConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'example',
      element: <Example />,
    },
  ],
};

export default ExampleConfig;
*/
