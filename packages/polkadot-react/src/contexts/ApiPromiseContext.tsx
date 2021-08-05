import { ApiPromise, WsProvider } from '@polkadot/api'
import { RegistryTypes } from '@polkadot/types/types'
import { createContext, PropsWithChildren, ReactElement, useContext, useEffect, useState } from 'react'

export interface SubstrateNetworkOptions {
    endpoint: string
    registryTypes: RegistryTypes
}

type Readystate = 'unavailable' | 'init' | 'ready' | 'failed'

interface IApiPromiseContext {
    api?: ApiPromise
    readystate: Readystate
}

const ApiPromiseContext = createContext<IApiPromiseContext>({
    readystate: 'unavailable',
})

const apiPromiseContextPrefix = '[ApiPromiseContext]'
const logDebug = console.debug.bind(console, apiPromiseContextPrefix)
const logError = console.error.bind(console, apiPromiseContextPrefix)

const enableApiPromise = async (endpoint: string, types: RegistryTypes): Promise<ApiPromise> => {
    const { cryptoWaitReady } = await import('@polkadot/util-crypto')
    await cryptoWaitReady()
    logDebug('Polkadot crypto is ready')

    const { ApiPromise } = await import('@polkadot/api')
    const api = await ApiPromise.create({
        provider: new WsProvider(endpoint),
        types,
    })
    logDebug('WebSocket API is ready:', api.runtimeVersion)

    return api
}

export function ApiPromiseProvider<T extends SubstrateNetworkOptions>({
    children,
    options,
}: PropsWithChildren<{ options?: T }>): ReactElement {
    const [api, setApi] = useState<ApiPromise>()
    const [readystate, setState] = useState<Readystate>('unavailable')

    useEffect(() => {
        if (typeof window === 'undefined' || readystate !== 'unavailable') {
            // do not enable during server side rendering
            return
        }

        if (options === undefined) {
            return
        }

        const { endpoint, registryTypes } = options

        setState('init')
        enableApiPromise(endpoint, registryTypes)
            .then((api) => {
                setApi(api)
                setState('ready')
            })
            .catch((reason) => {
                logError('Failed to enable Polkadot API:', reason)
                setState('failed')
            })
    }, [options, readystate])

    return <ApiPromiseContext.Provider value={{ api, readystate }}>{children}</ApiPromiseContext.Provider>
}

export const useApiPromise = (): IApiPromiseContext => useContext(ApiPromiseContext)
