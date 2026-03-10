/* =========================
   Compute Stats
========================= */
function computeStats(tradesArray) {
    let totalPnl = 0;
    let wins = 0;
    let losses = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;

    let largestWin = 0;
    let largestLoss = 0;
    let longTrades = 0;
    let shortTrades = 0;

    let returns = [];
    let downsideReturns = [];

    let equity = 0;
    let peak = 0;
    let maxDrawdown = 0;
    let maxRunup = 0;

    tradesArray.forEach(t => {
        const pnl = parseFloat(t.pnl) || 0;
        if (t.signal) {
            if (t.signal.includes("long")) longTrades++;
            if (t.signal.includes("short")) shortTrades++;
        }


        returns.push(pnl);
        if (pnl < 0) downsideReturns.push(pnl);

        totalPnl += pnl;
        equity += pnl;

        if (equity > peak) peak = equity;
        const dd = equity - peak;
        if (dd < maxDrawdown) maxDrawdown = dd;
        if (equity > maxRunup) maxRunup = equity;

        if (pnl > largestWin) largestWin = pnl;
        if (pnl < largestLoss) largestLoss = pnl;

        if (pnl > 0) {
            wins++;
            grossProfit += pnl;
            currentWinStreak++;
            currentLossStreak = 0;
        } else if (pnl < 0) {
            losses++;
            grossLoss += pnl;
            currentLossStreak++;
            currentWinStreak = 0;
        }

        if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
        if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
    });

    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
    const profitFactor = grossLoss !== 0 ? (grossProfit / Math.abs(grossLoss)).toFixed(2) : "-";
    const expectancy = totalTrades > 0 ? (totalPnl / totalTrades).toFixed(2) : 0;

    // Sharpe Ratio
    let sharpe = "-";
    if (returns.length > 1) {
        const mean = returns.reduce((a,b)=>a+b,0)/returns.length;
        const variance = returns.reduce((a,b)=>a + Math.pow(b-mean,2),0)/(returns.length-1);
        const std = Math.sqrt(variance);
        if (std !== 0) sharpe = (mean/std * Math.sqrt(returns.length)).toFixed(2);
    }

    // Sortino Ratio
    let sortino = "-";
    if (returns.length > 1 && downsideReturns.length > 0) {
        const mean = returns.reduce((a,b)=>a+b,0)/returns.length;
        const downsideVariance = downsideReturns.reduce((a,b)=>a + Math.pow(b,2),0)/downsideReturns.length;
        const downsideDev = Math.sqrt(downsideVariance);
        if (downsideDev !== 0) sortino = (mean/downsideDev * Math.sqrt(returns.length)).toFixed(2);
    }

    return {
        totalPnl,
        wins,
        losses,
        grossProfit,
        grossLoss,
        maxWinStreak,
        maxLossStreak,
        largestWin,
        largestLoss,
        totalTrades,
        winRate,
        profitFactor,
        expectancy,
        sharpe,
        sortino,
        maxDrawdown,
        maxRunup,
        longTrades,
        shortTrades
    };
}



/* =========================
   METRICS
========================= */
function generateMetrics() {
    const container = document.getElementById("metrics-container");
    container.innerHTML = "";

    if (!fullRows || fullRows.length <= 1) return;

    const header = fullRows[0];
    const pnlIndex = header.indexOf("Net P&L USD");
    if (pnlIndex === -1) return;

    // Collect all trade P&L data
    const signalIndex = header.indexOf("Signal");

    const tradesData = fullRows.slice(1).map(row => ({
        pnl: parseFloat(row[pnlIndex]) || 0,
        signal: (row[signalIndex] || "").toLowerCase()
    }));

    // Compute stats using computeStats()
    const stats = computeStats(tradesData);

    // Build the metric cards
    container.innerHTML = `
        <div class="metrics-grid">

            <div class="metric-card primary">
                <div class="metric-title">Net Profit</div>
                <div class="metric-value ${stats.totalPnl >= 0 ? 'positive' : 'negative'}">
                    ${stats.totalPnl >= 0 ? '+' : '-'}$${Math.abs(stats.totalPnl).toFixed(2)}
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Win Rate</div>
                <div class="metric-value">${stats.winRate}%</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Profit Factor</div>
                <div class="metric-value">${stats.profitFactor}</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Expectancy</div>
                <div class="metric-value">$${stats.expectancy}</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Sharpe Ratio</div>
                <div class="metric-value">${stats.sharpe}</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Sortino Ratio</div>
                <div class="metric-value">${stats.sortino}</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Max Drawdown</div>
                <div class="metric-value negative">
                    -$${Math.abs(stats.maxDrawdown).toFixed(2)}
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Largest Win</div>
                <div class="metric-value positive">
                    +$${stats.largestWin.toFixed(2)}
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Largest Loss</div>
                <div class="metric-value negative">
                    -$${Math.abs(stats.largestLoss).toFixed(2)}
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Max Win Streak</div>
                <div class="metric-value">${stats.maxWinStreak}</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Max Loss Streak</div>
                <div class="metric-value">${stats.maxLossStreak}</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Total Trades</div>
                <div class="metric-value">${stats.totalTrades}</div>
            </div>

            <div class="metric-card">
                <div class="metric-title">Long / Short</div>
                <div class="metric-value split">
                    ${stats.longTrades} / ${stats.shortTrades} 
                    (${stats.totalTrades ? Math.round(stats.longTrades / stats.totalTrades * 100) : 0}% Long)
                </div>
            </div>


        </div>
    `;
}

