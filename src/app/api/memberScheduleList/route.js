import { inJungliSQLConfig } from '@/db/mssql'
import { DBGet } from '@/db/pool-manager.js'
import { NextResponse } from 'next/server'


export async function POST(request) {
    try {
        const { user_id } = await request.json() 
        console.log('MemberSchedule user_id', user_id)
        const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
        let query_result = await inJungliConnection.query`select * from dbo.MessageSchedule where user_id=${user_id} and done is null order by create_at desc`
        let userScheduleList = query_result['recordset']
        return NextResponse.json({userScheduleList}, {status: 200})
    } catch (error) {
        console.log(error)
        console.error('memberScheduleList API CALL fail')
        return NextResponse.json({error}, {status: 400})
    }
}