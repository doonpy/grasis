import BarChartIcon from '@material-ui/icons/BarChart';
import DescriptionIcon from '@material-ui/icons/Description';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import GroupIcon from '@material-ui/icons/Group';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import RateReviewIcon from '@material-ui/icons/RateReview';
import School from '@material-ui/icons/School';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

export const normalRoutes = [
  {
    path: '/graduation-thesis',
    name: 'Khoá luận',
    icon: School
  },
  {
    path: '/topic',
    name: 'Đề tài',
    icon: DescriptionIcon
  },
  {
    path: '/register-topic',
    name: 'Đăng ký đề tài',
    icon: MenuOpenIcon
  },
  {
    path: '/progress-report',
    name: 'Báo cáo tiến độ',
    icon: BarChartIcon
  },
  {
    path: '/review',
    name: 'Phản biện',
    icon: RateReviewIcon
  },
  {
    path: '/defense',
    name: 'Bảo vệ khóa luận',
    icon: GroupWorkIcon
  }
];

export const adminRoutes = [
  {
    path: '/admin/lecturer',
    name: 'Giảng viên',
    icon: GroupIcon
  },
  {
    path: '/admin/student',
    name: 'Sinh viên',
    icon: EmojiPeopleIcon
  },
  {
    path: '/admin/council',
    name: 'Hội đồng khoá luận',
    icon: SupervisorAccountIcon
  }
];
