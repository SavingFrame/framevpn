import React, { FC } from 'react';
import ResponsiveDrawer from '../dashboard/components/BasePage';
// import { makeStyles } from 'tss-react/mui';
// import { isAuthenticated } from '../auth/services';

// import { getMessage } from '../utils/api';

// const useStyles = makeStyles()(() => ({
//   link: {
//     color: '#61dafb',
//   },
// }));

const Home: FC = () => {
  // const [message, setMessage] = useState<string>('');
  // const [error, setError] = useState<string>('');
  // @ts-ignore
  // TODO
  // const { classes } = useStyles();

  // const queryBackend = async () => {
  //   try {
  //     // const message = await getMessage();
  //     setMessage(message);
  //   } catch (err) {
  //     setError(String(err));
  //   }
  // };

  // return (
  //   <>
  //     {!message && !error && (
  //       <button
  //         type="button"
  //         className={classes.link}
  //         onClick={() => queryBackend()}
  //       >
  //         Click to make request to backend
  //       </button>
  //     )}
  //     {message && (
  //       <p>
  //         <code>{message}</code>
  //       </p>
  //     )}
  //     {error && (
  //       <p>
  //         Error: <code>{error}</code>
  //       </p>
  //     )}
  //     <a className={classes.link} href="/admin">
  //       Admin Dashboard
  //     </a>
  //     <a className={classes.link} href="/protected">
  //       Protected Route
  //     </a>
  //     {isAuthenticated() ? (
  //       <a className={classes.link} href="/logout">
  //         Logout
  //       </a>
  //     ) : (
  //       <>
  //         <a className={classes.link} href="/login">
  //           Login
  //         </a>
  //         <a className={classes.link} href="/signup">
  //           Sign Up
  //         </a>
  //       </>
  //     )}
  //   </>
  // );

  return (
    <ResponsiveDrawer>
      <p>Test</p>
    </ResponsiveDrawer>
  );
};

export default Home;
