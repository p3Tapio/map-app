import axios from 'axios';
import { createConfig } from '../localStore';

const baseUrl = process.env.REACT_APP_URL;
export interface CommentReply {
  _id: string;
  reply: string;
  user: { _id: string; username: string };
  date: Date;
  commentId: string;
}

const addReply = async (values: { reply: string; commentId: string; listId: string }): Promise<{data: CommentReply} | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    const { commentId, ...reply } = values;
    return axios.post(`${baseUrl}/api/reply/newreply/${commentId}`, reply, config);
  }
  return undefined;
};

export default {
  addReply,
};
