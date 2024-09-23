import { Storage } from "../types/storage.js";
import { PluginSetupProcessorAddressPerChain, PluginSetupProcessorAbi } from "../contracts/PluginSetupProcessor.sol.js";
import { InstallationPrepared } from "../types/plugin-setup-processor-events.js";
import { ContractWatcher } from "../utils/contract-watcher.js";
import { addPluginSetupProcessorEvent } from "./eventHelpers.js";

export function watchInstallationPrepared(contractWatcher: ContractWatcher, storage: Storage) {
  const address = PluginSetupProcessorAddressPerChain[contractWatcher.chain.id];

  if (!address) {
    throw new Error(`Unknown Plugin Setup Processor deployment for chain ${contractWatcher.chain.id}`);
  }

  contractWatcher.startWatching("InstallationPrepared", {
    abi: PluginSetupProcessorAbi,
    address: address,
    eventName: "InstallationPrepared",
    strict: true,
    onLogs: async (logs) => {
      await Promise.all(
        logs.map(async (log) => {
          const { args, blockNumber, transactionHash, address, logIndex } = log;

          const event = {
            type: "InstallationPrepared",
            blockNumber,
            transactionHash,
            chainId: contractWatcher.chain.id,
            address: address,
            logIndex: logIndex,
            ...args,
          } as InstallationPrepared;

          await processInstallationPrepared(event, storage);
        })
      );
    },
  });
}

export async function processInstallationPrepared(event: InstallationPrepared, storage: Storage): Promise<void> {
  await storage.pluginSetupProcessorEvents.update((events) => {
    if (events[event.chainId]?.[event.transactionHash]?.[event.logIndex] !== undefined) {
      return;
    }

    addPluginSetupProcessorEvent(events, event);
  });
}
