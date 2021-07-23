import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useErc20Token } from '../hooks'

const Erc20DecimalsQueryKey = uuidv4()

export const useErc20Decimals = (address?: string): UseQueryResult<number> => {
    const { chainId, contract } = useErc20Token(address)

    return useQuery(
        [Erc20DecimalsQueryKey, chainId, contract?.address],
        async () => {
            if (contract === undefined) {
                throw new Error('Contract is not ready')
            }

            return await contract.decimals()
        },
        {
            enabled: contract !== undefined,
            staleTime: Infinity, // token decimals are never changed
        }
    )
}
