let fullRows = [];
let visibleRows = 100;
let visibleColumns = [];

const defaultHidden = [
    "Net P&L %",
    "Favorable excursion %",
    "Adverse excursion %",
    "Cumulative P&L %",
    "Position size (value)"
];

document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        skipEmptyLines: true,
        complete: function(results) {
            const rawRows = results.data;
            fullRows = combineTrades(rawRows);
            visibleRows = 100;
            createColumnSelector();
            displayTable();
            generateMetrics();
            generateCalendar();

            // enable export button
            document.querySelector(".export-btn").classList.remove("disabled");            
        }
    });
});