import axios from 'axios';
import { createConfig } from '../localStore';
import { ListComment } from '../reducers/list/listTypes';

const baseUrl = process.env.REACT_APP_URL;

const getComments = async (id: string): Promise<{ data: ListComment[] }> => axios.get(`${baseUrl}/api/comment/comments/${id}`);

const addComment = async (values: { comment: string; id: string }): Promise<{ data: ListComment } | undefined> => {
  const config = createConfig();
  if (config.headers.token) {
    const { id, ...comment } = values;
    return axios.post(`${baseUrl}/api/comment/newcomment/${id}`, comment, config);
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

export default { getComments, addComment, deleteComment };
