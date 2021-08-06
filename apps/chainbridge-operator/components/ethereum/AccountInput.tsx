import { FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/react'
import { useAccountDecimalBalance } from '@phala/ethereum-erc20-react'
import { isAddress } from 'ethers/lib/utils'
import { useMemo, useState } from 'react'
import { useConfiguration } from '../../libs/configuration/context'

export const AccountInput = ({ onChange }: { onChange?: (address?: string) => void }): JSX.Element => {
    const { ethereum } = useConfiguration()

    const [account, setAccount] = useState<string>()
    const [isInvalid, setInvalid] = useState<boolean>(false)

    const {
        balance: { isLoading: isBalanceLoading },
        decimalBalance,
    } = useAccountDecimalBalance(account, ethereum?.contracts.erc20)

    const helperText = useMemo(() => {
        if (account === undefined || account.length === 0) {
            return
        }

        if (isBalanceLoading) {
            return 'loading account balance'
        }

        return decimalBalance !== undefined ? (
            <>
                <b>{decimalBalance.toString()}</b> PHA
            </>
        ) : (
            'account balance is currently unavailable'
        )
    }, [account, decimalBalance, isBalanceLoading])

    const handleInputChange = (value: string) => {
        const newAccount = isAddress(value) ? value : undefined
        setAccount(newAccount)
        setInvalid(newAccount === undefined && value.length > 0)
        onChange?.(newAccount)
    }

    return (
        <FormControl>
            <FormLabel>Ethereum account</FormLabel>
            <Input isInvalid={isInvalid} onChange={(e) => handleInputChange(e.target.value)} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    )
}
