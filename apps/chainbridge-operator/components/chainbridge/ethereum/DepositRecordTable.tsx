import { InfoIcon } from '@chakra-ui/icons'
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Spinner,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr
} from '@chakra-ui/react'
import { useDepositRecordsByDepositorQuery } from '@phala/chainbridge-graph-react/lib/ethereum/queries'
import { useDecimalMultiplier } from '@phala/polkadot-react/lib/queries/useTokenDecimalsQuery'
import { balanceToDecimal } from '@phala/polkadot-react/lib/utils/balances/convert'
import { hexToU8a } from '@polkadot/util'
import { encodeAddress } from '@polkadot/util-crypto'
import BN from 'bn.js'
import React, { useMemo } from 'react'
import { useEthereumGraphQL } from './GraphQLClientContext'

interface DepositRecord {
    amount: string
    destinationChainId: number
    destinationRecipient: string
    nonce: string
    transaction: string
}

export const DepositRecordItem = ({ record }: { record: DepositRecord }): JSX.Element => {
    const { amount, destinationRecipient, nonce, transaction } = record

    const { multiplier } = useDecimalMultiplier()

    const convertedAmount = useMemo(
        // TODO: this balance is already converted into Substrate decimals
        () => multiplier !== undefined && balanceToDecimal(new BN(amount), multiplier).toString(),
        [amount, multiplier]
    )

    const encodedRecipient = useMemo(() => {
        const u8a = hexToU8a(destinationRecipient)
        try {
            return encodeAddress(u8a)
        } catch {
            return 'invalid address'
        }
    }, [destinationRecipient])

    return (
        <Tr>
            <Td>
                {transaction} #{nonce}{' '}
            </Td>
            <Td>{(convertedAmount && `${convertedAmount} PHA`) || <Spinner />}</Td>
            <Td>
                <Tooltip label={destinationRecipient}>
                    <i>
                        {encodedRecipient} <InfoIcon />
                    </i>
                </Tooltip>
            </Td>
            <Td>
                <i>unavailable</i>
            </Td>
        </Tr>
    )
}

export const DepositRecordTable = ({ depositor }: { depositor?: string }): JSX.Element => {
    const { client } = useEthereumGraphQL()
    const { data, error } = useDepositRecordsByDepositorQuery(depositor, 10, 0, client)

    const rows = useMemo(
        () => data?.depositRecords.map((record) => <DepositRecordItem key={record.nonce} record={record} />),
        [data]
    )

    return (
        <Stack>
            {error && (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{(error as Error)?.message ?? JSON.stringify(error)}</AlertDescription>
                </Alert>
            )}
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Hash</Th>
                        <Th>Recipient</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                    </Tr>
                </Thead>
                <Tbody>{rows}</Tbody>
            </Table>
        </Stack>
    )
}
