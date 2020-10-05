import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from '../assets/jss/views/loginStyle.js';
import Copyright from '../components/Copyright/Copyright';
import { getRememberMeValue, postLogin, setRememberMeValue } from '../services/auth/auth.service';
import { JwtService } from '../services/jwt.service';
import { redirectTo, redirectToIndex } from '../services/redirect.service';

const useStyles = makeStyles(styles);

function Login() {
  const classes = useStyles();
  const router = useRouter();
  const initialRememberMe = getRememberMeValue();
  const initialValues = {
    username: initialRememberMe.username,
    password: ''
  };

  const [inputs, setInputs] = useState(initialValues);
  const [rememberMe, setRememberMe] = useState(initialRememberMe.status ?? false);
  const [snackBar, setSnackBar] = useState({ open: false, message: '' });
  const [errorInputs, setErrorInputs] = useState({
    username: initialValues.username.length === 0,
    password: initialValues.password.length === 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = await postLogin(inputs);
    if (message) {
      setSnackBar({ open: true, message });
      return;
    }

    if (rememberMe) {
      setRememberMeValue({ status: rememberMe, username: inputs.username });
    }

    if (router.query.redirectUrl) {
      await redirectTo(router.query.redirectUrl);
    }
  };

  const handleInputChange = (e) => {
    e.persist();
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
    if (e.target.value.length === 0) {
      setErrorInputs({ ...errorInputs, [e.target.name]: true });
    } else {
      setErrorInputs({ ...errorInputs, [e.target.name]: false });
    }
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  return (
    <div>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <Snackbar
        open={snackBar.open}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}>
        <Alert severity="error">{snackBar.message}</Alert>
      </Snackbar>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng nhập
            </Typography>
            <form className={classes.form} noValidate action={'#'}>
              <TextField
                error={errorInputs.username}
                helperText={errorInputs.username && 'Tên tài khoản không hợp lệ'}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Tên tài khoản"
                name="username"
                autoComplete="username"
                onChange={handleInputChange}
                value={inputs.username}
              />
              <TextField
                error={errorInputs.password}
                helperText={errorInputs.password && 'Mật khẩu không hợp lệ'}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleInputChange}
                value={inputs.password}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    onChange={() => setRememberMe(!rememberMe)}
                    color="primary"
                    checked={rememberMe}
                  />
                }
                label="Ghi nhớ"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={errorInputs.username || errorInputs.password}
                onClick={handleSubmit}>
                Đăng nhập
              </Button>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const auth = JwtService.fromNext(ctx);
  if (!auth.isExpired()) {
    await redirectToIndex(ctx.res);
  }

  return { props: {} };
};

export default Login;
