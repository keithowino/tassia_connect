import React from "react";
import MetaDataInsert from "../lib/MetaDataInsert";
import data from "../lib/data";

const Home = () => {
	return (
		<>
			<MetaDataInsert title={data.metadata.name} />
			<section className="home flex flex-col justify-center w-screen h-screen">
				<div className="flex flex-col items-center">
					<h1 className="text-2xl italic font-bold items-center">
						{data.metadata.name}
					</h1>
					<p>Comming soon... </p>
				</div>
			</section>
		</>
	);
};

export default Home;
