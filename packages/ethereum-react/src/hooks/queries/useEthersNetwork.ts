import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useEthers } from '../../contexts'

export const useEthersNetwork = (): ethers.providers.Network | undefined => {
    const { provider } = useEthers()
    const [network, setNetwork] = useState<ethers.providers.Network>()

    useEffect(() => {
        provider
            ?.getNetwork()
            .then((network) => setNetwork(network))
            .catch(() => setNetwork(undefined))
    }, [provider])

    return network
}
