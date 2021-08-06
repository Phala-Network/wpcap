import { Divider, Stack } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useState } from 'react'
import { DepositRecordTable } from '../../components/chainbridge/ethereum/DepositRecordTable'
import { AccountInput } from '../../components/ethereum/AccountInput'
import { AccountSelect } from '../../components/ethereum/AccountSelect'

const Erc20DepositHistoryPage: NextPage = () => {
    const [selectedAccount, setSelectedAccount] = useState<string>()
    const [inputAccount, setInputAccount] = useState<string>()

    return (
        <Stack divider={<Divider />}>
            <AccountSelect disabled={inputAccount !== undefined} onChange={(account) => setSelectedAccount(account)} />
            <AccountInput onChange={(account) => setInputAccount(account)} />
            <DepositRecordTable depositor={selectedAccount ?? inputAccount} />
        </Stack>
    )
}

export default Erc20DepositHistoryPage
