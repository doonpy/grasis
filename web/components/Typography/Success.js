import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import styles from '../../assets/jss/nextjs-material-dashboard/components/typographyStyle.js';

const useStyles = makeStyles(styles);

export default function Success(props) {
  const classes = useStyles();
  const { children } = props;
  return <div className={classes.defaultFontStyle + ' ' + classes.successText}>{children}</div>;
}

Success.propTypes = {
  children: PropTypes.node
};
