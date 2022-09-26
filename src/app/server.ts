import 'dotenv/config';
import App from './app';
import UsersController from './users/users.controller';
import { validateEnv } from '../utils/validate-env';
import PostsController from './posts/posts.controller';

const port = process.env.PORT || 5500;

validateEnv();

const app = new App([new UsersController(), new PostsController()], port);

app.listen();
