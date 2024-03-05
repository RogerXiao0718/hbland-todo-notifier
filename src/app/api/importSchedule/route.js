import { inJungliSQLConfig } from '@/db/mssql'
import { DBGet } from '@/db/pool-manager.js'
import translateToDBDateTime from '@/utils/translateToDBDateTime.js'
import { NextResponse } from 'next/server'


export async function POST(request) {
    try {
        const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
        const {user_id, scheduleList} = await request.json()
        const create_at = translateToDBDateTime(new Date())
        for (let i = 0; i < scheduleList.length; i++) {
            const schedule = scheduleList[i]
            const { schedule_rule } = schedule
            if (schedule_rule === 'one-time') {
                const {msg_content, onetime_datetime} = schedule
                await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, onetime_datetime) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${onetime_datetime})`
                console.log('Data Inserted')
            } else if (schedule_rule === 'everyday') {
                const {msg_content, everyday_time} = schedule
                await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everyday_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everyday_time})`
                console.log('Data Inserted')
            } else if (schedule_rule === 'everyweek') {
                const { msg_content, everyweek_day, everyweek_time } = schedule
                await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everyweek_day, everyweek_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everyweek_day}, ${everyweek_time})`
                console.log('Data Inserted')
            } else if (schedule_rule === 'everymonth') {
                const { msg_content, everymonth_date, everymonth_time } = schedule
                await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everymonth_date, everymonth_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everymonth_date}, ${everymonth_time})`
                console.log('Data Inserted')
            } else if (schedule_rule === 'everyyear') {
                const {msg_content, everyyear_month, everyyear_date, everyyear_time} = schedule
                await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everyyear_month, everyyear_date, everyyear_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everyyear_month}, ${everyyear_date}, ${everyyear_time})`
                console.log('Data Inserted')
            } 
        }
        // const { schedule_rule, user_id, msg_content, create_at } = req_json
        // console.log(req_json)
        // console.log('Schedule Rule: ', schedule_rule)
        // if (schedule_rule === 'one-time') {
        //     const {onetime_datetime} = req_json
        //     await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, onetime_datetime) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${onetime_datetime})`
        //     console.log('Data Inserted')
        // } else if (schedule_rule === 'everyday') {
        //     const {everyday_time} = req_json
        //     await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everyday_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everyday_time})`
        //     console.log('Data Inserted')
        // } else if (schedule_rule === 'everyweek') {
        //     const { everyweek_day, everyweek_time } = req_json
        //     await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everyweek_day, everyweek_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everyweek_day}, ${everyweek_time})`
        //     console.log('Data Inserted')
        // } else if (schedule_rule === 'everymonth') {
        //     const { everymonth_date, everymonth_time } = req_json
        //     await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everymonth_date, everymonth_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everymonth_date}, ${everymonth_time})`
        //     console.log('Data Inserted')
        // } else if (schedule_rule === 'everyyear') {
        //     const {everyyear_month, everyyear_date, everyyear_time} = req_json
        //     await inJungliConnection.query`insert into dbo.MessageSchedule (user_id, msg_content, schedule_rule, create_at, everyyear_month, everyyear_date, everyyear_time) values (${user_id}, ${msg_content}, ${schedule_rule}, ${create_at}, ${everyyear_month}, ${everyyear_date}, ${everyyear_time})`
        //     console.log('Data Inserted')
        // } 
        return NextResponse.json({}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status: 400})
    }
}