import { FormEvent } from 'react';

export interface CreateNewModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface NewEntry {
  name: string;
  description: string;
  category: string;
  address: string;
  coordinates: string;
  imageLink: string;
}
interface Location {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  description: string;
  category: string;
  imageLink: string;
}

export interface CreateNewFormProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}
export interface MapProps {
  pinPosition: number[];
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}
