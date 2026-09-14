import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Hash,
  Info,
} from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const {
    ledger,
    verificationStatus,
    isVerifyingLedger,
    runLedgerVerification,
    injectLedgerTamper,
    repairLedger,
  } = useApp();

  return (
    <div className="p-4 max-w-[1750px] mx-auto space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-text">FORENSIC AUDIT TRAIL</h1>
          </div>
          <p className="text-xs text-text-muted font-mono">
            Tamper-evident record of simulated platform activity
          </p>
        </div>

        {/* Verification & Tamper Simulation Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={injectLedgerTamper}
            className="px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 font-mono text-xs flex items-center space-x-1.5 transition-colors"
            title="Simulate malicious modification of a historic ledger transaction"
          >
            <Bug className="w-3.5 h-3.5 text-red-400" />
            <span>Simulate Tampering</span>
          </button>

          <button
            onClick={repairLedger}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-text-muted font-mono text-xs flex items-center space-x-1.5 transition-colors"
            title="Reset to pristine verified chain"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Chain</span>
          </button>

          <button
            onClick={runLedgerVerification}
            disabled={isVerifyingLedger}
            className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-text font-bold text-xs flex items-center space-x-1.5 transition-colors shadow disabled:opacity-50"
          >
            {isVerifyingLedger ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Hashing SHA-256...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFY CHAIN INTEGRITY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationStatus && (
        <div
          className={`p-3.5 rounded border flex items-center justify-between font-mono text-xs shadow-sm ${
            verificationStatus.isValid
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
              : 'bg-red-950/80 border-red-500 text-red-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            {verificationStatus.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {verificationStatus.isValid
                  ? '✓ CHAIN VERIFIED — No modification detected'
                  : `TAMPER DETECTED at Block #${verificationStatus.tamperedIndex}`}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5">
                {verificationStatus.isValid
                  ? `All ${verificationStatus.totalBlocks} blocks cryptographically match their parent digests using native Web Crypto SHA-256. Zero tampering found.`
                  : `Hash mismatch at Block #${verificationStatus.tamperedIndex}. Stored block hash does not match recomputed SHA-256 digest.`}
              </div>
            </div>
          </div>

          <div className="text-right hidden md:block text-[11px]">
            <div className="text-text-muted uppercase text-[9px]">Standard</div>
            <strong>FIPS 180-4 SHA-256</strong>
          </div>
        </div>
      )}

      {/* Architectural Context & Hyperledger Clarification */}
      <div className="bg-surface border border-border rounded-lg p-3.5 flex items-start space-x-3 text-xs">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-text-muted font-sans leading-relaxed space-y-1">
          <div>
            <strong className="text-text">Simulated Blockchain Architecture:</strong> In the Apex proposal, Hyperledger Fabric is proposed as a future enterprise distributed ledger for evidentiary chain-of-custody across courts and police commissionerates.
          </div>
          <div className="text-text-muted text-[11px]">
            In this prototype, the tamper-evidence concept is demonstrably proven using a live, browser-native SHA-256 cryptographic hash chain over synthetic operational records.
          </div>
        </div>
      </div>

      {/* Forensic Audit Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-3 bg-bg border-b border-border flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-text font-bold uppercase">
            <Hash className="w-4 h-4 text-blue-400" />
            <span>Immutable Hash-Chain Ledger ({ledger.length} Records)</span>
          </div>
          <span className="text-[10px] text-text-muted">Underlying events are simulated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-bg text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="p-3">Block #</th>
                <th className="p-3">Timestamp (IST)</th>
                <th className="p-3">Event / Action</th>
                <th className="p-3">User / Actor</th>
                <th className="p-3">Transaction Payload</th>
                <th className="p-3">Previous Hash</th>
                <th className="p-3">Block Hash</th>
                <th className="p-3 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-[11px]">
              {ledger.map((block) => {
                const isTampered =
                  verificationStatus &&
                  !verificationStatus.isValid &&
                  block.index === verificationStatus.tamperedIndex;

                return (
                  <tr
                    key={block.index}
                    className={`transition-colors ${
                      isTampered
                        ? 'bg-red-950/50 border-l-4 border-l-red-500 text-red-200'
                        : 'hover:bg-surface'
                    }`}
                  >
                    <td className="p-3 font-bold text-blue-400">
                      #{String(block.index).padStart(3, '0')}
                    </td>
                    <td className="p-3 text-text-muted whitespace-nowrap">{block.timestamp}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          block.action === 'ALERT_DISPATCH'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : block.action === 'EVIDENCE_EXPORT'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : block.action === 'WORK_ORDER_ISSUED'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-text-muted'
                        }`}
                      >
                        {block.action}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-text font-semibold">{block.actorRole}</div>
                      <div className="text-[10px] text-text-muted">{block.actorId}</div>
                    </td>
                    <td className="p-3 font-sans text-text-muted max-w-xs truncate" title={block.details}>
                      {block.details}
                    </td>
                    <td className="p-3 text-text text-[10px] max-w-[110px] truncate" title={block.prevHash}>
                      {block.prevHash.substring(0, 14)}...
                    </td>
                    <td className="p-3 text-[10px] max-w-[130px]">
                      <span
                        className={`font-bold truncate block ${
                          isTampered ? 'text-red-400 font-mono underline' : 'text-emerald-400 font-mono'
                        }`}
                        title={block.blockHash}
                      >
                        {block.blockHash.substring(0, 16)}...
                      </span>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {isTampered ? (
                        <span className="text-red-400 font-bold text-[10px]">CORRUPTED</span>
                      ) : (
                        <span className="text-emerald-400 font-bold text-[10px]">VALID</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
