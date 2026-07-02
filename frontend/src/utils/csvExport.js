// ============================================================
// CSV export utility
// ============================================================

/**
 * Exports an array of objects to a downloadable CSV file.
 * @param {string[]} headers - Column headers
 * @param {string[][]} rows - Array of row arrays (each row is an array of cell values)
 * @param {string} filename - Download filename (without extension)
 */
export const exportToCSV = (headers, rows, filename) => {
  const escapeCsvValue = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => row.map(escapeCsvValue).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
