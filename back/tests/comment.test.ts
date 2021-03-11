const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import List from '../src/models/listModel';
import User from '../src/models/userModel';
import Comment from '../src/models/commentModel';
import app from '../src/app';
const api = supertest(app);

const user = { username: 'tester', password: 'secret' };
const anotherUser = { username: 'another', password: 'terces' };
const validPublicList = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true };

describe('Comment can be added', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const newList = new List({ createdBy: createUser._id, ...validPublicList });
    await newList.save();
  })
  test('...when authenticated', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' }).expect(200);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
    const commentsInDb = await Comment.find({ list: listsInDb[0]._id });
    expect(commentsInDb[0].comment).toEqual('test comment')
  })
  test('...commenting fails without authentication and status code 401 is returned', async () => {
    let listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': '' }).send({ comment: 'test comment' }).expect(401);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
  })
  test('...empty string wont get saved and status 400 is returned', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: '' }).expect(400);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
  })
  test('...comment in wrong format wont get saved and status 400 is returned', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 654646 }).expect(400);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
  })
})
describe('Comments are returned', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const newList = new List({ createdBy: createUser._id, ...validPublicList });
    const anotherList = new List({ createdBy: createUser._id, name: 'another list', description: 'this is another', defaultview: { lat: 64.1442, lng: 22.212121, zoom: 13 }, country: 'Finland', place: 'Espoo', public: true })
    await newList.save();
    await anotherList.save();
  })
  test('...list\'s comments get returned and not another ones', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    expect(listsInDb).toHaveLength(2);
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'this is a comment for first list' });
    await api.post(`/api/comment/newcomment/${listsInDb[1]._id}`).set({ 'token': login.body.token }).send({ comment: 'this is for another list' });
    await api.post(`/api/comment/newcomment/${listsInDb[1]._id}`).set({ 'token': login.body.token }).send({ comment: 'Another for second list' });
    const res_1 = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);
    const res_2 = await api.get(`/api/comment/comments/${listsInDb[1]._id}`).expect(200);
    expect(res_1.body).toHaveLength(1);
    expect(res_1.body[0].comment).toEqual('this is a comment for first list');
    expect(res_2.body).toHaveLength(2);
    expect(res_2.body[0].comment).toEqual('this is for another list');
    expect(res_2.body[1].comment).toEqual('Another for second list');
  })
})
describe('Comments can be updated', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const newList = new List({ createdBy: createUser._id, ...validPublicList });
    await newList.save();
  })
  test('...by the user who created it when authenticated', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    let res = await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment', replies: [] });
    let commentsInDb = await Comment.find({});
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
    expect(commentsInDb[0].comment).toEqual('test comment');
    expect(commentsInDb[0].list).toEqual(listsInDb[0]._id);

    const updatedComment = { comment: 'this is an updated comment', list: listsInDb[0]._id, replies: [], date: listsInDb[0].date };
    await api.put(`/api/comment/update/${res.body._id}`).set({ 'token': login.body.token }).send(updatedComment).expect(200);

    listsInDb = await List.find({});
    commentsInDb = await Comment.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
    expect(commentsInDb[0].comment).toEqual('this is an updated comment');
    expect(commentsInDb[0].list).toEqual(listsInDb[0]._id);
  })
  test('...not without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    let res = await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment', replies: [] });
    let commentsInDb = await Comment.find({});
    expect(commentsInDb[0].comment).toEqual('test comment');

    const updatedComment = { comment: 'this is an updated comment', list: listsInDb[0]._id, replies: [], date: listsInDb[0].date };
    await api.put(`/api/comment/update/${res.body._id}`).set({ 'token': '' }).send(updatedComment).expect(401);

    listsInDb = await List.find({});
    commentsInDb = await Comment.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
    expect(commentsInDb[0].comment).toEqual('test comment');
  })
  test('..not by another user even if authenticated', async () => {
    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const anotheruser = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await anotheruser.save();

    let listsInDb = await List.find({});
    const login = await api.post('/api/user/login/').send(user);
    const res = await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment', replies: [] });

    const updatedComment = { comment: 'this is an updated comment', list: listsInDb[0]._id, replies: [], date: listsInDb[0].date };
    const anotherLogin = await api.post('/api/user/login/').send(anotherUser);

    await api.put(`/api/comment/update/${res.body._id}`).set({ 'token': anotherLogin.body.token }).send(updatedComment).expect(401);
    listsInDb = await List.find({});
    const commentsInDb = await Comment.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
    expect(commentsInDb[0].comment).toEqual('test comment');
  })
})
describe('Comment can be deleted', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    let hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const newList = new List({ createdBy: createUser._id, ...validPublicList });
    await newList.save();
    hashed = bcrypt.hashSync(anotherUser.password, 10);
    const anotheruser = new User({ _id: new mongoose.Types.ObjectId, username: anotherUser.username, password: hashed });
    await anotheruser.save();
  })
  test('...comment can be deleted by the user who wrote it', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' }).expect(200);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
    await api.delete(`/api/comment/delete/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ id: listsInDb[0].comments[0] }).expect(200);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
  })
  test('...comment can also be deleted by the user who created the list', async () => {
    const login_1 = await api.post('/api/user/login/').send(anotherUser);
    let listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login_1.body.token }).send({ comment: 'test comment' }).expect(200);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);

    const login_2 = await api.post('/api/user/login/').send(user);
    await api.delete(`/api/comment/delete/${listsInDb[0]._id}`).set({ 'token': login_2.body.token }).send({ id: listsInDb[0].comments[0] }).expect(200);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(0);
  })
  test('...deleting will fail without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' }).expect(200);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
    await api.delete(`/api/comment/delete/${listsInDb[0]._id}`).set({ 'token': '' }).send({ id: listsInDb[0].comments[0] }).expect(401);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
  })
  test('...comment can\'t be deleted by a user who has not written the comment or created the list', async () => {
    const hashed = bcrypt.hashSync('oneMore', 10);
    const user = new User({ _id: new mongoose.Types.ObjectId, username: 'OneMoreUser', password: hashed });
    await user.save();

    const login_1 = await api.post('/api/user/login/').send(anotherUser);
    let listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login_1.body.token }).send({ comment: 'test comment' }).expect(200);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);

    const login_2 = await api.post('/api/user/login/').send({password:'oneMore', username:'OneMoreUser'});
    await api.delete(`/api/comment/delete/${listsInDb[0]._id}`).set({ 'token': login_2.body.token }).send({ id: listsInDb[0].comments[0] }).expect(401);
    listsInDb = await List.find({});
    expect(listsInDb[0].comments).toHaveLength(1);
  })
})
describe('Starring a comment', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});
    let hashed = bcrypt.hashSync(user.password, 10);
    const createUser = new User({ _id: new mongoose.Types.ObjectId, username: user.username, password: hashed });
    await createUser.save();
    const newList = new List({ createdBy: createUser._id, ...validPublicList });
    await newList.save();
  })
  test('...Comment can be starred and unstarred if logged in', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(0);

    await api.post(`/api/comment/star/${commentRes.body[0]._id}`).set({ 'token': login.body.token }).expect(200);
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(1);
    expect(commentRes.body[0].stars[0]).toEqual(login.body.id);

    await api.post(`/api/comment/star/${commentRes.body[0]._id}`).set({ 'token': login.body.token }).expect(200);
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(0);

    await api.post(`/api/comment/star/${commentRes.body[0]._id}`).set({ 'token': login.body.token }).expect(200);
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(1);
    expect(commentRes.body[0].stars[0]).toEqual(login.body.id);
  })
  test('...Starring fails without authorization', async () => {
    const login = await api.post('/api/user/login/').send(user);
    let listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(0);
    await api.post(`/api/comment/star/${commentRes.body[0]._id}`).set({ 'token': '' }).expect(401);
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(0);
  })
  test('...Corrent amout of stars are returned for each comment', async () => {
    const hashed = bcrypt.hashSync(anotherUser.password, 10);
    const user_2 = new User({ username: anotherUser.username, password: hashed  });
    await user_2.save();
    const login = await api.post('/api/user/login/').send(user);
    const login_2 = await api.post('/api/user/login/').send(anotherUser);
    const listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' });
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'another comment' });
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'one more comment' });
    
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(0);
    expect(commentRes.body[1].stars).toHaveLength(0);
    expect(commentRes.body[2].stars).toHaveLength(0);

    await api.post(`/api/comment/star/${commentRes.body[1]._id}`).set({ 'token': login.body.token }).expect(200);
    await api.post(`/api/comment/star/${commentRes.body[2]._id}`).set({ 'token': login.body.token }).expect(200);
    await api.post(`/api/comment/star/${commentRes.body[2]._id}`).set({ 'token': login_2.body.token }).expect(200);
    
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].stars).toHaveLength(0);
    expect(commentRes.body[1].stars).toHaveLength(1);
    expect(commentRes.body[2].stars).toHaveLength(2);

    expect(commentRes.body[1].stars[0]).toEqual(login.body.id);
    expect(commentRes.body[2].stars[0]).toEqual(login.body.id);
    expect(commentRes.body[2].stars[1]).toEqual(login_2.body.id);
  })
})
afterAll(async () => {
  mongoose.connection.close();
})
