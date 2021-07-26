import { InfoIcon } from '@chakra-ui/icons'
import {
    Spinner, Table,
    Tbody,
    Td, Th,
    Thead,
    Tooltip,
    Tr
} from '@chakra-ui/react'
import { useDepositRecordsByDepositorQuery } from '@phala/chainbridge-ethereum-graph'
import { useErc20Decimals } from '@phala/ethereum-erc20-react'
import { Decimal } from 'decimal.js'
import React, { useMemo } from 'react'
import { useConfiguration } from '../../../libs/configuration/context'
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

    const { ethereum } = useConfiguration()
    const { factor } = useErc20Decimals(ethereum?.contracts.erc20)

    const convertedAmount = useMemo(
        // TODO: this balance is already converted into Substrate decimals
        () => factor && new Decimal(amount).div(factor).toString() + ' PHA',
        [amount, factor]
    )

    return (
        <Tr>
            <Td>
                {transaction} #{nonce}{' '}
            </Td>
            <Td>{convertedAmount || <Spinner />}</Td>
            <Td>
                <Tooltip label={destinationRecipient}>
                    <i>
                        undecodable <InfoIcon />
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
    const { data } = useDepositRecordsByDepositorQuery(depositor, 10, 0, client)

    const rows = useMemo(
        () => data?.depositRecords.map((record) => <DepositRecordItem key={record.nonce} record={record} />),
        [data]
    )

    return (
        <Table>
            <Thead>
                <Th>Hash</Th>
                <Th>Recipient</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
            </Thead>
            <Tbody>{rows}</Tbody>
        </Table>
    )
}
