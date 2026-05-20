import { Helmet } from "react-helmet-async";
import data from "./data";

const MetaDataInsert = ({ title = data.metadata.name }) => {
	let pageTitle =
		title === data.metadata.name
			? `${title} - ${data.metadata.parentCompany.name}`
			: `${title} - ${data.metadata.name}`;

	return (
		<Helmet>
			<title>{pageTitle}</title>
			<meta
				name="description"
				content={`${data.metadata.name} - Learn as i build template.`}
			/>
			<meta
				name="keywords"
				content="coding, website design, freelancing, software development, ai, llm"
			/>
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content="Self made template." />
			<meta
				property="og:image"
				content="https://raw.githubusercontent.com/keithowino/tassia_connect/refs/heads/main/client/public/site_image.png"
			/>
		</Helmet>
	);
};

export default MetaDataInsert;
