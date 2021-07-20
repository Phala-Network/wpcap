import { ethers } from 'ethers'
import React, { PropsWithChildren, useContext, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { EthersContext, IEthersContext } from '../contexts/EthersContext'
import { useWeb3 } from './useWeb3'

type ExternalProvider = ethers.providers.ExternalProvider

export const EthersProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
    const { provider: externalProvider, readystate } = useWeb3()

    const provider = useMemo(
        () =>
            externalProvider !== undefined
                ? new ethers.providers.Web3Provider(externalProvider as ExternalProvider)
                : undefined,
        [externalProvider]
    )
    const signer = useMemo(() => provider?.getSigner(), [provider])
    const instance = useMemo(() => (provider !== undefined ? uuidv4() : undefined), [provider])

    // TODO: use ethers.fallbackprovider as provider

    return (
        <EthersContext.Provider value={{ instance, provider, readystate, signer }}>{children}</EthersContext.Provider>
    )
}

export const useEthers = (): IEthersContext => useContext(EthersContext)
