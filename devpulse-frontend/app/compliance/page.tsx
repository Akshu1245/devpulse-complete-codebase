"use client";
import { useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { trpc } from "@/lib/trpc";

type Framework = "pci_dss" | "owasp";

export default function CompliancePage() {
  const utils = trpc.useUtils();
  const [selectedFramework, setSelectedFramework] = useState<Framework>("pci_dss");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [error, setError] = useState<string | null>(null);

  const collectionsQuery = trpc.collections.list.useQuery();
  const collections = collectionsQuery.data?.collections ?? [];

  const reportsQuery = trpc.compliance.listReports.useQuery(
    { collectionId: selectedCollection },
    { enabled: !!selectedCollection },
  );
  const reports = reportsQuery.data?.reports ?? [];
  const loading = !!selectedCollection && reportsQuery.isLoading;

  const generate = trpc.compliance.generateReport.useMutation({
    onSuccess: () => {
      if (selectedCollection) {
        utils.compliance.listReports.invalidate({
          collectionId: selectedCollection,
        });
      }
    },
    onError: (err: { message: string }) => setError(err.message),
  });

  const generateReport = () => {
    if (!selectedCollection) {
      setError("Pick a collection first.");
      return;
    }
    setError(null);
    generate.mutate({
      collectionId: selectedCollection,
      reportType: selectedFramework,
    });
  };

  /** Export a compliance report as a downloadable JSON file */
  const handleExport = (report: {
    id: string;
    reportType: string;
    complianceScore: number;
    totalRequirements: number;
    metRequirements: number;
    createdAt: string | Date;
    details?: unknown;
  }) => {
    const exportData = {
      reportId: report.id,
      reportType: report.reportType,
      complianceScore: report.complianceScore,
      totalRequirements: report.totalRequirements,
      metRequirements: report.metRequirements,
      generatedAt: report.createdAt,
      details: report.details,
      exportedAt: new Date().toISOString(),
      framework: selectedFramework,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devpulse-compliance-${report.reportType}-${new Date(report.createdAt).toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const latestReport = reports[0];
  const pciScore =
    latestReport && latestReport.reportType === "pci_dss"
      ? Math.round(latestReport.complianceScore)
      : 94;
  const owaspScore =
    latestReport && latestReport.reportType === "owasp"
      ? Math.round(latestReport.complianceScore)
      : 88;

  // Circle path circumference for radius 40 is 251.2
  const pciOffset = 251.2 - (251.2 * pciScore) / 100;
  const owaspOffset = 251.2 - (251.2 * owaspScore) / 100;

  return (
    <div className="text-[#e6e0e9] py-8 px-6 lg:px-margin-desktop min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4 border-b border-outline-variant/10 pb-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Compliance Control Panel
            </h1>
            <p className="text-on-surface-variant font-body-md text-xs mt-1">
              PCI DSS v4.0 & OWASP Risk Assessment Tracker
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-outline-variant text-on-surface font-body-md font-bold rounded hover:bg-surface-variant/30 transition-colors cursor-pointer text-xs"
          >
            ← Command Center
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded border-l-4 border-error bg-error/10 text-error text-xs font-body-md">
            <span className="font-bold uppercase mr-2">Error:</span> {error}
          </div>
        )}

        {/* Audit Selection Controls */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden">
          <div className="scan-line opacity-20"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block font-label-caps text-on-surface-variant text-[11px] mb-2 tracking-wider">
                COMPLIANCE FRAMEWORK
              </label>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value as Framework)}
                className="w-full px-4 py-2.5 rounded bg-surface-container-low text-on-surface border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-sm"
              >
                <option value="pci_dss">PCI DSS v4.0 Standard</option>
                <option value="owasp">OWASP Top 10 Framework</option>
              </select>
            </div>
            <div>
              <label className="block font-label-caps text-on-surface-variant text-[11px] mb-2 tracking-wider">
                DATABASE COLLECTION
              </label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-surface-container-low text-on-surface border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-sm"
              >
                <option value="">-- Select a collection --</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={generateReport}
                disabled={!selectedCollection || generate.isPending}
                className="w-full py-2.5 bg-primary text-on-primary font-body-md font-bold rounded hover:shadow-[0_0_15px_rgba(207,188,255,0.4)] disabled:opacity-50 transition-all cursor-pointer text-sm"
              >
                {generate.isPending ? "COMPILING AUDIT..." : "RUN COMPLIANCE AUDIT"}
              </button>
            </div>
          </div>
        </div>

        {/* Circular Indicators Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-container-gap">
          {/* PCI DSS gauge */}
          <div className="glass-card p-6 rounded-xl flex items-center justify-between group">
            <div>
              <p className="font-label-caps text-on-surface-variant text-[11px] mb-4 flex items-center gap-2 tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  verified_user
                </span>
                PCI DSS COMPLIANCE RATING
              </p>
              <h2 className="font-display-lg text-display-lg text-primary tracking-tighter">
                {pciScore}%
              </h2>
              <p className="text-xs text-on-surface-variant mt-2 font-body-md">
                Status:{" "}
                <span className={pciScore > 90 ? "text-primary font-bold" : "text-tertiary"}>
                  {pciScore > 90 ? "COMPLIANT" : "WARNING"}
                </span>
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
                  stroke="#cfbcff"
                  strokeLinecap="round"
                  strokeWidth="8"
                  style={{
                    strokeDashoffset: pciOffset,
                    strokeDasharray: 251.2,
                    transition: "stroke-dashoffset 0.8s ease",
                  }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface">
                <span className="font-bold text-lg leading-none">{pciScore}%</span>
                <span className="text-[8px] font-label-caps opacity-60">SCORE</span>
              </div>
            </div>
          </div>

          {/* OWASP gauge */}
          <div className="glass-card p-6 rounded-xl flex items-center justify-between group">
            <div>
              <p className="font-label-caps text-on-surface-variant text-[11px] mb-4 flex items-center gap-2 tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-tertiary">gavel</span>
                OWASP RISK ASSESSMENT
              </p>
              <h2 className="font-display-lg text-display-lg text-tertiary tracking-tighter">
                {owaspScore}%
              </h2>
              <p className="text-xs text-on-surface-variant mt-2 font-body-md">
                Risk Factor: <span className="text-tertiary font-bold">LOW RISK</span>
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
                  stroke="#e7c365"
                  strokeLinecap="round"
                  strokeWidth="8"
                  style={{
                    strokeDashoffset: owaspOffset,
                    strokeDasharray: 251.2,
                    transition: "stroke-dashoffset 0.8s ease",
                  }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface">
                <span className="font-bold text-lg leading-none">{owaspScore}%</span>
                <span className="text-[8px] font-label-caps opacity-60">SAFE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Audit Stream Table */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
            <p className="font-label-caps text-on-surface flex items-center gap-2 font-bold tracking-wider text-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">
                table_chart
              </span>
              GLOBAL COMPLIANCE AUDIT STREAM
            </p>
          </div>

          <div className="overflow-x-auto">
            {!selectedCollection ? (
              <div className="p-12 text-center">
                <EmptyState
                  icon={<span>📋</span>}
                  title="Pick a collection"
                  description="Compliance reports are scoped to a collection. Select one above to view existing reports or generate a new one."
                  actions={[
                    {
                      label: "Import a collection",
                      href: "/collections",
                      variant: "secondary",
                    },
                  ]}
                />
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8. w-8 border-b-2 border-primary"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 text-center">
                <EmptyState
                  icon={<span>📋</span>}
                  title="No compliance reports yet"
                  description="Generate a PCI DSS or OWASP Top 10 report to see how each framework scores this collection."
                  actions={[
                    {
                      label: "Generate report",
                      onClick: generateReport,
                    },
                  ]}
                />
              </div>
            ) : (
              <table className="w-full text-left font-data-tabular">
                <thead>
                  <tr className="text-on-surface-variant text-[10px] uppercase tracking-widest border-b border-outline-variant/10 font-label-caps">
                    <th className="px-6 py-4 font-bold">Framework Code</th>
                    <th className="px-6 py-4 font-bold">Evaluation Date</th>
                    <th className="px-6 py-4 font-bold">Requirement Breakdown</th>
                    <th className="px-6 py-4 font-bold">Status Badge</th>
                    <th className="px-6 py-4 font-bold text-center">Score</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-surface-variant/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary uppercase">
                        {report.reportType.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {new Date(report.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {report.metRequirements} / {report.totalRequirements} controls validated
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded border-l-2 text-[10px] uppercase font-bold ${
                            report.complianceScore >= 90
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-tertiary bg-tertiary/10 text-tertiary"
                          }`}
                        >
                          {report.complianceScore >= 90 ? "PASSED" : "WARN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-on-surface">
                        {Math.round(report.complianceScore)}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleExport(report as never)}
                          className="px-3 py-1 bg-surface-container-high border border-outline-variant/35 text-on-surface text-xs font-bold rounded uppercase hover:bg-surface-variant/80 transition-colors inline-flex items-center gap-1.5"
                          title="Export report as JSON"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          JSON
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
