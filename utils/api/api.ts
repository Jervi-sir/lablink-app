export const SERVER_IP = 'http://192.168.1.100:8000'
export const SERVER_URL = 'http://192.168.1.100:8000'
export const BASE_URL = SERVER_URL + '/api/'

export const UPLOAD_URL = 'https://uploads.octaprize.com/'

export const ApiRoutes = {
  base: '/',
  app: {
    checkUpdate: 'check-update',    // [done]
  },

  auth: {
    student: {
      login: 'auth/student/login',
      register: 'auth/student/register',
      logout: 'auth/student/logout',
      me: 'auth/student/me',
      pushToken: 'auth/student/push-token',
      notificationSettings: 'auth/student/notification-settings',
    },
    business: {
      login: 'auth/business/login',
      register: 'auth/business/register',
      logout: 'auth/business/logout',
      me: 'auth/business/me',
      pushToken: 'auth/business/push-token',
      notificationSettings: 'auth/business/notification-settings',
    }
  },

  taxonomies: 'taxonomies',       // []
  stores: {
    //   profileUrl: 'stores/url/:os_id',    // []
    // show: 'stores/show/:os_id',         // []
  },

  businesses: {
    show: 'businesses/:id',
    me: 'businesses/me',
    update: 'businesses/:id',
    products: 'businesses/:id/products',
    toggleFollow: 'businesses/:id/toggle-follow',
    toggleSave: 'businesses/:id/toggle-save',
    featuredLabs: 'businesses/featured-labs',
    topLabs: 'businesses/top-labs',
    uploadLogo: 'businesses/:id/logo',
    uploadCertificate: 'businesses/:id/certificate',
    deleteCertificate: 'businesses/:id/certificate',
  },
  products: {
    show: 'products/:id',
    store: 'products',
    update: 'products/:id',
    destroy: 'products/:id',
    toggleSave: 'products/:id/toggle-save',
    trending: 'products/trending-products',
    recent: 'products/recent',
    inventory: 'business/inventory',
    uploadImages: 'products/:id/images',
    deleteImage: 'product-images/:id',
    setMainImage: 'product-images/:id/set-main',
  },
  search: 'search',
  orders: {
    index: 'orders',
    store: 'orders',
    show: 'orders/:id',
    businessOrders: 'business/orders',
    updateStatus: 'orders/:id/status',
  },
  conversations: {
    index: 'conversations',
    show: 'conversations/:id',
    store: 'conversations',
    sendMessage: 'conversations/:id/messages',
  },
  stats: 'stats',
  collections: {
    savedProducts: 'collections/saved-products',
    savedBusinesses: 'collections/saved-businesses',
    followedBusinesses: 'collections/followed-businesses',
  },
  students: {
    updateMe: 'students/me',
  },
}

// @ts-ignore
export const buildRoute = (route, params = {}) => {
  let path = route;
  Object.keys(params).forEach((key) => {
    // @ts-ignore
    path = path.replace(`:${key}`, params[key]);
  });
  path = path.replace(/^\//, '');
  return `${BASE_URL}${path}`;
};
