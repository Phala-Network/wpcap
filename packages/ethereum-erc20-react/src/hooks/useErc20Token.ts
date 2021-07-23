import { useEthers } from '@phala/util-ethereum-react'
import { useMemo } from 'react'
import { Erc20Token, Erc20Token__factory } from '../interfaces'

export const useErc20Token = (
    address?: string
): { chainId?: number; contract?: Erc20Token; error?: Error; signedContract?: Erc20Token } => {
    const { provider, readystate, signer } = useEthers()
    const network = provider?.network

    return useMemo(() => {
        if (typeof address !== 'string' || address.length === 0) {
            return { error: new Error('Address is not a valid contract locator') }
        }

        if (provider !== undefined) {
            const contract = Erc20Token__factory.connect(address, provider)
            return {
                chainId: network?.chainId,
                contract,
                signedContract: signer !== undefined ? contract.connect(signer) : undefined,
            }
        } else {
            return { error: new Error('Ethers is not ready: ' + readystate) }
        }
    }, [address, network, provider, readystate, signer])
}
