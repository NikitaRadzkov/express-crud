import * as mongoose from 'mongoose';
import Post from './post.interface';

const PostSchema = new mongoose.Schema({
  author: [
    {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  content: String,
  title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', PostSchema);

export default postModel;
