import { Divider, Stack } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useState } from 'react'
import { DepositRecordTable } from '../../components/chainbridge/ethereum/DepositRecordTable'
import { AccountSelect } from '../../components/ethereum/AccountSelect'

const Erc20DepositHistoryPage: NextPage = () => {
    const [account, setAccount] = useState<string>()

    return (
        <Stack divider={<Divider />}>
            <AccountSelect onChange={(account) => setAccount(account)} />
            <DepositRecordTable depositor={account} />
        </Stack>
    )
}

export default Erc20DepositHistoryPage
