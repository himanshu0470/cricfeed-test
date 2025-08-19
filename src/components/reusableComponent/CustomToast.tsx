import React from "react";

interface CustomToastProps {
  title: string;
  message: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ title, message }) => (
  <div>
    <strong>{title}</strong>
    <div>{message}</div>
  </div>
);

export default CustomToast;
