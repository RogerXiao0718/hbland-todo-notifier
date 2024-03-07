import { inJungliSQLConfig } from '@/db/mssql'
import { DBGet } from '@/db/pool-manager.js'
import verifyToken from '@/utils/verifyToken'
import { NextResponse } from 'next/server'


export async function GET(request) {
    try {
        const decoded_token = await verifyToken(request.cookies.get('jwt_token').value)
        const user_id = decoded_token.username
        const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
        let query_result = await inJungliConnection.query`select * from dbo.MessageSchedule where user_id=${user_id} and done is null order by create_at desc`
        let userScheduleList = query_result['recordset']
        console.log(`GET ${user_id}`)
        console.log(userScheduleList)
        return NextResponse.json({userScheduleList}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status: 400})
    }
}

export async function POST(request) {
    try {
        const {user_id} = await request.json()
        const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
        let query_result = await inJungliConnection.query`select * from dbo.MessageSchedule where user_id=${user_id} and done is null order by create_at desc`
        let userScheduleList = query_result['recordset']
        console.log(`GET ${user_id}`)
        console.log(userScheduleList)
        return NextResponse.json({userScheduleList}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status: 400})
    }
}