import { Helmet } from "react-helmet-async";
import data from "./data";

const MetaDataInsert = ({
	title,
	description,
	image,
	keywords,
	type = "website",
	url,
}) => {
	const { metadata, social } = data;

	// Determine page title
	let pageTitle;
	if (!title || title === metadata.name) {
		pageTitle = `${metadata.name} - ${metadata.slug}`;
	} else {
		pageTitle = `${title} - ${metadata.name}`;
	}

	const metaDescription = description || metadata.description;
	const metaImage = image || metadata.image;
	const metaKeywords = keywords || metadata.keywords;
	const pageUrl =
		url ||
		(typeof window !== "undefined"
			? window.location.href
			: metadata.liveLink);

	return (
		<Helmet>
			{/* Basic Metadata */}
			<title>{pageTitle}</title>
			<meta name="description" content={metaDescription} />
			<meta name="keywords" content={metaKeywords} />
			<meta name="author" content={metadata.author} />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0"
			/>

			{/* Open Graph / Facebook */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={metaDescription} />
			<meta property="og:image" content={metaImage} />
			<meta property="og:url" content={pageUrl} />
			<meta property="og:site_name" content={metadata.name} />
			<meta property="og:locale" content="en_KE" />

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={metaDescription} />
			<meta name="twitter:image" content={metaImage} />
			<meta name="twitter:site" content={social.twitter} />
			<meta name="twitter:creator" content={social.twitter} />

			{/* Additional SEO */}
			<link rel="canonical" href={pageUrl} />
			<meta name="robots" content="index, follow" />
			<meta name="theme-color" content="#f97316" />
		</Helmet>
	);
};

export default MetaDataInsert;
