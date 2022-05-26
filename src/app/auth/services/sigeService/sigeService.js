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
      this.setSession(accessToken);
      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
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
}

const instance = new SIGEService();

export default instance;
