import {isSpoofedBot} from "@arcjet/inspect";
import {aj} from "../lib/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
    try{
        const decision = await aj.protect(req, { requested: 1 });

        if(decision.isDenied()){
           if(decision.reason.isRateLimit()){
            return res.status(429).send({message: "Rate limit exceeded. Please try again later."});
           }else if(decision.reason.isBot()){
            return res.status(403).send({message: "Bot access denied"});
           }else{
            return res.status(403).send({message: "Access denied by security policy"});
           }
        }

        if(decision.results.some(isSpoofedBot)){
            return res.status(403).send({error: "Spoofed bot detected", message: "Malicious activity detected. Please try again later."});
        }
        next();
    }catch(error){
        console.error("Arcjet middleware error:", error);
        next();
    }
}