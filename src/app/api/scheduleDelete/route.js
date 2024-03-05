import { inJungliSQLConfig } from '@/db/mssql'
import { DBGet } from '@/db/pool-manager.js'

import { NextResponse } from 'next/server'


export async function DELETE(request) {
    try {
        const inJungliConnection = await DBGet('inJungli', inJungliSQLConfig)
        
        const {sn} = await request.json()
        console.log(`Call Delete: delete sn ${sn}`)
        await inJungliConnection.query`delete from dbo.MessageSchedule where sn=${sn}`
        console.log('Delete Operation Success')
        return NextResponse.json({}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status: 400})
    }
}