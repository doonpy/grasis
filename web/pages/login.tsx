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
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import React, { useState } from 'react';

import Copyright from '../components/Copyright/Copyright';
import Header from '../components/Header/Header';
import {
  LOGIN_1,
  LOGIN_2,
  LOGIN_3,
  LOGIN_4,
  LOGIN_5,
  LOGIN_6,
  loginUseStyles
} from '../libs/resource/login.resource';
import { JwtService } from '../services/auth/jwt.service';
import {
  getRememberMeValue,
  LoginInputs,
  postLogin,
  setRememberMeValue
} from '../services/auth/login.service';
import { redirectToIndex } from '../services/redirect.service';

const Login: React.FunctionComponent = () => {
  const classes = loginUseStyles();
  const initialRememberMe = getRememberMeValue();
  const initialValues: LoginInputs = {
    username: initialRememberMe.username,
    password: ''
  };

  const [inputs, setInputs] = useState(initialValues);
  const [rememberMe, setRememberMe] = useState(initialRememberMe.status ?? false);
  const [snackBar, setSnackBar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorInputs, setErrorInputs] = useState({
    username: initialValues.username.length === 0,
    password: initialValues.password.length === 0
  });

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const message: string | undefined = await postLogin(inputs);
    if (message) {
      setErrorMessage(message);
      setSnackBar(true);
      return;
    }

    if (rememberMe) {
      setRememberMeValue({ status: rememberMe, username: inputs.username });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setSnackBar(false);
  };

  return (
    <div>
      <Header title={LOGIN_1} />
      <Snackbar
        open={snackBar}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}>
        <Alert severity="error">{errorMessage}</Alert>
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
              {LOGIN_1}
            </Typography>
            <form className={classes.form} noValidate action={'#'}>
              <TextField
                error={errorInputs.username}
                helperText={errorInputs.username && LOGIN_5}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label={LOGIN_2}
                name="username"
                autoComplete="username"
                onChange={handleInputChange}
                value={inputs.username}
              />
              <TextField
                error={errorInputs.password}
                helperText={errorInputs.password && LOGIN_6}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label={LOGIN_3}
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
                label={LOGIN_4}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={errorInputs.username || errorInputs.password}
                onClick={handleSubmit}>
                {LOGIN_1}
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
};

export default Login;

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  const auth = JwtService.fromNext(ctx);
  if (!auth.isExpired()) {
    await redirectToIndex(ctx.res);
  }

  return { props: {} };
}
