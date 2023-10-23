import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MSMLayout.vue'),

    children: [
      {
        path: 'disponibilidad/',
        component: () => import('pages/Disponibilidad.vue'),
      },
      {
        path: 'disponibilidad/:itemcode',
        component: () => import('pages/Disponibilidad.vue'),
      },
      {
        path: 'packages',
        component: () => import('pages/PackageWizard.vue'),
      },
      {
        path: 'transfersin',
        component: () => import('pages/TransfersIn.vue'),
      },
      {
        path: 'transfersout',
        component: () => import('pages/TransfersOut.vue'),
      },
      {
        path: 'transfer/:transferId',
        component: () => import('pages/Transfer.vue'),
        props: true,
      },
      {
        path: 'reservas',
        component: () => import('pages/Reservas.vue'),
      },
      {
        path: 'reservas/:reservationId',
        component: () => import('pages/ReservasEditar.vue'),
        props: true,
      },
      {
        path: 'stockrequested',
        component: () => import('pages/StockRequested.vue'),
      },
      {
        path: 'stockwhs',
        component: () => import('pages/Stock.vue'),
      },
      { path: 'config', component: () => import('pages/Config.vue') },
      { path: 'mapping', component: () => import('pages/Mapping.vue') },
      { path: 'users', component: () => import('pages/Users.vue') },
      { path: 'profiles', component: () => import('pages/Profiles.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
