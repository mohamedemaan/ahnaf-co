const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.cluster0.mkuj53g.mongodb.net", (err, records) => {
  if (err) {
    console.log("ERROR:", err);
  } else {
    console.log(records);
  }
});