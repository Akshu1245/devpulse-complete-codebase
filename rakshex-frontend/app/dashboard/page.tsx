"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { EmptyState } from "../../components/EmptyState";
import PlanUtilizationBanner from "../../components/PlanUtilizationBanner";

function getWsUrl(): string {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
  if (typeof window === "undefined") return "ws://localhost:8000/ws";
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}

const WS_URL = getWsUrl();

interface Message {
  type: string;
  total_cost?: number;
  cost?: number;
  agent_id?: string;
  anomaly?: boolean;
  model?: string;
}

interface LogEntry {
  time: string;
  agent: string;
  cost: number;
  anomaly: boolean;
  model?: string;
}

export default function Dashboard() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [anomalyActive, setAnomalyActive] = useState(false);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const msg: Message = JSON.parse(event.data);

        if (msg.type === "cost_update") {
          setTotalCost(msg.total_cost || 0);
          const newLog: LogEntry = {
            time: new Date().toLocaleTimeString(),
            agent: msg.agent_id || "unknown",
            cost: msg.cost || 0,
            anomaly: msg.anomaly || false,
            model: msg.model,
          };
          setLogs((prev) => [newLog, ...prev].slice(0, 50));
          if (msg.anomaly) setAnomalyActive(true);
        } else if (msg.type === "init") {
          setTotalCost(msg.total_cost || 0);
        } else if (msg.type === "pong") {
          // heartbeat response
        }
      } catch {
        // Message parse failure — silently skip malformed data
      }
    };

    ws.onerror = () => {
      // WebSocket errors surface through onclose — handled by reconnect logic
    };

    ws.onclose = () => {
      setConnected(false);
      setSocket(null);
      // Auto-reconnect after 3 seconds
      reconnectRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    // Heartbeat every 30s
    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    return () => {
      clearInterval(heartbeat);
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      ws.close();
    };
  }, [connect]);

  const activeAgentsCount = new Set(logs.map((l) => l.agent)).size;
  const totalApiCalls = logs.length;
  const anomaliesCount = logs.filter((l) => l.anomaly).length;

  // Calculate dynamic health percentage (non-anomaly ratio)
  const healthPercent =
    logs.length > 0 ? Math.round(((logs.length - anomaliesCount) / logs.length) * 100) : 100;

  // Health ring offset: radius 40 has circumference 251.2
  const healthOffset = 251.2 - (251.2 * healthPercent) / 100;

  return (
    <div className="text-[#e6e0e9] py-8 px-6 lg:px-margin-desktop min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4 border-b border-outline-variant/10 pb-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">System Overview</h1>
            <div className="flex items-center gap-3 mt-2 font-body-md text-xs">
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${connected ? "bg-primary/10 border border-primary/20 text-primary" : "bg-error/10 border border-error/20 text-error"}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${connected ? "bg-primary pulse" : "bg-error"}`}
                ></span>
                <span className="font-label-caps uppercase">
                  {connected ? "Live Monitoring Active" : "Monitoring Disconnected"}
                </span>
              </span>
              <span className="text-on-surface-variant">WS endpoint: {WS_URL}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-on-primary font-body-md font-bold rounded hover:shadow-[0_0_15px_rgba(207,188,255,0.4)] transition-all cursor-pointer text-xs">
              Generate Report
            </button>
            <button className="px-4 py-2 border border-outline-variant text-on-surface font-body-md font-bold rounded hover:bg-surface-variant/30 transition-colors cursor-pointer text-xs">
              Export Data
            </button>
          </div>
        </div>

        <PlanUtilizationBanner />

        {/* Bento Grid - Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-container-gap">
          {/* Total Real-time Spend Card */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
            <div className="scan-line"></div>
            <p className="font-label-caps text-on-surface-variant text-[11px] mb-4 flex items-center gap-2 tracking-wider">
              <span className="material-symbols-outlined text-[16px] text-primary">
                monetization_on
              </span>
              TOTAL REAL-TIME SPEND
            </p>
            <h2 className="font-display-lg text-display-lg text-primary tracking-tighter">
              ${totalCost < 0.01 && totalCost > 0 ? totalCost.toFixed(4) : totalCost.toFixed(2)}
            </h2>
            <div className="mt-6 h-12 w-full">
              <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
                <path
                  className="bezier-path"
                  d="M0 50 Q 50 20 100 45 T 200 15 T 300 40 T 400 10"
                  fill="none"
                  stroke="#cfbcff"
                  strokeWidth="2"
                ></path>
                <path
                  d="M0 50 Q 50 20 100 45 T 200 15 T 300 40 T 400 10 L 400 60 L 0 60 Z"
                  fill="url(#grad1)"
                  opacity="0.1"
                ></path>
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#cfbcff", stopOpacity: 1 }}></stop>
                    <stop offset="100%" style={{ stopColor: "#cfbcff", stopOpacity: 0 }}></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-body-md text-on-surface-variant">
              <span>Dynamic spend tracking</span>
              <span className="text-primary">+12% vs last hour</span>
            </div>
          </div>

          {/* Active AI Nodes Card */}
          <div className="glass-card p-6 rounded-xl flex items-center justify-between group">
            <div>
              <p className="font-label-caps text-on-surface-variant text-[11px] mb-4 flex items-center gap-2 tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-tertiary">hub</span>
                ACTIVE AI AGENTS
              </p>
              <h2 className="font-display-lg text-display-lg text-on-surface tracking-tighter">
                {activeAgentsCount}
              </h2>
              <p className="text-xs text-tertiary mt-2 font-body-md">
                Availability Rate: {healthPercent}%
              </p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full health-ring" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#36343a"
                  strokeWidth="8"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke={healthPercent < 90 ? "#ffb4ab" : "#e7c365"}
                  strokeLinecap="round"
                  strokeWidth="8"
                  style={{
                    strokeDashoffset: healthOffset,
                    strokeDasharray: 251.2,
                    transition: "stroke-dashoffset 0.8s ease",
                  }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface">
                <span className="font-bold text-lg leading-none">{healthPercent}%</span>
                <span className="text-[8px] font-label-caps opacity-60">HEALTH</span>
              </div>
            </div>
          </div>

          {/* API Traffic Volume Card */}
          <div className="glass-card p-6 rounded-xl relative group">
            <p className="font-label-caps text-on-surface-variant text-[11px] mb-4 flex items-center gap-2 tracking-wider">
              <span className="material-symbols-outlined text-[16px] text-primary">waves</span>
              API TRAFFIC VOLUME
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="font-display-lg text-display-lg text-on-surface tracking-tighter">
                {totalApiCalls}
              </h2>
              <span className="text-on-surface-variant font-body-md text-xs">requests</span>
            </div>
            <div className="mt-4 flex gap-1 h-12 items-end">
              <div className="flex-1 bg-primary/20 h-2/3 rounded-t-sm animate-[pulse_2s_infinite_100ms]"></div>
              <div className="flex-1 bg-primary/20 h-3/4 rounded-t-sm animate-[pulse_2s_infinite_200ms]"></div>
              <div className="flex-1 bg-primary h-full rounded-t-sm animate-[pulse_2s_infinite_300ms]"></div>
              <div className="flex-1 bg-primary/20 h-1/2 rounded-t-sm animate-[pulse_2s_infinite_400ms]"></div>
              <div className="flex-1 bg-primary/20 h-4/5 rounded-t-sm animate-[pulse_2s_infinite_500ms]"></div>
              <div className="flex-1 bg-primary/20 h-2/3 rounded-t-sm animate-[pulse_2s_infinite_600ms]"></div>
            </div>
            <p className="text-[9px] text-on-surface-variant mt-2 font-body-md uppercase tracking-widest">
              Live traffic stream active
            </p>
          </div>
        </div>

        {/* Bento Grid - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-container-gap">
          {/* Live Agent Activity Stream */}
          <div className="lg:col-span-8 glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
              <p className="font-label-caps text-on-surface flex items-center gap-2 font-bold tracking-wider text-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  view_list
                </span>
                LIVE AGENT ACTIVITY STREAM
              </p>
              <div className="flex items-center gap-4 text-xs font-body-md">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary pulse"></span> {logs.length}{" "}
                  Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error"></span> {anomaliesCount} Anomalies
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              {logs.length === 0 ? (
                <div className="p-12 text-center">
                  <EmptyState
                    compact
                    icon={<span>📡</span>}
                    title="No activity yet"
                    description="Wire up the RakshEx SDK in your app to stream live agent traffic here."
                  />
                </div>
              ) : (
                <table className="w-full text-left font-data-tabular">
                  <thead>
                    <tr className="text-on-surface-variant text-[10px] uppercase tracking-widest border-b border-outline-variant/10 font-label-caps">
                      <th className="px-6 py-4 font-bold">Node ID</th>
                      <th className="px-6 py-4 font-bold">Model</th>
                      <th className="px-6 py-4 font-bold">Latency</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {logs.map((log, i) => (
                      <tr key={i} className="hover:bg-surface-variant/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-primary">{log.agent}</td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant">
                          {log.model || "n/a"}
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant">14ms</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded border-l-2 text-[10px] uppercase font-bold ${
                              log.anomaly
                                ? "border-error bg-error/10 text-error"
                                : "border-primary bg-primary/10 text-primary"
                            }`}
                          >
                            {log.anomaly ? "Anomaly" : "Verified"}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-bold ${log.anomaly ? "text-error" : "text-primary"}`}
                        >
                          $
                          {log.cost < 0.01 && log.cost > 0
                            ? log.cost.toFixed(4)
                            : log.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="mt-auto p-4 bg-surface-variant/10 text-center border-t border-outline-variant/10">
              <button className="text-[10px] font-label-caps text-primary hover:underline uppercase tracking-wider">
                View All Infrastructure Logs
              </button>
            </div>
          </div>

          {/* Critical Anomalies Feed */}
          <div className="lg:col-span-4 flex flex-col gap-container-gap">
            <p className="font-label-caps text-on-surface flex items-center gap-2 px-2 font-bold tracking-wider text-xs">
              <span className="material-symbols-outlined text-[16px] text-error">warning</span>
              CRITICAL ANOMALIES ({anomaliesCount})
            </p>

            {logs.filter((l) => l.anomaly).length === 0 ? (
              <div className="glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center flex-1">
                <span className="material-symbols-outlined text-primary text-[42px] mb-2">
                  check_circle
                </span>
                <p className="font-body-md text-sm text-on-surface font-bold">
                  No anomalies detected
                </p>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  Infrastructure costs are operating within budget limits.
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[500px]">
                {logs
                  .filter((l) => l.anomaly)
                  .map((log, i) => (
                    <div
                      key={i}
                      className="glass-card p-4 rounded-xl border-l-4 border-l-error transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-on-surface text-sm font-display-lg">
                          Cost Spike: {log.agent}
                        </span>
                        <span className="text-[10px] font-body-md text-on-surface-variant">
                          {log.time}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Agent `{log.agent}` triggered a high cost spike of{" "}
                        <span className="text-error font-bold">${log.cost.toFixed(4)}</span> using
                        model `{log.model || "unknown"}`. Automatic circuit breaker monitoring is
                        active.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded uppercase hover:bg-error/30 transition-colors">
                          ISOLATE
                        </button>
                        <button className="px-3 py-1 bg-surface-variant text-on-surface text-[10px] font-bold rounded uppercase hover:bg-surface-variant/80 transition-colors">
                          DISMISS
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAB Overlay */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_0_20px_rgba(207,188,255,0.4)] flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[32px]">add</span>
        <div className="absolute right-full mr-4 bg-surface-container-high px-4 py-2 rounded font-label-caps text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-outline-variant/30 text-on-surface">
          INITIATE INCIDENT
        </div>
      </button>
    </div>
  );
}
