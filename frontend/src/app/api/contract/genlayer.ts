import { createClient } from "genlayer-js";
import { localnet, studionet, testnetAsimov, testnetBradbury } from "genlayer-js/chains";

type NetworkName = "localnet" | "studionet" | "testnetAsimov" | "testnetBradbury";

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

export async function readContract(
  functionName: string,
  args: unknown[] = [],
  contractAddress?: string,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
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
