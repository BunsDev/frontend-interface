import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
import { Tab, Nav, Spinner } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import Web3 from "web3";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { ERC20TokenContract } from "@0x/contract-wrappers";

import SearchIcon from "../../assets/images/search.svg";
import { UNLIMITED_ALLOWANCE_IN_BASE_UNITS } from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import useTheme from "../../hooks/useTheme";
import { getContractWrappers } from "../../utils/spot/contractWrapper";
import { AppState } from "../../state";
import { useMemoTokenBalances } from "../../state/balances/hooks";
import { fetchBalances, fetchTransformedBalances } from "../../state/balances/actions";

import { ResponsiveCard } from "../Card";
import CurrencyLogo from "../Logo/CurrencyLogo";
import CurrencyText from "../CurrencyText";
import { InputGroupText, InputGroupFormControl as FormControl } from "../Form";
import NftTab from "./NftWallet";
import { WalletTable } from "./WalletTable";
import UnlockModal from "./UnlockModal";
import * as Styled from "./styleds";

let web3;
let web3Wrapper;

export interface WalletCardProps {}

export const WalletCard = (props: WalletCardProps) => {
	const theme = useTheme();
	const { account } = useActiveWeb3React();
	const [query, setQuery] = useState("");
	const [unlocking, setUnlocking] = useState(false);
	const [showUnlockModal, setShowUnlockModal] = useState(false);
	const [done, setDone] = useState(false);
	const overview = useSelector((state: AppState) => state.balances.overview);
	const loading = useSelector((state: AppState) => state.balances.loading);
	const balances = useSelector((state: AppState) => state.balances.data);
	const { ETH } = useSelector((state: AppState) => state.currency.currenciesRate);
	const dispatch = useDispatch();
	const walletBalances = useMemoTokenBalances();
	const { t } = useTranslation();

	useEffect(() => {
		if (account) {
			dispatch(fetchBalances(account));
		}
	}, [account, dispatch]);

	useEffect(() => {
		dispatch(fetchTransformedBalances(balances, walletBalances, ETH));
	}, [balances, walletBalances, ETH, dispatch]);

	useEffect(() => {
		web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider(process.env.REACT_APP_NETWORK_URL));
		if (web3.currentProvider) {
			web3Wrapper = new Web3Wrapper(web3.currentProvider);
		}
	}, []);

	const unlockHandler = async (token) => {
		setShowUnlockModal(true);
		try {
			if (token.address) {
				const contractWrappers = await getContractWrappers(web3.currentProvider || window.ethereum);
				const approveAddress = token.address ? token.address : contractWrappers.contractAddresses.erc20Proxy;

				const erc20Token = new ERC20TokenContract(token.address, contractWrappers.getProvider());
				const amount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS;

				const tx = await erc20Token.approve(approveAddress, amount).sendTransactionAsync({
					from: account,
				});
				setUnlocking(true);
				await web3Wrapper.awaitTransactionSuccessAsync(tx);

				if (tx) {
					setUnlocking(false);
					setDone(true);
				}
			} else if (token.symbol === "ETH") {
				throw new Error("Unnecessary Approve for ethereum");
			} else {
				throw new Error("Token is invalid");
			}
		} catch (e) {
			toast.error("Unnecessary Approve for ethereum or token is invalid");
			setUnlocking(false);
			setShowUnlockModal(false);
			setDone(false);
		}
	};

	let tokensData = overview.wallet.balances || [];

	let filteredTokensData = useMemo(() => {
		if (query === "") {
			return tokensData;
		} else {
			const lowerQuery = query.toLowerCase();
			return tokensData.filter((token) => JSON.stringify(token.metadata).toLowerCase().includes(lowerQuery));
		}
	}, [tokensData, query]);

	const TokensColumns = [
		{
			dataField: "token",
			text: t("token"),
			formatter: (cellContent: any, row: any) => {
				const isLoading = row.loading || false;
				return (
					<div className="d-flex align-items-center flex-row-reverse flex-lg-row">
						<Styled.LogoContainer>
							{isLoading ? (
								<Skeleton width={"100%"} height={"100%"} circle />
							) : (
								<CurrencyLogo currency={row.metadata} />
							)}
						</Styled.LogoContainer>
						<Styled.Title>
							{isLoading ? <Skeleton width={48} height={24} /> : row.metadata.symbol}
						</Styled.Title>
					</div>
				);
			},
		},
		{
			dataField: "balance",
			text: t("balanceTitle"),
			formatter: (cellContent: any, row: any) => {
				const isLoading = row.loading || false;
				return (
					<div>
						{isLoading ? (
							<Skeleton width={80} height={24} />
						) : (
							<Styled.CustomText>{row.balance ? row.balance.toSignificant(6) : 0}</Styled.CustomText>
						)}
					</div>
				);
			},
		},
		{
			dataField: "value",
			text: t("totalValue"),
			formatter: (cellContent: any, row: any) => {
				const isLoading = row.loading || false;
				return (
					<div>
						{isLoading ? (
							<div className={"d-flex align-items-center"}>
								<Skeleton width={24} height={24} className={"mr-2"} />
								<Skeleton width={80} height={24} />
							</div>
						) : (
							<Styled.CustomText>
								<CurrencyText value={row.balanceUSD} />
							</Styled.CustomText>
						)}
					</div>
				);
			},
		},
		{
			dataField: "action",
			text: t("table.actions"),
			formatter: (cellContent: any, row: any, rowIndex: number, { unlockHandler }) => {
				const isLoading = row.loading || false;
				// const value = row.balanceUSD * (currenciesRate["BTC"] || 1);
				return (
					<div className="d-flex align-items-stretch justify-content-end flex-column flex-lg-row align-items-lg-center w-100">
						{isLoading ? (
							<div className={"d-flex align-items-center"}>
								<Skeleton width={70} height={40} count={3} className={"mr-lg-4 mb-2 mb-lg-0"} />
							</div>
						) : (
							<>
								<Styled.TradeButton
									href={`/#/exchange?outputCurrency=${
										row.metadata.symbol === "ETH" ? "ETH" : row.metadata.address
									}`}
								>
									{t("buttons.buy")}
								</Styled.TradeButton>

								<Styled.TradeButton
									variant={theme.warning}
									onClick={() => unlockHandler(row.metadata)}
									disabled={row.metadata.symbol === "ETH"}
								>
									{t("buttons.unlock")}
								</Styled.TradeButton>

								<Styled.TradeButton
									href={`/#/exchange?inputCurrency=${
										row.metadata.symbol === "ETH" ? "ETH" : row.metadata.address
									}`}
									variant={theme.secondary}
								>
									{t("buttons.sell")}
								</Styled.TradeButton>

								{/* {value <= 0.001 ? (
									<Styled.TradeButton
										href={`/#/exchange?inputCurrency=${
											row.metadata.symbol === "ETH" ? "ETH" : row.metadata.address
										}&outputCurrency=0x7240aC91f01233BaAf8b064248E80feaA5912BA3`}
										disabled
										variant={theme.tertiary}>
											{t("buttons.convertTo", { symbol: "OCTO" })}
										</Styled.TradeButton>
								) : (
									<Styled.TradeButton variant={theme.tertiary} disabled={true}>
										{t("buttons.convertTo", { symbol: "OCTO" })}
									</Styled.TradeButton>
								)} */}
							</>
						)}
					</div>
				);
			},
			isAction: true,
			formatExtraData: {
				unlockHandler,
			},
		},
	];

	return (
		<div>
			<UnlockModal
				done={done}
				show={showUnlockModal}
				unlocking={unlocking}
				onDismiss={() => {
					setDone(false);
					setUnlocking(false);
					setShowUnlockModal(false);
				}}
			/>

			<ResponsiveCard>
				<Tab.Container defaultActiveKey={"nft"}>
					<div className="d-flex flex-column-reverse flex-lg-row align-items-stretch align-items-lg-center justify-content-between mb-4">
						<Nav fill variant="pills">
							<Styled.CustomNavItem>
								<Styled.CustomNavLink eventKey="tokens">{t("importList.tokens")}</Styled.CustomNavLink>
							</Styled.CustomNavItem>
							<Styled.CustomNavItem>
								<Styled.CustomNavLink eventKey="nft">{t("NFT")}</Styled.CustomNavLink>
							</Styled.CustomNavItem>
						</Nav>

						<Styled.CustomInputGroup className={"w-auto mb-lg-0"} bg={"darker"}>
							<InputGroupText>
								<SVG src={SearchIcon} />
							</InputGroupText>
							<FormControl
								id="walletSearch"
								placeholder={t("search")}
								onChange={(e: any) => setQuery(e.target.value)}
							/>
						</Styled.CustomInputGroup>
					</div>
					<Tab.Content>
						{/* <Tab.Pane eventKey="tokens">
							{loading ? (
								<div className="py-5 w-100 d-flex align-items-center justify-content-center">
									<Spinner animation="border" variant="primary" id="tokens-wallet" />
								</div>
							) : (
								<WalletTable columns={TokensColumns} entities={filteredTokensData} />
							)}
						</Tab.Pane> */}
						<Tab.Pane eventKey="nft">
							<NftTab query={query} />
						</Tab.Pane>
					</Tab.Content>
				</Tab.Container>
			</ResponsiveCard>
		</div>
	);
};