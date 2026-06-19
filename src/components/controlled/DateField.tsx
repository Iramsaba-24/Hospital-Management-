import React from "react";
import { Controller, type Control, type FieldValues } from "react-hook-form";
import Label from "../controlled/Label";
import Error from "./Error";
import { convertToDateInputFormat } from "../../utils/dateUtils";


type DateFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  control: Control<FieldValues>;
  required?: boolean;
  disabled?: boolean;
  onlyToday?: boolean;
};


const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  control,
  required = false,
  disabled = false,
  onlyToday = false,
  ...rest
}) => {
  const today = getTodayDate();

  return (
    <div className="mb-2">
      {label && <Label label={label} required={required} />}

      <Controller
        name={name}
        control={control}
        defaultValue={today}
        rules={{
          required: required ? "Date is required" : false,
        }}
        render={({ field, fieldState: { error } }) => {
          

          const displayValue = field.value
            ? convertToDateInputFormat(field.value)
            : today;

          return (
            <>
              <input
                {...field}
                {...rest}
                id={name}
                type="date"
                value={displayValue}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={disabled}
                min={onlyToday ? today : rest.min}
                max={onlyToday ? today : rest.max}
                className={`mt-1 block w-full px-4 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  disabled
                    ? "bg-gray-100 cursor-not-allowed opacity-70"
                    : ""
                }`}
              />

              {error && <Error error={error} />}
            </>
          );
        }}
      />
    </div>
  );
};

export default DateField;