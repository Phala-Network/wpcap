import { Divider, Stack } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useState } from 'react'
import { AccountSelect } from '../../components/phala/AccountSelect'

const BridgeTransferHistoryPage: NextPage = () => {
    const [, setAccount] = useState<string>()

    return (
        <Stack divider={<Divider />}>
            <AccountSelect onChange={(account) => setAccount(account)} />
        </Stack>
    )
}

export default BridgeTransferHistoryPage
