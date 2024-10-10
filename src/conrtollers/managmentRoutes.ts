import express,{Request ,Response} from "express";
import {docker ,startContainers ,stopContainers ,listContainers} from "../core/dockerConfig";

const router = express.Router();

router.post("/",async (req:Request,res:Response)=>{
    let {image ,tag} = req.body;
    
});

export default router;