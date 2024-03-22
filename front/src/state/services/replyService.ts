import axios from 'axios';
import { createConfig } from '../localStore';

const baseUrl = process.env.APP_URL;
export interface CommentReply {
  _id: string;
  reply: string;
  user: { _id: string; username: string };
  date: Date;
  commentId: string;
  listId: string;
  edited?: Date;
}

const addReply = async (values: { reply: string; commentId: string; listId: string }): Promise<{ data: CommentReply } | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    const { commentId, ...reply } = values; // kulkeeko listId mukana ????
    return axios.post(`${baseUrl}/api/reply/newreply/${commentId}`, reply, config);
  }
  return undefined;
};
const updateReply = async (values: CommentReply): Promise<{data: CommentReply } | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    return axios.put(`${baseUrl}/api/reply/updatereply/${values._id}`, values, config);
  }
  return undefined;
};

const deleteReply = async (values: { commentId: string; replyId: string; listId: string }): Promise<{ data: { replyId: string } } | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    const { commentId } = values;
    const x = { headers: config.headers, data: { replyId: values.replyId, listId: values.listId } };
    return axios.delete(`${baseUrl}/api/reply/deletereply/${commentId}`, x);
  }
  return undefined;
};

export default {
  addReply,
  updateReply,
  deleteReply,
};
