import Post from '../posts/post.interface';

export default interface User {
  _id: string;
  address: {
    city: string;
    street: string;
  };
  name: string;
  email: string;
  password: string | undefined;
  posts: Post[] | undefined;
}
