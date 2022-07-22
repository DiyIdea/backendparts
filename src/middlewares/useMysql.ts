import {Request, Response, NextFunction} from 'express'
import mysql from "../modules/mysql"

interface RequestwithConnection extends Request {
    mysqlConnection?: any
}

export const useMysql = async (req: RequestwithConnection, res:Response, next: NextFunction) => {
    const connection = await mysql.connect()
    req.mysqlConnection = connection
    next()
}

