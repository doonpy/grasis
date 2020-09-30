import 'perfect-scrollbar/css/perfect-scrollbar.css';

import { makeStyles } from '@material-ui/core/styles';
import Head from 'next';
import { useRouter } from 'next/router';
import PerfectScrollbar from 'perfect-scrollbar';
import React from 'react';

import logo from '../assets/img/ hcmute-logo.png';
import bgImage from '../assets/img/sidebar-2.jpg';
import styles from '../assets/jss/nextjs-material-dashboard/layouts/adminStyle.js';
import Footer from '../components/Footer/Footer.js';
import Navbar from '../components/Navbars/Navbar.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import routes from '../components/Sidebar/routes.js';

let ps;

const useStyles = makeStyles(styles);

function Admin({ children, ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = 'hidden';
    }
    window.addEventListener('resize', resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy();
      }
      window.removeEventListener('resize', resizeFunction);
    };
  }, [mainPanel]);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={'Grasis'}
        logo={logo}
        image={bgImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color="purple"
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar handleDrawerToggle={handleDrawerToggle} {...rest} />
        <div className={classes.content}>
          <div className={classes.container}>{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Admin;
