import React from "react";
import { Controller, type Control } from "react-hook-form";
import Error from "./Error";
import Label from "./Label";

type Option = string | { label: string; value: string | number };

interface DropdownProps {
  name: string;
  control: Control<any>;
  required?: boolean;
  options?: Option[];
  label: string;
  selected?: string | number;
  onChange?: (value: string | number) => void;
  Options?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  control,
  required = false,
  disabled = false,
  options = [],
}) => {
  return (
    <div className="w-full mx-auto mb-2">
      <Label label={label} required={required} />

      <Controller
        name={name}
        control={control}
        rules={required ? { required: "This field is required" } : {}}
        render={({ field, fieldState: { error } }) => (
          <>
            <select
              {...field}
              id={name}
              disabled={disabled}
              className={`mt-1 w-full p-2 border rounded-md shadow ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
              }`}
            >
              <option value="">Select</option>

              {options.map((opt, idx) => {
                const value = typeof opt === "object" ? opt.value : opt;
                const label = typeof opt === "object" ? opt.label : opt;

                return (
                  <option key={idx} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>

            <Error error={error} />
          </>
        )}
      />
    </div>
  );
};

export default Dropdown;