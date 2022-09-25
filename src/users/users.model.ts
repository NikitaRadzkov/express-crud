import mongoose from 'mongoose';

const Users = new mongoose.Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
});

export default mongoose.model('Users', Users);
