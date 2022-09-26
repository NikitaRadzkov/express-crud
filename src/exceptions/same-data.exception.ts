import HttpException from './http.exception';

class SameDataException extends HttpException {
  constructor(data: string) {
    super(409, `User with this data: ${data} already exist`);
  }
}

export default SameDataException;
