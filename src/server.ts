import dotenv from 'dotenv';
import App from './app';
import UsersController from './users/users.controller';

dotenv.config();

const port = process.env.PORT || 5500;

const app = new App([new UsersController()], port);

app.listen();
