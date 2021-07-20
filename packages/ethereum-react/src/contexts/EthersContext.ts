import { ethers, Signer } from 'ethers'
import { createContext } from 'react'
import { Readystate } from './Web3Context'

type Web3Provider = ethers.providers.Web3Provider

export interface IEthersContext {
    instance?: string
    provider?: Web3Provider
    readystate: Readystate
    signer?: Signer
}

export const EthersContext = createContext<IEthersContext>({
    readystate: 'unavailable',
})
