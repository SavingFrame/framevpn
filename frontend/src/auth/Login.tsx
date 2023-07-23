import React, { FC, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Face, Fingerprint } from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { isAuthenticated, login, loginApiExceptionError } from './services';

const useStyles = makeStyles()((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  padding: {
    padding: theme.spacing(1),
  },
  button: {
    textTransform: 'none',
  },
  marginTop: {
    marginTop: 10,
  },
}));

const Login: FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('admin@example.com');
  const [password, setPassword] = useState<string>('password');
  const [errors, setErrors] = useState<Array<string>>([]);

  // eslint-disable-next-line no-unused-vars
  const handleSubmit = async (_: React.MouseEvent) => {
    setErrors([]);
    try {
      const data = await login(email, password);
      if (data) {
        navigate('/');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // handle errors thrown from backend
        setErrors(loginApiExceptionError(err));
      } else {
        // handle errors thrown from frontend
        setErrors([String(err)]);
      }
    }
  };

  return isAuthenticated() ? (
    <Navigate to="/" />
  ) : (
    <Paper className={classes.padding}>
      <div className={classes.margin}>
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Face />
          </Grid>
          <Grid item md sm xs>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.currentTarget.value)
              }
              fullWidth
              autoFocus
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={8} alignItems="flex-end">
          <Grid item>
            <Fingerprint />
          </Grid>
          <Grid item md sm xs>
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.currentTarget.value)
              }
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <br />
        <Grid container alignItems="center">
          {errors &&
            errors.map((error: string) => {
              return (
                <Grid item xs={12} spacing={50}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              );
            })}
        </Grid>
        <Grid container alignItems="center">
          <Grid item>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />
          </Grid>
          <Grid item>
            <Button
              disableFocusRipple
              disableRipple
              className={classes.button}
              variant="text"
              color="primary"
            >
              Forgot password ?
            </Button>
          </Grid>
        </Grid>
        <Grid container className={classes.marginTop}>
          {' '}
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>{' '}
          &nbsp;
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Grid>
      </div>
    </Paper>
  );
};

export default Login;
