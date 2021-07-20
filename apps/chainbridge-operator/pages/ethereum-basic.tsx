import { useEthers, useEthersAccounts, useWeb3 } from '@phala/util-ethereum-react'
import React from 'react'

const EthereumPage = (): JSX.Element => {
    const { readystate: web3Readystate } = useWeb3()
    const { readystate: ethersReadystate } = useEthers()
    const accounts = useEthersAccounts()

    return (
        <>
            <section>
                <h2>Readystates</h2>
                <p>
                    <b>Web3</b>: {web3Readystate}
                </p>
                <p>
                    <b>Ethers</b>: {ethersReadystate}
                </p>
            </section>
            <section>
                <h2>Accounts</h2>
                <ul>
                    {accounts.map((account) => (
                        <li key={account}>{account}</li>
                    ))}
                </ul>
            </section>
        </>
    )
}

export default EthereumPage
