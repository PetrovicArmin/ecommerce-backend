import { NextFunction, Request, RequestHandler, Response } from "express";
import OAuth2Server from "oauth2-server";
import { oauth } from "../oauth/oauthServer.js";

export const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: OAuth2Server.Token = await oauth.authenticate(new OAuth2Server.Request(req), new OAuth2Server.Response(res));
        req.body.token = token;
        next();
    } catch(err) {
        res.status(400).json(err);
    }
}