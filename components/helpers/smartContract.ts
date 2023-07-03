import {
  AbiRegistry,
  SmartContract,
  Address
} from '@multiversx/sdk-core/out';
import { contractAddress } from '../../config/config';
import json from '../../claim.abi.json';

const abiRegistry = AbiRegistry.create(json);
// const abi = new SmartContractAbi(abiRegistry);

export const smartContract = new SmartContract({
  address: new Address(contractAddress.claim),
  abi: abiRegistry
});
