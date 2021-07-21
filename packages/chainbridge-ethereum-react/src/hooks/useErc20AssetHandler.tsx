import { useEthers } from '@phala/util-ethereum-react'
import { useMemo } from 'react'
import { Erc20AssetHandler, Erc20AssetHandler__factory } from '../interfaces'

export const useErc20AssetHandler = (addressOrName?: string): { contract?: Erc20AssetHandler; error?: Error } => {
    const { provider, signer } = useEthers()

    return useMemo(() => {
        if (addressOrName === undefined) {
            return { error: new Error('Address or name of Erc20AssetHandler contract is undefined') }
        }

        if (provider === undefined) {
            return { error: new Error('Ethers provider is undefined (i.e not ready)') }
        }

        return {
            contract: Erc20AssetHandler__factory.connect(addressOrName, signer ?? provider),
        }
    }, [addressOrName, provider, signer])
}
