import { useTranslation } from "react-i18next";
import Page from "../../components/Page";
// import Currencies from "../Home/Currencies";

export const Favorites = () => {
	const { t } = useTranslation();

	return (
		<Page title={t("favorites")}>
			<h4>Coming Soon!</h4>
			<p>Have a look at these Featured Assets in the meantime.</p>

			{/* <Currencies /> */}
		</Page>
	);
};
