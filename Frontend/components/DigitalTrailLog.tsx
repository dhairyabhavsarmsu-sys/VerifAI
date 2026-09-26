import React, { useState } from 'react';
import { CheckpointLogItem } from '../types';
import { Download, FileSpreadsheet, Search, Trash2, CheckCircle2, XCircle, Database } from 'lucide-react';

interface DigitalTrailLogProps {
  logs: CheckpointLogItem[];
  onClearLogs: () => void;
}

export const DigitalTrailLog: React.FC<DigitalTrailLogProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'NOT_APPROVED'>('ALL');

  // Filter logs
  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      item.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.verdict === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV
  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'DocumentType', 'PassengerName', 'DocumentNumber', 'RiskScore', 'Verdict', 'ModuleAlerts'];
    const rows = logs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      l.documentType,
      `"${l.passengerName}"`,
      `"${l.documentNumber}"`,
      l.riskScore,
      l.verdict,
      `"${l.moduleAlerts.join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VerifAI_Checkpoint_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportJSON = () => {
    if (logs.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `VerifAI_Checkpoint_Log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card-3d-hover w-full bg-[#111827]/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-xl hover:border-cyan-500/40">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-950/40">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide font-display">
              Checkpoint Digital Trail Log
            </h3>
            <p className="text-[11px] text-slate-400">
              Tamper-Evident Forensic Chain-of-Custody Table
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            disabled={logs.length === 0}
            className="btn-3d btn-3d-slate px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={exportJSON}
            disabled={logs.length === 0}
            className="btn-3d btn-3d-slate px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          {logs.length > 0 && (
            <button
              type="button"
              onClick={onClearLogs}
              title="Clear session history"
              className="btn-3d btn-3d-slate p-2 rounded-xl text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search passenger or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors shadow-inner"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 self-end sm:self-auto shadow-inner">
          {(['ALL', 'APPROVED', 'NOT_APPROVED'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`btn-3d px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all ${
                statusFilter === filter
                  ? 'btn-3d-primary text-white'
                  : 'btn-3d-slate text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'ALL'
                ? `All (${logs.length})`
                : filter === 'APPROVED'
                ? 'Approved'
                : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 text-[10.5px] uppercase font-mono tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Passenger & ID</th>
              <th className="py-2.5 px-3 text-right">Risk Score</th>
              <th className="py-2.5 px-3">Module Alerts</th>
              <th className="py-2.5 px-3 text-center">Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono-nums">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((item) => {
                const isApprove = item.verdict === 'APPROVED';
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors duration-150"
                  >
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {item.timestamp}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="text-[11px] font-mono text-cyan-400 uppercase">
                        {item.documentType}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{item.passengerName}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {item.documentNumber}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-bold text-xs ${
                          isApprove ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.riskScore}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-[11px] text-slate-300 max-w-xs truncate">
                      {item.moduleAlerts.length > 0 ? (
                        <span className="text-rose-400 font-medium truncate block">
                          {item.moduleAlerts[0]}
                        </span>
                      ) : (
                        <span className="text-slate-400">Clean / Zero Alerts</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-mono font-bold uppercase ${
                          isApprove
                            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                            : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                        }`}
                      >
                        {isApprove ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            APPROVED
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-400" />
                            REJECTED
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No inspection logs recorded in current session. Run a screening above to populate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
