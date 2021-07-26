import { ChakraProvider } from '@chakra-ui/react'
import { EthersProvider, useEthersNetwork, Web3Provider as EthereumWeb3Provider } from '@phala/util-ethereum-react'
import type { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { EthereumGraphQLProvider } from '../components/chainbridge/ethereum/GraphQLClientContext'
import { ConfigurationProvider, useConfiguration } from '../libs/configuration/context'

const ConfiguredApp = ({ Component, pageProps }: AppProps) => {
    const config = useConfiguration()

    return (
        <EthereumGraphQLProvider endpoint={config.ethereum?.chainBridge.graph.endpoint}>
            <Component {...pageProps} />
        </EthereumGraphQLProvider>
    )
}

const EthereumConnectedApp = (appProps: AppProps) => {
    const network = useEthersNetwork()

    return (
        <ConfigurationProvider ethereumChainId={network?.chainId}>
            <ConfiguredApp {...appProps} />
        </ConfigurationProvider>
    )
}

const App = (appProps: AppProps): JSX.Element => {
    const queryClient = useMemo(() => new QueryClient(), [])

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider>
                <EthereumWeb3Provider>
                    <EthersProvider>
                        <EthereumConnectedApp {...appProps} />
                    </EthersProvider>
                </EthereumWeb3Provider>
            </ChakraProvider>
        </QueryClientProvider>
    )
}

export default App
