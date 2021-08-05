import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from 'react'
import { useApiPromise } from './ApiPromiseContext'

export type Readystate = 'idle' | 'enabling' | 'ready' | 'failed'

interface IWeb3Context {
    accounts: InjectedAccountWithMeta[]
    /**
     * Reset `readystate` and try to enable Web3 again
     */
    enable: () => void
    readystate: Readystate
}

const Web3Context = createContext<IWeb3Context>({
    accounts: [],
    enable: () => {},
    readystate: 'idle',
})

const logDebug = console.debug.bind(console, '[Web3Context]')
const logError = console.error.bind(console, '[Web3Context]')
const logInfo = console.info.bind(console, '[Web3Context]')

const imported =
    typeof window !== 'undefined'
        ? import('@polkadot/extension-dapp').catch((error) => {
              logError('Failed to import @polkadot/extension-dapp:', error)
              throw error
          })
        : undefined

export const Web3Provider = ({ children, originName }: PropsWithChildren<{ originName: string }>): ReactElement => {
    const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
    const [readystate, setReadystate] = useState<Readystate>('idle')

    const { api } = useApiPromise()

    useEffect(() => {
        if (readystate !== 'idle') {
            return
        }

        imported?.then(({ web3Enable, isWeb3Injected }) => {
            setReadystate('enabling')

            isWeb3Injected !== true && logError('isWeb3Injected !== true, actual value is', isWeb3Injected)

            web3Enable(originName)
                .then((extensions) => {
                    if (extensions.length > 0) {
                        setReadystate('ready')
                        logInfo(
                            'Injected extensions:',
                            extensions.map((ext) => `${ext.name} (${ext.version})`).join(', ')
                        )
                    } else {
                        setReadystate('failed')
                        logError('No injected extensions')
                    }
                })
                .catch((reason) => {
                    setReadystate('failed')
                    logError('Failed to enable web3:', reason)
                })
        })
    })

    useEffect(() => {
        const unsub = imported
            ?.then(async ({ web3AccountsSubscribe }) => {
                const unsub = await web3AccountsSubscribe(
                    (accounts) => {
                        setAccounts(accounts)
                        logInfo('Injected accounts updated:', accounts.map((account) => account.address).join(', '))
                    },
                    { ss58Format: api?.registry.chainSS58 }
                )
                logDebug('Successfully subscribed to account injection updates')
                return unsub
            })
            .catch((error) => {
                /**
                 * NOTE:
                 *      subscription failure doesn't affect core features,
                 *      so we silently reject errors here.
                 *
                 *      however, user may not see any account injection updates.
                 *
                 *      for example, account may not show up,
                 *      while user is not focused on the window and the subscription has failed
                 */
                logError('Failed to subscribe to account injection updates:', error)

                return () => null // return a dummy unsub func to useEffect unload
            })

        imported
            ?.then(async ({ web3Accounts }) => {
                try {
                    return await web3Accounts({ ss58Format: api?.registry.chainSS58 })
                } catch (error) {
                    logError('Failed to read available accounts:', error)
                    throw error
                }
            })
            .then((accounts) => {
                setAccounts(accounts)
                logInfo('Injected accounts:', accounts.map((account) => account.address).join(', '))
            })

        return () => {
            unsub?.then((unsub) => unsub()).catch(() => null)
        }
    }, [api, readystate])

    return (
        <Web3Context.Provider value={{ accounts, enable: () => setReadystate('idle'), readystate }}>
            {children}
        </Web3Context.Provider>
    )
}

export const useWeb3 = (): IWeb3Context => useContext(Web3Context)
