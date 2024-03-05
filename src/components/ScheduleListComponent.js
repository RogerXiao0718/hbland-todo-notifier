'use client'
import styles from '@/components/ScheduleListComponent.module.css'
import ScheduleListItem from '@/components/ScheduleListItem'

export default function ScheduleListComponent({scheduleList}) {
    return (
        <div className={`${styles['schedule-list']}`}>
            {
                scheduleList.map((schedule) => {
                    return <ScheduleListItem key={schedule.sn} schedule={schedule} />
                })
            }
        </div>
    )
}