import { khalaDev } from '@phala/typedefs'
import { Configuration } from './libs/configuration/configuration'

export const config: Configuration = {
    ethereum: {
        1: {
            // mainnet
            chainBridge: {
                chainId: 0,
                contracts: {
                    bridge: '0xC84456ecA286194A201F844993C220150Cf22C63',
                    erc20AssetHandler: '0x6eD3bc069Cf4F87DE05c04C352E8356492EC6eFE',
                    erc20ResourceId: '0x00000000000000000000000000000063a7e2be78898ba83824b0c0cc8dfb6001',
                },
                graph: {
                    endpoint:
                        'https://chainbridge-ethereum-graph-testing.phala.works/subgraphs/name/chainbridge',
                },
                peerChains: {
                    'khala-pc-test-2': {
                        chainId: 1,
                    },
                },
            },
            contracts: {
                erc20: '0x6c5ba91642f10282b576d91922ae6448c9d52f4e',
            },
        },
    },
    substrate: {
        'khala-pc-test': {
            chainBridge: {
                chainId: 1,
                graph: {
                    endpoint: 'https://chainbridge-substrate-graph-testing.phala.works/',
                },
                peerChains: {
                    1: {
                        // ethereum mainnet
                        chainId: 0,
                    },
                },
            },
            endpoint: 'wss://pc-test-2.phala.network/khala/ws',
            typedefs: khalaDev,
        },
    },
}
