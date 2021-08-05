import { ChakraProvider } from '@chakra-ui/react'
import { ApiPromiseProvider } from '@phala/polkadot-react/lib/contexts/ApiPromiseContext'
import { Web3Provider } from '@phala/polkadot-react/lib/contexts/Web3Context'
import { EthersProvider, useEthersNetwork, Web3Provider as EthereumWeb3Provider } from '@phala/util-ethereum-react'
import type { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { EthereumGraphQLProvider } from '../components/chainbridge/ethereum/GraphQLClientContext'
import { ConfigurationProvider, useConfiguration } from '../libs/configuration/context'

const ConfiguredApp = ({ Component, pageProps }: AppProps) => {
    const config = useConfiguration()

    if (config.substrate === undefined) {
        throw new Error('Substrate network is not configured')
    }

    return (
        <EthereumGraphQLProvider endpoint={config.ethereum?.chainBridge.graph.endpoint}>
            <ApiPromiseProvider
                options={{ endpoint: config.substrate?.endpoint, registryTypes: config.substrate?.typedefs }}
            >
                <Component {...pageProps} />
            </ApiPromiseProvider>
        </EthereumGraphQLProvider>
    )
}

const ConnectedApp = (appProps: AppProps) => {
    const network = useEthersNetwork()

    return (
        <ConfigurationProvider ethereumChainId={network?.chainId} substrateNetworkName="khala-pc-test">
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
                        <Web3Provider originName="ChainBridge Operator">
                            <ConnectedApp {...appProps} />
                        </Web3Provider>
                    </EthersProvider>
                </EthereumWeb3Provider>
            </ChakraProvider>
        </QueryClientProvider>
    )
}

export default App
