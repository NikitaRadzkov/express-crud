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

  private async getAllPosts(req: express.Request, res: express.Response) {
    const posts = await this.post.find().populate('author', '-password');
    res.send(posts);
  }

  private async getPostById(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    const post = await this.post.findById(id);
    if (post) {
      res.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  private async modifyPost(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    const postData: Post = req.body;
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
    if (post) {
      res.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }

  private async createPost(req: express.Request, res: express.Response) {
    const postData: CreatePostDto = req.body;
    const createdPost = new this.post({
      ...postData,
      authorId: req.user._id,
    });
    const user = await this.user.findById(req.user._id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.posts = [...(user!.posts, createdPost._id)];
    await user?.save();
    const savedPost = await createdPost.save();
    await savedPost.populate('authors', '-password');
    res.send(savedPost);
  }

  private async deletePost(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    const successResponse = await this.post.findByIdAndDelete(id);
    if (successResponse) {
      res.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  }
}

export default PostsController;
