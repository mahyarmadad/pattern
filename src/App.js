/** @jsx jsx */
import {useState, useEffect} from 'reactn';
import {ThemeProvider} from 'emotion-theming';
import {
  primary,
  primaryDark,
  primarySecondDark,
  text,
  hover,
  color,
  colorHover,
  red,
  blue,
  purple,
  green,
} from './constants/colors';
import Parse from 'parse';
import {css, jsx} from '@emotion/core';
import {ToastContainer, toast} from 'react-toastify';
import Main from './pages/main';
import Loading from './pages/loading';
import 'react-toastify/dist/ReactToastify.css';
import {getUser, removeUser, setUser} from './constants/functions';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Menu} from './pages/menu';

import {ThemeProvider as MaterialThemeProvider} from '@material-ui/core';
import {materialTheme} from './constants/materialTheme';

const theme = {
  primary,
  primaryDark,
  primarySecondDark,
  text,
  color,
  colorHover,
  hover,
  red,
  blue,
  purple,
  green,
};

const grid = (theme) => css`
  background: ${theme.primaryDark};
  width: 100vw;
  height: calc(100vh - 30px);
  position: absolute;
  top: 30px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 20px;
  padding: 20px;
  grid-template-rows: 100px auto;
  justify-items: center;
  align-items: center;
  box-sizing: border-box;
  z-index: 50;
  > div {
    width: 100%;
    max-width: 400px;
    :first-child {
      grid-column: 1 / 3;
      align-self: end;
    }
    h2 {
      text-align: center;
    }
    input {
      height: 40px;
      width: 100%;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      margin-bottom: 15px;
      color: #ddd;
      transition: 0.3s ease-out all 0s;
      box-shadow: none;
      & hover {
        box-shadow: none;
        border: 1px solid cyan;
      }
    }
    div.button {
      height: 40px;
      line-height: 40px;
      width: 100%;
      background: ${theme.color};
      border-radius: 4px;
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      margin-top: 5px;
      color: #fff;
      cursor: pointer;
      transition: 0.3s ease-out all 0s;
      &:hover {
        background: ${theme.colorHover};
      }
      &.loading {
        background: rgba(0, 0, 0, 0.15);
        color: #999;
      }
    }
  }
`;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [sign, setSign] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPassword2, setSignupPassword2] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const error = (e) => {
    if (e.code === -1 && e.message === 'passwordRegex') {
      toast.warn(
        'Your password must contain 8 letters and atleast 1 small-case letter, 1 Capital letter, 1 digit',
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    } else if (e.code === -1 && e.message === 'usernameRegex') {
      toast.warn('Your email is not correct', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else if (e.code === -1 && e.message === 'phoneRegex') {
      toast.warn('Your phone number is not correct (example: +98**********)', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      toast.error(e.message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  const login = () => {
    if (btnLoading) return null;
    setBtnLoading(true);
    Parse.User.logIn(loginUsername, loginPassword)
      .then((user) => {
        setUser(user);
        setLoading(false);
        setVerified(user.get('verified') === true);
        setSign(false);
      })
      .catch(error)
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const signup = () => {
    if (btnLoading) return null;
    if (signupPassword2 !== signupPassword) {
      return error({
        message: 'Your password confirmation does not match your password',
      });
    }
    const user = new Parse.User();
    user.set('username', signupUsername);
    user.set('email', signupUsername);
    user.set('password', signupPassword);
    user.set('phone', signupPhone);
    user
      .signUp()
      .then((user) => {
        setUser(user);
        setLoading(false);
        setVerified(false);
        setSign(false);
      })
      .catch(error)
      .finally(() => {
        setBtnLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    // setVerified(true);
    getUser()
      .then((user) => {
        setLoading(false);
        setVerified(user.verified === true);
      })
      .catch(() => {
        removeUser();
        setLoading(false);
        setSign(true);
      });
  }, []);
  return (
    <MaterialThemeProvider theme={materialTheme}>
      <ThemeProvider theme={theme}>
        <Menu />
        <ToastContainer />
        {sign && (
          <div css={grid}>
            <div>
              <h3>WELCOME TO ZEGARA TOOLKIT</h3>
            </div>
            <div>
              <h2>LOGIN</h2>
              <form>
                <input
                  type="text"
                  placeholder="EMAIL"
                  onChange={(val) => setLoginUsername(val.target.value)}
                />
                <input
                  type="password"
                  placeholder="PASSWORD"
                  onChange={(val) => setLoginPassword(val.target.value)}
                />
                <div
                  className={`button ${btnLoading && 'loading'}`}
                  onClick={login}>
                  LOGIN
                </div>
              </form>
            </div>
            <div>
              <h2>SIGNUP</h2>
              <form>
                <input
                  type="text"
                  placeholder="EMAIL"
                  onChange={(val) => setSignupUsername(val.target.value)}
                />
                <input
                  type="text"
                  placeholder="PHONE"
                  onChange={(val) => setSignupPhone(val.target.value)}
                />
                <input
                  type="password"
                  placeholder="PASSWORD"
                  onChange={(val) => setSignupPassword(val.target.value)}
                />
                <input
                  type="password"
                  placeholder="PASSWORD CONFIRMATION"
                  onChange={(val) => setSignupPassword2(val.target.value)}
                />
                <div
                  className={`button ${btnLoading && 'loading'}`}
                  onClick={signup}>
                  SIGNUP
                </div>
              </form>
            </div>
          </div>
        )}
        <div
          css={(theme) => css`
            background: ${theme.primary};
            color: ${theme.text};
            width: 100vw;
            height: calc(100vh - 30px);
          `}>
          {loading ? (
            <Loading />
          ) : !verified ? (
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                text-align: center;
                margin: auto;
                max-width: 500px;
                max-height: 200px;
              `}>
              <div>
                <FontAwesomeIcon
                  // icon="exclamation-triangle"
                  icon="exclamation-triangle"
                  css={css`
                    height: 130px;
                  `}
                  size="5x"
                />
                <i className="fas fa-exclamation-triangle" />
              </div>
              You have to be verified by the admin to get access to these tools
            </div>
          ) : (
            <Main />
          )}
        </div>
      </ThemeProvider>
    </MaterialThemeProvider>
  );
};

export default App;
