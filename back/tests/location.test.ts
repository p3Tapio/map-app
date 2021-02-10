const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import app from '../src/app';
import Location from '../src/models/locationModel';
import User from '../src/models/userModel';

const api = supertest(app);

const user = { username: 'tester', password: 'secret' };
const anotherUser = { username: 'another', password: 'terces' };
const list = { name: 'Alist', description: 'testing list', defaultview: { lat: 61.23, lng: 24.123, zoom: 11 }, country: 'Finland', place: 'Helsinki', public: true };

const createValidLocation = async () => {
  const login = await api.post('/api/user/login/').send(user);
  const { body } = await api.post('/api/list/create').set({ 'token': login.body.token }).send(list);
  const validLocation = {
    name: 'location',
    address: 'address 123',
    coordinates: {
      lat: 61.12132311,
      lng: 24.42332311,
    },
    description: 'this is a valid location',
    category: 'shopping',
    imageLink: 'www.url.com',
    list: body._id
  }
  return validLocation;
}

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
    const validLocation = await createValidLocation();
    const response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation);
    expect(response.body.description).toEqual('this is a valid location');
    const locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(1);
  })
  test('...not without logging in', async () => {
    const validLocation = await createValidLocation();
    const response = await api.post('/api/location/create').send(validLocation).expect(401);
    expect(response.body.error).toEqual('unauthorized');
    const locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(0);
  })
  test('...not without missing details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = await createValidLocation();

    const { name, ...withoutName } = validLocation;
    let response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const { address, ...withoutAddress } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutAddress).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const { coordinates, ...withoutCoordinates } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutCoordinates).expect(400);
    expect(response.body.error).toEqual('coordinates missing or in wrong format.');

    const { description, ...withoutDescription } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutDescription).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const { category, ...withoutCategory } = validLocation;
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(withoutCategory).expect(400);
    expect(response.body.error).toEqual('category missing or in wrong format');

    const locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(0);
  })
  test('...not with wrong type of input', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = await createValidLocation();

    const invalidName = { name: 1234, address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 'www.url.com' };
    let response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidAdd = { name: 'name', address: 12334, coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidAdd).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidCoord = { name: 'name', address: 'address', coordinates: { lat: 'lat', lng: 'lng' }, description: 'description', category: 'shopping', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidCoord).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: number expected.');

    const invalidDesc = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 12345, category: 'shopping', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidDesc).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidCat = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'wrong', imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidCat).expect(400);
    expect(response.body.error).toEqual('category missing or in wrong format');

    const invalidCat2 = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 123456, imageLink: 'www.url.com' };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidCat2).expect(400);
    expect(response.body.error).toEqual('category missing or in wrong format');

    const invalidUrl = { name: 'name', address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 123456 };
    response = await api.post('/api/location/create').set({ 'token': login.body.token }).send(invalidUrl).expect(400);
    expect(response.body.error).toEqual('input in wrong format');

    const locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(0);
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
    const validLocation = await createValidLocation();
    const res = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation);
    let locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(1);
    await api.delete(`/api/location/delete/${res.body._id}`).set({ 'token': login.body.token }).expect(204);
    locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(0);
  })
  test('...not without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const validLocation = await createValidLocation();
    const res = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation);
    let locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(1);
    await api.delete(`/api/location/delete/${res.body._id}`).expect(401);
    locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(1);

  })
  test('...not by a different user, even if authenticated', async () => {
    let login = await api.post('/api/user/login/').send(user);
    const validLocation = await createValidLocation();
    const res = await api.post('/api/location/create').set({ 'token': login.body.token }).send(validLocation);
    let locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(1);

    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await another.save();

    login = await api.post('/api/user/login/').send(anotherUser);
    await api.delete(`/api/location/delete/${res.body._id}`).set({ 'token': login.body.token }).expect(401);
    locationsInDb = await Location.find({});
    expect(locationsInDb).toHaveLength(1);
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
    const location = await createValidLocation();
    await api.post('/api/location/create').set({ 'token': login.body.token }).send(location);
  })
  test('...by the user who created it, if authenticated', async () => {
    let locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');
    expect(locationsInDb).toHaveLength(1);

    const editedLocation = (({ _id, name, address, coordinates, description, category, imageLink, createdBy, list }) => ({ _id, name, address, coordinates, description, category, imageLink, createdBy, list }))(locationsInDb[0])
    editedLocation.description = 'Edited description';

    const login = await api.post('/api/user/login/').send(user);
    await api.put(`/api/location/update/${editedLocation._id}`).set({ 'token': login.body.token }).send(editedLocation).expect(200);

    locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('Edited description');
    expect(locationsInDb).toHaveLength(1);
  })
  test('...but not without authentication', async () => {
    let locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');
    expect(locationsInDb).toHaveLength(1);

    const editedLocation = (({ _id, name, address, coordinates, description, category, imageLink, createdBy, list }) => ({ _id, name, address, coordinates, description, category, imageLink, createdBy, list }))(locationsInDb[0])
    editedLocation.description = 'Edited description';

    const res = await api.put(`/api/location/update/${editedLocation._id}`).set({ 'token': '' }).send(editedLocation).expect(401);
    expect(res.body.error).toEqual('unauthorized');

    locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');
    expect(locationsInDb).toHaveLength(1);
  })
  test('...not by another user', async () => {
    let locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');
    expect(locationsInDb).toHaveLength(1);

    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await another.save();

    const editedLocation = (({ _id, name, address, coordinates, description, category, imageLink, createdBy, list }) => ({ _id, name, address, coordinates, description, category, imageLink, createdBy, list }))(locationsInDb[0])
    editedLocation.description = 'Edited description';
    const login = await api.post('/api/user/login/').send(anotherUser);
    const res = await api.put(`/api/location/update/${editedLocation._id}`).set({ 'token': login.body.token }).send(editedLocation).expect(401);
    expect(res.body.error).toEqual('unauthorized');

    locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');
    expect(locationsInDb).toHaveLength(1);
  })
  test('...not with missing values, even if authenticated', async () => {

    const login = await api.post('/api/user/login/').send(user);
    let locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');
    expect(locationsInDb).toHaveLength(1);

    const withoutName = (({ _id, address, coordinates, description, category, imageLink, createdBy, list }) => ({ _id, address, coordinates, description, category, imageLink, createdBy, list }))(locationsInDb[0])
    let response = await api.put(`/api/location/update/${withoutName._id}`).set({ 'token': login.body.token }).send(withoutName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const withoutDescription = (({ _id, name, address, coordinates, category, imageLink, createdBy, list }) => ({ _id, name, address, coordinates, category, imageLink, createdBy, list }))(locationsInDb[0])
    response = await api.put(`/api/location/update/${withoutDescription._id}`).set({ 'token': login.body.token }).send(withoutDescription).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');
    expect(locationsInDb).toHaveLength(1);
  })
  test('...and not with wrong type of inputs', async () => {
    const validLocation = await createValidLocation();
    const login = await api.post('/api/user/login/').send(user);

    let locationsInDb = await Location.find({});
    expect(locationsInDb[0].description).toEqual('this is a valid location');

    const invalidName = { _id: locationsInDb[0]._id, name: 1234, address: 'address', coordinates: validLocation.coordinates, description: 'description', category: 'shopping', imageLink: 'www.url.com', createdBy: locationsInDb[0].createdBy, list: locationsInDb[0].list };
    let response = await api.put(`/api/location/update/${invalidName._id}`).set({ 'token': login.body.token }).send(invalidName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidDesc = { _id: locationsInDb[0]._id, name: 'valid name', address: 'address', coordinates: validLocation.coordinates, description: 12345, category: 'shopping', imageLink: 'www.url.com', createdBy: locationsInDb[0].createdBy, list: locationsInDb[0].list };
    response = await await api.put(`/api/location/update/${invalidDesc._id}`).set({ 'token': login.body.token }).send(invalidDesc).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');
  })
})
afterAll(async () => {
  mongoose.connection.close();
})

