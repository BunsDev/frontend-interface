import { ETHER, Token } from "@uniswap/sdk";
import { Spinner } from "react-bootstrap";

import { useActiveWeb3React } from "../../hooks";
import CurrencyText from "../CurrencyText";
import CurrencyLogo from "../Logo/CurrencyLogo";
import * as Styled from "./styleds";

export type AssetTableProps = {
	balances: Array<any>;
	size?: string;
	loading?: boolean;
};

export const AssetTable = ({ balances, size = "md", loading }: AssetTableProps) => {
	const { chainId } = useActiveWeb3React();

	if (loading) {
		return <Spinner animation="border" variant="primary" />;
	}

	if (balances.length === 0) {
		return null;
	}

	return (
		<Styled.AssetTableWrap className={"table-responsive"}>
			<table className={`table table-borderless table-head-custom mb-0 asset-table asset-table--${size}`}>
				<thead>
					<tr>
						<th>Assets</th>
						<th>Balance</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					{balances.map((row) => {
						if (row.underlying.length > 0) {
							// @ts-ignore
							return row.underlying.map((uRow, index) => {
								const currency =
									uRow.metadata.address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
										? ETHER
										: new Token(
												// @ts-ignore
												chainId,
												uRow.metadata.address,
												uRow.metadata.decimals,
												uRow.metadata.symbol,
												uRow.metadata.name
										  );
								return (
									<tr key={uRow.metadata.address} className="assets__row">
										<td>
											<div className="d-flex align-items-center">
												<Styled.LogoContainer>
													<CurrencyLogo currency={currency} />
												</Styled.LogoContainer>
												<Styled.Title
													size={size}
													className={"font-weight-boldest assets__title"}
												>
													{uRow.metadata.symbol}
												</Styled.Title>
											</div>
										</td>
										<td className={"assets__value"}>
											<Styled.CustomText size={size}>
												{(uRow.balance / 10 ** uRow.metadata.decimals).toFixed(6)}
											</Styled.CustomText>
										</td>
										<td className={"assets__value assets__value--right"}>
											<Styled.CustomText size={size}>
												<CurrencyText value={uRow.balanceUSD} />
											</Styled.CustomText>
										</td>
									</tr>
								);
							});
						} else {
							const currency =
								row.base.metadata.address.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
									? ETHER
									: new Token(
											// @ts-ignore
											chainId,
											row.base.metadata.address,
											row.base.metadata.decimals,
											row.base.metadata.symbol,
											row.base.metadata.name
									  );
							return (
								<tr key={row.base.metadata.address} className={"assets__row"}>
									<td>
										<div className="d-flex align-items-center">
											<Styled.LogoContainer>
												<CurrencyLogo currency={currency} />
											</Styled.LogoContainer>
											<Styled.Title size={size} className={"font-weight-boldest assets__title"}>
												{row.base.metadata.symbol}
											</Styled.Title>
										</div>
									</td>
									<td className={"assets__value"}>
										<Styled.CustomText size={size}>
											{(row.base.balance / 10 ** row.base.metadata.decimals).toFixed(6)}
										</Styled.CustomText>
									</td>
									<td className={"assets__value assets__value--right"}>
										<Styled.CustomText size={size}>
											<CurrencyText value={row.base.balanceUSD} />
										</Styled.CustomText>
									</td>
								</tr>
							);
						}
					})}
				</tbody>
			</table>
		</Styled.AssetTableWrap>
	);
};
