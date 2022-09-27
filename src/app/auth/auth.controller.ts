import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import SameDataException from '../../exceptions/same-data.exception';
import Controller from '../../interfaces/controller.interface';
import usersModel from '../users/user.model';
import CreateUserDto from './dto/create-user.dto';
import LoginDto from './dto/login.dto';
import WrongCredentials from '../../exceptions/wrong-credentials.exception';
import validationMiddleware from '../../middleware/validation.middleware';
import User from '../users/user.interface';
import TokenData from '../../interfaces/token-data.interface';
import DataStoredInToken from '../../interfaces/data-stored-in-token';

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
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { expiresIn, token: jwt.sign(dataStoredInToken, secret!, { expiresIn }) };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new SameDataException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 4);
      const user = await this.user.create({ ...userData, password: hashedPassword });
      user.password = undefined;
      const tokenData = this.createToken(user);
      response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
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
        const tokenData = this.createToken(user);
        response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new WrongCredentials());
      }
    } else {
      next(new WrongCredentials());
    }
  };

  private logout = (request: express.Request, response: express.Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  };
}

export default AuthenticationController;
