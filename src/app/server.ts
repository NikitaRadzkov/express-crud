import 'dotenv/config';
import App from './app';
import UsersController from './users/users.controller';
import { validateEnv } from '../utils/validate-env';

const port = process.env.PORT || 5500;

validateEnv();

const app = new App([new UsersController()], port);

app.listen();
