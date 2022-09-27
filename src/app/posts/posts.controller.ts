import * as express from 'express';
import validationMiddleware from '../../middleware/validation.middleware';
import PostNotFoundException from '../../exceptions/post-not-found.exception';
import Controller from '../../interfaces/controller.interface';
import CreatePostDto from './create-post.dto';
import Post from './post.interface';
import postModel from './post.model';
import { authMiddleware } from '../../middleware/auth.middleware';
import userModel from '../users/user.model';

class PostsController implements Controller {
  path = '/posts';
  router = express.Router();
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = async (request: express.Request, response: express.Response) => {
    const posts = await this.post.find().populate('author', '-password');
    response.send(posts);
  };

  private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post.findById(id).then((post) => {
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true }).then((post) => {
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };

  private createPost = async (request: express.Request, response: express.Response) => {
    const postData: CreatePostDto = request.body;
    const createdPost = new this.post({
      ...postData,
      authorId: request.user._id,
    });
    const user = await this.user.findById(request.user._id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.posts = [...(user!.posts, createdPost._id)];
    await user?.save();
    const savedPost = await createdPost.save();
    await savedPost.populate('authors', '-password');
    response.send(savedPost);
  };

  private deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.send(200);
      } else {
        next(new PostNotFoundException(id));
      }
    });
  };
}

export default PostsController;
