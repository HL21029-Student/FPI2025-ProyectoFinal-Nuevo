const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
  },
  {
    path: '/producto/:id',
    component: () => import('pages/ProductoDetalle.vue'),
  },
  {
    path: '/estadisticas',
    component: () => import('pages/EstadisticasPage.vue'),
  },
  {
    path: '/carrito',
    component: () => import('pages/CarritoPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
