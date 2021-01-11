import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { PORT, SECRET } = process.env;
let MONGODB_URI: string = process.env.MONGODB_URI as string;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI as string;
}

export { MONGODB_URI, PORT, SECRET };
