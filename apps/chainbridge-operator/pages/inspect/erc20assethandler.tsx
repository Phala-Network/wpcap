import { Box, Stack } from '@chakra-ui/react'
import { useErc20AssetHandler } from '@phala/chainbridge-ethereum-react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

const Erc20AssetHandlerPage = (): JSX.Element => {
    const { query } = useRouter()
    const address = (query['address'] instanceof Array) ? query['address'][0] : query['address']

    const { contract, error } = useErc20AssetHandler(address)

    const resolvedAddressQueryKey = useMemo(() => uuidv4(), [])
    const { data: resolvedAddress } = useQuery([resolvedAddressQueryKey, address], async () => {
        return await contract?.resolvedAddress
    })

    return (
        <Stack>
            <h1>Erc20AssetHandler Inspection</h1>

            {error &&
                <Box>
                    <h2>Contract Load Error</h2>
                    <p>{error?.message ?? 'No error'}</p>
                </Box>
            }

            <Box as="section">
                <p>Resolved Address: {resolvedAddress}</p>
            </Box>

            <Box as="section">
                {
                    // TODO: inspect deposit records
                }
            </Box>
        </Stack>
    )
}

export default Erc20AssetHandlerPage
