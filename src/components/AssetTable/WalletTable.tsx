import { Spinner } from "react-bootstrap";
import CurrencyLogo from "../Logo/CurrencyLogo";
import CurrencyText from "../CurrencyText";
import * as Styled from "./styleds";

export type WalletTableProps = {
	balances: any;
	size?: string;
	loading?: boolean;
	onClickToken: (T: any) => void;
	show?: boolean;
};

const WalletTable = ({ balances, size = "md", loading, onClickToken, show = true }: WalletTableProps) => {
	if (loading) {
		return <Spinner animation="border" variant="primary" />;
	}

	if (!show) {
		return null;
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
					{/* @ts-ignore */}
					{balances.map((row, index) => {
						return (
							<tr
								key={`${row.metadata.address}-${index}`}
								className={"assets__row"}
								style={{ cursor: "pointer" }}
								onClick={() => onClickToken(row)}
							>
								<td>
									<div className="d-flex align-items-center">
										<Styled.LogoContainer>
											<CurrencyLogo currency={row.metadata} />
										</Styled.LogoContainer>
										<Styled.Title
											size={size || "md"}
											className={"font-weight-boldest assets__title ml-2 ml-xl-4"}
										>
											{row.metadata.symbol}
										</Styled.Title>
									</div>
								</td>
								<td className={"assets__value"}>
									<Styled.CustomText size={size || "md"}>
										{row.balance ? row.balance.toSignificant(6) : 0}
									</Styled.CustomText>
								</td>
								<td className={"assets__value assets__value--right"}>
									<Styled.CustomText size={size || "md"}>
										<CurrencyText value={row.balanceUSD} />
									</Styled.CustomText>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Styled.AssetTableWrap>
	);
};

export default WalletTable;
