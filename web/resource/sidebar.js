import Icon from '@ant-design/icons';
import React from 'react';

import ChalkBoardTeacher from '../assets/svg/regular/chalkboard-teacher.svg';
import FileSearch from '../assets/svg/regular/file-search.svg';
import FlagAlt from '../assets/svg/regular/flag-alt.svg';
import GraduationCap from '../assets/svg/regular/graduation-cap.svg';
import LightBulbOn from '../assets/svg/regular/lightbulb-on.svg';
import PenFancy from '../assets/svg/regular/pen-fancy.svg';
import Shield from '../assets/svg/regular/shield.svg';
import UserGraduate from '../assets/svg/regular/user-graduate.svg';
import { IS_ADMIN, USER_TYPE } from './user';

export const SidebarKey = {
  GRADUATION_THESIS: '0',
  TOPIC: '1',
  REGISTER_TOPIC: '2',
  PROGRESS_REPORT: '3',
  REVIEW: '4',
  DEFENSE: '5',
  ADMIN_LECTURER: '6',
  ADMIN_STUDENT: '7'
};

export const SidebarItem = [
  {
    key: SidebarKey.GRADUATION_THESIS,
    icon: <Icon component={GraduationCap} />,
    text: 'Khóa luận',
    href: '/graduation-thesis',
    adminPermission: IS_ADMIN.FALSE,
    userTypes: [USER_TYPE.LECTURER, USER_TYPE.STUDENT]
  },
  {
    key: SidebarKey.TOPIC,
    icon: <Icon component={LightBulbOn} />,
    text: 'Topic',
    href: '/topic',
    adminPermission: IS_ADMIN.FALSE,
    userTypes: [USER_TYPE.LECTURER]
  },
  {
    key: SidebarKey.REGISTER_TOPIC,
    icon: <Icon component={PenFancy} />,
    text: 'Đăng ký đề tài',
    href: '/register-topic',
    adminPermission: IS_ADMIN.FALSE,
    userTypes: [USER_TYPE.LECTURER, USER_TYPE.STUDENT]
  },
  {
    key: SidebarKey.PROGRESS_REPORT,
    icon: <Icon component={FlagAlt} />,
    text: 'Báo cáo tiến độ',
    href: '/progress-report',
    adminPermission: IS_ADMIN.FALSE,
    userTypes: [USER_TYPE.LECTURER, USER_TYPE.STUDENT]
  },
  {
    key: SidebarKey.REVIEW,
    icon: <Icon component={FileSearch} />,
    text: 'Phản biện',
    href: '/review',
    adminPermission: IS_ADMIN.FALSE,
    userTypes: [USER_TYPE.LECTURER, USER_TYPE.STUDENT]
  },
  {
    key: SidebarKey.DEFENSE,
    icon: <Icon component={Shield} />,
    text: 'Bảo vệ',
    href: '/defense',
    adminPermission: IS_ADMIN.FALSE,
    userTypes: [USER_TYPE.LECTURER, USER_TYPE.STUDENT]
  },
  {
    key: SidebarKey.ADMIN_LECTURER,
    icon: <Icon component={ChalkBoardTeacher} />,
    text: 'Quản lý giảng viên',
    href: '/admin/lecturer',
    adminPermission: IS_ADMIN.TRUE,
    userTypes: [USER_TYPE.LECTURER, USER_TYPE.STUDENT]
  },
  {
    key: SidebarKey.ADMIN_STUDENT,
    icon: <Icon component={UserGraduate} />,
    text: 'Quản lý sinh viên',
    href: '/admin/student',
    adminPermission: IS_ADMIN.TRUE,
    userTypes: [USER_TYPE.LECTURER, USER_TYPE.STUDENT]
  }
];
