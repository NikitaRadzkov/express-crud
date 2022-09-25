import Users from './users.model';
import * as express from 'express';

class UsersController {
  router = express.Router();

  async createUser() {
    this.router.post('/', async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await Users.create({ email, password });
        res.json(user);
      } catch (e) {
        res.status(500).json(e);
      }
    });
  }
}

export default UsersController;
