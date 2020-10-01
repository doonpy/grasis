import React from 'react';

import Primary from '../components/Typography/Primary';

export const LECTURER_LIMIT = 20;

export function formatLecturerForGetOn({ lecturerId, level, createdAt, updatedAt }) {
  return [
    [
      <Primary key={'lecturerId'}>
        <b>Mã giảng viên</b>
      </Primary>,
      lecturerId
    ],
    [
      <Primary key={'level'}>
        <b>Trình độ</b>
      </Primary>,
      level
    ],
    [
      <Primary key={'createdAt'}>
        <b>Ngày tạo</b>
      </Primary>,
      new Date(createdAt).toLocaleString()
    ],
    [
      <Primary key={'createdAt'}>
        <b>Ngày tạo</b>
      </Primary>,
      new Date(updatedAt).toLocaleString()
    ]
  ];
}
