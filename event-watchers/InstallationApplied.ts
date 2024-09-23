import { Storage } from "../types/storage.js";
import { PluginSetupProcessorAddressPerChain, PluginSetupProcessorAbi } from "../contracts/PluginSetupProcessor.sol.js";
import { InstallationApplied } from "../types/plugin-setup-processor-events.js";
import { ContractWatcher } from "../utils/contract-watcher.js";
import { addPluginSetupProcessorEvent } from "./eventHelpers.js";

export function watchInstallationApplied(contractWatcher: ContractWatcher, storage: Storage) {
  const address = PluginSetupProcessorAddressPerChain[contractWatcher.chain.id];

  if (!address) {
    throw new Error(`Unknown Plugin Setup Processor deployment for chain ${contractWatcher.chain.id}`);
  }

  contractWatcher.startWatching("InstallationApplied", {
    abi: PluginSetupProcessorAbi,
    address: address,
    eventName: "InstallationApplied",
    strict: true,
    onLogs: async (logs) => {
      await Promise.all(
        logs.map(async (log) => {
          const { args, blockNumber, transactionHash, address, logIndex } = log;

          const event = {
            type: "InstallationApplied",
            blockNumber,
            transactionHash,
            chainId: contractWatcher.chain.id,
            address: address,
            logIndex: logIndex,
            ...args,
          } as InstallationApplied;

          await processInstallationApplied(event, storage);
        })
      );
    },
  });
}

export async function processInstallationApplied(event: InstallationApplied, storage: Storage): Promise<void> {
  await storage.pluginSetupProcessorEvents.update((events) => {
    if (events[event.chainId]?.[event.transactionHash]?.[event.logIndex] !== undefined) {
      return;
    }

    addPluginSetupProcessorEvent(events, event);
  });
}
