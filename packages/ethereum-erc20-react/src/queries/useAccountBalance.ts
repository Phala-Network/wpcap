import { Decimal } from 'decimal.js'
import { BigNumber } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useErc20Token } from '../hooks/useErc20Token'
import { useErc20Decimals } from './useTokenDecimals'

const AccountBalanceQueryKey = uuidv4()

export const useAccountBalance = (account?: string, address?: string): UseQueryResult<BigNumber> => {
    const { chainId, contract } = useErc20Token(address)
    const valid = useMemo(() => isAddress(address ?? ''), [address])

    return useQuery(
        [AccountBalanceQueryKey, chainId, contract?.address, account],
        async () => {
            if (account === undefined || !isAddress(account)) {
                return
            }

            if (contract === undefined) {
                throw new Error('Contract is not ready')
            }

            return await contract.balanceOf(account)
        },
        {
            enabled: chainId !== undefined && contract !== undefined && valid,
        }
    )
}

export const useAccountDecimalBalance = (
    account?: string,
    address?: string
): {
    balance: UseQueryResult<BigNumber>
    decimalBalance?: Decimal
    decimals: UseQueryResult<number>
} => {
    const balance = useAccountBalance(account, address)
    const decimals = useErc20Decimals(address)

    const decimalBalance = useMemo(() => {
        if (balance.data === undefined || decimals.data === undefined) {
            return
        }

        const factor = new Decimal(10).pow(decimals.data)
        return new Decimal(balance.data.toString()).div(factor)
    }, [balance, decimals])

    return { balance, decimalBalance, decimals }
}
