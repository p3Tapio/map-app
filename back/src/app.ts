import { MONGODB_URI } from './utils/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { unknownEndpoint } from './utils/middleware';
import testingRouter from './routes/testingRoute';
import userRouter from './routes/userRoute';
import locationRouter from './routes/locationRoute';
import listRouter from './routes/listRoute';
import commentRouter from './routes/commentRoute';
import replyRouter from './routes/replyRoute';

const app = express();
app.use(cors());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB: ', MONGODB_URI))
  .catch((error) => console.error('Failed to connect: ', error));

app.use(express.json());
app.use(express.static('build'));
app.use('/api/user', userRouter);
app.use('/api/location', locationRouter);
app.use('/api/list', listRouter);
app.use('/api/comment', commentRouter);
app.use('/api/reply', replyRouter);

// if (process.env.NODE_ENV === 'production') {  // TODO cross-env ei skulaa herokussa, kommentoi tämä pois toistaiseksi
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
// }
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(unknownEndpoint);

export default app; 