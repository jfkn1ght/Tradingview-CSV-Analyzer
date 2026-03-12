# TradingView CSV Analyzer

<img width="1068" height="1704" alt="pic" src="https://github.com/user-attachments/assets/512c3b4e-d63f-4c55-bcc7-84331b609761" />

A lightweight web app for analyzing **TradingView strategy CSV exports**.

Upload your TradingView trade history and instantly get:

- Clean **combined trades (entry + exit)**
- **Performance metrics dashboard**
- **Monthly and weekly performance calendar**
- **Trade table with column filtering**
- **Exportable processed dataset**

Everything runs **entirely in the browser** — no server, no uploads, and no data leaving your machine.

---

## Features

### Trade Processing
- Combines TradingView **entry and exit rows** into a single trade
- Calculates:
  - Trade duration
  - Net P&L
  - Cumulative P&L
- Sorts trades chronologically

### Performance Metrics Dashboard
Includes key trading statistics:

- Net Profit
- Win Rate
- Profit Factor
- Expectancy
- Sharpe Ratio
- Sortino Ratio
- Largest Win / Loss
- Max Drawdown
- Max Win / Loss Streak
- Long vs Short trade breakdown
- Average Trade Duration

---

### Calendar Performance View

Visual trading calendar showing:

- Daily P&L
- Number of trades
- Daily metrics
  - Win rate
  - Profit factor
  - Drawdown
  - Run-up

Also includes:

- Weekly summaries
- Monthly performance dashboards
- Expand / collapse months

---

### Interactive Trade Table

- View all processed trades
- Toggle column visibility
- Show more rows dynamically
- Clean dark-mode table design

---

### Export Processed Trades

Export the processed dataset as a CSV including:

- Combined entry/exit trades
- Calculated duration
- Cumulative P&L
- Only currently visible columns

---

## Example Workflow

1. Run a TradingView strategy backtest
2. Export List of Trades → CSV
3. Upload the CSV into this app
4. Instantly explore:
   - Trade metrics
   - Calendar performance
   - Processed trade dataset

---

## Tech Stack

- HTML
- CSS (dark mode UI)
- Vanilla JavaScript
- PapaParse** for CSV parsing

No frameworks required.

---

## Contributing

Contributions and feature suggestions are welcome.

Ideas for improvements:

- Additional trading metrics
- Better visualizations
- Risk analysis tools
- UI improvements

Open an issue or submit a pull request.

---

## License

MIT License

You are free to use, modify, and distribute this project.
