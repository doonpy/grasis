import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

import styles from '../../assets/jss/components/sidebarStyle';
import AdminNavbarLinks from '../Navbars/AdminNavbarLinks';

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  const router = useRouter();

  function isActiveRoute(routeName) {
    return router.route.indexOf(routeName) > -1;
  }

  const { logo, image, logoText, routes, color } = props;
  const links = (
    <List className={classes.list}>
      {routes.map((prop, key) => {
        const listItemActiveClass = classNames({
          [' ' + classes[color]]: isActiveRoute(prop.path)
        });
        const whiteFontClasses = classNames({
          [' ' + classes.whiteFont]: isActiveRoute(prop.path)
        });

        return (
          <Link href={prop.path} key={key}>
            <a className={classes.item}>
              <ListItem button className={classes.itemLink + listItemActiveClass}>
                {typeof prop.icon === 'string' ? (
                  <Icon className={classNames(classes.itemIcon, whiteFontClasses)}>
                    {prop.icon}
                  </Icon>
                ) : (
                  <prop.icon className={classes.itemIcon} />
                )}
                <ListItemText
                  primary={prop.name}
                  className={classNames(classes.itemText, whiteFontClasses)}
                  disableTypography={true}
                />
              </ListItem>
            </a>
          </Link>
        );
      })}
    </List>
  );

  const brand = (
    <div className={classes.logo}>
      <a href="#" className={classes.logoLink}>
        <div className={classes.logoImage}>
          <img src={logo} alt="logo" className={classes.img} />
        </div>
        {logoText}
      </a>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={'right'}
          open={props.open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}>
          {brand}
          <div className={classes.sidebarWrapper}>
            <AdminNavbarLinks />
            {links}
          </div>
          {image !== undefined ? (
            <div className={classes.background} style={{ backgroundImage: 'url(' + image + ')' }} />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={'left'}
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper
          }}>
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div className={classes.background} style={{ backgroundImage: 'url(' + image + ')' }} />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(['white', 'purple', 'blue', 'green', 'orange', 'red']),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
  auth: PropTypes.object
};
