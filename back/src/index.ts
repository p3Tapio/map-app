import express from 'express';
import cors from 'cors';
import { MONGODB_URI, PORT } from './utils/config';
import mongoose from 'mongoose';

import { unknownEndpoint } from './utils/middleware';
import userRouter from './routes/userRoute';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user', userRouter);

mongoose.connect(MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect: ', error));

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
