import mysql, {Connection} from "mysql2/promise"
import dotenv from 'dotenv'
dotenv.config()

const DB_URL = `mysql://${process.env.MYSQL_ID}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DB}?ssl={"rejectUnauthorized":true}`

interface customConnection extends Connection{
    run? : Function
}

interface connectionWithRunFunction extends Connection {
    run : Function
}


const connect = async () => {
    const connection: customConnection =  await mysql.createConnection(DB_URL)

    const run = async (sqlQuery: string, params: any[] = []) => {
        const [rows,field] = await connection.execute(sqlQuery, params)
        console.log(rows)
        return rows
    }

    connection.run = run
    return connection as connectionWithRunFunction
    }

export default {
    connect
}