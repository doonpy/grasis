import Icon from '@ant-design/icons';
import React from 'react';

import ChalkBoardTeacher from '../../assets/svg/regular/chalkboard-teacher.svg';
// import FileSearch from '../../assets/svg/regular/file-search.svg';
// import FlagAlt from '../../assets/svg/regular/flag-alt.svg';
import GraduationCap from '../../assets/svg/regular/graduation-cap.svg';
// import LightBulbOn from '../../assets/svg/regular/lightbulb-on.svg';
// import PenFancy from '../../assets/svg/regular/pen-fancy.svg';
// import Shield from '../../assets/svg/regular/shield.svg';
import UserGraduate from '../../assets/svg/regular/user-graduate.svg';
import { SIDER_KEYS } from '../../libs/common/common.resource';
import { THESIS_PATH_ROOT } from '../../libs/thesis/thesis.resource';
import { IsAdmin, UserType } from '../../libs/user/user.resource';

export const SIDER_ITEMS = [
  {
    key: SIDER_KEYS.THESIS,
    icon: <Icon component={GraduationCap} />,
    text: 'Khóa luận',
    href: THESIS_PATH_ROOT,
    adminPermission: IsAdmin.FALSE,
    allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
  },
  // {
  //   key: SIDER_KEYS.TOPIC,
  //   icon: <Icon component={LightBulbOn} />,
  //   text: 'Topic',
  //   href: '/topic',
  //   adminPermission: IsAdmin.FALSE,
  //   userTypes: [UserType.LECTURER]
  // },
  // {
  //   key: SIDER_KEYS.REGISTER_TOPIC,
  //   icon: <Icon component={PenFancy} />,
  //   text: 'Đăng ký đề tài',
  //   href: '/register-topic',
  //   adminPermission: IsAdmin.FALSE,
  //   userTypes: [UserType.LECTURER, UserType.STUDENT]
  // },
  // {
  //   key: SIDER_KEYS.PROGRESS_REPORT,
  //   icon: <Icon component={FlagAlt} />,
  //   text: 'Báo cáo tiến độ',
  //   href: '/progress-report',
  //   adminPermission: IsAdmin.FALSE,
  //   userTypes: [UserType.LECTURER, UserType.STUDENT]
  // },
  // {
  //   key: SIDER_KEYS.REVIEW,
  //   icon: <Icon component={FileSearch} />,
  //   text: 'Phản biện',
  //   href: '/review',
  //   adminPermission: IsAdmin.FALSE,
  //   userTypes: [UserType.LECTURER, UserType.STUDENT]
  // },
  // {
  //   key: SIDER_KEYS.DEFENSE,
  //   icon: <Icon component={Shield} />,
  //   text: 'Bảo vệ',
  //   href: '/defense',
  //   adminPermission: IsAdmin.FALSE,
  //   userTypes: [UserType.LECTURER, UserType.STUDENT]
  // },
  {
    key: SIDER_KEYS.ADMIN_LECTURER,
    icon: <Icon component={ChalkBoardTeacher} />,
    text: 'Quản lý giảng viên',
    href: '/admin/lecturer',
    adminPermission: IsAdmin.TRUE,
    allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
  },
  {
    key: SIDER_KEYS.ADMIN_STUDENT,
    icon: <Icon component={UserGraduate} />,
    text: 'Quản lý sinh viên',
    href: '/admin/student',
    adminPermission: IsAdmin.TRUE,
    allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
  }
];
