import { Alert, AlertIcon, Button, Code, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react"
import { useResourceIdHandlerQuery } from "@phala/chainbridge-ethereum-react"
import Link from 'next/link'
import React, { useRef, useState } from "react"

export const ResourceIdInspect = ({ address }: { address?: string }): JSX.Element => {
    const [resourceId, setResourceId] = useState<string>()

    const resourceIdInput = useRef<HTMLInputElement>(null)

    const handleSubmit = () => {
        setResourceId(resourceIdInput.current?.value)
    }

    const { address: handlerAddress } = useResourceIdHandlerQuery(resourceId, address)

    return (
        <Stack>
            <FormControl isRequired>
                <FormLabel>Resource Id</FormLabel>
                <Input ref={resourceIdInput} />
            </FormControl>

            <Button onClick={handleSubmit} type="submit">Lookup</Button>

            {handlerAddress.error && (
                <Alert status="error">
                    <AlertIcon />
                    {(handlerAddress.error as Error)?.message ?? JSON.stringify(handlerAddress.error)}
                </Alert>
            )}

            {handlerAddress.data && (
                <Code>
                    Handler:&nbsp;
                    <Link href={`erc20assethandler?address=${handlerAddress.data}`}>
                        {handlerAddress.data}
                    </Link>
                </Code>
            )}
        </Stack>
    )
}

