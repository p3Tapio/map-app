export interface NewLocation {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  category: string;
  imageLink: string;
}
export interface Location extends NewLocation {
  _id: string;
  createdBy: string;
  list: string;
}
