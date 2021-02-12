const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import { Types } from 'mongoose';
import app from '../src/app';
import List from '../src/models/listModel';
import User from '../src/models/userModel';

const api = supertest(app);

const user = { username: 'tester', password: 'secret' };
const anotherUser = { username: 'another', password: 'terces' };

const validPublicList = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true };
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
  list: ''
}

const validPrivateList = { name: 'Another list', description: 'Another valid list', defaultview: { lat: 61.12212, lng: 27.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: false };

describe('List can be created', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
  })
  test('...when authenticated and with valid details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(validPublicList).expect(200);
    expect(response.body.name).toEqual('valid list');
    let lists = await api.get('/api/list/allpublic');
    expect(lists.body).toHaveLength(1);

    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(validPrivateList).expect(200);
    expect(response.body.name).toEqual('Another list');
    const listsInDb = await List.find({});
    expect(listsInDb).toHaveLength(2);
  })
  test('...not without logging in', async () => {
    const response = await api.post('/api/list/create').set({ 'token': '' }).send(validPublicList).expect(401);
    expect(response.body.error).toEqual('unauthorized');
    const lists = await api.get('/api/list/allpublic');
    expect(lists.body).toHaveLength(0);
  })
  test('...not without required details', async () => {
    const login = await api.post('/api/user/login/').send(user);

    const { name, ...withoutName } = validPublicList;
    let response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutName).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { description, ...withoutDescription } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutDescription).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { defaultview, ...withoutDefaultview } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutDefaultview).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { lat, ...withoutLat } = validPublicList.defaultview;
    const withoutLatitude = { ...validPublicList, defaultview: withoutLat }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutLatitude).expect(400);
    expect(response.body.error).toEqual('defaultview missing required properties.');

    const { country, ...withoutCountry } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutCountry).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { place, ...withoutPlace } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutPlace).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const withoutPublic = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki' }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutPublic).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const emptyObject = {};
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(emptyObject).expect(400);
    expect(response.body.error).toEqual('No data.');

    const listsInDb = await List.find({});
    expect(listsInDb).toHaveLength(0);
  })
  test('...not with wrong type of input', async () => {
    const login = await api.post('/api/user/login/').send(user);

    const invalidName = { name: 1234, description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true }
    let response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidDesc = { name: 'valid list', description: 1234, defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidDesc).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidDefaultview = { name: 'valid list', description: 'this is a valid list for testing', defaultview: 'this is not an object', country: 'Finland', place: 'Helsinki', public: true }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidDefaultview).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: defaultview missing.');

    const invalidDefaultview2 = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 'latitude', lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidDefaultview2).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: number expected.');

    const invalidCountry = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 61.1234, lng: 21.212121, zoom: 12 }, country: 12345, place: 'Helsinki', public: true }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidCountry).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidPlace = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 61.1234, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 12345, public: true }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidPlace).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const invalidPublic = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 61.1234, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: 'invalid' }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidPublic).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: boolean expected.');

    const invalidObject = { id: 12345, something: 'else', wrong: true }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(invalidObject).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const listsInDb = await List.find({});
    expect(listsInDb).toHaveLength(0);
  })
})
describe('Lists are returned correctly', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();

    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(validPublicList);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(validPrivateList);
  })
  test('...only public lists are returned from "allpublic" route', async () => {
    const publiclists = await api.get('/api/list/allpublic');
    expect(publiclists.body[0].name).toEqual('valid list');
    expect(publiclists.body).toHaveLength(1);

    const listsInDb = await List.find({});
    expect(listsInDb[0].name).toEqual('valid list');
    expect(listsInDb[1].name).toEqual('Another list');
    expect(listsInDb).toHaveLength(2);
  })
  test('...unauthorized user cannot access userlist route', async () => {
    const res = await api.get('/api/list/user').set({ 'token': '' }).expect(401);
    expect(res.body.error).toEqual('unauthorized');
  })
  test('...users lists can only be seen by the user who created them', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body).toHaveLength(2);

    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await another.save();

    const anotherLogin = await api.post('/api/user/login/').send(anotherUser);
    const anotherLists = await api.get('/api/list/user').set({ 'token': anotherLogin.body.token }).expect(200);
    expect(anotherLists.body).toHaveLength(0);
  })
})
describe('List can be updated', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});

    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const hashed2 = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed2 });
    await another.save();

    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(validPublicList);
  })
  test('...if authenticated and with valid details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body[0].description).toEqual('this is a valid list for testing');

    userlists.body[0].description = 'this is an edited description';
    userlists.body[0].name = 'A new name too';

    await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(userlists.body[0]).expect(200);

    const listsInDb = await List.find({});
    expect(listsInDb[0].description).toEqual('this is an edited description');
    expect(listsInDb[0].name).toEqual('A new name too');
    expect(listsInDb).toHaveLength(1);
  })
  test('...but not without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body[0].description).toEqual('this is a valid list for testing');

    userlists.body[0].description = 'this is an edited description';
    userlists.body[0].name = 'A new name too';

    let res = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': '' }).send(userlists.body[0]).expect(401);

    expect(res.body.error).toEqual('unauthorized');
    res = await api.put(`/api/list/update/${userlists.body[0]._id}`).send(userlists.body[0]).expect(401);
    expect(res.body.error).toEqual('unauthorized');

    const listsInDb = await List.find({});
    expect(listsInDb[0].description).toEqual('this is a valid list for testing');
    expect(listsInDb[0].name).toEqual('valid list');
  })
  test('...not by another user', async () => {
    const login = await api.post('/api/user/login/').send(anotherUser);
    let listsInDb = await List.find({});
    const updated: any = {
      name: 'new name',
      description: listsInDb[0].description,
      defaultview: listsInDb[0].defaultview,
      country: 'Latvia', place: listsInDb[0].place,
      public: false,
      createdBy: { _id: listsInDb[0].createdBy, username: 'tester' },
      locations: listsInDb[0].locations,
      favoritedBy: [],
    }

    const res = await api.put(`/api/list/update/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send(updated).expect(401);
    expect(res.body.error).toEqual('unauthorized');

    listsInDb = await List.find({});
    expect(listsInDb[0].name).toEqual('valid list');

    const login2 = await api.post('/api/user/login/').send(user);
    await api.put(`/api/list/update/${listsInDb[0]._id}`).set({ 'token': login2.body.token }).send(updated).expect(200);
  })
  test('...not with missing values', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);

    const { name, ...withoutName } = userlists.body[0];
    let response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutName).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { description, ...withoutDesc } = userlists.body[0];
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutDesc).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { defaultview, ...withoutDefaultview } = userlists.body[0];
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutDefaultview).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { lat, ...withoutLat } = validPublicList.defaultview;
    const withoutLatitude = { ...validPublicList, defaultview: withoutLat, createdBy: userlists.body[0].createdBy, locations: [], favoritedBy: [] }
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutLatitude).expect(400);
    expect(response.body.error).toEqual('defaultview missing required properties.');

    const { country, ...withoutCountry } = userlists.body[0];
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutCountry).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { place, ...withoutPlace } = userlists.body[0];
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutPlace).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const withoutPublic = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', createdBy: userlists.body[0].createdBy, locations: [],  favoritedBy: [] }
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutPublic).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const withMissingValuesInLocation = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true, createdBy: userlists.body[0].createdBy, locations: [{ _id: new mongoose.Types.ObjectId, name: 'testname' }], favoritedBy: [] }
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withMissingValuesInLocation).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const { createdBy, ...withoutCreatedBy } = userlists.body[0];
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutCreatedBy).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const { locations, ...withoutLocations } = userlists.body[0];
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(withoutLocations).expect(400);
    expect(response.body.error).toEqual('object missing required properties.');

    const emptyObject = {};
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(emptyObject).expect(400);
    expect(response.body.error).toEqual('No data.');

    const listsInDb = await List.find({});
    expect(listsInDb).toHaveLength(1);
    expect(listsInDb[0].name).toEqual('valid list');
  })
  test('...not with incorrect type of values', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);

    const invalidName = { ...userlists.body[0], name: 12345 };
    let response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidName).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.')

    const invalidDesc = { ...userlists.body[0], description: 12345 };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidDesc).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.')

    const invalidDefaultview = { ...userlists.body[0], defaultview: 12345 };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidDefaultview).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: defaultview missing.')

    const invalidDefaultview2 = { ...userlists.body[0], defaultview: { lat: 'latitude', lng: 45.2323, zoom: 10 } };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidDefaultview2).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: number expected.')

    const invalidDefaultview3 = { ...userlists.body[0], defaultview: { number: 1, string: 'string' } };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidDefaultview3).expect(400);
    expect(response.body.error).toEqual('defaultview missing required properties.')

    const invalidCountry = { ...userlists.body[0], country: 11234 };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidCountry).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.')

    const invalidPlace = { ...userlists.body[0], place: 11234 };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidPlace).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.')

    const invalidPublic = { ...userlists.body[0], public: 11234 };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidPublic).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: boolean expected.')

    const invalidPublic2 = { ...userlists.body[0], public: 'wrong' };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidPublic2).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: boolean expected.')

    const invalidCreatedBy = { ...userlists.body[0], createdBy: 12345678910112 };
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidCreatedBy).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: id expected.')

    const invalidLocations = {
      ...userlists.body[0], locations: [{ ...validLocation, _id: new Types.ObjectId, list: userlists.body[0]._id, createdBy: userlists.body[0].createdBy }, {
        ...validLocation, _id: new Types.ObjectId, list: userlists.body[0]._id, name: 12345, createdBy: userlists.body[0].createdBy
      }]
    }
    response = await api.put(`/api/list/update/${userlists.body[0]._id}`).set({ 'token': login.body.token }).send(invalidLocations).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.')
  })
})
describe('List can be deletd', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const hashed2 = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed2 });
    await another.save();
    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(validPublicList);
  })
  test('...by the user who created it if authenticated', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body).toHaveLength(1);
    await api.delete(`/api/list/delete/${userlists.body[0]._id}`).set({ 'token': login.body.token }).expect(204);
    userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body).toHaveLength(0);
  })
  test('...not without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body).toHaveLength(1);
    const res = await api.delete(`/api/list/delete/${userlists.body[0]._id}`).set({ 'token': '' }).expect(401);
    expect(res.body.error).toEqual('unauthorized');
    userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body).toHaveLength(1);
  })
  test('...not by another user even when authenticated', async () => {
    const login1 = await api.post('/api/user/login/').send(user);
    let userlists = await api.get('/api/list/user').set({ 'token': login1.body.token }).expect(200);
    expect(userlists.body).toHaveLength(1);

    const login2 = await api.post('/api/user/login/').send(anotherUser);
    const res = await api.delete(`/api/list/delete/${userlists.body[0]._id}`).set({ 'token': login2.body.token }).expect(401);
    expect(res.body.error).toEqual('unauthorized');

    userlists = await api.get('/api/list/user').set({ 'token': login1.body.token }).expect(200);
    expect(userlists.body).toHaveLength(1);
  })
})

afterAll(async () => {
  mongoose.connection.close();
})
