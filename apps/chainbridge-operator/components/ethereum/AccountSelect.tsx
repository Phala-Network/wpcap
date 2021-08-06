import { FormControl, FormHelperText, FormLabel, Select } from '@chakra-ui/react'
import { useAccountDecimalBalance } from '@phala/ethereum-erc20-react'
import { useEthersAccounts } from '@phala/util-ethereum-react'
import { isAddress } from 'ethers/lib/utils'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useConfiguration } from '../../libs/configuration/context'

export const AccountSelect = ({
    disabled,
    onChange,
}: {
    disabled?: boolean
    onChange?: (account?: string) => void
}): JSX.Element => {
    const config = useConfiguration()

    const accounts = useEthersAccounts()
    const accountOptions = useMemo(
        () =>
            accounts.map((account) => {
                return (
                    <option key={account} value={account}>
                        {account}
                    </option>
                )
            }),
        [accounts]
    )

    const [account, setAccount] = useState<string>()

    const {
        balance: { isLoading: isBalanceLoading },
        decimalBalance,
    } = useAccountDecimalBalance(account, config.ethereum?.contracts.erc20)

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

    const selectRef = useRef<HTMLSelectElement>(null)
    useEffect(() => {
        const value = selectRef.current?.value ?? ''
        setAccount(isAddress(value) ? value : undefined)
    }, [account])

    useEffect(() => onChange?.(account), [account, onChange])

    return (
        <>
            <FormControl>
                <FormLabel>Ethereum account</FormLabel>
                <Select
                    defaultValue=""
                    disabled={disabled}
                    onChange={(e) => {
                        setAccount(e.target.value)
                    }}
                    ref={selectRef}
                >
                    <option value=""></option>
                    {accountOptions}
                </Select>
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        </>
    )
}
