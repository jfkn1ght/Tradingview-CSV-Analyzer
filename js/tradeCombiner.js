/* =========================
   TRADE COMBINER
========================= */
function combineTrades(rows) {
    const header = rows[0];

    const tradeIndex = header.indexOf("Trade #");
    const typeIndex = header.indexOf("Type");
    const dateIndex = header.indexOf("Date and time");
    const signalIndex = header.indexOf("Signal");
    const pnlIndex = header.indexOf("Net P&L USD");
    const pnlPctIndex = header.indexOf("Net P&L %");
    const posQtyIndex = header.indexOf("Position size (qty)");
    const posValueIndex = header.indexOf("Position size (value)");
    const favUsdIndex = header.indexOf("Favorable excursion USD");
    const favPctIndex = header.indexOf("Favorable excursion %");
    const advUsdIndex = header.indexOf("Adverse excursion USD");
    const advPctIndex = header.indexOf("Adverse excursion %");

    const trades = {};

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const tradeNum = row[tradeIndex];
        const type = (row[typeIndex] || "").toLowerCase();
        if (!tradeNum) continue;

        if (!trades[tradeNum]) {
            trades[tradeNum] = {
                tradeNum,
                signal: "",
                enter: "",
                exit: "",
                pnlUsd: 0,
                pnlPct: 0,
                posQty: "",
                posValue: "",
                favUsd: "",
                favPct: "",
                advUsd: "",
                advPct: ""
            };
        }

        if (type.includes("entry")) {
            trades[tradeNum].enter = row[dateIndex];
            trades[tradeNum].signal = row[signalIndex];
            trades[tradeNum].posQty = row[posQtyIndex] || "";
            trades[tradeNum].posValue = row[posValueIndex] || "";
        }

        if (type.includes("exit")) {
            trades[tradeNum].exit = row[dateIndex];
            trades[tradeNum].pnlUsd = parseFloat(row[pnlIndex]) || 0;
            trades[tradeNum].pnlPct = parseFloat(row[pnlPctIndex]) || 0;
            trades[tradeNum].favUsd = row[favUsdIndex] || "";
            trades[tradeNum].favPct = row[favPctIndex] || "";
            trades[tradeNum].advUsd = row[advUsdIndex] || "";
            trades[tradeNum].advPct = row[advPctIndex] || "";
        }
    }

    const tradeArray = Object.values(trades).sort((a,b) => new Date(a.enter)-new Date(b.enter));
    const newRows = [[
        "Trade #","Signal","Enter","Exit","Trade Duration","Position size (qty)","Position size (value)",
        "Net P&L USD","Net P&L %","Favorable excursion USD","Favorable excursion %","Adverse excursion USD","Adverse excursion %",
        "Cumulative P&L USD","Cumulative P&L %"
    ]];

    let cumulativeUsd = 0;
    let cumulativePct = 0;

    tradeArray.forEach(trade => {
        cumulativeUsd += trade.pnlUsd;
        cumulativePct += trade.pnlPct;

        let durationStr = "";
        if (trade.enter && trade.exit) {
            const enterTime = new Date(trade.enter);
            const exitTime = new Date(trade.exit);
            let diff = Math.floor((exitTime - enterTime)/1000);
            const hours = Math.floor(diff / 3600);
            diff %= 3600;
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            durationStr = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        }

        newRows.push([
            trade.tradeNum,trade.signal,trade.enter,trade.exit,durationStr,
            trade.posQty,trade.posValue,trade.pnlUsd.toFixed(2),trade.pnlPct.toFixed(2),
            trade.favUsd,trade.favPct,trade.advUsd,trade.advPct,
            cumulativeUsd.toFixed(2),cumulativePct.toFixed(2)
        ]);
    });

    return newRows;
}