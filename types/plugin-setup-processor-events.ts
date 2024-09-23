import { Address, Hash, Hex } from "viem";

import { EventIdentifier } from "./event-identifier.js";

export interface PluginSetupProcessorEventBase extends EventIdentifier {
  blockNumber: bigint;
  address: Address;
}

export type PluginSetupProcessorEvent = InstallationPrepared | InstallationApplied;

export interface InstallationPrepared extends PluginSetupProcessorEventBase {
  type: "InstallationPrepared";
  sender: Address;
  dao: Address;
  preparedSetupId: Hash;
  pluginSetupRepo: Address;
  versionTag: {
    release: number;
    build: number;
  };
  data: Hex;
  plugin: Address;
  preparedSetupData: {
    helpers: Address[];
    permissions: {
      operation: number;
      where: Address;
      who: Address;
      condition: Hash;
      permissionId: Hash;
    }[];
  };
}

export interface InstallationApplied extends PluginSetupProcessorEventBase {
  type: "InstallationApplied";
  dao: Address;
  plugin: Address;
  preparedSetupId: Hash;
  appliedSetupId: Hash;
}
