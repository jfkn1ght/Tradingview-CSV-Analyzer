
function exportCombinedCSV() {

    if (document.querySelector(".export-btn").classList.contains("disabled")) {
        return;
    }

    if (!fullRows || fullRows.length <= 1) {
        alert("No processed trades to export.");
        return;
    }

    // Get current column visibility
    const checkboxes = document.querySelectorAll("#column-selector input");
    const visibleColumns = Array.from(checkboxes).map(cb => cb.checked);

    // Filter rows based on visible columns
    const filteredRows = fullRows.map(row => {
        return row.filter((cell, index) => visibleColumns[index]);
    });

    const csv = Papa.unparse(filteredRows);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "processed_trades.csv");
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
