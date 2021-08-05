import { AccountId, Balance } from '@polkadot/types/interfaces'
import { validateAddress } from '@polkadot/util-crypto'
import { Decimal } from 'decimal.js'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useApiPromise } from '../contexts'
import { balanceToDecimal } from '../utils/balances/convert'
import { useDecimalMultiplier, UseDecimalMultiplierResult } from './useTokenDecimalsQuery'

const AccountBalanceQueryKey = uuidv4()

export const useAccountBalanceQuery = (address?: AccountId | string): UseQueryResult<Balance> => {
    const { api } = useApiPromise()

    return useQuery(
        [AccountBalanceQueryKey, 'AccountBalanceQuery', address, api],
        async () => {
            if (address === undefined || api === undefined) {
                return
            }

            if (typeof address === 'string' && !validateAddress(address)) {
                throw new Error('Invalid or malformed account address')
            }

            const account = await api.query.system.account(address)
            return account.data.free
        },
        {
            enabled: address !== undefined && api !== undefined,
        }
    )
}

export const useAccountDecimalBalanceQuery = (
    address?: AccountId | string
): {
    decimalBalance?: Decimal
    balance: UseQueryResult<Balance>
    multiplier: UseDecimalMultiplierResult
} => {
    const balance = useAccountBalanceQuery(address)
    const multiplier = useDecimalMultiplier()

    return {
        balance: balance,
        decimalBalance:
            balance.data !== undefined && multiplier.multiplier !== undefined
                ? balanceToDecimal(balance.data, multiplier.multiplier)
                : undefined,
        multiplier,
    }
}
