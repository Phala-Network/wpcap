import { ChakraProvider } from '@chakra-ui/react'
import { EthersProvider, Web3Provider as EthereumWeb3Provider } from '@phala/util-ethereum-react'
import type { AppProps } from 'next/app'
import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    const queryClient = useMemo(() => new QueryClient(), [])

    return (
        <QueryClientProvider client={queryClient}>
            <EthereumWeb3Provider>
                <EthersProvider>
                    <ChakraProvider>
                        <Component {...pageProps} />
                    </ChakraProvider>
                </EthersProvider>
            </EthereumWeb3Provider>
        </QueryClientProvider>
    )
}

export default MyApp
