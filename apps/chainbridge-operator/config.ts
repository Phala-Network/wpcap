import { Configuration } from './libs/configuration/configuration'

export const config: Configuration = {
    ethereum: {
        42: {
            // kovan testnet
            chainBridge: {
                contracts: {
                    bridge: '0xe5F54e020f3E4964Ba11D269Cdda602A78d09917',
                    erc20AssetHandler: '0xDf2E83f33dB8A9CcF3a00FCe18C3F509b974353D',
                    erc20ResourceId: '0x00000000000000000000000000000063a7e2be78898ba83824b0c0cc8dfb6001',
                },
                graph: { endpoint: 'http://graph-http.magi.futa.moe/subgraphs/name/chainbridge' },
                peerChains: {
                    poc5: {
                        chainId: 1,
                    },
                },
            },
            contracts: {
                erc20: '0x512f7a3c14b6ee86c2015bc8ac1fe97e657f75f2',
            },
        },
    },
}
