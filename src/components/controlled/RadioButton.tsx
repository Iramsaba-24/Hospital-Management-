import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import Error from "./Error";
import Label from "./Label";

interface Option {
  label: string;
  value: string;
}

interface RadioButtonProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: Option[];
  required?: boolean;
  label: string;
}

const RadioButton = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  control,
  options = [],
  required = false,
}: RadioButtonProps<TFieldValues>) => {
  return (
    <>
      <Label label={label} required={required} />
      <Controller
        name={name}
        control={control}
        rules={required ? { required: `Choose any one option` } : {}}
        render={({ field, fieldState: { error } }) => (
          <div className="mt-1 mb-2">
            <div className="flex gap-8">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="accent-slate-700"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <Error error={error} />
          </div>
        )}
      />
    </>
  );
};

export default RadioButton;