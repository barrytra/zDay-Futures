import { SignTypedDataParams, SmartAccountSigner } from "@alchemy/aa-core";
import { useCallback } from "react";
import { toHex } from "viem";
import { useWalletClient } from "wagmi";

export function useLightAccountSigner() {
    const walletClientQuery = useWalletClient();
    const signerType = "json-rpc";
    // We need this to by pass a viem bug https://github.com/wagmi-dev/viem/issues/606
    const signMessage = useCallback(
        (data) =>
            walletClientQuery.data.request({
                // ignore the type error here, it's a bug in the viem typing
                // @ts-ignore
                method: "personal_sign",
                // @ts-ignore
                params: [toHex(data), walletClientQuery.data.account.address],
            }),
        [walletClientQuery.data]
    );
    const signTypedData = useCallback(
        (data) =>
            walletClientQuery.data.request({
                // ignore the type error here, it's a bug in the viem typing
                // @ts-ignore
                method: "eth_signTypedData_v4",
                // @ts-ignore
                params: [toHex(data), walletClientQuery.data.account.address],
            }),
        [walletClientQuery.data]
    );

    const getAddress = useCallback(
        () => {
            return Promise.resolve(walletClientQuery.data.account.address);
        },
        [walletClientQuery.data]
    );
    if (walletClientQuery.isLoading) {
        return {
            isLoading: true,
            owner: undefined,
        };
    }
    console.log('light account inited')
    return {
        isLoading: false,
        owner: { signerType, signMessage, signTypedData, getAddress },
    };
}

