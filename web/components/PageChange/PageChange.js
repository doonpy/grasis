import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { infoColor, title } from '../../assets/jss/nextjs-material-dashboard.js';

const useStyles = makeStyles({
  progress: {
    color: infoColor,
    width: '6rem !important',
    height: '6rem !important'
  },
  wrapperDiv: {
    margin: '100px auto',
    padding: '0px',
    maxWidth: '360px',
    textAlign: 'center',
    position: 'relative',
    zIndex: '9999',
    top: '0'
  },
  iconWrapper: {
    display: 'block'
  },
  title: {
    ...title,
    color: '#FFFFFF'
  }
});

export default function PageChange(props) {
  const classes = useStyles();
  console.log(props);
  return (
    <div>
      <div className={classes.wrapperDiv}>
        <div className={classes.iconWrapper}>
          <CircularProgress className={classes.progress} />
        </div>
        <h4 className={classes.title}>Đang tải dữ liệu cho {props.path}</h4>
      </div>
    </div>
  );
}
