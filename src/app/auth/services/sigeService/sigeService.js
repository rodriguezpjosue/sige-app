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
    if (accessToken) {
      this.setSession(null);
    }
    this.emit('onNoAccessToken');
  };

  /*
  handleAuthentication = () => {
    const accessToken = this.getAccessToken();
    const redLiderada = window.localStorage.getItem('red_liderada');

    if (!accessToken || !redLiderada) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(accessToken)) {
      // this.setSession(accessToken);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };
  */
 
  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          sigeServiceConfig.accessToken,
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
          if (response.data.user) {
            this.setSession(response.data.access_token, response.data.user.data);
            resolve(response.data.user);
          } else {
            this.logout();
            reject(new Error('Failed to login with token.'));
          }
        })
        .catch((error) => {
          this.logout();
          reject(new Error('Failed to login with token.'));
        });
    });
  };

  signInWithEmailAndPassword = (user, pass) => {
    return new Promise((resolve, reject) => {
      axios
        .post(sigeServiceConfig.signIn, {
          params: {
            endpoint: 'login',
            args: {
              db: 'sige',
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
          sigeServiceConfig.signIn,
          {
            params: {
              endpoint: 'login',
              args: {
                db: 'sige',
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
          if (response.data.user) {
            this.setSession(response.data.access_token, response.data.user.data);
            resolve(response.data.user);
            this.emit('onLogin', response.data.user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  setSession = (accessToken, userdata) => {
    if (accessToken) {
      localStorage.setItem('session_id', accessToken);
      localStorage.setItem('red_id', userdata.red_liderada);
      // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('session_id');
      localStorage.removeItem('red_id');
      // delete axios.defaults.headers.common.Authorization;
    }
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
