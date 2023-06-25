import {Request, Response, NextFunction, RequestHandler} from 'express';

export const readProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({'parameter': 'value'});
};

