import express,{Request ,Response} from "express";
import {docker ,startContainers ,stopContainers ,listContainers ,listImages} from "../core/dockerConfig";
import {success ,error ,notFound} from "../utilities/response";

const router = express.Router();

router.post("/listContainers",async (req:Request,res:Response):Promise<any>=>{
    try{
        const containers = await listContainers();
    if(!containers){
        return success({message:"no container found",data:0,res});
    }
    return success({message:"no container found",data:containers,res});
    }catch(err){
        console.log(err);
        return error({"message":err as string,res});
    }
});

router.post("/startContainer",async (req:Request,res:Response):Promise<any>=>{
    try{
        const { containerId } = req.body;
        const containers = await startContainers([containerId]);
    if(containers == 1){
        return success({message:"container started",data:1,res});
    }
    return success({message:"not started",data:0,res});
    }catch(err){
        console.log(err);
        return error({"message":err as string,res});
    }
});

router.post("/stopContainer",async (req:Request,res:Response):Promise<any>=>{
    try{
        const { containerId } = req.body;
        const containers = await stopContainers([containerId]);
    if(containers == 1){
        return success({message:"container stoped",data:1,res});
    }
    return success({message:"not stoped",data:0,res});
    }catch(err){
        console.log(err);
        return error({"message":err as string,res});
    }
});

router.post("/listImages",async (req:Request,res:Response):Promise<any>=>{
    try{
        const images = await listImages();
    if(!images){
        return success({message:"no container found",data:0,res});
    }
    return success({message:"no container found",data:images,res});
    }catch(err){
        console.log(err);
        return error({"message":err as string,res});
    }
});

export default router;