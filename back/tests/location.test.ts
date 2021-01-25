const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import app from '../src/app';
import Location from '../src/models/locationModel';
import User from '../src/models/userModel';

const api = supertest(app);

const createValidLocation = () => {
  return {
    name: 'location',
    address: 'address 123',
    coordinates: {
      lat: '61.12132311',
      lng: '24.42332311',
    },
    description: 'this is a valid location',
    category: 'shopping',
    imageLink: 'www.url.com',
  }
}
const user = { username: 'tester', password: 'secret' };
const anotherUser = { username: 'another', password: 'terces' };

describe('Location can be created', () => {
  beforeEach(async () => {
    await Location.deleteMany({});
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
  })
  test('...with authentication and valid details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = createValidLocation();
    const response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation).expect(200);
    expect(response.body.description).toEqual('this is a valid location');
    const locations = await api.get('/api/location/all');
    expect(locations.body).toHaveLength(1);
  })
  test('...not without logging in', async () => {
    const validLocation = createValidLocation();
    const response = await api.post('/api/location/create').send(validLocation).expect(400);
    expect(response.body.error).toEqual('No token');
    const locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(0);
  })
  test('...not without missing details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = createValidLocation();

    const { name, ...withoutName } = validLocation;
    let response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const { address, ...withoutAddress } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutAddress).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const { coordinates, ...withoutCoordinates } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutCoordinates).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const { description, ...withoutDescription } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutDescription).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const { category, ...withoutCategory } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutCategory).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(0);
  })
  test('...not with wrong type of input', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = createValidLocation();

    const invalidName = { name: 1234, address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 'www.url.com' };
    let response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const invalidAdd = { name: 'name', address: 12334, coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidAdd).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const invalidCoord = { name: 'name', address: 'address', coordinates: { lat: 'lat', lng: 'lng' }, description: 'description', category: 'shopping', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidCoord).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const invalidDesc = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 12345, category: 'shopping', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidDesc).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const invalidCat = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'wrong', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidCat).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const invalidCat2 = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 123456, imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidCat2).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const invalidUrl = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 123456 };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidUrl).expect(400);
    expect(response.body.error).toEqual('input in wrong format');

    const locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(0);
  })
})
describe('Location can be deleted', () => {
  beforeEach(async () => {
    await Location.deleteMany({});
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
  });
  test('...by the same user who created it, if authenticated', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = createValidLocation();
    const res = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation);
    let locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
    await api.delete(`/api/location/delete/${res.body._id}`).set({ 'token': login.body.token }).expect(204);
    locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(0);
  })
  test('...not without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = createValidLocation();
    const res = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation);
    let locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
    await api.delete(`/api/location/delete/${res.body._id}`).expect(401);
    locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
  })
  test('...not by a different user, even if authenticated', async () => {
    let login = await api.post('/api/user/login/').send(user);
    const validLocation = createValidLocation();
    const res = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation);
    let locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);

    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await another.save();

    login = await api.post('/api/user/login/').send(anotherUser);
    await api.delete(`/api/location/delete/${res.body._id}`).set({ 'token': login.body.token }).expect(401);
    locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
  })
})
describe('Location can be updated', () => {
  beforeEach(async () => {
    await Location.deleteMany({});
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/location/create').set({ 'token': login.body.token }).send(createValidLocation());
  })
  test('...by the user who created it, if authenticated', async () => {
    let locations = await api.get('/api/location/all')
    expect(locations.body[0].description).toEqual('this is a valid location');
    expect(locations.body).toHaveLength(1);

    locations.body[0].description = 'Edited description';
    const login = await api.post('/api/user/login/').send(user);
    await api.put(`/api/location/update/${locations.body[0]._id}`).set({ 'token': login.body.token }).send(locations.body[0]).expect(200);

    locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
    expect(locations.body[0].description).toEqual('Edited description');
  })
  test('...but not without authentication', async () => {
    let locations = await api.get('/api/location/all')
    expect(locations.body[0].description).toEqual('this is a valid location');
    expect(locations.body).toHaveLength(1);

    locations.body[0].description = 'Edited description';
    const res = await api.put(`/api/location/update/${locations.body[0]._id}`).send(locations.body[0]).expect(400);
    expect(res.body.error).toEqual('No token');

    locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
    expect(locations.body[0].description).toEqual('this is a valid location');
  })
  test('...not by another user', async () => {
    let locations = await api.get('/api/location/all')
    expect(locations.body[0].description).toEqual('this is a valid location');
    expect(locations.body).toHaveLength(1);

    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await another.save();

    locations.body[0].description = 'Edited description';
    const login = await api.post('/api/user/login/').send(anotherUser);
    await api.put(`/api/location/update/${locations.body[0]._id}`).set({ 'token': login.body.token }).send(locations.body[0]).expect(401);

    locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
    expect(locations.body[0].description).toEqual('this is a valid location');
  })
  test('...not with missing values, even if authenticated', async () => {
    
    const login = await api.post('/api/user/login/').send(user);
    let locations = await api.get('/api/location/all')
    expect(locations.body[0].description).toEqual('this is a valid location');

    const { name, ...withoutName } = locations.body[0];
    let response = await api.put(`/api/location/update/${locations.body[0]._id}`).set({ 'token': login.body.token }).send(withoutName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');
    
    const { description, ...withoutDescription } = locations.body[0];
    response = await api.put(`/api/location/update/${locations.body[0]._id}`).set({ 'token': login.body.token }).send(withoutDescription).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');
   
    locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(1);
    expect(locations.body[0].description).toEqual('this is a valid location');
  })
  test('...and not with wrong type of inputs', async () => {
    const validLocation = createValidLocation();
    const login = await api.post('/api/user/login/').send(user);

    let locations = await api.get('/api/location/all')
    expect(locations.body[0].description).toEqual('this is a valid location');

    const invalidName = { _id: locations.body[0]._id, name: 12345, address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 'www.url.com', createdBy: locations.body[0].createdBy };
    let response = await api.put(`/api/location/update/${locations.body[0]._id}`).set({ 'token': login.body.token }).send(invalidName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');

    const invalidDesc = { _id: locations.body[0]._id, name: 'valid name', address: 'address', coordinates: validLocation.coordinates, description: 1234, category: 'shopping', imageLink: 'www.url.com', createdBy: locations.body[0].createdBy };
    response = await api.put(`/api/location/update/${locations.body[0]._id}`).set({ 'token': login.body.token }).send(invalidDesc).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format');
  })
})
afterAll(async () => {
  mongoose.connection.close();
})