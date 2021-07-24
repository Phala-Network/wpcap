import { Box, Stack, StackDivider } from '@chakra-ui/react'
import { useBridge } from '@phala/chainbridge-ethereum-react'
import { useRouter } from 'next/dist/client/router'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { ResourceIdInspect } from '../../components/chainbridge/ethereum/ResourceIdInspect'

const AdminRoleQueryKey = uuidv4()
const AdminRoleMemberQueryKey = uuidv4()

const RelayerRoleQueryKey = uuidv4()
const RelayerRoleMemberQueryKey = uuidv4()

const BridgePage = (): JSX.Element => {
    const { query } = useRouter()
    const address = query['address'] instanceof Array ? query['address'][0] : query['address']

    const { contract, error } = useBridge(address)

    const resolvedAddressQueryKey = useMemo(() => uuidv4(), [])
    const { data: resolvedAddress } = useQuery([resolvedAddressQueryKey, address], async () => {
        return await contract?.resolvedAddress
    })

    const { data: adminRole } = useQuery(
        [AdminRoleQueryKey, resolvedAddress],
        async () => await contract?.DEFAULT_ADMIN_ROLE()
    )
    const { data: admins } = useQuery([AdminRoleMemberQueryKey, resolvedAddress, adminRole], async () => {
        if (contract === undefined || adminRole === undefined) {
            return
        }

        const count = await contract.getRoleMemberCount(adminRole)
        return await Promise.all(Array(count).map((_, i) => contract.getRoleMember(adminRole, i)))
    })

    const { data: relayerRole } = useQuery(
        [RelayerRoleQueryKey, resolvedAddress],
        async () => await contract?.RELAYER_ROLE()
    )
    const { data: relayers } = useQuery([RelayerRoleMemberQueryKey, resolvedAddress, relayerRole], async () => {
        if (contract === undefined || relayerRole === undefined) {
            return
        }

        const count = await contract.getRoleMemberCount(relayerRole)
        return await Promise.all(Array(count).map((_, i) => contract.getRoleMember(relayerRole, i)))
    })

    return (
        <Stack divider={<StackDivider />}>
            <h1 style={{ fontSize: '1.2em' }}>Bridge Contract Inspection</h1>

            {error && (
                <Box>
                    <h2>Contract Load Error</h2>
                    <p>{error?.message ?? 'No error'}</p>
                </Box>
            )}

            <Stack>
                <p>Resolved Address: {resolvedAddress}</p>

                <Box>
                    <h2 style={{ fontSize: '1em' }}>Members of DEFAULT_ADMIN_ROLE {adminRole && <>({adminRole})</>}</h2>
                    <ul>
                        {admins?.map((admin) => (
                            <li key={admin}>{admin}</li>
                        ))}
                    </ul>
                </Box>

                <Box>
                    <h2 style={{ fontSize: '1em' }}>Members of RELAYER_ROLE {relayerRole && <>({relayerRole})</>}</h2>
                    <ul>
                        {relayers?.map((relayer) => (
                            <li key={relayer}>{relayer}</li>
                        ))}
                    </ul>
                </Box>
            </Stack>

            <Box>
                <h2>Bridge Resources</h2>
                <ResourceIdInspect address={address} />
            </Box>
        </Stack>
    )
}

export default BridgePage
