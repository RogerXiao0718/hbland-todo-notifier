import { inJungliSQLConfig, tdocSQLConfig } from '@/db/mssql'
import {DBGet} from '@/db/pool-manager.js'
import verifyToken from '@/utils/verifyToken'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const decoded_token = await verifyToken(request.cookies.get('jwt_token').value)
        const user_id = decoded_token.username
        const tdocConnection = await DBGet('tdoc', tdocSQLConfig)
        const apUnitIDQuery = await tdocConnection.query`select AP_UNIT_ID from tdoc.AP_USER where DocUserID=${user_id}`
        console.log('user_id', user_id)
        console.log('apUnitIDQuery', apUnitIDQuery)
        const apUnitID = apUnitIDQuery.recordset[0].AP_UNIT_ID
        console.log('AP Unit ID: ', apUnitID)
        const apDepartmentMemberQuery = await tdocConnection.query`select DocUserId from tdoc.AP_USER where AP_UNIT_ID=${apUnitID} and ap_off_job='N'`
        let departmentMember = apDepartmentMemberQuery.recordset
        departmentMember = departmentMember.map( m => m.DocUserId)
        departmentMember = departmentMember.filter( member_id => member_id !== user_id)
        console.log('Department Member: ', departmentMember)

        return NextResponse.json({departmentMember}, {status: 200})
    } catch (err) {
        console.log(err)
        return NextResponse.json({err}, {status: 400})
    }
}