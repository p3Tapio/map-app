import axios from 'axios';
import { createConfig } from '../localStore';
import { ListComment } from '../reducers/list/listTypes';

const baseUrl = process.env.REACT_APP_URL;

const getComments = async (id: string): Promise<{ data: ListComment[] }> => axios.get(`${baseUrl}/api/comment/comments/${id}`);

const addComment = async (values: { comment: string; id: string }): Promise<{ data: ListComment } | undefined> => {
  const config = createConfig();
  // TODO keksi joku toinen restrukturointi tolle objektille
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...comment } = values;
  if (config.headers.token) {
    return axios.post(`${baseUrl}/api/comment/newcomment/${values.id}`, comment, config);
  }
  return undefined;
};

export default { getComments, addComment };
