import { createContext, useState, useRef, useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";
import { toHex } from "viem";
import {
    Deferrable,
    HttpTransport,
    PublicErc4337Client,
    createPublicErc4337Client,
    getDefaultEntryPointAddress,
} from "@alchemy/aa-core";
import {
    AlchemyProvider,
    withAlchemyGasFeeEstimator,
} from "@alchemy/aa-alchemy";
import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { useLightAccountSigner } from "./lightAccountSigner";

export const SCWContext = createContext({
    sCWAddress: undefined,
    sCWClient: undefined,
    sCWSigner: undefined,
    updateSCW: undefined,
});

const rpcUrl =
    "https://eth-sepolia.g.alchemy.com/v2/6LS_1W2VpXvWhpiVcsuCQlLxU64COp3R";

export const SCWallet = ({ children }) => {
    const [sCWAddress, setSCWAddress] = useState("");
    const [ownerAddress, setOwnerAddress] = useState("");
    const sCWSigner = useRef({});
    const sCWClient = useRef({});
    const account = useAccount();
    const network = useNetwork();
    const ownerResult = useLightAccountSigner();

    useMemo(async () => {
        const ownerAddr = (await ownerResult?.owner?.getAddress()) || "";
        if (ownerAddr) setOwnerAddress(ownerAddr);
    }, [ownerResult.isLoading]);

    const setupSCW = async (chain, accountAddress) => {
        const baseSigner = new AlchemyProvider({
            rpcUrl,
            chain,
            opts: {
                txMaxRetries: 60,
            },
        }).connect((provider) => {
            let lsca = {
                chain,
                owner: ownerResult.owner,
                entryPointAddress: getDefaultEntryPointAddress(chain),
                factoryAddress: getDefaultLightAccountFactoryAddress(chain),
                rpcClient: provider,
            };
            if (accountAddress?.length > 3) lsca.accountAddress = accountAddress;
            return new LightSmartContractAccount(lsca);
        });

        const smartAccountAddress = await baseSigner.getAddress();
        setSCWAddress(smartAccountAddress);

        const dummyPaymasterDataMiddleware = async (uoStruct) => {
            console.log("dummy paymaster for gas estimate", uoStruct);
            const params1 = await resolveProperties(uoStruct);
            console.log("params1", params1);

            const body = {
                id: 1,
                jsonrpc: "2.0",
                method: "eth_paymasterAndDataForUserOperation",
                params: [
                    {
                        ...params1,
                        nonce: toHex(Number(params1.nonce)),
                        sender: smartAccountAddress,
                        callGasLimit: "0x0",
                        preVerificationGas: "0x0",
                        verificationGasLimit: "0x0",
                        maxFeePerGas: "0x0",
                        maxPriorityFeePerGas: "0x0",
                    },
                    baseSigner.getEntryPointAddress(),
                    toHex(chain.id),
                ],
            };

            const response = await fetch("https://paymaster.base.org", {
                method: "post",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            console.log("response", data);

            return {
                paymasterAndData: data.result,
            };
        };

        const paymasterDataMiddleware = async (uoStruct) => {
            console.log("final paymaster", uoStruct);

            const params1 = await resolveProperties(uoStruct);
            console.log("params1", params1);
            const body = {
                id: 1,
                jsonrpc: "2.0",
                method: "eth_paymasterAndDataForUserOperation",
                params: [
                    {
                        ...params1,
                        nonce: toHex(Number(params1.nonce)),
                        sender: smartAccountAddress,
                        callGasLimit: toHex(Number(params1.callGasLimit)),
                        preVerificationGas: toHex(
                            Number(params1.preVerificationGas) + 5000
                        ),
                        verificationGasLimit: toHex(
                            Number(params1.verificationGasLimit) + 10000
                        ),
                        maxFeePerGas: toHex(Number(params1.maxFeePerGas)),
                        maxPriorityFeePerGas: toHex(Number(params1.maxPriorityFeePerGas)),
                    },
                    baseSigner.getEntryPointAddress(),
                    toHex(chain.id),
                ],
            };

            const response = await fetch("https://paymaster.base.org", {
                method: "post",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            console.log("response", data);

            return {
                paymasterAndData: data.result,
            };
        };

        const signer = withAlchemyGasFeeEstimator(baseSigner, 50n, 50n);

        const smartAccountSigner = signer.withPaymasterMiddleware({
            dummyPaymasterDataMiddleware,
            paymasterDataMiddleware,
        });

        return smartAccountSigner;
    };

    const updateSCW = async (newAddress) => {
        const chain = network.chain;
        console.log(chain);

        const smartAccountSigner = await setupSCW(chain, newAddress);

        sCWSigner.current = smartAccountSigner;
        console.log(sCWSigner.current);
        const client = createPublicErc4337Client({
            chain,
            rpcUrl,
        });
        sCWClient.current = client;
    };

    useMemo(async () => {
        if (!account || !network?.chain || ownerAddress.length < 1) return;
        const chain = network.chain;
        console.log(chain);

        const smartAccountSigner = await setupSCW(chain);

        sCWSigner.current = smartAccountSigner;
        console.log(sCWSigner.current);
        const client = createPublicErc4337Client({
            chain,
            rpcUrl,
        });
        sCWClient.current = client;
    }, [account?.address, network?.chain?.id, ownerAddress]);

    const state = {
        sCWAddress,
        sCWSigner: sCWSigner.current,
        sCWClient: sCWClient.current,
        updateSCW,
    };

    return <SCWContext.Provider value={state}>{children}</SCWContext.Provider>;
};

async function resolveProperties(object) {
    const promises = Object.keys(object).map((key) => {
        const value = object[key];
        return Promise.resolve(value).then((v) => ({ key: key, value: v }));
    });

    const results = await Promise.all(promises);

    return results.reduce((accum, curr) => {
        accum[curr.key] = curr.value;
        return accum;
    }, {});
}
