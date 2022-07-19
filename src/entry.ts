import express from 'express'
import cors from "cors"
import usersRouter from "./api/users"

const app = express()
const PORT = 3714


app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use('/v1',usersRouter)
//end point 등록 방법 ::
// 1. app.get 직접 등록
// 2. router 모듈을 사용한 등록 => 지금 router 등록 방식

app.listen(PORT, () =>
    console.log('example app listening at http://localhost:3714')
)

