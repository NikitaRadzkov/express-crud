import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

const startApp = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect(process.env.MONGO_DB!);
    app.listen(port, () => console.log(`Server is running on PORT = ${port}`));
  } catch (e) {
    console.log(e);
  }
};

startApp();
