import HttpException from './http.exception';

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(404, 'Authentication token is missing');
  }
}

export default AuthenticationTokenMissingException;
