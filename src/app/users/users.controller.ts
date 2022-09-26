import * as express from 'express';
import UserNotFoundException from '../../exceptions/user-not-found.exception';
import Controller from '../../interfaces/controller.interface';
import usersModel from './user.model';

class UsersController implements Controller {
  path = '/users';
  router = express.Router();
  user = usersModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
  }

  private getAllUsers = async (request: express.Request, response: express.Response) => {
    const users = await this.user.find();
    const convertUsers = users.map((user) => {
      user.password = undefined;
      return user;
    });
    response.send(convertUsers);
  };

  private getUserById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const user = await this.user.findById(id);
    if (user) {
      user.password = undefined;
      response.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  };
}

export default UsersController;
