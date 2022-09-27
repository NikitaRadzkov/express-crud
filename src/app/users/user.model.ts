import mongoose from 'mongoose';
import AddressSchema from './address.schema';
import User from './user.interface';

const UserSchema = new mongoose.Schema({
  address: AddressSchema,
  name: String,
  email: String,
  password: String,
  posts: [
    {
      ref: 'Post',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const userModel = mongoose.model<User & mongoose.Document>('User', UserSchema);

export default userModel;
