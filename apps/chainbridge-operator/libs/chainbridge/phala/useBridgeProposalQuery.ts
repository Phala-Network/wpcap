import { useApiPromise } from '@phala/polkadot-react'
import { useDecimalMultiplier } from '@phala/polkadot-react/lib/queries/useTokenDecimalsQuery'
import { Option } from '@polkadot/types'
import { AccountId, Balance } from '@polkadot/types/interfaces'
import { hexToU8a } from '@polkadot/util'
import { decodeAddress } from '@polkadot/util-crypto'
import BN from 'bn.js'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { ProposalVotes } from '../../polkadot/interfaces'

const BridgeVoteQueryKey = uuidv4()

export const useBridgeProposalQuery = ({
    amount,
    depositNonce,
    recipient,
    resourceId,
    originChainId,
}: {
    amount?: Balance | BN
    depositNonce?: number
    recipient?: AccountId | string
    resourceId?: string
    originChainId?: number
}): UseQueryResult<Option<ProposalVotes>> => {
    const { api } = useApiPromise()
    const { multiplier } = useDecimalMultiplier()

    return useQuery(
        [BridgeVoteQueryKey, amount, depositNonce, recipient, resourceId, multiplier, originChainId, api === undefined],
        async () => {
            if (amount === undefined || api === undefined || multiplier === undefined || originChainId === undefined) {
                return
            }

            const call = api.registry.createType('Call', {
                args: [decodeAddress(recipient), amount, hexToU8a(resourceId, 256)],
                callIndex: api.tx.bridgeTransfer.transfer.callIndex,
            })

            return (await api.query.chainBridge.votes(originChainId, [depositNonce, call])) as Option<ProposalVotes>
        }
    )
}
