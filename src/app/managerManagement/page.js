'use client'

import styles from '@/app/managerManagement/page.module.css'
import ScheduleListComponent from '@/components/ScheduleListComponent';
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '@/context/AuthProvider'
import { PostTimestampContext } from '@/context/PostTimestampProvider'


export default function ManagerManagement() {
    const [displayedScheduleList, setDisplayedScheduleList] = useState([])
    const [currentSelectedUser, setCurrentSelectedUser] = useState([])
    const { isManager } = useContext(AuthContext)
    const [departmentMembers, setDepartmentMembers] = useState([])
    const { postTimestamp, setPostTimestamp } = useContext(PostTimestampContext)

    useEffect(() => {
        if (isManager) {
            fetch('/api/departmentMember', {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json'
                }
            }).then((res) => {
                return res.json()
            }).then(({ departmentMember }) => {
                setDepartmentMembers(departmentMember)
                setCurrentSelectedUser(departmentMember[0].user_id)
            })
        }
    }, [isManager])

    // 取得使用者的schedule list
    useEffect(() => {
        if (currentSelectedUser) {
            fetch('/api/memberScheduleList', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ user_id: currentSelectedUser })
            }).then((res) => {
                return res.json()
            }).then((res_json) => {
                setDisplayedScheduleList(res_json.userScheduleList)
            })
        }
    }, [currentSelectedUser, postTimestamp])

    const onMemberSelectorChanged = (event) => {
        setCurrentSelectedUser(event.target.value)
    }

    const onExportClicked = (event) => {
        fetch('api/scheduleList', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify({
                user_id: currentSelectedUser
            })
        }).then(res => res.json())
            .then(({ userScheduleList }) => {
                // delete user data from schedulelist
                if (userScheduleList) {
                    userScheduleList = userScheduleList.map(schedule => {
                        delete schedule.sn
                        delete schedule.user_id
                        delete schedule.create_at
                        return schedule
                    })

                    const fileName = 'ExportSchedule.json'
                    const json = JSON.stringify(userScheduleList, null, 2)
                    const blob = new Blob([json], { type: 'application/json' })
                    const href = URL.createObjectURL(blob)

                    const link = document.createElement('a')
                    link.href = href
                    link.download = fileName
                    document.body.appendChild(link)
                    link.click()

                    document.body.removeChild(link)
                    URL.revokeObjectURL(href)
                }
            })
    }

    const onReaderLoad = (event) => {
        const importedSchedules = JSON.parse(event.target.result)
        fetch('/api/importSchedule', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(
                {
                    user_id: currentSelectedUser,
                    scheduleList: importedSchedules
                }
            )
        }).then(res => {
            console.log('Import Successed')
            setPostTimestamp(new Date())
            return res.json()
        }).catch(err => {
            console.log(err)
        })
    }

    const onImportChange = (event) => {
        const jsonFile = event.target.files[0]
        const reader = new FileReader()
        reader.onload = onReaderLoad
        reader.readAsText(jsonFile)
    }

    return (
        <main className={`${styles['main']}`}>
            <div className={`${styles['member-selection-container']}`}>
                <span className={`${styles['member-selection-header']}`}>部門成員選擇</span>
                <select id='member-selector' className={`${styles['member-selector']}`} onChange={onMemberSelectorChanged}>
                    {
                        departmentMembers && departmentMembers.map(({ user_id, username }) => {
                            return (
                                <option key={user_id} value={user_id}>{username}</option>
                            )
                        })
                    }
                </select>
                <span className={`${styles['member-selection-header']}`}>匯入與匯出部門成員排程</span>
                <div className={`${styles['schedule-file-container']}`}>
                    <button className={`${styles['header-btn']}`} onClick={onExportClicked}>匯出排程</button>
                    <div className={`${styles['header-btn']}`}>
                        <input id='member-import-schedule' className={`${styles['invisible']}`} type='file' styles='height:50px' onChange={onImportChange} accept='application/JSON' />
                        <label for='member-import-schedule' className={`${styles['abs-center']}`}>匯入排程</label>
                    </div>
                    {/* <button className={`${styles['header-btn']}`}>匯入排程</button> */}
                </div>
            </div>
            <div className={`${styles['schedule-list-container']}`}>
                <span className={`${styles['schedule-list-header']}`}>使用者排程清單</span>
                <ScheduleListComponent scheduleList={displayedScheduleList} />
            </div>
        </main>
    );
}