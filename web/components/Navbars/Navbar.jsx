import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import React from 'react';

import styles from '../../assets/jss/components/headerStyle.js';
import Button from '../CustomButtons/Button';
import AdminNavbarLinks from './AdminNavbarLinks.jsx';

const useStyles = makeStyles(styles);

function Narbar({ handleDrawerToggle, pageName }) {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <div className={classes.pageName}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.pageNameText}>
            {pageName}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks />
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle}>
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Narbar.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
  breadCrumb: PropTypes.arrayOf(PropTypes.object)
};

export default Narbar;
