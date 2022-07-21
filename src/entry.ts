import express from 'express'
import cors from "cors"
import usersRouter from "./api/users"
import usersPostRouter from "./api/users/posts"

import {useMysql} from './middlewares/useMysql'

const app = express()
const PORT = 3714

//미들웨어란? static, urlencoded, json, cors, usemysql 같은 app.use안에 있는 것.
//미들웨어 설명은 5_23 강의 1:43:40 부터 간단한 설명.
app.use(express.static('public')) // 이미지 로드 등 public 에 있는 문서를 로드하여줌
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use(useMysql)

app.use('/v1',usersRouter)
app.use('/v1',usersPostRouter)
//end point 등록 방법 ::
// 1. app.get 직접 등록
// 2. router 모듈을 사용한 등록 => 지금 router 등록 방식

app.listen(PORT, () =>
    console.log(`example app listening at http://localhost:${PORT}`)
)

