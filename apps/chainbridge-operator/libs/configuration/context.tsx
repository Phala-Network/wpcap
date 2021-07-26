import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { config } from '../../config'
import { EthereumNetworkConfiguration } from './configuration'

interface IConfigurationContext {
    ethereum?: EthereumNetworkConfiguration
}

const ConfigurationContext = createContext<IConfigurationContext>({})

export const ConfigurationProvider = ({
    children,
    ethereumChainId,
}: PropsWithChildren<{ ethereumChainId?: number }>): JSX.Element => {
    const ethereum = useMemo(() => {
        return ethereumChainId !== undefined ? config.ethereum[ethereumChainId] : undefined
    }, [ethereumChainId])

    return <ConfigurationContext.Provider value={{ ethereum }}>{children}</ConfigurationContext.Provider>
}

export const useConfiguration = (): IConfigurationContext => useContext(ConfigurationContext)
