const mongoose = require("mongoose");
const dns = require("dns");

require("dotenv").config();

const dnsServers = process.env.MONGO_DNS_SERVERS;

if (dnsServers) {
  dns.setServers(dnsServers.split(",").map((server) => server.trim()));
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing from .env");
}

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "thetimeline",
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
