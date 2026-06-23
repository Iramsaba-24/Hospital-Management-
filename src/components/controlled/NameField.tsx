import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

interface NameFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  control: Control<T>;
  placeholder?: string;
}

const NameField = <T extends FieldValues>({
  name,
  label,
  required = false,
  control,
  placeholder = "",
}: NameFieldProps<T>) => {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">
        {label} {required && "*"}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <input
              {...field}
              placeholder={placeholder}
              className={`w-full border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error.message}</p>
            )}
          </div>
        )}
        rules={{ required: required ? `${label} is required` : false }}
      />
    </div>
  );
};

export default NameField;