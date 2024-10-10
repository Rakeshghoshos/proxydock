import express from "express";
import http from "http";
import cors from "cors";
import router from "./conrtollers/managmentRoutes";

const managementServer = express();

managementServer.use(express.json({ limit: '100mb' }));
managementServer.use(express.urlencoded({ extended: false }));
managementServer.use(cors());
managementServer.use("/",router);


const proxyServerApp = express();
const proxyServer = http.createServer(proxyServerApp);

managementServer.listen(8080,()=>{
    console.log("management server is running on port : 8080");
});