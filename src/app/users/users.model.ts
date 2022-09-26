import mongoose from 'mongoose';
import User from './user.interface';

const UsersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const usersModel = mongoose.model<User & mongoose.Document>('Users', UsersSchema);

export default usersModel;
