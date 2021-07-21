import { useEthers } from '@phala/util-ethereum-react'
import { useMemo } from 'react'
import { Bridge, Bridge__factory } from '../interfaces'

export const useBridge = (addressOrName?: string): { contract?: Bridge; error?: Error } => {
    const { provider, signer } = useEthers()

    return useMemo(() => {
        if (addressOrName === undefined) {
            return { error: new Error('Address or name of Erc20AssetHandler contract is undefined') }
        }

        if (provider === undefined) {
            return { error: new Error('Ethers provider is undefined (i.e not ready)') }
        }

        return {
            contract: Bridge__factory.connect(addressOrName, signer ?? provider),
        }
    }, [addressOrName, provider, signer])
}
