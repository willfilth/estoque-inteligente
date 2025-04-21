export function exportToPDF(
  data: any[],
  title: string,
  headers: string[],
  columns: (string | ((row: any) => string))[]
) {
  if (typeof window === 'undefined') {
    return;
  }

  // Ensure jsPDF is available
  // @ts-ignore - we know it's available because we're including it in index.html
  const { jsPDF } = window.jspdf;
  
  if (!jsPDF) {
    console.error('jsPDF is not available');
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
  });

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

  // Prepare data for autoTable
  const tableRows = data.map(row => {
    return columns.map(column => {
      if (typeof column === 'function') {
        return column(row);
      }
      return row[column] !== undefined ? row[column] : '';
    });
  });

  // Generate table
  // @ts-ignore - we know it's available because we're including it in index.html
  doc.autoTable({
    head: [headers],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      halign: 'left',
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
}
