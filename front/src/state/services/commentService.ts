import axios from 'axios';
import { ListComment } from '../reducers/list/listTypes';

const baseUrl = process.env.REACT_APP_URL;

interface CommentResponse {
  data: ListComment[];
}
const getComments = async (id: string): Promise<CommentResponse> => axios.get(`${baseUrl}/api/comment/comments/${id}`);

export default { getComments };
