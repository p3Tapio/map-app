const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import app from '../src/app';
import User from '../src/models/userModel';

const api = supertest(app);

const user = { username: 'tester', password: 'secret' }

describe('login works with correct credentials and not with wrong ones', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
  })
  test('Correct credentials return status code 200 and a token', async () => {
    const correctUser = { username: 'tester', password: 'secret' };
    const response = await api.post('/api/user/login/').send(correctUser).expect(200);
    expect(response.body.token).toHaveLength(175);
  });
  test('Wrong username returns status code 401 and a correct error message', async () => {
    const wrongUser = { username: 'wrong', password: 'secret' };
    const response = await api.post('/api/user/login/').send(wrongUser).expect(401);
    expect(response.body.error).toEqual('wrong username or password');
  })
  test('Wrong password returns status code 401 and a correct error message', async () => {
    const wrongUser = { username: 'tester', password: 'wrong' };
    const response = await api.post('/api/user/login/').send(wrongUser).expect(401);
    expect(response.body.error).toEqual('wrong username or password');
  })
  test('If username is in wrong format, the status code is 400 and a correct error message is returned', async () => {
    const wrongUser = { username: 123456, password: 'secret' };
    const response = await api.post('/api/user/login/').send(wrongUser).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');
  })
  test('If password is in wrong format, the status code is 400 and a correct error message is returned', async () => {
    const wrongUser = { username: 'tester', password: 123456 };
    const response = await api.post('/api/user/login/').send(wrongUser).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');
  })

})

describe('User account can be created with correct input and not with incorrect details', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  })
  test('User account is created with correct details and a token is returned', async () => {
    const correctUser = { username: 'tester', password: 'secret' }
    const response = await api.post('/api/user/register/').send(correctUser).expect(200);
    const user = await User.findOne({ username: correctUser.username })
    const users = await User.find({});

    expect(response.body.token).toHaveLength(175);
    expect(user?.username).toEqual('tester');
    expect(users).toHaveLength(1);
  });
  test('If username is already taken, status code is 400 and the user is not created', async () => {
    const correctUser = { username: 'tester', password: 'secret' };
    const sameUser = { username: 'tester', password: 'zecret' };

    await api.post('/api/user/register/').send(correctUser);
    const response = await api.post('/api/user/register/').send(sameUser).expect(400);
    const users = await User.find({});

    expect(response.body.error).toEqual('User validation failed: username: Error, expected `username` to be unique. Value: `tester`');
    expect(users).toHaveLength(1);
  })
  test('If username is not a string, status code is 400 and the user is not created', async () => {
    const wrongUser = { username: 1234, password: 'wrong' };
    const response = await api.post('/api/user/register/').send(wrongUser).expect(400);
    const users = await User.find({});

    expect(response.body.error).toEqual('input missing or in wrong format');
    expect(users).toHaveLength(0);
  })
  test('If password is not a string, status code is 400 and the user is not created', async () => {
    const wrongUser = { username: 'tester', password: 1234465 };
    const response = await api.post('/api/user/register/').send(wrongUser).expect(400);
    const users = await User.find({});

    expect(response.body.error).toEqual('input missing or in wrong format');
    expect(users).toHaveLength(0);
  })
})
afterAll(async () => {
  mongoose.connection.close();
})