/* =========================
   CALENDAR WITH DAILY METRICS & RED LOSSES
========================= */

function generateCalendar() {

    const container = document.getElementById("calendar-container");
    container.innerHTML = `
    <h2>Calendar View</h2>
    <div class="calendar-controls">
        <button onclick="toggleAllMonths(false)">Expand All</button>
        <button onclick="toggleAllMonths(true)">Collapse All</button>
    </div>
`;

    if (!fullRows || fullRows.length <= 1) return;

    const header = fullRows[0];
    const dateIndex = header.indexOf("Enter");
    const pnlIndex = header.indexOf("Net P&L USD");
    const signalIndex = header.indexOf("Signal");

    if (dateIndex === -1 || pnlIndex === -1) return;

    const dailyTrades = {};
    const monthlyTrades = {};

    for (let i = 1; i < fullRows.length; i++) {

        const dateValue = new Date(fullRows[i][dateIndex]);
        if (isNaN(dateValue)) continue;

        const dayKey = dateValue.toISOString().split("T")[0];

        const monthKey =
            `${dateValue.getFullYear()}-${(dateValue.getMonth()+1)
            .toString().padStart(2,'0')}`;

        const pnl = parseFloat(fullRows[i][pnlIndex]) || 0;

        const signal =
            (fullRows[i][signalIndex] || "").toLowerCase();

        const tradeObj = {
            pnl,
            signal
        };

        if (!dailyTrades[dayKey]) dailyTrades[dayKey] = [];
        dailyTrades[dayKey].push(tradeObj);

        if (!monthlyTrades[monthKey]) monthlyTrades[monthKey] = [];
        monthlyTrades[monthKey].push(tradeObj);
    }

    const sortedMonths = Object.keys(monthlyTrades).sort();

    sortedMonths.forEach(monthKey => {

        const [year, month] = monthKey.split("-").map(Number);

        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);

        const monthName =
            firstDay.toLocaleString('default', {
                month: 'long',
                year: 'numeric'
            });

        /* =========================
           MONTH WRAPPER
        ========================== */

        const monthWrapper = document.createElement("div");
        monthWrapper.className = "month-wrapper";

        const monthHeader = document.createElement("div");
        monthHeader.className = "month-header";

        const monthContent = document.createElement("div");
        monthContent.className = "month-content collapsed";

        monthHeader.innerHTML = `▶ ${monthName}`;

        monthHeader.onclick = () => {

            const collapsed =
                monthContent.classList.toggle("collapsed");

            monthHeader.innerHTML =
                `${collapsed ? "▶" : "▼"} ${monthName}`;
        };

        monthWrapper.appendChild(monthHeader);
        monthWrapper.appendChild(monthContent);
        container.appendChild(monthWrapper);

        /* =========================
           CALENDAR GRID
        ========================== */

        const calendar = document.createElement("div");
        calendar.className = "calendar";
        calendar.style.gridTemplateColumns = "repeat(8, 1fr)";

        ["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Week"].forEach(day => {

            const div = document.createElement("div");
            div.className = "weekday-header";
            div.textContent = day;

            calendar.appendChild(div);
        });

        for (let i = 0; i < firstDay.getDay(); i++) {
            calendar.appendChild(document.createElement("div"));
        }

        let weeklyTrades = [];
        let currentWeekDayIndex = firstDay.getDay();

        for (let day = 1; day <= lastDay.getDate(); day++) {

            const currentDate = new Date(year, month - 1, day);

            const key =
                currentDate.toISOString().split("T")[0];

            const trades = dailyTrades[key] || [];

            const dayDiv = document.createElement("div");
            dayDiv.className = "day";

            if (trades.length > 0) {

                const dailyStats = computeStats(trades);

                dayDiv.style.backgroundColor =
                    dailyStats.totalPnl < 0
                    ? "#b71c1c"
                    : "#388e3c";

                dayDiv.innerHTML = `
                    <strong>${day}</strong><br>
                    ${dailyStats.totalPnl>=0?'+':'-'}$${Math.abs(dailyStats.totalPnl).toFixed(2)}<br>
                    ${trades.length} trades
                    <div class="day-metrics">
                        Win: ${dailyStats.winRate}%<br>
                        PF: ${dailyStats.profitFactor}<br>
                        DD: $${dailyStats.maxDrawdown.toFixed(2)}<br>
                        RU: $${dailyStats.maxRunup.toFixed(2)}
                    </div>
                `;

            } else {

                dayDiv.innerHTML = `<strong>${day}</strong>`;
            }

            calendar.appendChild(dayDiv);

            weeklyTrades.push(...trades);

            currentWeekDayIndex++;

            if (currentWeekDayIndex % 7 === 0 || day === lastDay.getDate()) {

                const summaryDiv = document.createElement("div");
                summaryDiv.className = "day";

                if (weeklyTrades.length > 0) {

                    const weekStats =
                        computeStats(weeklyTrades);

                    summaryDiv.style.backgroundColor =
                        weekStats.totalPnl < 0
                        ? "#4a1c1c"
                        : "#1b3a1b";

                    summaryDiv.innerHTML = `
                        <strong>Week</strong><br>
                        ${weekStats.totalPnl>=0?'+':'-'}$${Math.abs(weekStats.totalPnl).toFixed(2)}<br>
                        Trades: ${weekStats.totalTrades}<br>
                        Win: ${weekStats.winRate}%<br>
                        DD: $${weekStats.maxDrawdown.toFixed(2)}<br>
                        RU: $${weekStats.maxRunup.toFixed(2)}
                    `;
                }

                calendar.appendChild(summaryDiv);

                weeklyTrades = [];
                currentWeekDayIndex = 0;
            }
        }

        monthContent.appendChild(calendar);

        /* =========================
           MONTHLY METRICS
        ========================== */

        const monthTrades = monthlyTrades[monthKey];

        const monthStats = computeStats(monthTrades);

        const monthDiv = document.createElement("div");

        monthDiv.style.marginTop = "40px";

        monthDiv.innerHTML = `
            <div class="metrics-grid">

                <div class="metric-card primary">
                    <div class="metric-title">Net Profit</div>
                    <div class="metric-value ${monthStats.totalPnl >= 0 ? 'positive' : 'negative'}">
                        ${monthStats.totalPnl >= 0 ? '+' : '-'}$${Math.abs(monthStats.totalPnl).toFixed(2)}
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Trades</div>
                    <div class="metric-value">${monthStats.totalTrades}</div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Win Rate</div>
                    <div class="metric-value">${monthStats.winRate}%</div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Profit Factor</div>
                    <div class="metric-value">${monthStats.profitFactor}</div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Expectancy</div>
                    <div class="metric-value">$${monthStats.expectancy}</div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Sharpe</div>
                    <div class="metric-value">${monthStats.sharpe}</div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Sortino</div>
                    <div class="metric-value">${monthStats.sortino}</div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Max Drawdown</div>
                    <div class="metric-value negative">
                        -$${Math.abs(monthStats.maxDrawdown).toFixed(2)}
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Max Run-Up</div>
                    <div class="metric-value positive">
                        +$${monthStats.maxRunup.toFixed(2)}
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-title">Long / Short</div>
                    <div class="metric-value split">
                        ${monthStats.longTrades} / ${monthStats.shortTrades}
                        (${monthStats.totalTrades ? Math.round(monthStats.longTrades / monthStats.totalTrades * 100) : 0}% Long)
                    </div>
                </div>

            </div>
        `;

        monthContent.appendChild(monthDiv);

    });
}



function toggleAllMonths(collapse) {
    document.querySelectorAll(".month-content").forEach(content => {
        const header = content.previousElementSibling;
        if (collapse) {
            content.classList.add("collapsed");
            header.innerHTML = header.innerHTML.replace("▼","▶");
        } else {
            content.classList.remove("collapsed");
            header.innerHTML = header.innerHTML.replace("▶","▼");
        }
    });
}