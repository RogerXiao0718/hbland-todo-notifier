'use client'
import { useEffect, useState } from 'react'
import styles from '@/components/ScheduleListComponent.module.css'
import ScheduleListItem from '@/components/ScheduleListItem'

export default function ScheduleListComponent({ scheduleList }) {

    const tabSelections = ['all', 'everyday', 'everyweek','everymonth', 'everyyear', 'one-time']
    const tabNames = ['全部', '每日', '每周', '每月', '每年', '單次']
    const [currentTab, setCurrentTab] = useState(tabSelections[0])
    const [displayedScheduleList, setDisplayedScheduleList] = useState(scheduleList)

    useEffect( () => {
        if (currentTab === 'all') {
            setDisplayedScheduleList(scheduleList)
        } else {
            setDisplayedScheduleList(scheduleList.filter(schedule => {
                return schedule.schedule_rule === currentTab
            }))
        }
    }, [scheduleList])

    const onTabSelectionClickedGenerator = (tabSelection) => {
        return (event) => {
            setCurrentTab(tabSelection)
            if (tabSelection === 'all') {
                setDisplayedScheduleList(scheduleList)
            } else {
                setDisplayedScheduleList(scheduleList.filter(schedule => {
                    return schedule.schedule_rule === tabSelection
                }))
            }
        }
    }

    return (
        <>
            <div className={`${styles['schedule-list']}`}>
            <div className={`${styles['tab-selection-container']}`}>
                {tabSelections.map( (tabSelection, i) => {
                    return <button key={i} className={`${styles['tab-selection-btn']} ${currentTab === tabSelection ? styles['selected-tab-btn'] : ''}`} onClick={onTabSelectionClickedGenerator(tabSelection)}>
                        {tabNames[i]}
                    </button>
                })}
            </div>
                {
                    displayedScheduleList && displayedScheduleList.map((schedule) => {
                        return <ScheduleListItem key={schedule.sn} schedule={schedule} />
                    })
                }
            </div>
        </>

    )
}