import { Decimal } from 'decimal.js'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useErc20Token } from '../hooks'

const Erc20DecimalsQueryKey = uuidv4()

export const useErc20Decimals = (address?: string): { decimals?: number; error: unknown; factor?: Decimal } => {
    const { chainId, contract } = useErc20Token(address)

    const { data, error } = useQuery(
        [Erc20DecimalsQueryKey, chainId, contract?.address],
        async () => {
            if (contract === undefined) {
                throw new Error('Contract is not ready')
            }

            const decimals = await contract.decimals()
            const factor = new Decimal(10).pow(decimals)

            return { decimals, factor }
        },
        {
            enabled: contract !== undefined,
            staleTime: Infinity, // token decimals are never changed
        }
    )

    return { ...data, error }
}
