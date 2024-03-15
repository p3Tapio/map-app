import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { SECRET } = process.env;
const PORT = process.env.PORT || 3001;
let MONGODB_URI: string = process.env.MONGODB_URI as string;

console.log('MONGODB_URI', MONGODB_URI)

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI as string;
}

export { MONGODB_URI, PORT, SECRET };
