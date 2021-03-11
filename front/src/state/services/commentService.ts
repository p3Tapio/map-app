import axios from 'axios';
import { createConfig } from '../localStore';
import { ListComment } from '../reducers/list/listTypes';

const baseUrl = process.env.REACT_APP_URL;

const addComment = async (values: { comment: string; id: string }): Promise<{ data: ListComment } | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    const { id, ...comment } = values;
    return axios.post(`${baseUrl}/api/comment/newcomment/${id}`, comment, config);
  }
  return undefined;
};

const getComments = async (id: string): Promise<{ data: ListComment[] }> => axios.get(`${baseUrl}/api/comment/comments/${id}`);

const updateComment = async (commentId: string, values: { comment: string; list: string }): Promise<{ data: ListComment } | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    return axios.put(`${baseUrl}/api/comment/update/${commentId}`, values, config);
  }
  return undefined;
};
const deleteComment = async (listId: string, values: { id: string }): Promise<{ data: { success: string; id: string } } | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    const x = { headers: config.headers, data: { id: values.id } };
    return axios.delete(`${baseUrl}/api/comment/delete/${listId}`, x);
  }
  return undefined;
};
const toggleStar = async (commentId: string): Promise<{data: ListComment} | undefined> => {
  const config = createConfig();
  if (config.headers.token) return axios.post(`${baseUrl}/api/comment/star/${commentId}`, {}, config);
  return undefined;
};

export default {
  addComment, getComments, updateComment, deleteComment, toggleStar,
};
