import { MONGODB_URI } from './utils/config';
import express from 'express';
import mongoose from 'mongoose';
import { unknownEndpoint } from './utils/middleware';
import userRouter from './routes/userRoute';

const app = express();

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB: ', MONGODB_URI))
  .catch((error) => console.error('Failed to connect: ', error));


app.use(express.json());
app.use('/api/user', userRouter);

app.use(unknownEndpoint);

export default app; 