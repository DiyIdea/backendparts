import express from 'express'
import mysql from '../../modules/mysql'
const router = express.Router()

type filedataType = {
    id : string,
    password : string,
    name : string,
    age : number
}[]
//users: 집합(컬렉션)
// /users/2/name <=예시

//특정 user 가 소유하고 있는 게시글 전부 읽기
router.get('/users/:userIdx/posts',async (req,res) => {// 전부 읽기
    const {userIdx} = req.params
    const connection = await mysql.connect()
    const selectUsersPostsResult = await connection.run("SELECT * FROM users;",[userIdx])
    res.send(selectUsersPostsResult)
})



export default router