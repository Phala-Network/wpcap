import { useEffect, useState } from 'react'
import { useEthers } from '../../contexts/EthersContext'
import { useWeb3 } from '../../contexts/Web3Context'

export const useEthersAccounts = (): string[] => {
    const { provider } = useEthers()
    const { accounts: web3Accounts } = useWeb3()

    const [accounts, setAccounts] = useState<string[]>([])

    useEffect(() => {
        // NOTE: speaks only the accounts available from Ethers to stay consist
        provider?.listAccounts().then((accounts) => {
            setAccounts(accounts)
        })
    }, [provider, web3Accounts])

    return accounts
}
