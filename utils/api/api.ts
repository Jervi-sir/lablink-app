export const SERVER_IP = 'lablink.jervi.dev';
// export const SERVER_IP = '192.168.1.105:8000';
export const SERVER_URL = 'https://' + SERVER_IP;

export const BASE_URL = SERVER_URL + '/api/';

export const ApiRoutes = {
  base: '/',
  app: {
    checkUpdate: 'check-update',
  },

  auth: {
    me: 'auth/me',
    login: 'auth/login',
    logout: 'auth/logout',
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
    },
  },

  taxonomies: 'taxonomies',

  businesses: {
    show: 'businesses/:id',
    update: 'businesses/:id',
    toggleFollow: 'businesses/:id/toggle-follow',
    toggleSave: 'businesses/:id/toggle-save',
    featuredLabs: 'businesses/featured-labs',
    featuredSuppliers: 'businesses/featured-suppliers',
    topLabs: 'businesses/top-labs',
    uploadLogo: 'businesses/:id/logo',
    uploadCertificate: 'businesses/:id/certificate',
    deleteCertificate: 'businesses/:id/certificate',
    reviews: 'businesses/:id/reviews',
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
    index: 'products',
  },

  lab: {
    products: 'lab/products',
    stats: 'lab/stats',
  },

  search: {
    global: 'search',
    products: 'search/products',
    businesses: 'search/businesses',
    laboratories: 'search/laboratory',
    laboratoryProducts: 'search/laboratory/products',
    randomLaboratories: 'search/laboratory/random',
  },

  labs: {
    index: 'labs',
    show: 'labs/:id',
    products: 'labs/:id/products',
  },

  orders: {
    index: 'orders',
    store: 'orders',
    show: 'orders/:id',
    updateStatus: 'orders/:id/status',
    sign: 'orders/:id/signature',
    read: 'orders/:id/read',
    contract: 'orders/:id/contract',
    businessIndex: 'business/orders',
    laboratoryIndex: 'laboratory/orders',
  },

  estimationRequests: {
    index: 'estimation-requests',
    store: 'estimation-requests',
    show: 'estimation-requests/:id',
    businessIndex: 'business/estimation-requests',
  },

  conversations: {
    index: 'conversations',
    show: 'conversations/:id',
    store: 'conversations',
    sendMessage: 'conversations/:id/messages',
  },

  collections: {
    savedProducts: 'collections/saved-products',
    savedBusinesses: 'collections/saved-businesses',
    followedBusinesses: 'collections/followed-businesses',
  },

  students: {
    updateMe: 'students/me',
    show: 'students/:id',
    rate: 'students/:id/reviews',
  },

  uploads: {
    temp: 'upload-temp',
  },
};

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
