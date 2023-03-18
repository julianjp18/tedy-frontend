import * as Paths from './paths';
import SignUp from '../components/Auth/SignUp';
import Products from '../components/Products';
import ProductsStatistics from '../components/Products/Statistics';
import Dispatches from '../components/Dispatches';

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
  {
    title: 'Products statistics',
    path: Paths.PRODUCT_STATISTICS,
    exact: true,
    component: ProductsStatistics,
  },
  {
    title: 'Dispatches',
    path: Paths.DISPATCHES,
    exact: true,
    component: Dispatches,
  }
  /*
  {
    title: 'Campaigns show',
    path: Paths.SHOW_CAMPAIGN(':id'),
    exact: true,
    component: ShowCampaign,
  },
  */
];

export const mainRoutes = [];
