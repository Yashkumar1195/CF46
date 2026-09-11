/**
 * CashFlow Saathi - Audit Trail & Data Export Manager
 * Implements Slide 2 (#10), Slide 4 (Trust & Privacy, CSV export, User-controlled reset)
 */

class AuditManager {
  constructor(getStateFn, updateStateFn) {
    this.getState = getStateFn;
    this.updateState = updateStateFn;
  }

  /**
   * Log an event with high-precision timestamp
   */
  log(action, category, details) {
    const state = this.getState();
    const now = new Date();
    const formattedTimestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const newEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formattedTimestamp,
      action,
      category,
      details
    };

    const updatedLog = [newEntry, ...(state.auditLog || [])];
    this.updateState({ auditLog: updatedLog });
    return newEntry;
  }

  /**
   * Export all transactions to CSV format and trigger browser download
   */
  exportTransactionsToCSV() {
    const state = this.getState();
    const transactions = state.transactions || [];

    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const headers = ["Transaction ID", "Date", "Type", "Category", "Party / Customer", "Payment Method", "Amount (INR)", "Status", "Settlement Latency (Days)", "Description"];
    
    const rows = transactions.map(tx => [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${tx.type.toUpperCase()}"`,
      `"${tx.category}"`,
      `"${tx.party || 'General'}"`,
      `"${tx.method.toUpperCase()}"`,
      tx.amount,
      `"${tx.status || 'settled'}"`,
      tx.settlementOffsetDays ?? 0,
      `"${(tx.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CashFlow_Saathi_Transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.log("Data Export Generated", "Export", `Exported ${transactions.length} transaction records to CSV`);
  }

  /**
   * Export audit log to CSV
   */
  exportAuditToCSV() {
    const state = this.getState();
    const logs = state.auditLog || [];

    const headers = ["Audit ID", "Timestamp", "Category", "Action", "Details"];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.category}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CashFlow_Saathi_AuditLog_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
