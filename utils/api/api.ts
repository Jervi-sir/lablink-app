export const SERVER_IP = 'http://192.168.1.101:8000'
export const SERVER_URL = 'http://192.168.1.101:8000'
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
    }
  },

  taxonomies: 'taxonomies',       // []
  stores: {
    //   profileUrl: 'stores/url/:os_id',    // []
    // show: 'stores/show/:os_id',         // []
  },

  businesses: {
    featuredLabs: 'businesses/featured-labs',
    topLabs: 'businesses/top-labs',
  },
  products: {
    trending: 'products/trending-products',
    recent: 'products/recent',
  },
  search: 'search',
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
