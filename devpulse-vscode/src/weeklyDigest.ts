import * as vscode from "vscode";
import type { DevPulseApi, DashboardData, Finding } from "./api";
import type { EngagementTracker } from "./engagementTracker";

export class WeeklyDigestCommand {
  constructor(
    private readonly api: DevPulseApi,
    private readonly engagementTracker: EngagementTracker,
  ) {}

  async execute(): Promise<void> {
    try {
      const [data, findings] = await Promise.all([
        this.api.getDashboardData(),
        this.api.getRecentFindings(50),
      ]);

      const stats = this.engagementTracker.getWeeklyStats();
      const streak = this.engagementTracker.getScanStreak();
      const longestStreak = this.engagementTracker.getLongestStreak();
      const segment = this.engagementTracker.getSegment();

      const severityCounts = this.getSeverityCounts(findings);
      const newFindings = findings.filter((f) => f.status === "open" && this.isRecent(f));

      const panel = vscode.window.createWebviewPanel(
        "devpulse.weeklyDigest",
        "DevPulse Weekly Digest",
        vscode.ViewColumn.One,
        { enableScripts: false },
      );

      panel.webview.html = this.renderHtml({
        data,
        stats,
        streak,
        longestStreak,
        segment,
        severityCounts,
        newFindings: newFindings.length,
      });
    } catch (err) {
      void vscode.window.showErrorMessage(
        `DevPulse: could not load weekly digest — ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private isRecent(finding: Finding): boolean {
    // Treat any open finding as "new" for digest purposes
    // In production, compare finding.createdAt against 7 days ago
    return finding.status === "open";
  }

  private getSeverityCounts(findings: Finding[]): Record<string, number> {
    return {
      Critical: findings.filter((f) => f.severity === "Critical").length,
      High: findings.filter((f) => f.severity === "High").length,
      Medium: findings.filter((f) => f.severity === "Medium").length,
      Low: findings.filter((f) => f.severity === "Low").length,
    };
  }

  private renderHtml(props: {
    data: DashboardData;
    stats: { scans: number; findings: number; score: number };
    streak: number;
    longestStreak: number;
    segment: string;
    severityCounts: Record<string, number>;
    newFindings: number;
  }): string {
    const { data, stats, streak, longestStreak, severityCounts, newFindings } = props;

    const streakEmoji = streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "💪";
    const streakText =
      streak > 1 ? `${streakEmoji} ${streak}-day scan streak` : "Start a scan streak this week!";

    const riskColor =
      severityCounts.Critical > 0
        ? "#DC2626"
        : severityCounts.High > 0
          ? "#EA580C"
          : severityCounts.Medium > 0
            ? "#CA8A04"
            : "#16A34A";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 32px;
      max-width: 600px;
      margin: 0 auto;
      color: var(--vscode-foreground, #333);
      background: var(--vscode-editor-background, #fff);
    }
    h1 { font-size: 24px; margin-bottom: 8px; }
    .subtitle { color: #888; margin-bottom: 24px; }
    .card {
      border: 1px solid var(--vscode-panel-border, #e0e0e0);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .metric-value { font-weight: 600; }
    .streak { color: #EA580C; font-size: 18px; margin: 12px 0; }
    .risk-bar {
      height: 8px;
      border-radius: 4px;
      background: ${riskColor};
      margin: 12px 0;
      opacity: 0.8;
    }
    .finding-count {
      display: inline-flex;
      gap: 16px;
      margin: 8px 0;
    }
    .finding-count span { font-size: 14px; }
    .cta {
      background: #2563EB;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 8px;
    }
    .empty { color: #888; font-style: italic; }
  </style>
</head>
<body>
  <h1>📊 Your Weekly Digest</h1>
  <div class="subtitle">DevPulse Security Summary</div>

  <div class="card">
    <div class="streak">${streakText}</div>
    <div class="metric-row">
      <span>Scans this week</span>
      <span class="metric-value">${stats.scans}</span>
    </div>
    <div class="metric-row">
      <span>Longest streak</span>
      <span class="metric-value">${longestStreak} days</span>
    </div>
    <div class="metric-row">
      <span>Engagement score</span>
      <span class="metric-value">${stats.score}/100</span>
    </div>
  </div>

  <div class="card">
    <h3>🛡️ Security Status</h3>
    <div class="risk-bar"></div>
    <div class="finding-count">
      <span>🔴 ${severityCounts.Critical} Critical</span>
      <span>🟠 ${severityCounts.High} High</span>
      <span>🟡 ${severityCounts.Medium} Medium</span>
      <span>🟢 ${severityCounts.Low} Low</span>
    </div>
    <div class="metric-row" style="margin-top:12px">
      <span>Open findings</span>
      <span class="metric-value">${data.openFindings}</span>
    </div>
    <div class="metric-row">
      <span>New this week</span>
      <span class="metric-value">${newFindings}</span>
    </div>
  </div>

  <div class="card">
    <h3>💰 Cost Snapshot</h3>
    <div class="metric-row">
      <span>Weekly LLM spend</span>
      <span class="metric-value">$${data.weeklyCost.toFixed(2)}</span>
    </div>
    <div class="metric-row">
      <span>Collections</span>
      <span class="metric-value">${data.collections}</span>
    </div>
    <div class="metric-row">
      <span>Recent scans</span>
      <span class="metric-value">${data.recentScans}</span>
    </div>
  </div>

  <div style="margin-top:24px; color:#888; font-size:12px">
    Weekly digest updates every Monday. Your data stays local.
  </div>
</body>
</html>`;
  }
}
