// const dns = require("dns");

// dns.resolveSrv(
// 	"_mongodb._tcp.cluster0.8cfyeyj.mongodb.net",
// 	(err, addresses) => {
// 		console.log("Error:", err);
// 		console.log("Addresses:", addresses);
// 	},
// );

// ---

// import dns from "dns";

// dns.resolveSrv(
// 	"_mongodb._tcp.cluster0.8cfyeyj.mongodb.net",
// 	(err, addresses) => {
// 		console.log("Error:", err);
// 		console.log("Addresses:", addresses);
// 	},
// );

// ---

import dns from "dns";

dns.resolveSrv("_mongodb._tcp.cluster0.8cfyeyj.mongodb.net", console.log);
