const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Paths configuration
const rootDir = path.join(__dirname, '..');
const reportsDir = path.join(rootDir, 'reports');
const historyPath = path.join(rootDir, 'PERFORMANCE_HISTORY.md');
const tempReportPath = path.join(reportsDir, 'temp-report.json');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

let serverProcess = null;

// Clean server termination utility (PID tree termination for Windows & Unix)
function killServer() {
  if (serverProcess) {
    console.log(`\x1b[36m[INFO]\x1b[0m Terminating server process (PID ${serverProcess.pid})...`);
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${serverProcess.pid} /f /t`, { stdio: 'ignore' });
      } else {
        serverProcess.kill('SIGKILL');
      }
    } catch (e) {
      console.warn(`\x1b[33m[WARN]\x1b[0m Failed to cleanly terminate server: ${e.message}`);
    }
    serverProcess = null;
  }
}

// Bind process listeners to ensure zero ghost ports are left open
process.on('exit', killServer);
process.on('SIGINT', () => { killServer(); process.exit(1); });
process.on('SIGTERM', () => { killServer(); process.exit(1); });
process.on('uncaughtException', (err) => {
  console.error(`\n\x1b[31m[ERROR] Uncaught Exception:\x1b[0m`, err);
  killServer();
  process.exit(1);
});

// Helper: Polling health check to wait for Next.js to start
function waitForServer(retries = 30, delay = 1000) {
  return new Promise((resolve, reject) => {
    const check = (remaining) => {
      if (remaining <= 0) {
        reject(new Error('Next.js server failed to respond on port 3001 in time.'));
        return;
      }
      
      http.get('http://localhost:3001/', (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(() => check(remaining - 1), delay);
        }
      }).on('error', () => {
        setTimeout(() => check(remaining - 1), delay);
      });
    };
    check(retries);
  });
}

// Helper: Fetch Git commit short hash
function getCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    return `Run_${Date.now().toString().slice(-6)}`;
  }
}

// Parse number values from performance entries (e.g. "1.2s" -> 1.2, "120ms" -> 120)
function parseMetricValue(str) {
  const match = str.match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Auditing pipeline entrypoint
async function run() {
  console.log('\x1b[35m====================================================\x1b[0m');
  console.log('\x1b[35m   FRONTEND PERFORMANCE AUDIT LOOP INITIALIZED     \x1b[0m');
  console.log('\x1b[35m====================================================\x1b[0m\n');

  try {
    // 1. Build production assets
    console.log('\x1b[36m[STEP 1]\x1b[0m Building production assets (npm run build)...');
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
    console.log('\x1b[32m[SUCCESS]\x1b[0m Production build completed successfully.\n');

    // 2. Launch Next.js start server in background
    console.log('\x1b[36m[STEP 2]\x1b[0m Starting transient production server on port 3001...');
    serverProcess = spawn('npx', ['next', 'start', '-p', '3001'], {
      cwd: rootDir,
      shell: true,
      stdio: 'ignore'
    });

    console.log('\x1b[36m[INFO]\x1b[0m Waiting for server health check (http://localhost:3001)...');
    await waitForServer();
    console.log('\x1b[32m[SUCCESS]\x1b[0m Transient Next.js server is online.\n');

    // 3. Multi-Pass Lighthouse capture (3 runs for consistency)
    const runCount = 3;
    const lcpValues = [];
    const tbtValues = [];
    const clsValues = [];
    const fcpValues = [];
    const ttfbValues = [];
    const performanceScores = [];

    console.log(`\x1b[36m[STEP 3]\x1b[0m Executing ${runCount} Lighthouse audit passes for averaging...`);

    for (let i = 1; i <= runCount; i++) {
      console.log(`  -> Audit Pass ${i}/${runCount} in progress...`);
      
      const lhCmd = `npx lighthouse http://localhost:3001 --output=json --output-path="${tempReportPath}" --chrome-flags="--headless" --only-categories=performance --quiet`;
      execSync(lhCmd, { cwd: rootDir, stdio: 'inherit' });

      if (!fs.existsSync(tempReportPath)) {
        throw new Error(`Failed to generate audit report in pass ${i}.`);
      }

      const reportData = JSON.parse(fs.readFileSync(tempReportPath, 'utf8'));

      const lcp = reportData.audits['largest-contentful-paint'].numericValue || 0;
      const tbt = reportData.audits['total-blocking-time'].numericValue || 0;
      const cls = reportData.audits['cumulative-layout-shift'].numericValue || 0;
      const fcp = reportData.audits['first-contentful-paint'].numericValue || 0;
      const ttfb = reportData.audits['server-response-time'].numericValue || 0;
      const score = Math.round((reportData.categories.performance.score || 0) * 100);

      lcpValues.push(lcp);
      tbtValues.push(tbt);
      clsValues.push(cls);
      fcpValues.push(fcp);
      ttfbValues.push(ttfb);
      performanceScores.push(score);

      // Clean temp report file
      fs.unlinkSync(tempReportPath);
    }

    // Compute averages
    const avgLcp = lcpValues.reduce((a, b) => a + b, 0) / runCount;
    const avgTbt = tbtValues.reduce((a, b) => a + b, 0) / runCount;
    const avgCls = clsValues.reduce((a, b) => a + b, 0) / runCount;
    const avgFcp = fcpValues.reduce((a, b) => a + b, 0) / runCount;
    const avgTtfb = ttfbValues.reduce((a, b) => a + b, 0) / runCount;
    const avgScore = Math.round(performanceScores.reduce((a, b) => a + b, 0) / runCount);

    console.log('\n\x1b[32m[SUCCESS]\x1b[0m All audits completed. Calculating deltas...');

    // 4. Compute Baseline Delta
    let previousRun = null;
    if (fs.existsSync(historyPath)) {
      const content = fs.readFileSync(historyPath, 'utf8');
      const lines = content.split('\n');
      const dataLines = lines.filter(l => l.trim().startsWith('|') && !l.includes('---|') && !l.includes('Date/Timestamp'));
      if (dataLines.length > 0) {
        const lastLine = dataLines[dataLines.length - 1];
        const parts = lastLine.split('|').map(p => p.trim());
        if (parts.length >= 9) {
          previousRun = {
            lcp: parseMetricValue(parts[3]),
            tbt: parseMetricValue(parts[4]),
            cls: parseMetricValue(parts[5]),
            ttfb: parseMetricValue(parts[6]),
            score: parseMetricValue(parts[7])
          };
        }
      }
    }

    // Format metrics
    const curLcpSec = (avgLcp / 1000).toFixed(2);
    const curTbtMs = Math.round(avgTbt);
    const curClsVal = avgCls.toFixed(3);
    const curTtfbMs = Math.round(avgTtfb);

    let deltaNote = 'Initial baseline run';
    if (previousRun) {
      const dLcp = (curLcpSec - previousRun.lcp).toFixed(2);
      const dTbt = curTbtMs - previousRun.tbt;
      const dCls = (curClsVal - previousRun.cls).toFixed(3);
      const dScore = avgScore - previousRun.score;

      const formatDelta = (val, unit) => {
        if (val > 0) return `+${val}${unit} 🔺`;
        if (val < 0) return `${val}${unit} 🟢`;
        return `0${unit}`;
      };

      deltaNote = `Score: ${formatDelta(dScore, '')} / LCP: ${formatDelta(dLcp, 's')} / CLS: ${formatDelta(dCls, '')}`;
    }

    // Determine performance status
    let status = 'Passing';
    if (avgLcp >= 4000 || avgTbt >= 300 || avgCls >= 0.25) {
      status = 'Critical';
    } else if (avgLcp >= 2500 || avgTbt >= 150 || avgCls >= 0.1) {
      status = 'Warning';
    }

    // 5. Append ledger entry into PERFORMANCE_HISTORY.md
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const commitId = getCommitHash();
    const newRow = `| ${dateStr} | ${commitId} | ${curLcpSec}s | ${curTbtMs}ms | ${curClsVal} | ${curTtfbMs}ms | ${avgScore} (${status}) | ${deltaNote} |`;

    fs.appendFileSync(historyPath, newRow + '\n');
    console.log('\x1b[32m[SUCCESS]\x1b[0m Append to PERFORMANCE_HISTORY.md database ledger complete.');

    // 6. Generate Offline HTML Visualization Dashboard
    compileHtmlDashboard();

    // Kill background Next.js server cleanly
    killServer();

    console.log('\n\x1b[32m====================================================\x1b[0m');
    console.log('\x1b[32m   PERFORMANCE AUDIT LOOP COMPLETED SUCCESSFULLY    \x1b[0m');
    console.log('\x1b[32m====================================================\x1b[0m\n');
    console.log('You can review the updated dashboard offline at:');
    console.log(`\x1b[34mfile:///${path.join(reportsDir, 'performance-dashboard.html').replace(/\\/g, '/')}\x1b[0m\n`);

  } catch (error) {
    console.error(`\n\x1b[31m[CRITICAL AUDIT ERROR]\x1b[0m`, error.message);
    killServer();
    process.exit(1);
  }
}

// Function to compile offline performance-dashboard.html
function compileHtmlDashboard() {
  console.log('\x1b[36m[STEP 4]\x1b[0m Compiling visual HTML dashboard reports/performance-dashboard.html...');
  
  if (!fs.existsSync(historyPath)) {
    throw new Error('PERFORMANCE_HISTORY.md file does not exist.');
  }

  // Parse PERFORMANCE_HISTORY.md table rows
  const historyContent = fs.readFileSync(historyPath, 'utf8');
  const lines = historyContent.split('\n');
  const runs = [];

  let isTable = false;
  for (const line of lines) {
    if (line.includes('|---|') || line.includes('| :---')) {
      isTable = true;
      continue;
    }
    if (isTable && line.trim().startsWith('|')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 9 && parts[1]) {
        runs.push({
          timestamp: parts[1],
          commitId: parts[2],
          lcp: parts[3],
          tbt: parts[4],
          cls: parts[5],
          ttfb: parts[6],
          scoreStatus: parts[7],
          notesDelta: parts[8]
        });
      }
    }
  }

  if (runs.length === 0) {
    throw new Error('No valid runs detected inside PERFORMANCE_HISTORY.md.');
  }

  const latest = runs[runs.length - 1];
  const latestLcp = parseMetricValue(latest.lcp);
  const latestTbt = parseMetricValue(latest.tbt);
  const latestCls = parseMetricValue(latest.cls);
  const latestTtfb = parseMetricValue(latest.ttfb);
  const latestScore = parseMetricValue(latest.scoreStatus);

  // Helper: Status colors for visual cards
  const getStatusColor = (val, good, warn) => {
    if (val <= good) return '#10b981'; // Green
    if (val <= warn) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const lcpColor = getStatusColor(latestLcp, 2.5, 4.0);
  const tbtColor = getStatusColor(latestTbt, 150, 300);
  const clsColor = getStatusColor(latestCls, 0.1, 0.25);
  const ttfbColor = getStatusColor(latestTtfb, 800, 1500);
  const scoreColor = latestScore >= 90 ? '#10b981' : (latestScore >= 50 ? '#f59e0b' : '#ef4444');

  // Math helper for drawing simple sparkline SVG graphs
  function getSparklinePoints(dataArray, width, height) {
    if (dataArray.length < 2) return '';
    const min = Math.min(...dataArray);
    const max = Math.max(...dataArray);
    const range = max - min === 0 ? 1 : max - min;

    return dataArray.map((val, idx) => {
      const x = (idx / (dataArray.length - 1)) * width;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${x},${y}`;
    }).join(' ');
  }

  const lcpPoints = getSparklinePoints(runs.map(r => parseMetricValue(r.lcp)), 260, 60);
  const tbtPoints = getSparklinePoints(runs.map(r => parseMetricValue(r.tbt)), 260, 60);
  const clsPoints = getSparklinePoints(runs.map(r => parseMetricValue(r.cls)), 260, 60);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dasi Games - Performance Ledger Dashboard</title>
  <style>
    :root {
      --bg-color: #080b11;
      --card-bg: #0f131a;
      --card-border: rgba(255,255,255,0.06);
      --text-main: #f8fafc;
      --text-muted: #64748b;
      --primary-color: #8b5cf6;
      --primary-glow: rgba(139, 92, 246, 0.15);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 2.5rem 1.5rem;
      min-height: 100vh;
      line-height: 1.5;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 1.5rem;
    }

    header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      background: linear-gradient(135deg, #fff 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    header p {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    /* Metric Grid Cards */
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background-color: var(--indicator-color, var(--primary-color));
    }

    .card-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }

    .card-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .card-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    /* SVG Sparkline container */
    .sparkline-box {
      width: 100%;
      height: 60px;
      margin-top: auto;
      border-top: 1px dashed rgba(255,255,255,0.03);
      padding-top: 8px;
    }

    /* Score Radial Card Override */
    .score-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 6px solid var(--indicator-color);
      margin: 1rem 0;
      font-size: 1.75rem;
      font-weight: 900;
      color: #fff;
      box-shadow: 0 0 15px var(--indicator-color);
    }

    /* Table styling */
    .history-section {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .history-header {
      font-size: 1.1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.25rem;
      color: #fff;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.825rem;
    }

    th {
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      padding: 1rem;
      border-bottom: 1.5px solid var(--border-color);
      background-color: rgba(255,255,255,0.01);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      color: var(--text-main);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    tr:hover {
      background-color: rgba(255,255,255,0.02);
    }

    /* Badge tags */
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-passing {
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge-warning {
      background-color: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    .badge-critical {
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Performance Ledger Dashboard</h1>
      <p>A automated offline metrics monitoring loop for the Tbilisi game studio assets. Sync: Commit \`#${latest.commitId}\` // Last Audit: ${latest.timestamp}</p>
    </header>

    <div class="metric-grid">
      <!-- Performance Score -->
      <div class="card" style="--indicator-color: ${scoreColor}; align-items: center; justify-content: center;">
        <span class="card-title">Lighthouse Score</span>
        <div class="score-circle" style="--indicator-color: ${scoreColor}">${latestScore}</div>
        <span class="card-subtitle" style="margin-bottom: 0;">Overall Performance Status</span>
      </div>

      <!-- LCP Card -->
      <div class="card" style="--indicator-color: ${lcpColor}">
        <div>
          <span class="card-title">Largest Contentful Paint (LCP)</span>
          <div class="card-value">${latest.lcp}</div>
          <span class="card-subtitle">Goal Budget: &lt; 2.50s</span>
        </div>
        <div class="sparkline-box">
          <svg viewBox="0 0 260 60" width="100%" height="100%">
            <polyline fill="none" stroke="${lcpColor}" stroke-width="2" points="${lcpPoints}" />
          </svg>
        </div>
      </div>

      <!-- TBT Card -->
      <div class="card" style="--indicator-color: ${tbtColor}">
        <div>
          <span class="card-title">Total Blocking Time (TBT)</span>
          <div class="card-value">${latest.tbt}</div>
          <span class="card-subtitle">INP Proxy Budget: &lt; 150ms</span>
        </div>
        <div class="sparkline-box">
          <svg viewBox="0 0 260 60" width="100%" height="100%">
            <polyline fill="none" stroke="${tbtColor}" stroke-width="2" points="${tbtPoints}" />
          </svg>
        </div>
      </div>

      <!-- CLS Card -->
      <div class="card" style="--indicator-color: ${clsColor}">
        <div>
          <span class="card-title">Cumulative Layout Shift (CLS)</span>
          <div class="card-value">${latest.cls}</div>
          <span class="card-subtitle">Goal Budget: &lt; 0.100</span>
        </div>
        <div class="sparkline-box">
          <svg viewBox="0 0 260 60" width="100%" height="100%">
            <polyline fill="none" stroke="${clsColor}" stroke-width="2" points="${clsPoints}" />
          </svg>
        </div>
      </div>
    </div>

    <!-- History ledger table -->
    <div class="history-section">
      <h2 class="history-header">Historical Runs Timeline Log</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Commit ID</th>
              <th>LCP</th>
              <th>TBT</th>
              <th>CLS</th>
              <th>TTFB</th>
              <th>Status</th>
              <th>Delta / Changeset</th>
            </tr>
          </thead>
          <tbody>
            ${runs.slice().reverse().map(run => {
              const runScore = parseMetricValue(run.scoreStatus);
              const scoreText = run.scoreStatus;
              let badgeClass = 'badge-passing';
              if (scoreText.toLowerCase().includes('critical')) badgeClass = 'badge-critical';
              else if (scoreText.toLowerCase().includes('warning')) badgeClass = 'badge-warning';

              return `
              <tr>
                <td>${run.timestamp}</td>
                <td style="color: var(--primary-color)">${run.commitId}</td>
                <td>${run.lcp}</td>
                <td>${run.tbt}</td>
                <td>${run.cls}</td>
                <td>${run.ttfb}</td>
                <td><span class="status-badge ${badgeClass}">${runScore} // ${scoreText.split('(')[1]?.slice(0,-1) || 'OK'}</span></td>
                <td style="color: #cbd5e1; font-size: 0.75rem;">${run.notesDelta}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reportsDir, 'performance-dashboard.html'), htmlContent);
  console.log('\x1b[32m[SUCCESS]\x1b[0m reports/performance-dashboard.html compiled successfully.');
}

// Invoke the audit run
run();
