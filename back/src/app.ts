import { MONGODB_URI } from './utils/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { unknownEndpoint } from './utils/middleware';
import testingRouter from './routes/testingRoute';
import userRouter from './routes/userRoute';
import locationRouter from './routes/locationRoute';

const app = express();
app.use(cors());
app.use(express.static('build'));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB: ', MONGODB_URI))
  .catch((error) => console.error('Failed to connect: ', error));

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/location', locationRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(unknownEndpoint);

export default app; 