import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import Web3Modal from 'web3modal'

export type Readystate = 'idle' | 'connecting' | 'connected' | 'unavailable'

export interface RawProvider {
    on?(eventName: 'accountsChanged', handler: (accounts?: string[]) => void): void
    on?(eventName: 'chainChanged', handler: () => void): void

    removeListener?(eventName: 'accountsChanged', handler: (accounts?: string[]) => void): void
    removeListener?(eventName: 'chainChanged', handler: () => void): void
}

export interface IWeb3Context {
    /**
     * Injected accounts notified by `accountsChanged`
     */
    accounts: string[]

    provider?: RawProvider
    readystate: Readystate
}

export const Web3Context = createContext<IWeb3Context>({ accounts: [], readystate: 'idle' })

export const Web3Provider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
    const [accounts, setAccounts] = useState<string[]>([])
    const [rawProvider, setRawProvider] = useState<RawProvider>()
    const [readystate, setReadystate] = useState<Readystate>('idle')

    const web3modal = useMemo(() => (typeof window !== 'undefined' ? new Web3Modal() : undefined), [])

    useEffect(() => {
        if (readystate !== 'idle') {
            return
        }

        if (web3modal === undefined) {
            setReadystate('unavailable')
            return
        }

        setReadystate('connecting')
        web3modal
            .connect()
            .then((rawProvider) => {
                setRawProvider(rawProvider)
                setReadystate('connected')
            })
            .catch(() => {
                setReadystate('unavailable')
            })
    }, [readystate, web3modal])

    useEffect(() => {
        const handleAccountChanged = (accounts?: string[]) => {
            setAccounts(accounts ?? [])
        }

        const handleChainChanged = () => {}

        rawProvider?.on?.('accountsChanged', handleAccountChanged)
        rawProvider?.on?.('chainChanged', handleChainChanged)

        return () => {
            rawProvider?.removeListener?.('accountsChanged', handleAccountChanged)
            rawProvider?.removeListener?.('chainChanged', handleChainChanged)
        }
    }, [rawProvider])

    return (
        <Web3Context.Provider value={{ accounts, provider: rawProvider, readystate }}>{children}</Web3Context.Provider>
    )
}

export const useWeb3 = (): IWeb3Context => useContext(Web3Context)
