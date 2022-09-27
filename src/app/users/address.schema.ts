import * as mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  city: String,
  street: String,
});

export default AddressSchema;
