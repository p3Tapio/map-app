import React from 'react';
import { ErrorMessageProps } from './userAuthTypes';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ touched, error }) => {
  const errorStyle = { marginTop: -2, marginBottom: -20 };
  const okStyle = { marginTop: 18, marginBottom: 18 };
  const errorText = { color: 'red' };

  return (
    <div className="error" style={touched && error ? errorStyle : okStyle}>
      <small style={errorText}>{touched && error ? error : null}</small>
    </div>
  );
};

export default ErrorMessage;
