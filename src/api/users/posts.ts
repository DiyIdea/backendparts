import express from 'express'
import mysql from '../../modules/mysql'
const router = express.Router()

//특정 user 가 소유하고 있는 게시글 전부 읽기
router.get('/users/:userIdx/posts',async (req,res) => {// 전부 읽기
    const {userIdx} = req.params
    
    const connection = await mysql.connect()
    const selectUsersPostsResult = await connection.run("SELECT title, contents FROM posts WHERE author_idx=?; ",[userIdx])
    res.send(selectUsersPostsResult)
})
//특정 post 읽기
// router.get('/users/:userIdx/posts/:postIdx', async (req,res) => {

// })
export default router