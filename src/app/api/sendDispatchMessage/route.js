import { NextResponse } from "next/server"
import { DBGet } from '@/db/pool-manager.js'
import { inJungliSQLConfig, tdocSQLConfig } from "@/db/mssql"
import translateToDBDateTime from "@/utils/translateToDBDateTime.js"

export async function POST(request) {
    try {
        const { dispatch_user } = await request.json()
        const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
        const tdocConnection = await DBGet('tdoc', tdocSQLConfig)
        // 取得使用者的AP_PCIP
        const tdocIPQuery = await tdocConnection.query`select AP_PCIP from tdoc.AP_USER where DocUserID=${dispatch_user} and ap_off_job='N'`
        console.log('tdocIPQuery', tdocIPQuery)
        if (tdocIPQuery.recordset) {
            let tdocUserIP = tdocIPQuery.recordset[0].AP_PCIP
            const sender = 'HBADMIN'
            const sendIP = '220.1.35.78'
            const message_xname = '待辦事項委派通知'
            const msg_content = '主管人員委派新待辦事項，可登入待辦事項主動通知系統(220.1.35.78:9080)查看。'
            const sendtype = 1
            const xtime = 1
            const intertime = 15
            const timetype = 0
            const message_done = 0
            const createunit = 5
            const creator = 'HBADMIN'
            const xkey = Math.random() * 30000
            const presn = 0
            const sendCname = '待辦事項主動通知系統'
            const pctype = 'WinServer'
            let enddate = translateToDBDateTime(new Date())
            enddate.setTime(enddate.getTime() + (2 * 24 * 60 * 60 * 1000))
            await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${dispatch_user}, ${message_xname}, ${msg_content}, ${sendtype}, ${sendIP}, ${tdocUserIP}, ${xtime}, ${intertime}, ${timetype}, ${translateToDBDateTime(new Date())}, ${message_done}, ${translateToDBDateTime(new Date())}, ${createunit}, ${creator}, ${translateToDBDateTime(new Date())}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
            console.log('Send dispatch notify to department member')
        }
        return NextResponse.json({}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status: 400})
    }
} 