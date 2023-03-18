import * as Paths from './paths';
import SignUp from '../components/Auth/SignUp';
import Products from '../components/Products';

export const authRoutes = [
  {
    title: 'Home',
    path: Paths.ROOT_PATH,
    exact: true,
    component: SignUp,
  },
  {
    title: 'SignUp',
    path: Paths.AUTH_SIGN_UP,
    exact: true,
    component: SignUp,
  },
  {
    title: 'Products list',
    path: Paths.PRODUCTS_LIST,
    exact: true,
    component: Products,
  },
];

export const mainRoutes = [];
