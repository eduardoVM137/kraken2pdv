export function exportToCSV<T extends object>(data: T[], filename: string = "export.csv") {
  if (!data.length) return;

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(row => Object.values(row).map(String).join(",")).join("\n");
  const csvContent = [headers, rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
