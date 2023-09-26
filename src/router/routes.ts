import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MSMLayout.vue'),

    children: [
      { path: 'config', component: () => import('pages/Config.vue') },
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
