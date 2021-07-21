import { useBridge } from '@phala/chainbridge-ethereum-react'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

const AdminRoleQueryKey = uuidv4()
const AdminRoleMemberQueryKey = uuidv4()

const RelayerRoleQueryKey = uuidv4()
const RelayerRoleMemberQueryKey = uuidv4()

const BridgePage = (): JSX.Element => {
    const { query } = useRouter()
    const address = query['address']

    const { contract, error } = useBridge(address instanceof Array ? address[0] : address)

    const [resolvedAddress, setResolvedAddress] = useState<string>()
    useEffect(() => {
        contract?.resolvedAddress.then((address) => setResolvedAddress(address))
    }, [contract?.resolvedAddress])

    const { data: adminRole } = useQuery([AdminRoleQueryKey, resolvedAddress], async () => await contract?.DEFAULT_ADMIN_ROLE())
    const { data: admins } = useQuery([AdminRoleMemberQueryKey, resolvedAddress, adminRole], async () => {
        if (contract === undefined || adminRole === undefined) {
            return
        }

        const count = await contract.getRoleMemberCount(adminRole)
        return await Promise.all(Array(count).map((_, i) => contract.getRoleMember(adminRole, i)))
    })

    const { data: relayerRole } = useQuery([RelayerRoleQueryKey, resolvedAddress], async () => await contract?.RELAYER_ROLE())
    const { data: relayers } = useQuery([RelayerRoleMemberQueryKey, resolvedAddress, relayerRole], async () => {
        if (contract === undefined || relayerRole === undefined) {
            return
        }

        const count = await contract.getRoleMemberCount(relayerRole)
        return await Promise.all(Array(count).map((_, i) => contract.getRoleMember(relayerRole, i)))
    })

    return (
        <>
            <section>
                {error &&
                    <>
                        <h2>Contract Load Error</h2>
                        <p>{error?.message ?? 'No error'}</p>
                    </>
                }
            </section>
            <section>
                <h1 style={{ fontSize: '1.2em' }}>Bridge Contract</h1>
                < p > Resolved Address: {resolvedAddress}</p>
                <h2 style={{ fontSize: '1em' }}>Members of DEFAULT_ADMIN_ROLE</h2>
                <p>Locator: {adminRole}</p>
                <ul>
                    {admins?.map(admin => <li key={admin}>{admin}</li>)}
                </ul>
                <h2 style={{ fontSize: '1em' }}>Members of RELAYER_ROLE</h2>
                <p>Locator: {relayerRole}</p>
                <ul>
                    {relayers?.map(relayer => <li key={relayer}>{relayer}</li>)}
                </ul>
            </section>
        </>
    )
}

export default BridgePage
