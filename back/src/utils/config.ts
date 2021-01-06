import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
const { PORT, MONGODB_URI, SECRET } = process.env;

export { MONGODB_URI, PORT, SECRET };
