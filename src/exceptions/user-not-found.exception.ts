import HttpException from './http.exception';

class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `User with ID: ${id} not found`);
  }
}

export default UserNotFoundException;
