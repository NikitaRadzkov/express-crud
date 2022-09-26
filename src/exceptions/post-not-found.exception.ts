import HttpException from './http.exception';

class PostNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Post with ID: ${id} not found`);
  }
}

export default PostNotFoundException;
