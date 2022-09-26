import 'dotenv/config';
import App from './app';
import { validateEnv } from '../utils/validate-env';
import PostsController from './posts/posts.controller';
import AuthenticationController from './auth/auth.controller';
import UsersController from './users/users.controller';

const port = process.env.PORT || 5500;

validateEnv();

const app = new App([new AuthenticationController(), new PostsController(), new UsersController()], port);

app.listen();
