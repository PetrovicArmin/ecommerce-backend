import { Request, Response } from "express";

const isCached = (req: Request, res: Response, lastModified: Date) => {
    if (req.headers['if-modified-since'] && (new Date(req.headers['if-modified-since']) >= lastModified)) {
        res.status(304).json({});
        return true;
    }

    res.setHeader('Last-Modified', lastModified.toUTCString());
    return false;
};

export default isCached;