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
    Tr,
} from '@chakra-ui/react'
import { useDepositRecordsByDepositorQuery } from '@phala/chainbridge-graph-react/lib/ethereum/queries'
import { useProposalEventsByDepositNonceQuery } from '@phala/chainbridge-graph-react/lib/substrate/queries'
import { useDecimalMultiplier } from '@phala/polkadot-react/lib/queries/useTokenDecimalsQuery'
import { balanceToDecimal } from '@phala/polkadot-react/lib/utils/balances/convert'
import { hexToU8a } from '@polkadot/util'
import { encodeAddress } from '@polkadot/util-crypto'
import BN from 'bn.js'
import React, { useMemo } from 'react'
import { useBridgeProposalQuery } from '../../../libs/chainbridge/phala/useBridgeProposalQuery'
import { useConfiguration } from '../../../libs/configuration/context'
import { useSubstrateGraphQL } from '../substrate/GraphQLClientContext'
import { useEthereumGraphQL } from './GraphQLClientContext'

interface DepositRecord {
    amount: string
    destinationChainId: number
    destinationRecipient: string
    nonce: string
    resourceId: string
    transaction: string
}

export const DepositRecordItem = ({ record }: { record: DepositRecord }): JSX.Element => {
    const { ethereum } = useConfiguration()

    const { amount, destinationRecipient, nonce, resourceId, transaction } = record

    const { client } = useSubstrateGraphQL()
    const { data: events } = useProposalEventsByDepositNonceQuery(ethereum?.chainBridge.chainId, nonce, client)

    const parsedNonce = parseInt(nonce)
    const recipient = useMemo(() => {
        try {
            return encodeAddress(hexToU8a(destinationRecipient))
        } catch {
            return undefined
        }
    }, [destinationRecipient])

    const { data: proposal } = useBridgeProposalQuery({
        amount: new BN(amount),
        depositNonce: parsedNonce,
        originChainId: ethereum?.chainBridge.chainId,
        recipient,
        resourceId,
    })

    const proposalStatus = useMemo(() => {
        const hash = events?.approval?.approvalExtrinsic

        if (events?.execution !== undefined) {
            return (
                <Tooltip hasArrow label={hash ?? 'hash is currently unavailable'}>
                    <i>Executed</i>
                </Tooltip>
            )
        }

        if (events?.approval !== undefined || proposal?.unwrapOr(undefined)?.status?.isApproved === true) {
            return (
                <Tooltip hasArrow label={hash ?? 'hash is currently unavailable'}>
                    <i>Approved</i>
                </Tooltip>
            )
        }

        return <i>Pending</i>
    }, [events, proposal])

    const { multiplier } = useDecimalMultiplier()

    const convertedAmount = useMemo(
        // TODO: this balance is already converted into Substrate decimals
        () => multiplier !== undefined && balanceToDecimal(new BN(amount), multiplier).toString(),
        [amount, multiplier]
    )

    return (
        <Tr>
            <Td>
                {transaction} #{nonce}{' '}
            </Td>
            <Td>{(convertedAmount && `${convertedAmount} PHA`) || <Spinner />}</Td>
            <Td>
                <Tooltip hasArrow label={destinationRecipient ?? 'currently unavailable'}>
                    <i>
                        {recipient ?? 'unavailable'} <InfoIcon />
                    </i>
                </Tooltip>
            </Td>
            <Td>{proposalStatus}</Td>
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
                        <Th>Amount</Th>
                        <Th>Recipient</Th>
                        <Th>Status</Th>
                    </Tr>
                </Thead>
                <Tbody>{rows}</Tbody>
            </Table>
        </Stack>
    )
}
