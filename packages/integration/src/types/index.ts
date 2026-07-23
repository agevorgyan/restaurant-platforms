export type ContractVersion = string;
export type ContractName = string;
export type ContractIdentifier = string;
export type IntegrationIdentifier = string;
export type ProducerIdentifier = string;
export type ConsumerIdentifier = string;

export enum ContractCompatibility {
  Compatible = 'Compatible',
  BackwardCompatible = 'BackwardCompatible',
  ForwardCompatible = 'ForwardCompatible',
  Breaking = 'Breaking',
  Unsupported = 'Unsupported'
}
