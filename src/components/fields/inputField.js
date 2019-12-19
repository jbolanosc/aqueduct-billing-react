import React from "react";

export const InputField = ({ field, form: _, ...props }) => {
  return (
    <div className="form-group">
      <label>{props.placeholder}</label>
      <input className="form-control" {...field} {...props} />
    </div>
  );
};

export const ErrorField = ({ field, form: _, ...props }) => {
  return (
    <div className="m-1" style={{ color: "red " }}>
      {props.errors}
    </div>
  );
};
