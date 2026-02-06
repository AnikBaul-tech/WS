import arcjet, { detectBot, slidingWindow } from "@arcjet/node";

const arcjetKey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE === 'DRY_RUN' ? 'DRY_RUN' : 'LIVE';

if (arcjetKey)
    throw new Error('ARCJET KEY ENV VARIABLE IS MISSING');

export const httpArcjet = arcjetKey ? 
        arcjet({
            key: arcjetKey,
            rules: [
                shield({mode: arcjetMode}),
                detectBot({mode: arcjetMode, allow: ['CATEGORY:SEARCH_ENGINE','CATEGORY:PREVIEW']}),
                slidingWindow({mode: arcjetMode,interval: '10s' , max: 50})
            ]
        }) : null;

export const wsArcjet = arcjetKey ? 
        arcjet({
            key: arcjetKey,
            rules: [
                shield({mode: arcjetMode}),
                detectBot({mode: arcjetMode, allow: ['CATEGORY:SEARCH_ENGINE','CATEGORY:PREVIEW']}),
                slidingWindow({mode: arcjetMode,interval: '5s' , max: 5})
            ]
        }) : null;

export function securityMiddleware(){
    return async(req,res,next)=>{
        if(!httpArcjet) return next();

        try{
            const decision = await httpArcjet.protect(req);

            if(decision.isDenied()){
                if(decision.reason.isRateLimit()){
                    return response.status(429).json({error: "Too many requests"})
                }
            }
            return res.status(403).json({error: "Forbiddedn"})
        }catch(e){
            console.error('Arcjet Middleware error', e);
            return res.status(503).json({error: 'Service Unavailable'})
        }

        next();
    }
}