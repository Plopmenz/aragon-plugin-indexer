import { PluginSetupProcessorEvent } from "./plugin-setup-processor-events.js";
import { Hex } from "viem";
import { PersistentJson } from "../utils/persistent-json.js";

export type PluginSetupProcessorEventsStorage = {
  [chainId: number]: {
    [transactionHash: Hex]: {
      [logIndex: number]: PluginSetupProcessorEvent;
    };
  };
};

export interface Storage {
  pluginSetupProcessorEvents: PersistentJson<PluginSetupProcessorEventsStorage>;
}
