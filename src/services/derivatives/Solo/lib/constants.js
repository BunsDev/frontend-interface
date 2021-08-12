import BigNumber from "bignumber.js";

export const SUBTRACT_GAS_LIMIT = 100000;

const ONE_MINUTE_IN_SECONDS = new BigNumber(60);
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60);
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24);
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365);

export const INTEGERS = {
	ONE_MINUTE_IN_SECONDS,
	ONE_HOUR_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	ONE_YEAR_IN_SECONDS,
	ZERO: new BigNumber(0),
	ONE: new BigNumber(1),
	ONES_31: new BigNumber("4294967295"), // 2**32-1
	ONES_127: new BigNumber("340282366920938463463374607431768211455"), // 2**128-1
	ONES_255: new BigNumber("115792089237316195423570985008687907853269984665640564039457584007913129639935"), // 2**256-1
	INTEREST_RATE_BASE: new BigNumber("1e18"),
};

export const ADDRESSES = {
	ZERO: "0x0000000000000000000000000000000000000000",
	TEST: [
		"0x06012c8cf97bead5deae237070f9587f8e7a266d",
		"0x22012c8cf97bead5deae237070f9587f8e7a266d",
		"0x33012c8cf97bead5deae237070f9587f8e7a266d",
		"0x44012c8cf97bead5deae237070f9587f8e7a266d",
		"0x55012c8cf97bead5deae237070f9587f8e7a266d",
		"0x66012c8cf97bead5deae237070f9587f8e7a266d",
		"0x77012c8cf97bead5deae237070f9587f8e7a266d",
		"0x88012c8cf97bead5deae237070f9587f8e7a266d",
		"0x99012c8cf97bead5deae237070f9587f8e7a266d",
		"0xaa012c8cf97bead5deae237070f9587f8e7a266d",
	],
	TEST_SAI_PRICE_ORACLE: "0x1928347120834128940721983472825823453223",
};
