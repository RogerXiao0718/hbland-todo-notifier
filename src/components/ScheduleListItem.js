'use client'
import styles from '@/components/ScheduleListItem.module.css'
import getScheduleRuleText from '@/utils/getScheduleRuleText'
import {useContext} from 'react'
import { PostTimestampContext } from '@/context/PostTimestampProvider' 

export default function ScheduleListItem({schedule}) {

    const {setPostTimestamp} = useContext(PostTimestampContext)

    const renderScheduleDetail = (schedule) => {
        if (schedule.schedule_rule === 'one-time') {
            const {onetime_datetime} = schedule
            let [datetime_date, datetime_time] = onetime_datetime.split('T')
            datetime_time = datetime_time.split(':')
            datetime_time = `${datetime_time[0]}點${datetime_time[1]}分`
            return <>
            <span>{`${datetime_date} ${datetime_time}`}</span>
            </>
        } else if (schedule.schedule_rule === 'everyday') {
            const {everyday_time} = schedule
            let datetime_time = everyday_time.split('T')[1]
            datetime_time = datetime_time.split(':')
            return <>
                {`${datetime_time[0]}點${datetime_time[1]}分`}
            </>
        } else if (schedule.schedule_rule === 'everyweek') {
            let weekDisplayOptions = ['日', '一', '二', '三', '四', '五', '六']
            let {everyweek_time} = schedule
            everyweek_time = everyweek_time.split('T')[1].split(':')
            everyweek_time = `${everyweek_time[0]}點${everyweek_time[1]}分`

            return <>
                {`每周${weekDisplayOptions[schedule.everyweek_day]} ${everyweek_time}`}
            </>
        } else if (schedule.schedule_rule === 'everymonth') {
            let {everymonth_date, everymonth_time} = schedule
            everymonth_time = everymonth_time.split('T')[1].split(':')
            everymonth_time = `${everymonth_time[0]}點${everymonth_time[1]}分`
            return <>
                {`每月${everymonth_date}日${everymonth_time}`}
            </>
        } else if (schedule.schedule_rule === 'everyyear') {
            let {everyyear_month, everyyear_date, everyyear_time} = schedule
            everyyear_time = everyyear_time.split('T')[1].split(':')
            everyyear_time = `${everyyear_time[0]}點${everyyear_time[1]}分`
            return <>
            {`每年${everyyear_month}月${everyyear_date}日${everyyear_time}`}
            </>
        }
    }

    const onDeleteButtonClick = (event) => {
        fetch('/api/scheduleDelete', {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({sn: schedule.sn})
        }).then(() => {
            setPostTimestamp(new Date())
        }).catch( err => {
            console.log(err)
        })
    }

    return (
        <div className={`${styles['schedule-list-item']}`}>
            <div className={`${styles['schedule-rule-text']}`}>
                <span>{getScheduleRuleText(schedule.schedule_rule)}</span>
                {renderScheduleDetail(schedule)}
            </div>
            <div className={`${styles['schedule-msg-content']}`}>
                {schedule.msg_content}
            </div>
            <div className={`${styles['schedule-rule-edit-section']}`}>
                <button className={`${styles['schedule-rule-delete-btn']}`} onClick={onDeleteButtonClick}>刪除</button>
            </div>
        </div>
    )
}