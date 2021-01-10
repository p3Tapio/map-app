export interface LoginFormValues {
  username: string;
  password: string;
}
export interface AllFormValues extends LoginFormValues {
  passwordconfirm: string;
}
export interface UserAuthFormProps {
  onSubmit: (values: AllFormValues) => void;
  headline: string;
}
export interface ErrorMessageProps {
  touched: boolean | undefined;
  error: string | undefined;
}
