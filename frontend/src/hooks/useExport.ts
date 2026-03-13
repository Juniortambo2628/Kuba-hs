import { toast } from "sonner";

/**
 * Hook to export JSON data to CSV format and trigger browser download
 */
export function useExport() {
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }

    try {
      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Create CSV rows
      const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => 
          headers.map(header => {
            let val = row[header];
            // Handle nested objects (like user.name)
            if (typeof val === 'object' && val !== null) {
              val = val.name || val.business_name || JSON.stringify(val);
            }
            // Escape commas and quotes
            const stringVal = String(val ?? '').replace(/"/g, '""');
            return `"${stringVal}"`;
          }).join(',')
        )
      ].join('\n');

      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export successful");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed");
    }
  };

  return { exportToCSV };
}
