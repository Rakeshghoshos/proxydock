import { Response } from "express"
interface resp{
    message : string,
    data? : any,
    res :Response
}

export const success = ({message,data,res}:resp)=>{
    return res.status(200).json({
        "message":message,
        "data":data
    });
}

export const error = ({message,res}:resp)=>{
    return res.status(500).json({
        "message":message,
    });
}

export const notFound = ({message,res}:resp)=>{
    return res.status(400).json({
        "message":message,

    });
}