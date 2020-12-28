import Icon from '@ant-design/icons';
import React from 'react';

import ChalkBoardTeacher from '../../assets/svg/regular/chalkboard-teacher.svg';
import GraduationCap from '../../assets/svg/regular/graduation-cap.svg';
import UserGraduate from '../../assets/svg/regular/user-graduate.svg';
import { ThesisTerminology } from '../../assets/terminology/thesis.terminology';
import { SIDER_KEYS } from '../../libs/common/common.resource';
import { LECTURER_ADMIN_PATH_ROOT } from '../../libs/lecturer/lecturer.resource';
import { STUDENT_ADMIN_PATH_ROOT } from '../../libs/student/student.resource';
import { THESIS_PATH_ROOT } from '../../libs/thesis/thesis.resource';
import { IsAdmin, UserType } from '../../libs/user/user.resource';

export const SIDER_ITEMS = [
  {
    key: SIDER_KEYS.THESIS,
    icon: <Icon component={GraduationCap} />,
    text: ThesisTerminology.THESIS_27,
    href: THESIS_PATH_ROOT,
    adminPermission: IsAdmin.FALSE,
    allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
  },
  {
    key: SIDER_KEYS.ADMIN_LECTURER,
    icon: <Icon component={ChalkBoardTeacher} />,
    text: 'Quản lý giảng viên',
    href: LECTURER_ADMIN_PATH_ROOT,
    adminPermission: IsAdmin.TRUE,
    allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
  },
  {
    key: SIDER_KEYS.ADMIN_STUDENT,
    icon: <Icon component={UserGraduate} />,
    text: 'Quản lý sinh viên',
    href: STUDENT_ADMIN_PATH_ROOT,
    adminPermission: IsAdmin.TRUE,
    allowUserTypes: [UserType.LECTURER, UserType.STUDENT]
  }
];
