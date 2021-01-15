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
export interface CreateNewFormProps {
  onSubmit: (values: NewEntry) => void;
}
export interface MapProps {
  pinPosition: number[];
  setPinPosition: React.Dispatch<React.SetStateAction<number[]>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}
