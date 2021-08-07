import { GraphQLClient } from 'graphql-request'
import { useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { ProposalSucceededEvent, getSdk } from '../interfaces/graph'

const ProposalSucceededEventByDepositNonceQueryKey = uuidv4()

export const useProposalSucceededEventByDepositNonceQuery = (
    originChainId?: number,
    depositNonce?: string,
    client?: GraphQLClient
): UseQueryResult<ProposalSucceededEvent> => {
    const sdk = useMemo(() => (client !== undefined ? getSdk(client) : undefined), [client])

    return useQuery(
        [ProposalSucceededEventByDepositNonceQueryKey, originChainId, depositNonce, client],
        async () => {
            if (client === undefined || depositNonce === undefined || originChainId === undefined) {
                return
            }

            const result = await sdk?.proposalSucceedEventByDepositNonce({ depositNonce, originChainId })
            return result?.proposalSucceededEvents?.nodes?.[0]
        },
        {
            enabled: client !== undefined && depositNonce !== undefined && originChainId !== undefined,
        }
    )
}
