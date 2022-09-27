import mongoose from 'mongoose';
import AddressSchema from './address.schema';
import User from './user.interface';

const UsersSchema = new mongoose.Schema({
  address: AddressSchema,
  name: String,
  email: String,
  password: String,
});

const usersModel = mongoose.model<User & mongoose.Document>('Users', UsersSchema);

export default usersModel;
