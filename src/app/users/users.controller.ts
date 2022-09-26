import Controller from '../../interfaces/controller.interface';
import * as express from 'express';
import usersModel from './users.model';

class UsersController implements Controller {
  path = '/users';
  router = express.Router();
  private users = usersModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.post(this.path, this.createUser);
  }

  private async getAllUsers(req: express.Request, res: express.Response) {
    try {
      const users = await this.users.find();
      res.send(users);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  private async getUserById(req: express.Request, res: express.Response) {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(404).json(`User with ID: ${id} not found`);
      }
      const post = await this.users.findById(id);
      res.send(post);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  private async createUser(req: express.Request, res: express.Response) {
    try {
      const userData = req.body;
      const createdUser = new this.users(userData);
      await createdUser.save();
      res.send(createdUser);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  private async deleteUser(req: express.Request, res: express.Response) {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(404).json(`User with ID: ${id} not found`);
      }
      await this.users.findByIdAndDelete(id);
      res.status(200);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  // async createUser() {
  //   this.router.post('/', async (req, res) => {
  //     try {
  //       const { email, password } = req.body;
  //       const user = await Users.create({ email, password });
  //       res.json(user);
  //     } catch (e) {
  //       res.status(500).json(e);
  //     }
  //   });
  // }
}

export default UsersController;
