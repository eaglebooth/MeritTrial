import { createClient } from "genlayer-js";
import { localnet, studionet, testnetAsimov, testnetBradbury } from "genlayer-js/chains";
import { ExecutionResult, TransactionStatus, type Hash } from "genlayer-js/types";

type NetworkName = "localnet" | "studionet" | "testnetAsimov" | "testnetBradbury";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const network = (process.env.NEXT_PUBLIC_NETWORK as NetworkName) || "testnetAsimov";

const chainMap: Record<NetworkName, typeof testnetAsimov> = {
  localnet,
  studionet,
  testnetAsimov,
  testnetBradbury,
};

const endpoint = process.env.NEXT_PUBLIC_GENLAYER_RPC;

const client = createClient({
  chain: chainMap[network] ?? testnetAsimov,
  ...(endpoint ? { endpoint } : {}),
});

export type ContractReadResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export type ContractWriteResult = {
  success: boolean;
  hash?: string;
  status?: string;
  executionResult?: string;
  data?: unknown;
  error?: string;
};

export async function readContract(
  functionName: string,
  args: unknown[] = [],
  contractAddress?: string,
): Promise<ContractReadResult> {
  try {
    const addr = contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!addr) {
      return { success: false, error: "Contract address not configured" };
    }
    const result = (await client.readContract({
      address: addr as `0x${string}`,
      functionName,
      args: args as never[],
    })) as unknown;
    return { success: true, data: result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function connectWallet(): Promise<{ success: boolean; address?: string; error?: string }> {
  if (typeof window === "undefined") {
    return { success: false, error: "Wallet connection is only available in the browser" };
  }
  if (!window.ethereum) {
    return { success: false, error: "GenLayer wallet provider not found. Install a GenLayer-compatible wallet." };
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    })) as string[];
    const address = accounts[0];
    if (!address) {
      return { success: false, error: "No account returned from wallet" };
    }
    return { success: true, address };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to connect wallet",
    };
  }
}

export async function writeContract(
  functionName: string,
  args: unknown[] = [],
  contractAddress?: string,
): Promise<ContractWriteResult> {
  if (typeof window === "undefined") {
    return { success: false, error: "Contract writes are only available in the browser" };
  }
  if (!window.ethereum) {
    return { success: false, error: "GenLayer wallet provider not found. Install a GenLayer-compatible wallet." };
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    })) as string[];
    const address = accounts[0];
    const addr = contractAddress || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!address || !addr) {
      return { success: false, error: "Wallet or contract address not configured" };
    }

    const writeClient = createClient({
      chain: chainMap[network] ?? testnetAsimov,
      ...(endpoint ? { endpoint } : {}),
      account: address as `0x${string}`,
      provider: window.ethereum,
    });

    const hash = await writeClient.writeContract({
      address: addr as `0x${string}`,
      functionName,
      args: args as never[],
      value: BigInt(0),
    }) as string;

    const receipt = await writeClient.waitForTransactionReceipt({
      hash: hash as Hash,
      status: TransactionStatus.FINALIZED,
    });

    if (receipt.txExecutionResultName === ExecutionResult.FINISHED_WITH_ERROR) {
      return {
        success: false,
        hash,
        status: receipt.statusName,
        executionResult: receipt.txExecutionResultName,
        error: "Contract execution failed",
      };
    }

    return {
      success: true,
      hash,
      status: receipt.statusName,
      executionResult: receipt.txExecutionResultName,
      data: receipt.txDataDecoded,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to write contract",
    };
  }
}
