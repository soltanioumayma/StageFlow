const Select = ({ label, name, value, onChange, options, required, error, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-800 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: '#F0F1F5',
          border: 'none',
          borderRadius: '10px',
          outline: 'none',
          color: '#111827',
        }}
      >
        <option value="" disabled>
          Sélectionnez...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
