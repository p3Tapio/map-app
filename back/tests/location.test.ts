const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import app from '../src/app';
import Location from '../src/models/locationModel';
import User from '../src/models/userModel';

const api = supertest(app);

const validLocation = {
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
const user = { username: 'tester', password: 'secret' }

describe('Logged user can create a new location with correct details', () => {
  beforeEach(async () => {
    await Location.deleteMany({});
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
  })
  test('Location cannot be created without logging in', async () => {
    const response = await api.post('/api/location/create').send(validLocation).expect(400);
    expect(response.body.error).toEqual('No token');
    const locations = await api.get('/api/location/all')
    expect(locations.body).toHaveLength(0);
  })
  test('Logged user can create a location with valid details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation).expect(200);
    expect(response.body.description).toEqual('this is a valid location');
    const locations = await api.get('/api/location/all');
    expect(locations.body).toHaveLength(1);
  })
  test('Location with missing details does not get saved', async () => {
    const login = await api.post('/api/user/login/').send(user);

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
  test('Location with wrong type of inputs does not get saved', async () => {
    const login = await api.post('/api/user/login/').send(user);

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
afterAll(async () => {
  mongoose.connection.close();
})