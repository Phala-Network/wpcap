import { EthersProvider, Web3Provider as EthereumWeb3Provider } from '@phala/util-ethereum-react'
import type { AppProps } from 'next/app'
import React from 'react'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <EthereumWeb3Provider>
            <EthersProvider>
                <Component {...pageProps} />
            </EthersProvider>
        </EthereumWeb3Provider>
    )
}

export default MyApp
