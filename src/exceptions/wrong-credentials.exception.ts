import HttpException from './http.exception';

class WrongCredentials extends HttpException {
  constructor() {
    super(401, 'Wrong login or password');
  }
}

export default WrongCredentials;
