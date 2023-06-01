import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';
import { smartContract } from './smartContract';

const resultsParser = new ResultsParser();

export const useCompleteTask = () => {
  const { network } = useGetNetworkConfig();
  const [NFTAmount, setNFTAmount] = useState<string>();

  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getCompleteTasks = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('completeTasks')
      });
      const queryResponse = await proxy.queryContract(query);

      const endpointDefinition = smartContract.getEndpoint('completeTasks');

      const { firstValue: amount } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );

      setNFTAmount(amount?.valueOf()?.toString(10));
    } catch (err) {
      console.error('Unable to call getCompleteTasks', err);
    }
  };

  useEffect(() => {
    getCompleteTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return NFTAmount;
};
