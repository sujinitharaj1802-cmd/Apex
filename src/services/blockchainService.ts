import { AuditBlock } from '../types';

// Cryptographically compute SHA-256 using native Web Crypto API
export async function sha256(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate an individual block hash
export async function calculateBlockHash(block: Omit<AuditBlock, 'blockHash' | 'verified'>): Promise<string> {
  const content = `${block.index}|${block.prevHash}|${block.timestamp}|${block.actorRole}|${block.actorId}|${block.action}|${block.details}|${block.payloadHash}`;
  return sha256(content);
}

// Initial mock transactions to seed the blockchain ledger
const initialTransactions: Omit<AuditBlock, 'index' | 'prevHash' | 'blockHash' | 'payloadHash' | 'verified'>[] = [
  {
    timestamp: '2026-09-14 06:00:12',
    actorRole: 'State Admin',
    actorId: 'ADM-GJ-001',
    action: 'SYSTEM_INITIALIZATION',
    details: 'Apex Core Gateway v2.4 initialized with 12,480 registered mock edge nodes.',
  },
  {
    timestamp: '2026-09-14 06:14:35',
    actorRole: 'Control Room Operator',
    actorId: 'OPR-AMD-409',
    action: 'ROLE_SESSION_START',
    details: 'Shift Alpha commenced on Station 04, Ahmedabad Central Command Room.',
  },
  {
    timestamp: '2026-09-14 06:32:10',
    actorRole: 'Control Room Operator',
    actorId: 'OPR-AMD-409',
    action: 'ALERT_DISPATCH',
    details: 'Dispatched PCR Van 12 to SG Highway Junction for ANPR Hit: GJ-01-XX-9412.',
  },
  {
    timestamp: '2026-09-14 07:05:41',
    actorRole: 'District SP',
    actorId: 'SP-SRT-012',
    action: 'WORK_ORDER_ISSUED',
    details: 'Authorized Emergency Work Order WO-SRT-8821 for degraded sensor CAM-SRT-0312.',
  },
  {
    timestamp: '2026-09-14 07:22:19',
    actorRole: 'Control Room Operator',
    actorId: 'OPR-VDR-118',
    action: 'EVIDENCE_EXPORT',
    details: 'Exported cryptographic dossier #EV-2026-0914-884 for Alert ALT-AMD-7811.',
  },
  {
    timestamp: '2026-09-14 07:45:02',
    actorRole: 'State Admin',
    actorId: 'ADM-GJ-001',
    action: 'CAMERA_CONFIG_UPDATE',
    details: 'Pushed edge AI firmware update build 2.4.1 to 142 Highway Patrol sensors.',
  },
  {
    timestamp: '2026-09-14 08:12:44',
    actorRole: 'Control Room Operator',
    actorId: 'OPR-RJK-204',
    action: 'ALERT_DISPATCH',
    details: 'Dispatched Quick Response Team to Rajkot Ring Road for Perimeter Breach detection.',
  },
  {
    timestamp: '2026-09-14 08:30:19',
    actorRole: 'District SP',
    actorId: 'SP-AMD-004',
    action: 'EVIDENCE_EXPORT',
    details: 'Court evidentiary bundle sealed under Section 65B compliance for case ref #GJ-CR-4401.',
  },
];

// Build an initial valid blockchain ledger
export async function generateInitialLedger(): Promise<AuditBlock[]> {
  const chain: AuditBlock[] = [];
  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000'; // Genesis previous hash

  for (let i = 0; i < initialTransactions.length; i++) {
    const tx = initialTransactions[i];
    const payloadHash = await sha256(tx.details + tx.timestamp);
    const blockData: Omit<AuditBlock, 'blockHash' | 'verified'> = {
      index: i + 1,
      timestamp: tx.timestamp,
      actorRole: tx.actorRole,
      actorId: tx.actorId,
      action: tx.action,
      details: tx.details,
      payloadHash,
      prevHash,
    };
    const blockHash = await calculateBlockHash(blockData);
    chain.push({
      ...blockData,
      blockHash,
      verified: true,
    });
    prevHash = blockHash;
  }

  return chain;
}

// Add a new block onto an existing chain
export async function appendBlock(
  chain: AuditBlock[],
  entry: {
    actorRole: string;
    actorId: string;
    action: AuditBlock['action'];
    details: string;
  }
): Promise<AuditBlock[]> {
  const lastBlock = chain[chain.length - 1];
  const prevHash = lastBlock ? lastBlock.blockHash : '0000000000000000000000000000000000000000000000000000000000000000';
  const index = chain.length + 1;
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
  const payloadHash = await sha256(entry.details + timestamp);

  const blockData: Omit<AuditBlock, 'blockHash' | 'verified'> = {
    index,
    timestamp,
    actorRole: entry.actorRole,
    actorId: entry.actorId,
    action: entry.action,
    details: entry.details,
    payloadHash,
    prevHash,
  };

  const blockHash = await calculateBlockHash(blockData);
  const newBlock: AuditBlock = {
    ...blockData,
    blockHash,
    verified: true,
  };

  return [...chain, newBlock];
}

// Verify integrity of the entire chain
export interface VerificationResult {
  isValid: boolean;
  tamperedIndex?: number;
  expectedHash?: string;
  actualHash?: string;
  totalBlocks: number;
}

export async function verifyChainIntegrity(chain: AuditBlock[]): Promise<VerificationResult> {
  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];

    // Check link to previous block
    if (block.prevHash !== prevHash) {
      return {
        isValid: false,
        tamperedIndex: block.index,
        expectedHash: prevHash,
        actualHash: block.prevHash,
        totalBlocks: chain.length,
      };
    }

    // Recompute block hash
    const computedHash = await calculateBlockHash({
      index: block.index,
      timestamp: block.timestamp,
      actorRole: block.actorRole,
      actorId: block.actorId,
      action: block.action,
      details: block.details,
      payloadHash: block.payloadHash,
      prevHash: block.prevHash,
    });

    if (computedHash !== block.blockHash) {
      return {
        isValid: false,
        tamperedIndex: block.index,
        expectedHash: computedHash,
        actualHash: block.blockHash,
        totalBlocks: chain.length,
      };
    }

    prevHash = block.blockHash;
  }

  return {
    isValid: true,
    totalBlocks: chain.length,
  };
}
