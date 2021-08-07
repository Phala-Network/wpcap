import { RegistryTypes } from '@polkadot/types/types'

interface EthereumChainBridgeConfiguration {
    chainId: number

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

interface SubstrateChainBridgeConfiguration {
    chainId: number

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

export interface SubstrateNetworkConfiguration {
    chainBridge: SubstrateChainBridgeConfiguration

    endpoint: string

    typedefs: RegistryTypes
}

export interface Configuration {
    ethereum: Record<number, EthereumNetworkConfiguration>
    substrate: Record<string, SubstrateNetworkConfiguration>
}
