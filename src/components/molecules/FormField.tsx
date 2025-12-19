import React from "react";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Icon from "../atoms/Icon";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  placeholder?: string;
  icon?: string;
  inputClassName?: string;
  error?: string | null;
};

export const FormField = React.forwardRef<HTMLInputElement, Props>(({ id, label, type = "text", placeholder, icon, className = "", inputClassName, error, ...props }, ref) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input ref={ref} id={id} name={id} type={type} placeholder={placeholder} leading={icon ? <Icon name={icon} size={18} /> : undefined} aria-label={label} autoComplete={type === 'email' ? 'email' : undefined} inputClassName={inputClassName} {...props} />
      {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
    </div>
  );
});

export default FormField;
