import { List } from "../../state/reducers/list/listTypes";

export interface ListComponentProps {
  list: List;
  toggleFavorite: (listId: string) => void;
}
export interface StaticMapProps {
  list: List;
}
