import { useEthers } from '@phala/util-ethereum-react/dist'
import { useMemo } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { useBridge } from '..'
import { Erc20AssetHandler, Erc20AssetHandler__factory } from '../../interfaces'

const ResourceIdHandlerQueryKey = uuidv4()

export const useResourceIdHandlerQuery = (
    resourceId?: string,
    bridgeAddress?: string
): {
    address: UseQueryResult<string>
    handler?: Erc20AssetHandler
} => {
    const { contract: bridge } = useBridge(bridgeAddress)
    const { provider } = useEthers()

    const address = useQuery(
        [ResourceIdHandlerQueryKey, 'address', bridge?.address, resourceId],
        async () => {
            if (bridge === undefined) {
                throw new Error('Bridge contract is not ready')
            }

            if (resourceId === undefined) {
                throw new Error('Resource Id is undefined')
            }

            return await bridge._resourceIDToHandlerAddress(resourceId)
        },
        {
            enabled: bridge !== undefined && resourceId !== undefined,
        }
    )

    const handler = useMemo(() => {
        if (bridge === undefined || address.data === undefined || provider === undefined) {
            return undefined
        }

        return Erc20AssetHandler__factory.connect(address.data, provider)
    }, [address.data, bridge, provider])

    return {
        address,
        handler,
    }
}
