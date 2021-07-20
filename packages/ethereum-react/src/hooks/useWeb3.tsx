import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import Web3Modal from 'web3modal'
import { IWeb3Context, Provider, Readystate, Web3Context } from '../contexts/Web3Context'

export const Web3Provider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
    const [accounts, setAccounts] = useState<string[]>([])
    const [provider, setProvider] = useState<Provider>()
    const [readystate, setReadystate] = useState<Readystate>('idle')

    const web3Modal = useMemo(
        () =>
            typeof window !== 'undefined'
                ? new Web3Modal({
                      cacheProvider: true,
                      providerOptions: {},
                  })
                : {
                      connect: () => {
                          throw new Error('web3modal is unavailable in SSR')
                      },
                  },
        []
    )

    useEffect(() => {
        if (readystate !== 'idle') {
            return
        }

        setAccounts([])
        setReadystate('connecting')
        web3Modal
            .connect()
            .then((provider) => {
                setReadystate('connected')
                setProvider(provider as Provider)
            })
            .catch(() => {
                setReadystate('unavailable')
            })
    }, [readystate, web3Modal])

    useEffect(() => {
        provider?.on?.('accountsChanged', (accounts) => {
            setAccounts(accounts ?? [])
        })
        provider?.on?.('chainChanged', () => {
            setProvider(undefined)
            setReadystate('idle')
        })
    }, [provider])

    return <Web3Context.Provider value={{ accounts, provider, readystate }}>{children}</Web3Context.Provider>
}

export const useWeb3 = (): IWeb3Context => useContext(Web3Context)
