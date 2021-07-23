import { FormControl, FormHelperText, FormLabel, Select } from "@chakra-ui/react"
import { useAccountDecimalBalance } from '@phala/ethereum-erc20-react'
import { useEthersAccounts } from "@phala/util-ethereum-react"
import React, { useEffect, useMemo, useRef, useState } from "react"

export const AccountSelect = (): JSX.Element => {
    const accounts = useEthersAccounts()
    const accountOptions = useMemo(() => accounts.map(account => {
        return <option key={account} value={account}>{account}</option>
    }), [accounts])

    const [account, setAccount] = useState<string>()

    const address = '0x512f7a3c14b6ee86c2015bc8ac1fe97e657f75f2' // TODO: read from config provider

    const {
        balance: { isLoading: isBalanceLoading },
        decimalBalance,
        decimals: { isLoading: isDecimalsLoading }
    } = useAccountDecimalBalance(account, address)

    const helperText = useMemo(() => {
        if (account === undefined || account.length === 0) {
            return
        }

        if (isBalanceLoading) {
            return 'loading account balance'
        }

        if (isDecimalsLoading) {
            return 'loading erc-20 properties'
        }

        return (
            decimalBalance !== undefined
                ? <><b>{decimalBalance.toString()}</b> PHA</>
                : 'account balance is currently unavailable'
        )
    }, [account, decimalBalance, isBalanceLoading, isDecimalsLoading])

    const selectRef = useRef<HTMLSelectElement>(null)
    useEffect(() => { setAccount(selectRef.current?.value) }, [account])

    return (
        <>
            <FormControl>
                <FormLabel>Ethereum account</FormLabel>
                <Select defaultValue="" onChange={e => { setAccount(e.target.value) }} ref={selectRef}>
                    <option value=""></option>
                    {accountOptions}
                </Select>
                {helperText && (
                    <FormHelperText>
                        {helperText}
                    </FormHelperText>
                )}
            </FormControl>
        </>
    )
}