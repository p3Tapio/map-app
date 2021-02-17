import { List } from "../../state/reducers/list/listTypes";

export interface ListComponentProps {
  fromWhere: string;
  list: List;
  toggleFavorite: (listId: string) => void;
}
export interface StaticMapProps {
  list: List;
}
export interface PublicListMapProps {
  lists: List[] | undefined;
}