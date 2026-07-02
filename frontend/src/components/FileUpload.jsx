import { useState } from 'react';

const FileUpload = ({ label, accept, onChange, error, maxSize = 5 * 1024 * 1024 }) => {
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > maxSize) {
      setFileError(`Le fichier ne doit pas dépasser ${maxSize / (1024 * 1024)} Mo`);
      e.target.value = '';
      return;
    }
    setFileError('');
    onChange(e);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      />
      {(error || fileError) && <p className="text-red-500 text-sm mt-1">{error || fileError}</p>}
    </div>
  );
};

export default FileUpload;
