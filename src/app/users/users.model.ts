import mongoose from 'mongoose';

interface User {
  email: string;
  password: string;
}

const UsersSchema = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
});

const usersModel = mongoose.model<User & mongoose.Document>('Users', UsersSchema);

export default usersModel;
