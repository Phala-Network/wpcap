import { useErc20AssetHandler } from '@phala/chainbridge-ethereum-react'
import { useEffect, useState } from 'react'

const Erc20AssetHandlerPage = (): JSX.Element => {
    

    const { contract, error } = useErc20AssetHandler('0xDf2E83f33dB8A9CcF3a00FCe18C3F509b974353D')

    const [resolvedAddress, setResolvedAddress] = useState<string>()
    useEffect(() => {
        contract?.resolvedAddress.then((address) => setResolvedAddress(address))
    }, [contract?.resolvedAddress])

    return (
        <>
            <section>
                <h2>Error</h2>
                <p>{error?.message ?? 'No error'}</p>
                <h2>Contract</h2>
                <p>Address: {resolvedAddress}</p>
            </section>
        </>
    )
}

export default Erc20AssetHandlerPage
