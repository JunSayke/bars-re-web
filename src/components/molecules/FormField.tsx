import React from "react";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Icon from "../atoms/Icon";

type Props = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: string;
};

export const FormField: React.FC<Props> = ({ id, label, type = "text", placeholder, icon }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} leading={icon ? <Icon name={icon} size={18} /> : undefined} aria-label={label} autoComplete={type === 'email' ? 'email' : undefined} />
    </div>
  );
};

export default FormField;
