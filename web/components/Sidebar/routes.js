import BubbleChart from '@material-ui/icons/BubbleChart';
import Dashboard from '@material-ui/icons/Dashboard';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import LocationOn from '@material-ui/icons/LocationOn';
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';

const mainRoutes = [
  {
    path: '/graduation-thesis',
    name: 'Khoá',
    icon: Dashboard
  },
  {
    path: '/user-profile',
    name: 'User Profile',
    icon: Person,
    layout: '/admin'
  },
  {
    path: '/table-list',
    name: 'Table List',
    icon: 'content_paste',
    layout: '/admin'
  },
  {
    path: '/typography',
    name: 'Typography',
    icon: LibraryBooks,
    layout: '/admin'
  },
  {
    path: '/icons',
    name: 'Icons',
    icon: BubbleChart,
    layout: '/admin'
  },
  {
    path: '/maps',
    name: 'Maps',
    icon: LocationOn,
    layout: '/admin'
  },
  {
    path: '/notifications',
    name: 'Notifications',
    icon: Notifications,
    layout: '/admin'
  }
];

export default mainRoutes;
