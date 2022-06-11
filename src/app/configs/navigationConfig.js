import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import es from './navigation-i18n/es';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);
i18next.addResourceBundle('es', 'navigation', es);

const navigationConfig = [
  {
    id: 'formacions-group',
    title: 'Formación',
    subtitle: 'Cursos completados, Aperturas.',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'FORMACION',
    children: [
      {
        id: 'aperturas-formacion',
        title: 'Aperturas',
        translate: 'APERTURAS',
        type: 'item',
        icon: 'heroicons-outline:document-text',
        url: 'aperturas',
      },
    ],
  },
  {
    id: 'redes-group',
    title: 'Redes',
    subtitle: 'Informes de reunión, integrantes de la red.',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'REDES',
    children: [
      {
        id: 'integrantes-redes',
        title: 'Integrantes',
        translate: 'INTEGRANTES',
        type: 'item',
        icon: 'heroicons-outline:user-group',
        url: 'integrantes',
      },
      {
        id: 'informes-redes',
        title: 'Informes',
        translate: 'INFORMES',
        type: 'item',
        icon: 'heroicons-outline:document-text',
        url: 'informes',
      },
    ],
  },
];

export default navigationConfig;
