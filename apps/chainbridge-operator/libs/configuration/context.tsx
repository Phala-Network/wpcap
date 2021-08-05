import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { config } from '../../config'
import { EthereumNetworkConfiguration, SubstrateNetworkConfiguration } from './configuration'

interface IConfigurationContext {
    ethereum?: EthereumNetworkConfiguration
    substrate?: SubstrateNetworkConfiguration
}

const ConfigurationContext = createContext<IConfigurationContext>({})

export const ConfigurationProvider = ({
    children,
    ethereumChainId,
    substrateNetworkName,
}: PropsWithChildren<{ ethereumChainId?: number; substrateNetworkName: string }>): JSX.Element => {
    const ethereum = useMemo(() => {
        return ethereumChainId !== undefined ? config.ethereum[ethereumChainId] : undefined
    }, [ethereumChainId])

    const substrate = useMemo(() => {
        return substrateNetworkName !== undefined ? config.substrate[substrateNetworkName] : undefined
    }, [substrateNetworkName])

    return <ConfigurationContext.Provider value={{ ethereum, substrate }}>{children}</ConfigurationContext.Provider>
}

export const useConfiguration = (): IConfigurationContext => useContext(ConfigurationContext)
