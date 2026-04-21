import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Service to handle exporting data to PDF and Excel
 */
export const exportService = {
  
  /**
   * Export transactions to PDF
   * @param {Array} data - List of transactions
   * @param {Object} metadata - { rtName, period, totalIncome, totalExpense, balance }
   */
  exportToPDF(data, metadata) {
    const doc = new jsPDF();
    const { rtName, period, totalIncome, totalExpense, balance } = metadata;

    // 1. Header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(`LAPORAN KEUANGAN KAS ${rtName || 'RT 001'}`, 105, 20, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text(`Periode Cetak: ${new Date().toLocaleDateString('id-ID')}`, 105, 28, { align: 'center' });
    doc.line(20, 32, 190, 32); // Horizontal Line

    // 2. Summary Section
    doc.setFontSize(12);
    doc.text('Ringkasan Keuangan:', 20, 42);
    
    doc.setFontSize(10);
    doc.text(`Total Pemasukan  : Rp ${new Intl.NumberFormat('id-ID').format(totalIncome)}`, 25, 48);
    doc.text(`Total Pengeluaran : Rp ${new Intl.NumberFormat('id-ID').format(totalExpense)}`, 25, 54);
    doc.setFont(undefined, 'bold');
    doc.text(`Saldo Akhir       : Rp ${new Intl.NumberFormat('id-ID').format(balance)}`, 25, 60);
    doc.setFont(undefined, 'normal');

    // 3. Transactions Table
    const tableColumn = ["Tanggal", "Kategori", "Keterangan", "Tipe", "Nominal"];
    const tableRows = data.map(t => [
      new Date(t.date).toLocaleDateString('id-ID'),
      t.category,
      t.description || '-',
      t.type === 'income' ? 'Masuk' : 'Keluar',
      new Intl.NumberFormat('id-ID').format(t.amount)
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 68,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // Blue-500
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        4: { halign: 'right' }, // Align Nominal to right
      }
    });

    // 4. Footer / Signature Placeholder
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text('Hormat Kami,', 150, finalY);
    doc.text('Ketua Pengurus RT', 150, finalY + 25);

    // Save PDF
    doc.save(`Laporan_Kas_${new Date().getTime()}.pdf`);
  },

  /**
   * Export transactions to Excel
   * @param {Array} data - List of transactions
   */
  exportToExcel(data) {
    // Prepare data for worksheet
    const worksheetData = data.map(t => ({
      'Tanggal': new Date(t.date).toLocaleDateString('id-ID'),
      'Tipe': t.type === 'income' ? 'Masuk' : 'Keluar',
      'Kategori': t.category,
      'Keterangan': t.description || '-',
      'Nominal (Rp)': t.amount
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Kas");

    // Auto-size columns (optional but better)
    const wscols = [
      {wch:15}, // Tanggal
      {wch:10}, // Tipe
      {wch:20}, // Kategori
      {wch:40}, // Keterangan
      {wch:15}, // Nominal
    ];
    worksheet['!cols'] = wscols;

    // Trigger download
    XLSX.writeFile(workbook, `Rekap_Kas_RT_${new Date().getTime()}.xlsx`);
  }
};
