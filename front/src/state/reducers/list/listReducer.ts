import {
  ListDispatchTypes, GETPUBLICLISTS, CREATELIST, List, GETUSERLISTS,
} from './listTypes';

interface ListState {
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
    default:
      return state;
  }
};
export default listReducer;
