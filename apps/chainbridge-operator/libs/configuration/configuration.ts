interface EthereumChainBridgeConfiguration {
    contracts: {
        bridge: string
        erc20AssetHandler: string
        erc20ResourceId: string
    }

    graph: {
        endpoint: string
    }

    peerChains: Record<
        number | string,
        {
            chainId: number
        }
    >
}

export interface EthereumNetworkConfiguration {
    chainBridge: EthereumChainBridgeConfiguration

    contracts: {
        erc20: string
    }
}

export interface Configuration {
    ethereum: Record<number, EthereumNetworkConfiguration>
}
