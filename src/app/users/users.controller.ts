import * as express from 'express';
import NotAuthorizedException from '../../exceptions/not-authorized.exception';
import { authMiddleware } from '../../middleware/auth.middleware';
import UserNotFoundException from '../../exceptions/user-not-found.exception';
import Controller from '../../interfaces/controller.interface';
import postModel from '../posts/post.model';
import usersModel from './user.model';

class UsersController implements Controller {
  path = '/users';
  router = express.Router();
  user = usersModel;
  post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  private async getAllUsers(req: express.Request, res: express.Response) {
    const users = await this.user.find();
    const convertUsers = users.map((user) => {
      user.password = undefined;
      return user;
    });
    res.send(convertUsers);
  }

  private async getUserById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    const user = await this.user.findById(id);
    if (user) {
      user.password = undefined;
      res.send(user);
    } else {
      next(new UserNotFoundException(id));
    }
  }

  private async getAllPostsOfUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userId = req.params.id;
    if (userId === req.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      res.send(posts);
    }
    next(new NotAuthorizedException());
  }
}

export default UsersController;
