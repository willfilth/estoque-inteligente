export function exportToExcel(
  data: any[],
  title: string,
  headers: string[],
  columns: (string | ((row: any) => any))[]
) {
  if (typeof window === 'undefined') {
    return;
  }

  // Ensure XLSX is available
  // @ts-ignore - we know it's available because we're including it in index.html
  const XLSX = window.XLSX;
  
  if (!XLSX) {
    console.error('XLSX is not available');
    return;
  }

  // Prepare data for Excel
  const excelData = [
    headers, // First row is headers
    ...data.map(row => {
      return columns.map(column => {
        if (typeof column === 'function') {
          return column(row);
        }
        return row[column] !== undefined ? row[column] : '';
      });
    })
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Set column widths
  const colWidths = headers.map(() => ({ wch: 20 })); // default width
  worksheet['!cols'] = colWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, title);

  // Generate file and trigger download
  XLSX.writeFile(
    workbook, 
    `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`
  );
}
