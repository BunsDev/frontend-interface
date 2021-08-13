import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
import { lighten } from "polished";
import styled from "styled-components";

import { ServerState } from "../../../../constants";
import { ResponsiveCard } from "../../../../components/Card";
import SearchIcon from "../../../../assets/images/search.svg";
import {
	InputGroupFormControl as FormControl,
	InputGroupText,
	InputGroup,
} from "../../../../components/Form";
import "./styles.scss";

const Card = styled(ResponsiveCard)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	margin-bottom: 20px;

	& .card-body {
		padding: 30px;
	}

	@media (min-width: 1400px) {
		width: 228px;
		height: 486px;
		margin-bottom: 10px;

		& .card-body {
			padding: 10px;
		}
	}
`;

const EmptyText = styled.span`
	font-size: 0.875rem;
	font-weight: 400;
	color: ${({ theme }) => theme.text1};
`;

const CustomInputGroup = styled(InputGroup)`
	font-size: 0.75rem;

	.input-group-text {
		padding-left: 1.25rem;
		padding-right: 0.625rem;
	}

	& input {
		font-size: 0.75rem !important;
		padding-left: 0;
	}

	& img {
		width: 1rem;
		height: 1rem;
	}
`;

const Text = styled.span`
	color: ${({ theme, variant }) => (variant ? theme[variant] : theme.text1)};
	font-size: 0.75rem;
	font-weight: 400;
	cursor: pointer;
`;

const AutoHeight = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 360px;

	@media (max-width: 1400px) {
		max-height: initial;
	}

	/* width */
	::-webkit-scrollbar {
		width: 3px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		box-shadow: none;
		background-color: transparent;
		border-radius: 10px;
		padding: 0 6px;
		margin: 0 6px;
		border-right: 1px solid ${({ theme }) => theme.text1};
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: ${({ theme }) => theme.text1};
		border-radius: 10px;
		width: 4px !important;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: ${({ theme }) => lighten(0.08, theme.text1)};
	}
`;

const MarketStats = (props) => {
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const { markets, marketsState } = props;
	const history = useHistory();

	const _setSelectedMarket = (marketId) => {
		history.push(`/trade/margin/${marketId}`);
	};

	const changeQueryHandler = useCallback((e) => {
		setQuery(e.target.value);
	}, []);

	const searchedMarkets = useMemo(() => {
		if (!markets) {
			return [];
		}
		return markets.filter((market) => {
			return JSON.stringify(market).indexOf(query) > -1 || query === "";
		});
	}, [markets, query]);

	const columns = [
		{
			dataField: "market",
			text: t("market"),
			formatter: (cellContent, row, rowIndex) => {
				return (
					<Text>
						{row.id}
						<span className="label label-light-primary label-sm label-block ml-3">5x</span>
					</Text>
				);
			},
		},
	];

	const rowEvents = {
		onClick: (e, row) => {
			_setSelectedMarket(row.id);
		},
	};

	const _getMarkets = () => {
		const { markets } = props;

		if (!markets) {
			return null;
		}

		return (
			<AutoHeight>
				<BootstrapTable
					bordered={false}
					classes="table table-head-custom table-borderless table-vertical-center overflow-hidden margin-stats__table"
					bootstrap4
					keyField={"id"}
					remote
					rowEvents={rowEvents}
					data={searchedMarkets === null ? [] : searchedMarkets}
					columns={columns}
				/>
			</AutoHeight>
		);
	};

	if (marketsState === ServerState.NotLoaded) {
		return (
			<Card>
				<div className="w-100 h-100 d-flex align-items-center justify-content-center">
					<Spinner
						animation="border"
						variant="primary"
						id={`margin-markets-${props.isMobile ? "mobile" : "desktop"}`}
					/>
				</div>
			</Card>
		);
	} else if (!markets) {
		return (
			<Card>
				<div className="w-100 h-100 d-flex align-items-center justify-content-center">
					<EmptyText>{t("errors.noMarket")}</EmptyText>
				</div>
			</Card>
		);
	}
	return (
		<Card>
			<CustomInputGroup className={"w-auto"}>
				<InputGroupText>
					<SVG src={SearchIcon} />
				</InputGroupText>
				<FormControl id="PoolsSearch" placeholder={t("search")} onChange={changeQueryHandler} />
			</CustomInputGroup>

			{_getMarkets()}
		</Card>
	);
};

const mapStateToProps = (state) => {
	return {
		marketsState: state.margin.markets.state,
		markets: state.margin.markets.data,
	};
};

export default withRouter(connect(mapStateToProps)(MarketStats));
