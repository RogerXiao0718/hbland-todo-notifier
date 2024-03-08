const { DBGet, DBCloseAll } = require('./src/db/pool-manager.js')
const { tdocSQLConfig, inJungliSQLConfig } = require('./src/db/mssql')
const translateToDBDateTime = require('./src/utils/translateToDBDateTime')
const checkManagerID = require('./src/utils/checkManagerID')
const checkIsManager = require('./src/utils/checkIsManager')
const checkUserIP = require('./src/utils/checkUserIP')
require('dotenv').config()

const convertDateTimeToString = (date_obj) => {
    let currentDateSec = date_obj.toISOString().split('T')[0].split('-')
    let currentDateStr = `${currentDateSec[0]}-${currentDateSec[1]}-${currentDateSec[2]}`
    return currentDateStr
}

const useManagerCallback = (process.env.USE_MANAGER_CALLBACK === 'Y')

// note 從DB讀取到的DateTime物件在呼叫get方法會自動 +8 Hours
// 於半夜將當天要推送的通知排程推送至dbo.Message資料表
const main = async () => {
    let currentDateTime = translateToDBDateTime(new Date())
    let currentDateStr = convertDateTimeToString(currentDateTime)
    const sender = 'HBADMIN'
    const sendIP = '220.1.35.78'
    const message_xname = '待辦事項通知'
    const sendtype = 1
    const xtime = 1
    const intertime = 15
    const timetype = 0
    const message_done = 0
    const createunit = 5
    const creator = 'HBADMIN'
    const presn = 0
    const sendCname = '待辦事項主動通知系統'
    const pctype = 'WinServer'
    let enddate = translateToDBDateTime(new Date())
    enddate.setTime(enddate.getTime() + (2 * 24 * 60 * 60 * 1000))
    const tdocConnection = await DBGet('tdoc', tdocSQLConfig)
    const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
    // let messageScheduleDBQuery = await inJungliConnection.query`select * from dbo.MessageSchedule where done is null`
    //測試
    let messageScheduleDBQuery = await inJungliConnection.query`select * from dbo.MessageSchedule where done is null and user_id`
    messageScheduleDBQuery = messageScheduleDBQuery.recordset
    for (let i = 0; i < messageScheduleDBQuery.length; i++) {
        const schedule = messageScheduleDBQuery[i]
        const { sn, user_id, msg_content, schedule_rule } = schedule
        const xkey = Math.random() * 30000

        // 將schedule內容插入到dbo.Message內
        //取得user ip sql:  "select AP_PCIP from tdoc.AP_USER where DocUserID='" & Session("loginuser") & "' and ap_off_job='N' "
        let tdocDBQuery = await tdocConnection.query`select AP_USER_NAME, AP_PCIP from tdoc.AP_USER where DocUserID=${user_id} and ap_off_job=${'N'}`
        if (tdocDBQuery.recordset) {
            let user_ip = tdocDBQuery.recordset[0].AP_PCIP
            let user_name = tdocDBQuery.recordset[0].AP_USER_NAME
            if (schedule_rule === 'one-time') {
                const { onetime_datetime } = schedule
                const onetime_datetime_str = convertDateTimeToString(onetime_datetime)

                if (onetime_datetime_str === currentDateStr) {
                    try {
                        await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${user_id}, ${message_xname}, ${msg_content}, ${sendtype}, ${sendIP}, ${user_ip}, ${xtime}, ${intertime}, ${timetype}, ${onetime_datetime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                        await inJungliConnection.query`update dbo.MessageSchedule set done='1', last_timestamp=${translateToDBDateTime(new Date())} where sn=${sn}`
                        // manager callback--------------
                        const isManager = await checkIsManager(user_id)
                        if (!isManager && useManagerCallback) {
                            const manager_id = await checkManagerID(user_id)
                            const manager_ip = await checkUserIP(manager_id)
                            const manager_msg = `已發送通知給${user_name}: ${msg_content}`
                            console.log(manager_msg)
                            await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${manager_id}, ${message_xname}, ${manager_msg}, ${sendtype}, ${sendIP}, ${manager_ip}, ${xtime}, ${intertime}, ${timetype}, ${onetime_datetime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                        }
                        // -----manager callback
                        console.log(user_id, 'Push Message to dbo.Message Success!!!')
                    } catch (err) {
                        console.log(err)
                    }
                }
                // 確認onetime_datetime為屬於當日排程
            } else if (schedule_rule === 'everyday') {
                try {
                    const { everyday_time } = schedule
                    const everyday_time_timesec = everyday_time.toISOString().split('T')[1].split(':')
                    const timeString = `${everyday_time_timesec[0]}:${everyday_time_timesec[1]}:00`
                    const messageDateTimeString = `${currentDateStr} ${timeString}`
                    const messageDateTime = translateToDBDateTime(new Date(messageDateTimeString))
                    await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${user_id}, ${message_xname}, ${msg_content}, ${sendtype}, ${sendIP}, ${user_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                    await inJungliConnection.query`update dbo.MessageSchedule set  last_timestamp=${translateToDBDateTime(new Date())} where sn=${sn}`
                    // const isManager = await checkIsManager(user_id)
                    // console.log('everyday member is manager', isManager)
                    // if (!isManager && useManagerCallback) {
                    //     const manager_id = await checkManagerID(user_id)
                    //     const manager_ip = await checkUserIP(manager_id)
                    //     const manager_msg = `已發送通知給${user_name}: ${msg_content}`
                    //     console.log(manager_msg)
                    //     await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${manager_id}, ${message_xname}, ${manager_msg}, ${sendtype}, ${sendIP}, ${manager_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                    // }
                    console.log(user_id, 'Push everyday Message to dbo.Message Success!!!')
                } catch (err) {
                    console.log(err)
                }
            } else if (schedule_rule === 'everyweek') {
                try {
                    const { everyweek_day, everyweek_time } = schedule
                    const current_day = (new Date()).getDay()

                    if (current_day == everyweek_day) {
                        const everyweek_time_timesec = everyweek_time.toISOString().split('T')[1].split(':')
                        const timeString = `${everyweek_time_timesec[0]}:${everyweek_time_timesec[1]}:00`
                        const messageDateTimeString = `${currentDateStr} ${timeString}`
                        const messageDateTime = translateToDBDateTime(new Date(messageDateTimeString))
                        await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${user_id}, ${message_xname}, ${msg_content}, ${sendtype}, ${sendIP}, ${user_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                        await inJungliConnection.query`update dbo.MessageSchedule set  last_timestamp=${translateToDBDateTime(new Date())} where sn=${sn}`
                        const isManager = await checkIsManager(user_id)
                        if (!isManager && useManagerCallback) {
                            const manager_id = await checkManagerID(user_id)
                            const manager_ip = await checkUserIP(manager_id)
                            const manager_msg = `已發送通知給${user_name}: ${msg_content}`
                            await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${manager_id}, ${message_xname}, ${manager_msg}, ${sendtype}, ${sendIP}, ${manager_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                            console.log(manager_msg)
                        }
                        console.log(user_id, 'Push everyweek Message to dbo.Message Success!!!')
                    }
                } catch (err) {
                    console.log(err)
                }
            } else if (schedule_rule === 'everymonth') {
                try {
                    const { everymonth_date, everymonth_time } = schedule
                    const everymonth_currentDate = (new Date()).getDate()

                    if (everymonth_date === everymonth_currentDate) {
                        const everymonth_time_timesec = everymonth_time.toISOString().split('T')[1].split(':')
                        const timeString = `${everymonth_time_timesec[0]}:${everymonth_time_timesec[1]}:00`
                        const messageDateTimeString = `${currentDateStr} ${timeString}`
                        const messageDateTime = translateToDBDateTime(new Date(messageDateTimeString))
                        await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${user_id}, ${message_xname}, ${msg_content}, ${sendtype}, ${sendIP}, ${user_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                        await inJungliConnection.query`update dbo.MessageSchedule set  last_timestamp=${translateToDBDateTime(new Date())} where sn=${sn}`
                        const isManager = await checkIsManager(user_id)
                        if (!isManager && useManagerCallback) {
                            const manager_id = await checkManagerID(user_id)
                            const manager_ip = await checkUserIP(manager_id)
                            const manager_msg = `已發送通知給${user_name}: ${msg_content}`
                            await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${manager_id}, ${message_xname}, ${manager_msg}, ${sendtype}, ${sendIP}, ${manager_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                            console.log(manager_msg)
                        }
                        console.log(user_id, 'Push everymonth Message to dbo.Message Success!!!')
                    }
                } catch (err) {
                    console.log(err)
                }
            } else if (schedule_rule === 'everyyear') {
                try {
                    const { everyyear_month, everyyear_date, everyyear_time } = schedule
                    const everyyear_currentDateTime = new Date()
                    const currentMonth = everyyear_currentDateTime.getMonth() + 1
                    const currentDate = everyyear_currentDateTime.getDate()
                    if (everyyear_month === currentMonth && everyyear_date === currentDate) {
                        const everyyear_time_timesec = everyyear_time.toISOString().split('T')[1].split(':')
                        const timeString = `${everyyear_time_timesec[0]}:${everyyear_time_timesec[1]}:00`
                        const messageDateTimeString = `${currentDateStr} ${timeString}`
                        const messageDateTime = translateToDBDateTime(new Date(messageDateTimeString))
                        await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${user_id}, ${message_xname}, ${msg_content}, ${sendtype}, ${sendIP}, ${user_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                        await inJungliConnection.query`update dbo.MessageSchedule set  last_timestamp=${translateToDBDateTime(new Date())} where sn=${sn}`
                        const isManager = await checkIsManager(user_id)
                        if (!isManager && useManagerCallback) {
                            const manager_id = await checkManagerID(user_id)
                            const manager_ip = await checkUserIP(manager_id)
                            const manager_msg = `已發送通知給${user_name}: ${msg_content}`
                            await inJungliConnection.query`insert into dbo.Message (sender, receiver, xname, xcontent, sendtype, sendIP, recIP, xtime, intertime, timetype, sendtime, done, createdate, createunit, creator, modifydate, modunit, modifier, xkey, presn, sendCname, pctype, enddate) values (${sender}, ${manager_id}, ${message_xname}, ${manager_msg}, ${sendtype}, ${sendIP}, ${manager_ip}, ${xtime}, ${intertime}, ${timetype}, ${messageDateTime}, ${message_done}, ${currentDateTime}, ${createunit}, ${creator}, ${currentDateTime}, ${createunit}, ${creator}, ${xkey}, ${presn}, ${sendCname}, ${pctype}, ${enddate})`
                            console.log(manager_msg)
                        }
                        console.log(user_id, 'Push everyyear Message to dbo.Message Success!!!')
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }

    }
    await DBCloseAll()
}

main()