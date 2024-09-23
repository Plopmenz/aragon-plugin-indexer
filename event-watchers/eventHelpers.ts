import { Hex } from "viem";
import { PluginSetupProcessorEventsStorage } from "../types/storage.js";
import { PluginSetupProcessorEvent } from "../types/plugin-setup-processor-events.js";

export function createChainIfNotExists(events: PluginSetupProcessorEventsStorage, chainId: number): void {
  if (!events[chainId]) {
    events[chainId] = {};
  }
}

export function createTransactionIfNotExists(events: PluginSetupProcessorEventsStorage, chainId: number, transactionHash: Hex): void {
  createChainIfNotExists(events, chainId);
  if (!events[chainId][transactionHash]) {
    events[chainId][transactionHash] = {};
  }
}

export function addPluginSetupProcessorEvent(events: PluginSetupProcessorEventsStorage, event: PluginSetupProcessorEvent): void {
  createTransactionIfNotExists(events, event.chainId, event.transactionHash);
  events[event.chainId][event.transactionHash][event.logIndex] = event;
}
