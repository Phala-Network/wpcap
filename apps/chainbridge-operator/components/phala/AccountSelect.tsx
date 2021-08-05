import { FormControl, FormHelperText, FormLabel, Select } from '@chakra-ui/react'
import { useWeb3 } from '@phala/polkadot-react/lib/contexts/Web3Context'
import { useAccountDecimalBalanceQuery } from '@phala/polkadot-react/lib/queries/useAccountBalanceQuery'
import React, { useEffect, useMemo, useRef, useState } from 'react'

export const AccountSelect = ({ onChange }: { onChange?: (account?: string) => void }): JSX.Element => {
    const { accounts } = useWeb3()
    const accountOptions = useMemo(
        () =>
            accounts.map((account) => (
                <option key={account.address} value={account.address}>
                    {account.address}
                </option>
            )),
        [accounts]
    )

    const [account, setAccount] = useState<string>()

    const {
        balance: { isLoading: isBalanceLoading },
        decimalBalance,
    } = useAccountDecimalBalanceQuery(account)

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
        setAccount(selectRef.current?.value)
    }, [account])

    useEffect(() => onChange?.(account), [account, onChange])

    return (
        <>
            <FormControl>
                <FormLabel>Phala account</FormLabel>
                <Select
                    defaultValue=""
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
