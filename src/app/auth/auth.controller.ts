import * as express from 'express';
import * as bcrypt from 'bcrypt';
import SameDataException from '../../exceptions/same-data.exception';
import Controller from '../../interfaces/controller.interface';
import usersModel from '../users/user.model';
import CreateUserDto from './dto/create-user.dto';
import LoginDto from './dto/login.dto';
import WrongCredentials from '../../exceptions/wrong-credentials.exception';
import validationMiddleware from '../../middleware/validation.middleware';

class AuthenticationController implements Controller {
  path = '/auth';
  router = express.Router();
  user = usersModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/registration`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LoginDto), this.login);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new SameDataException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 4);
      const user = await this.user.create({ ...userData, password: hashedPassword });
      user.password = undefined;
      response.send(user);
    }
  };

  private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const loginData: LoginDto = request.body;
    const user = await this.user.findOne({ email: loginData.email });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const isPasswordMatching = await bcrypt.compare(loginData.password, user.password!);
      if (isPasswordMatching) {
        user.password = undefined;
        response.send(user);
      } else {
        next(new WrongCredentials());
      }
    } else {
      next(new WrongCredentials());
    }
  };
}

export default AuthenticationController;
