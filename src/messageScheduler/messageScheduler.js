import {DBGet, DBCloseAll} from '@/db/pool-manager.js'
const { inJungliSQLConfig } = require('')


// 於半夜將當天要推送的通知排程推送至dbo.Message資料表
const main = async () => {
    const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
    const messageScheduleDBQuery = await inJungliConnection.query`select * from dbo.MessageSchedule where done is null`
    console.log(messageScheduleDBQuery)

    await DBCloseAll()
}

main()