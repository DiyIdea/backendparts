import express from 'express'
import mysql from '../../modules/mysql'

import {Request, Response, NextFunction} from 'express'
interface RequestWithConnection extends Request {
    mysqlConnection: any
}

const router = express.Router()

//특정 user 가 소유하고 있는 게시글 전부 읽기
router.get('/users/:userIdx/posts',async (request: Request, response:Response) => {
    const req = request as RequestWithConnection
    const res = response

    const {userIdx} = request.params

    const connection = await req.mysqlConnection
    const selectUsersPostsResult: {title:string, contents: string, id: string}[] = await connection.run(`
        SELECT title, contents, u.id 
        FROM posts AS p 
        INNER JOIN users AS u 
        ON p.author_idx = u.idx 
        WHERE p.author_idx=4;
    `,[userIdx])
    
    const responseBodyData = selectUsersPostsResult.map((data) => {
            const { title, contents, id:userId} = data
            return {title, contents, userId}
    })
    res.send(responseBodyData)
})

// 특정유저의 게시글 추가
router.post("/users/:userIdx/posts", async (request: Request, response:Response) => {
    const req = request as RequestWithConnection
    const res = response

    const {userIdx} = req.params
    const {title, contents} = req.body
    const connection = await req.mysqlConnection
    //  만약 게시자가 users 목록에 없으면: error를 내보내라.
    const countUserResult = await connection.run('SELECT COUNT(*) AS count FROM users WHERE idx=?;', [userIdx])
    if(countUserResult[0].count !== 1) {
        throw new Error('해당되는 idx의 유저가 존재하지 않습니다.')

    }
    await connection.run ("INSERT INTO posts (title, contents, author_idx) VALUES (?,?,?)", [title, contents, userIdx])
    res.send({
        success: true
    })
})

//PUT 특정 유저의 게시글에서 특징 idx의 게시글 수정

router.put('/users/:userIdx/posts/:postIdx', async (request: Request, response:Response) => {
    const req = request as RequestWithConnection
    const res = response

    const {userIdx, postIdx } = req.params
    const { contents, title } = req.body
    const connection = req.mysqlConnection

    try {
        const countUsersPost = await connection.run('SELECT COUNT(*) AS count FROM posts WHERE author_idx = ? AND idx = ?',[userIdx, postIdx])
        if(countUsersPost[0].count !==1) {
            throw new Error('해당 포스터는 존재하지 않습니다.')
        }

        await connection.run(`UPDATE posts SET title=? , contents =? WHERE idx =?`, [title, contents, postIdx])
        res.send({
            success:true
        })
    } catch (e) {
        res.send({
            success: false,
            errorMessage: `${e}`
        })
    }
})

//DELETE 특정 유저의 게시글에서 특정 idx의 게시글 삭제
router.delete('/users/:userIdx/posts/:postIdx', async (request: Request, response:Response) => {
    const req = request as RequestWithConnection
    const res = response

    const {userIdx, postIdx } = req.params
    const connection = req.mysqlConnection

    try {
        const countUsers = await connection.run('SELECT COUNT(*) AS count FROM users WHERE idx = ?',[userIdx])
        if(countUsers[0].count !==1) {
            throw new Error('해당 사용자는 존재하지 않습니다.')
        }
        const countUsersPost = await connection.run('SELECT COUNT(*) AS count FROM posts WHERE idx = ?',[userIdx, postIdx])
        if(countUsersPost[0].count !==1) {
            throw new Error('해당 포스터는 존재하지 않습니다.')
        }

        await connection.run(`DELETE FROM POSTS WHERE idx =?`, [postIdx])
        res.send({
            success:true
        })
    } catch (e) {
        res.send({
            success: false,
            errorMessage: `${e}`
        })
    }
})


export default router