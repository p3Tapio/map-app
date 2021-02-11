import {
  ListDispatchTypes, GETPUBLICLISTS, CREATELIST, List, GETUSERLISTS, DELETELIST, UPDATELIST,
} from './listTypes';

export interface ListState {
  publicLists?: List[];
  userLists?: List[];
}
const listState: ListState = { publicLists: undefined };

const listReducer = (state: ListState = listState, action: ListDispatchTypes): ListState => {
  switch (action.type) {
    case GETPUBLICLISTS:
      return { ...state, publicLists: action.payload };
    case GETUSERLISTS:
      return { ...state, userLists: action.payload };
    case CREATELIST: {
      const userLists = state.userLists?.concat(action.payload);
      if (action.payload.public) {
        const publicLists = state.publicLists?.concat(action.payload);
        return { ...state, userLists, publicLists };
      }
      return { ...state, userLists };
    }
    case UPDATELIST: {
      const userLists = state.userLists?.map((x) => (x._id === action.payload._id ? action.payload : x));
      if (action.payload.public) {
        const publicLists = state.publicLists?.map((x) => (x._id === action.payload._id ? action.payload : x));
        return { ...state, userLists, publicLists };
      }
      return { ...state, userLists };
    }
    case DELETELIST: {
      const userLists = state.userLists?.filter((x) => x._id !== action.payload);
      const publicLists = state.publicLists?.filter((x) => x._id !== action.payload);
      return { ...state, userLists, publicLists };
    }
    default:
      return state;
  }
};
export default listReducer;
