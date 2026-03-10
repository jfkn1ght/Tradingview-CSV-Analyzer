/* =========================
   COLUMN SELECTOR
========================= */
function createColumnSelector() {
    const container = document.getElementById("column-selector");
    container.innerHTML = "";

    const headers = fullRows[0];
    visibleColumns = headers.map((header, index) => {
        const isChecked = !defaultHidden.includes(header);

        const label = document.createElement("label");
        label.className = "checkbox-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = isChecked;
        checkbox.dataset.index = index;

        checkbox.addEventListener("change", function() {
            displayTable();
        });

        label.appendChild(checkbox);
        label.append(" " + header);
        container.appendChild(label);

        return isChecked;
    });
}

/* =========================
   TABLE
========================= */
function displayTable() {
    const rows = fullRows;
    if (!rows || rows.length === 0) return;

    const checkboxes = document.querySelectorAll("#column-selector input");
    visibleColumns = Array.from(checkboxes).map(cb => cb.checked);

    const table = document.createElement("table");

    rows.slice(0, visibleRows).forEach((row, rowIndex) => {
        const tr = document.createElement("tr");

        row.forEach((cell, colIndex) => {
            if (!visibleColumns[colIndex]) return;

            const cellElement = document.createElement(rowIndex===0?"th":"td");
            cellElement.textContent = cell;
            tr.appendChild(cellElement);
        });

        table.appendChild(tr);
    });

    const container = document.getElementById("table-container");
    container.innerHTML = "";
    container.appendChild(table);

    if (visibleRows < rows.length) {
        const btn = document.createElement("button");
        btn.textContent = "Show More";
        btn.className = "show-more-btn";
        btn.onclick = () => { visibleRows += 100; displayTable(); };
        container.appendChild(btn);
    }
}
