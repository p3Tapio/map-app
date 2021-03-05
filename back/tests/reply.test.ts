const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
import app from '../src/app';
import User from '../src/models/userModel';
import List from '../src/models/listModel';
import Comment from '../src/models/commentModel';
import Reply from '../src/models/replyModel';

const api = supertest(app);
const user = { username: 'tester', password: 'secret' };
const anotherUser = { username: 'another', password: 'terces' };

const publicList = { name: 'valid list', description: 'this is a valid list for testing', defaultview: { lat: 65.12212, lng: 21.212121, zoom: 12 }, country: 'Finland', place: 'Helsinki', public: true };

describe('Comment can be replied', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await List.deleteMany({});
    const hashed = bcrypt.hashSync(user.password, 10);
    const testUser = new User({ username: user.username, password: hashed });
    await testUser.save();
    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(publicList);
  })
  beforeEach(async () => {
    await Reply.deleteMany({});
    await Comment.deleteMany({});
    const login = await api.post('/api/user/login/').send(user);
    const listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' });
  })
  test('...when authenticated and with valid details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({});
    let repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(0);

    await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(200);
    repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(1);
    expect(repliesInDb[0].reply).toEqual('this is a reply');
  })
  test('...but not without authentication', async () => {
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({});
    let repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(0);
    await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': '' }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(401);
    repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(0);
  })
  test('...or without valid details', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({});
    let repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(0);

    await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: 12345 }).expect(400);
    await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 1234, listId: listsInDb[0]._id }).expect(400);
    repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(0);
  })
})
describe('Correct replies are returned for a comment', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await List.deleteMany({});
    await Reply.deleteMany({});
    await Comment.deleteMany({});

    const hashed = bcrypt.hashSync(user.password, 10);
    const testUser = new User({ username: user.username, password: hashed });
    await testUser.save();

    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(publicList);
    const listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' });
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'Another comment' });
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'One more comment' });
  })
  test('...and not wrong ones', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({})
    let repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(0);

    await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply for test comment', listId: listsInDb[0]._id }).expect(200);
    await api.post(`/api/reply/newreply/${commentsInDb[1]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply another comment', listId: listsInDb[0]._id }).expect(200);
    await api.post(`/api/reply/newreply/${commentsInDb[1]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is another reply for another comment', listId: listsInDb[0]._id }).expect(200);
    await api.post(`/api/reply/newreply/${commentsInDb[2]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is for one more comment', listId: listsInDb[0]._id }).expect(200);
    await api.post(`/api/reply/newreply/${commentsInDb[2]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is one more for one more comment', listId: listsInDb[0]._id }).expect(200);

    repliesInDb = await Reply.find({});
    expect(repliesInDb).toHaveLength(5);

    const res = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);

    expect(res.body[0].replies).toHaveLength(1);
    expect(res.body[0].replies[0].reply).toEqual('this is a reply for test comment');
    expect(res.body[1].replies).toHaveLength(2);
    expect(res.body[1].replies[0].reply).toEqual('this is a reply another comment');
    expect(res.body[1].replies[1].reply).toEqual('this is another reply for another comment');
    expect(res.body[2].replies).toHaveLength(2);
    expect(res.body[2].replies[0].reply).toEqual('this is for one more comment');
    expect(res.body[2].replies[1].reply).toEqual('this is one more for one more comment');
  })
})
describe('Reply can be updated', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await List.deleteMany({});
    await Reply.deleteMany({});
    await Comment.deleteMany({});

    const hashed = bcrypt.hashSync(user.password, 10);
    const testUser = new User({ username: user.username, password: hashed });
    await testUser.save();
    const hashed_2 = bcrypt.hashSync(anotherUser.password, 10);
    const testUser_2 = new User({ username: anotherUser.username, password: hashed_2 });
    await testUser_2.save();

    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(publicList);

    const listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' });
  })
  test('...by the user who wrote it if authenticated', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({})

    const replyRes = await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);
    expect(commentRes.body[0].replies).toHaveLength(1);
    expect(commentRes.body[0].replies[0].reply).toEqual('this is a reply');
    expect(commentRes.body[0].replies[0].edited).toEqual(undefined);

    const updatedReply = { reply: 'this reply is updated', user: login.body.id, listId: replyRes.body.listId, commentId: replyRes.body._id, date: replyRes.body.date };
    await api.put(`/api/reply/updatereply/${replyRes.body._id}`).set({ 'token': login.body.token }).send(updatedReply).expect(200);

    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);
    expect(commentRes.body[0].replies).toHaveLength(1);
    expect(commentRes.body[0].replies[0].reply).toEqual('this reply is updated');
    expect(commentRes.body[0].replies[0].edited).not.toEqual(undefined);
  })
  test('...not without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({})

    const replyRes = await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);
    expect(commentRes.body[0].replies).toHaveLength(1);
    expect(commentRes.body[0].replies[0].reply).toEqual('this is a reply');

    const updatedReply = { reply: 'this reply is updated', user: login.body.id, listId: replyRes.body.listId, commentId: replyRes.body._id, date: replyRes.body.date };
    await api.put(`/api/reply/updatereply/${replyRes.body._id}`).set({ 'token': '' }).send(updatedReply).expect(401);

    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);
    expect(commentRes.body[0].replies).toHaveLength(1);
    expect(commentRes.body[0].replies[0].reply).toEqual('this is a reply');
    expect(commentRes.body[0].replies[0].edited).toEqual(undefined);
  })
  test('...not by another user', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({})

    const replyRes = await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);
    expect(commentRes.body[0].replies).toHaveLength(1);
    expect(commentRes.body[0].replies[0].reply).toEqual('this is a reply');

    const login_2 = await api.post('/api/user/login/').send(anotherUser);
    const updatedReply = { reply: 'this reply is updated', user: login.body.id, listId: replyRes.body.listId, commentId: replyRes.body._id, date: replyRes.body.date };
    await api.put(`/api/reply/updatereply/${replyRes.body._id}`).set({ 'token': login_2.body.token }).send(updatedReply).expect(401);

    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`).expect(200);
    expect(commentRes.body[0].replies).toHaveLength(1);
    expect(commentRes.body[0].replies[0].reply).toEqual('this is a reply');
    expect(commentRes.body[0].replies[0].edited).toEqual(undefined);
  })
})
describe('Reply can be deleted', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await List.deleteMany({});
    await Reply.deleteMany({});
    await Comment.deleteMany({});

    const hashed = bcrypt.hashSync(user.password, 10);
    const testUser = new User({ username: user.username, password: hashed });
    await testUser.save();
    const hashed_2 = bcrypt.hashSync(anotherUser.password, 10);
    const testUser_2 = new User({ username: anotherUser.username, password: hashed_2 });
    await testUser_2.save();

    const login = await api.post('/api/user/login/').send(user);
    await api.post('/api/list/create').set({ 'token': login.body.token }).send(publicList);

    const listsInDb = await List.find({});
    await api.post(`/api/comment/newcomment/${listsInDb[0]._id}`).set({ 'token': login.body.token }).send({ comment: 'test comment' });
  })
  test('...by the user who wrote it when authenticated', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({})

    const replyRes = await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].replies).toHaveLength(1);

    await api.delete(`/api/reply/deletereply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({id: replyRes.body._id});
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].replies).toHaveLength(0);
  })
  test('...not without authentication', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({})

    const replyRes = await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].replies).toHaveLength(1);

    await api.delete(`/api/reply/deletereply/${commentsInDb[0]._id}`).set({ 'token': '' }).send({id: replyRes.body._id}).expect(401);
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].replies).toHaveLength(1);
  })
  test('...not by another user', async () => {
    const login = await api.post('/api/user/login/').send(user);
    const commentsInDb = await Comment.find({});
    const listsInDb = await List.find({})

    const replyRes = await api.post(`/api/reply/newreply/${commentsInDb[0]._id}`).set({ 'token': login.body.token }).send({ reply: 'this is a reply', listId: listsInDb[0]._id }).expect(200);
    let commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].replies).toHaveLength(1);
  
    const login_2 = await api.post('/api/user/login/').send(anotherUser);
    await api.delete(`/api/reply/deletereply/${commentsInDb[0]._id}`).set({ 'token': login_2.body.token}).send({id: replyRes.body._id}).expect(401);
    commentRes = await api.get(`/api/comment/comments/${listsInDb[0]._id}`);
    expect(commentRes.body[0].replies).toHaveLength(1);
  })
})
afterAll(async () => {
  mongoose.connection.close();
})
