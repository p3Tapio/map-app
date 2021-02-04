const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import app from '../src/app';
import List from '../src/models/listModel';
import User from '../src/models/userModel';

const api = supertest(app);

const user = { username: 'tester', password: 'secret' };
const anotherUser = { username: 'another', password: 'terces' };

const validPublicList = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true };
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
    lists = await api.get('/api/testing/allLists');
    expect(lists.body).toHaveLength(2);
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
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const { description, ...withoutDescription } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutDescription).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const { defaultview, ...withoutDefaultview } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutDefaultview).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: defaultview missing.');

    const { lat, ...withoutLat } = validPublicList.defaultview;
    const withoutLatitude = { ...validPublicList, defaultview: withoutLat }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutLatitude).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: number expected.');

    const { country, ...withoutCountry } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutCountry).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const { place, ...withoutPlace } = validPublicList;
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutPlace).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: string expected.');

    const withoutPublic = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki' }
    response = await api.post('/api/list/create').set({ 'token': login.body.token }).send(withoutPublic).expect(400);
    expect(response.body.error).toEqual('input missing or in wrong format: boolean expected.');

    const lists = await api.get('/api/list/allpublic');
    expect(lists.body).toHaveLength(0);
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

    const allLists = await api.get('/api/testing/allLists')
    expect(allLists.body[0].name).toEqual('valid list');
    expect(allLists.body[1].name).toEqual('Another list');
    expect(allLists.body).toHaveLength(2);
  })
  test('...private list can only be seen by the user who created it', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const userlists = await api.get('/api/list/user').set({ 'token': login.body.token }).expect(200);
    expect(userlists.body).toHaveLength(2);

    await api.get('/api/list/user').set({ 'token': '' }).expect(401);

    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const another = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await another.save();

    const anotherLogin = await api.post('/api/user/login/').send(anotherUser);
    const anotherLists = await api.get('/api/list/user').set({ 'token': anotherLogin.body.token }).expect(200);
    expect(anotherLists.body).toHaveLength(0);

    const publiclists = await api.get('/api/list/allpublic');
    expect(publiclists.body).toHaveLength(1);
  })
})
afterAll(async () => {
  mongoose.connection.close();
})
