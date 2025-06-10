type FormFieldProps = {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
};

function FormField({
  label,
  type,
  value,
  onChange,
  error,
  options,
  required,
  ...props
}: FormFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={label}>
        {label} {required && '*'}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? 'error' : ''}
          {...props}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? 'error' : ''}
          {...props}
        />
      )}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

export default FormField;
