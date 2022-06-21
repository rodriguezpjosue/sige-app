import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import sigeServiceConfig from './sigeServiceConfig';

class SIGEService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      this.emit('onNoAccessToken');
      return;
    }

    if (this.isAuthTokenValid(accessToken)) {
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          sigeServiceConfig.uniqueEndpoint,
          {
            params: {
              endpoint: 'login_with_sid',
              args: {
                sid: this.getAccessToken(),
              },
            },
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          response = response.data.result;
          if (response.status === 200) {
            if (response.data.user) {
              this.setSession(response.data.access_token, response.data.user.data);
              resolve(response.data.user);
              this.emit('onLogin', response.data.user);
            } else {
              // reject(response.data.error);
              this.logout();
              reject(new Error('Sesión expirada.'));
            }
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            this.logout();
            reject(new Error('Sesión expirada.'));
          }
        });
    });
  };

  signInWithEmailAndPassword = (user, pass) => {
    return new Promise((resolve, reject) => {
      axios
        .post(sigeServiceConfig.uniqueEndpoint, {
          params: {
            endpoint: 'login',
            args: {
              db: sigeServiceConfig.db,
              login: user,
              password: pass,
            },
          },
        })
        .then((response) => {
          response = response.data.result;
          if (response.data.user) {
            this.setSession(response.data.access_token);
            resolve(response.data.user);
            this.emit('onLogin', response.data.user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithUserAndPassword = (user, pass) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          sigeServiceConfig.uniqueEndpoint,
          {
            params: {
              endpoint: 'login',
              args: {
                db: sigeServiceConfig.db,
                login: user,
                password: pass,
              },
            },
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          response = response.data.result;
          if (response.status === 200) {
            if (response.data.user) {
              this.setSession(response.data.access_token, response.data.user.data);
              resolve(response.data.user);
              this.emit('onLogin', response.data.user);
            } else {
              reject(response.data.error);
            }
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject([
              { type: 'username', message: 'Usuario o contraseña incorrecto.' },
              { type: 'password', message: 'Usuario o contraseña incorrecto.' },
            ]);
          }
        });
    });
  };

  requestResetPasswordMail = (user) => {
    return new Promise((resolve, reject) => {
      axios
        .post(sigeServiceConfig.uniqueEndpoint, {
          params: {
            endpoint: 'reset_link',
            args: {
              db: 'sige8',
              username: user,
            },
          },
        })
        .then((response) => {
          response = response.data.result;
          if (response.status === 200) {
            resolve(response.data);
            this.emit('onPasswordResetLink');
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject([{ type: 'username', message: 'No se pudo procesar la solicitud.' }]);
          }
        });
    });
  };

  setSession = (accessToken, userdata) => {
    if (accessToken) {
      localStorage.setItem('session_id', accessToken);
      localStorage.setItem('red_id', userdata.red_liderada);
      localStorage.setItem('partner_id', userdata.partner_id);
      localStorage.setItem('user_context', JSON.stringify(userdata.user_context));
      // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('session_id');
      localStorage.removeItem('red_id');
      localStorage.removeItem('partner_id');
      localStorage.removeItem('user_context');
      // delete axios.defaults.headers.common.Authorization;
    }
  };

  updateUserData = (user) => {
    return axios.post(sigeServiceConfig.uniqueEndpoint, {
      user,
    });
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (accessToken) => {
    if (!accessToken) {
      return false;
    }
    /*
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }
    */
    return true;
  };

  getAccessToken = () => {
    return window.localStorage.getItem('session_id');
  };
}

const instance = new SIGEService();

export default instance;
