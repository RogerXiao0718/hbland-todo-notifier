import {ad, authADUser} from '@/utils/loginAD.js'
import {docSQLConfig} from '@/db/mssql'
import {DBGet} from '@/db/pool-manager.js'
import { NextResponse } from 'next/server'
import createToken from '@/utils/createToken.js'

export async function POST(request) {
    try {
        let {username, password } = await request.json()
        // console.log(username, password)
        const auth_result = await authADUser(username, password)
        // const docConnection = await DBGet('doc', docSQLConfig)
        // const docQueryResult = await docConnection.query`select * from doc.doc_user where 1=1 and user_id=${username}`
        // console.log(docQueryResult)
        const res = NextResponse.json({
            auth_result
        }, {status: 200})
        if (auth_result) {
            
            const jwt_token = await createToken({username})
            const maxAge = 3 * 60 * 60 // 3 hr
            console.log(`jwt token: ${jwt_token}`)
            res.cookies.set({
                name: 'jwt_token',
                value: jwt_token,
                maxAge: maxAge,
                httpOnly: true,
                sameSite: 'strict'
            })
        }
        
        return res
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            auth_result: false
        }, {status: 403})
    }
}