import express from 'express'
import mysql from '../modules/mysql'
const Router = express.Router()

type filedataType = {
    id : string,
    password : string,
    name : string,
    age : number
}[]
//users: 집합(컬렉션)
// /users/2/name <=예시


Router.get('/users',async (req,res) => {// 전부 읽기
    const connection = await mysql.connect()
    const selectdata = await connection.run("SELECT * FROM users;",[])
    res.send(selectdata)
})

Router.get('/users/:userIdx',async(req,res) => {// 특정유저 읽기
    const {userIdx} = req.params
    const connection = await mysql.connect()
    const [selectUserResult] = await connection.run("SELECT * FROM users WHERE idx = ?;", [userIdx])
    res.send(selectUserResult)
})

//post user: body parameter 입력(id,password,name, age)를 받아서data.json에 가장 마지막 index에 추가하기.
//Post/ user : users에 한 개체를 추가함.
Router.post('/', async(req,res) => {//쓰기
    const connection = await mysql.connect()
    await connection.run("INSERT INTO users (id, password, name, age) VALUES (?,?,?,?);", [])
    res.send({
        success: true
    })
})

//put user: body parameter 입력(index, id, password, name, age)을 받아서 해당 index의
//PUT v1/users/:usersIdx 컬렉션에 있는  usersIdx번 정보를 덮어쓰기 하겠다.(한 개체를 수정한다)
Router.put('/user/:userIdx', async(req,res) => {
    const {userIdx} = req.params
    const { id, password, name, age} = req.body
    const connection = await mysql.connect()
    await connection.run("UPDATE users SET id = ?, password = ?, name = ?, age = ? WHERE idx = ?;",[id, password, name, age, userIdx])
    res.send({
        success: true
    })
})

// DELETE /user: body parameter 입력(index)을 받아서 해당 index의 data 제거하기.
Router.delete('/users/:userIdx', async(req,res) => {
    const {userIdx} = req.params
    const connection = await mysql.connect()
    await connection.run(`DELETE FROM users WHERE idx = ?;`,[userIdx])
    res.send({
        success: true
    })
})

export default Router