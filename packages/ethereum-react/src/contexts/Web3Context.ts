import { createContext } from 'react'

export type Readystate = 'idle' | 'connecting' | 'connected' | 'unavailable'

export interface Provider {
    readonly _: unique symbol
    on?(eventName: 'accountsChanged', handler: (accounts?: string[]) => void): void
    on?(eventName: 'chainChanged', handler: () => void): void
}

export interface IWeb3Context {
    /**
     * Injected accounts notified by `accountsChanged`
     */
    accounts: string[]

    provider?: Provider
    readystate: Readystate
}

export const Web3Context = createContext<IWeb3Context>({ accounts: [], readystate: 'idle' })
