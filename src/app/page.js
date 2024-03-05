'use client'
import { useCheckLogin } from '@/utils/useCheckLogin.js'
import { useContext, useEffect, useState } from 'react';
import styles from "./page.module.css";
import translateToDBDateTime from '@/utils/translateToDBDateTime.js'
import { AuthContext } from '@/context/AuthProvider'
import { PostTimestampContext } from '@/context/PostTimestampProvider'
import isDateValid from '@/utils/isDateValid'
import ScheduleListComponent from '@/components/ScheduleListComponent'


export default function Home() {
    const verified = useCheckLogin()
    const { auth, isManager } = useContext(AuthContext)
    const { postTimestamp, setPostTimestamp } = useContext(PostTimestampContext)
    const [currentRule, setCurrentRule] = useState('everyday')
    const [scheduleList, setScheduleList] = useState([])

    useEffect(() => {
        fetch('/api/scheduleList', {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        }).then((res) => {
            return res.json()
        }).then(({ userScheduleList }) => {
            // console.log(userScheduleList)
            setScheduleList(userScheduleList)
        }).catch((err) => {
            console.log('API CALL: /api/ScheduleList, something going wrong')
        })
    }, [postTimestamp])

    useEffect(() => {
        fetch('/api/departmentMember', {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        }).then((res) => {
            return res.json()
        }).then(({departmentMember}) => {
            setDepartmentMembers(departmentMember)
            setDispatchSelectedMember(departmentMember[0])
            console.log('dispatchSelectedMember Default', departmentMember[0])
        }).catch((err) => {
            console.log('API CALL: /api/departmentMember, something going wrong')
        })
    }, [isManager])

    // 設定不得小於該日期
    const getMinDate = () => {
        return translateToDBDateTime(new Date()).toISOString().split('T')[0]
    }

    // 設定不得超過兩年
    const getMaxDate = () => {
        let maxDate = translateToDBDateTime(new Date())
        maxDate.setTime(maxDate.getTime() + (2 * 365 * 24 * 60 * 60 * 1000))
        maxDate = maxDate.toISOString().split('T')[0]
        return maxDate
    }

    const getCurrentMonth = () => {
        // 1 - 12
        let currentMonth = new Date().getMonth() + 1
        return currentMonth
    }

    const getCurrentDate = () => {
        // 1 - 31
        let currentDate = new Date().getDate()
        return currentDate
    }

    const getCurrentDay = () => {
        // 0 - 6 
        let currentDay = new Date().getDay()
        return currentDay
    }

    const [oneTimeDate, setOneTimeDate] = useState()
    const [oneTimeTime, setOneTimeTime] = useState()
    const [everydayTime, setEverydayTime] = useState()
    const [everyweekDay, setEveryweekDay] = useState(getCurrentDay())
    const [everyweekTime, setEveryweekTime] = useState()
    const [everymonthDate, setEverymonthDate] = useState(getCurrentDate())
    const [everymonthTime, setEverymonthTime] = useState()
    const [everyyearMonth, setEveryyearMonth] = useState(getCurrentMonth())
    const [everyyearDate, setEveryyearDate] = useState(getCurrentDate())
    const [everyyearTime, setEveryyearTime] = useState()
    const [textAreaContent, setTextAreaContent] = useState('')
    const [submitErrorMessage, setSubmitErrorMessage] = useState('')
    const [isDispatchChecked, setIsDispatchChecked] = useState(false)
    const [dispatchSelectedMember, setDispatchSelectedMember] = useState('')
    const [departmentMembers, setDepartmentMembers] = useState([])
    let weekOptions = [...Array(7).keys()]
    let weekDisplayOptions = ['日', '一', '二', '三', '四', '五', '六']
    let monthOptions = [...Array(12).keys()]
    let monthDateOptions = [...Array(31).keys()]
    monthDateOptions = monthDateOptions.map((i) => {
        return i + 1
    })

    const onRuleChange = (event) => {
        setCurrentRule(event.target.value)
        console.log(`RULE change: ${event.target.value}`)
    }

    const onDispatchCheckboxChanged = (event) => {
        setIsDispatchChecked(event.currentTarget.checked)
        console.log("dispatch: ", event.currentTarget.checked)
    }

    const onDispatchMemberSelectorChanged = (event) => {
        setDispatchSelectedMember(event.target.value)
        console.log('dispatch selected member changed', event.target.value)
    }

    const onOneTimeDateChange = (event) => {
        setOneTimeDate(event.target.value)
        console.log(`RULE 'one-time' date changed: ${event.target.value}`)
    }

    const onOneTimeTimeChange = (event) => {
        setOneTimeTime(event.target.value)
        console.log(`RULE 'one-time' time changed: ${event.target.value}`)
    }

    const onEverydayTimeChange = (event) => {
        setEverydayTime(event.target.value)
        console.log(`RULE 'everyday' time changed: ${event.target.value}`)
    }

    const onEveryweekDayChange = (event) => {
        setEveryweekDay(event.target.value)
        console.log(`RULE 'everyweek' date changed: ${event.target.value}`)
    }

    const onEveryweekTimeChange = (event) => {
        setEveryweekTime(event.target.value)
        console.log(`RULE 'everyweek' time changed: ${event.target.value}`)
    }

    const onEverymonthDateChange = (event) => {
        setEverymonthDate(event.target.value)
        console.log(`RULE 'everymonth' date changed: ${event.target.value}`)
    }

    const onEverymonthTimeChange = (event) => {
        setEverymonthTime(event.target.value)
        console.log(`RULE 'everymonth' time changed: ${event.target.value}`)
    }

    const onEveryyearMonthChange = (event) => {
        setEveryyearMonth(event.target.value)
        console.log(`RULE 'everyyear' month changed: ${event.target.value}`)
    }

    const onEveryyearDateChange = (event) => {
        setEveryyearDate(event.target.value)
        console.log(`RULE 'everyyear' date changed: ${event.target.value}`)
    }

    const onEveryyearTimeChange = (event) => {
        setEveryyearTime(event.target.value)
        console.log(`RULE 'everyyear' time changed: ${event.target.value}`)
    }

    const onScheduleTextAreaChange = (event) => {
        setTextAreaContent(event.target.value)
    }

    const onScheduleTextAreaKeyDown = (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault()
        }
    }

    const checkSubmitValid = () => {
        // 規則要選 (預設一定會選)
        // 內容欄位trim以後不能空白
        // 被選取的Rule對應輸入欄位不能為空
        if (!currentRule) {
            setSubmitErrorMessage('請選擇通知規則')
            return false
        } else if (!(textAreaContent.trim())) {
            setSubmitErrorMessage('通知內容欄位不能空白')
            return false
        } else if (currentRule === 'one-time') {
            if (!oneTimeDate || !oneTimeTime) {
                setSubmitErrorMessage('請輸入日期與時間')
                return false
            } else if (!isDateValid(new Date(`${oneTimeDate} ${oneTimeTime}`))) {
                setSubmitErrorMessage('輸入日期或時間無效')
                return false
            } else {
                setSubmitErrorMessage('')
                return true
            }
        } else if (currentRule === 'everyday') {
            if (!everydayTime) {
                setSubmitErrorMessage('請輸入日期與時間')
                return false
            } else {
                setSubmitErrorMessage('')
                return true
            }
        } else if (currentRule === 'everyweek') {
            if (!everyweekDay || !everyweekTime) {
                setSubmitErrorMessage('請輸入日期與時間')
                return false
            } else {
                setSubmitErrorMessage('')
                return true
            }
        } else if (currentRule === 'everymonth') {
            if (!everymonthDate || !everymonthTime) {
                setSubmitErrorMessage('請輸入日期與時間')
                return false
            } else {
                setSubmitErrorMessage('')
                return true
            }
        } else if (currentRule === 'everyyear') {
            const userInputDate = new Date(`2024-${everyyearMonth}-${everyyearDate} ${everyyearTime}`)
            if (!everyyearMonth || !everyyearDate || !everyyearTime) {
                setSubmitErrorMessage('請輸入日期與時間')
                return false
            } else if ((!isDateValid(new Date(`2024-${everyyearMonth}-${everyyearDate}`)) || !(everyyearMonth == userInputDate.getMonth() + 1) || !(everyyearDate == userInputDate.getDate()))) {
                setSubmitErrorMessage('輸入日期或時間無效')
                return false
            }
            else {
                setSubmitErrorMessage('')
                return true
            }
        }
        return true
    }

    const onCreateSubmitClick = (event) => {
        event.preventDefault()
        // console.log(oneTimeDate, oneTimeTime)
        // const [year, month, date] = oneTimeDate.split('-')
        // const [hour, minute] = oneTimeTime.split(':')
        // console.log(year, month, date, hour, minute)
        // const selectedDateTime = new Date(`${'113-13-13'} ${oneTimeTime}`)
        // console.log(selectedDateTime)
        if (checkSubmitValid()) {
            let req_json = {
                user_id: auth,
                schedule_rule: currentRule,
                msg_content: textAreaContent,
                create_at: translateToDBDateTime(new Date())
            }

            if (isManager && isDispatchChecked) {
                req_json.user_id = dispatchSelectedMember
                console.log('委派任務給', req_json.user_id)
            }

            if (currentRule === 'one-time') {
                req_json = {
                    ...req_json,
                    onetime_datetime: translateToDBDateTime(new Date(`${oneTimeDate} ${oneTimeTime}`))
                }
            } else if (currentRule === 'everyday') {
                req_json = {
                    ...req_json,
                    everyday_time: everydayTime
                }
            } else if (currentRule === 'everyweek') {
                req_json = {
                    ...req_json,
                    everyweek_day: everyweekDay,
                    everyweek_time: everyweekTime
                }
            } else if (currentRule === 'everymonth') {
                req_json = {
                    ...req_json,
                    everymonth_date: everymonthDate,
                    everymonth_time: everymonthTime
                }
            } else if (currentRule === 'everyyear') {
                req_json = {
                    ...req_json,
                    everyyear_month: everyyearMonth,
                    everyyear_date: everyyearDate,
                    everyyear_time: everyyearTime
                }
            }
            fetch('/api/create', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ ...req_json })
            }).then(() => {
                setPostTimestamp(translateToDBDateTime(new Date()))
                if (isManager && isDispatchChecked) {
                    alert('通知排程委派成功')
                }
            })
        }


    }

    return (
        <main className={styles.main}>
            {verified &&
                <>
                    <div className={`${styles['create-section-container']}`}>
                        <span className={`${styles['rule-selector-form-header']}`}>{`新增`}</span>
                        <form className={`${styles['rule-selector-form']}`}>
                            {
                                isManager &&
                                <div className={`${styles['rule-selector-container']}`}>
                                    <input id='dispatch-checkbox' className={`${styles['dispatch-checkbox']}`} type="checkbox" onChange={onDispatchCheckboxChanged} value={isDispatchChecked}></input>
                                    <label for='dispatch-checkbox' className={`${styles['display-checkbox-label']}`}>是否委派待辦事項</label>
                                    <label for="dispatch-member-selector">委派人員</label>
                                    <select id='dispatch-member-selector' disabled={isDispatchChecked ? '' : 'disabled'} onChange={onDispatchMemberSelectorChanged}>
                                        {
                                            departmentMembers.map(departmentMember => {
                                                return <option key={departmentMember} value={departmentMember}>{departmentMember}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            }
                            <div className={`${styles['rule-selector-container']}`}>
                                <input type='radio' id='everyday-rule' name='rule' checked={currentRule === 'everyday'} onChange={onRuleChange} value='everyday' />
                                <label for='everyday-rule'>每日通知: </label>
                                <input type='time' className={`${styles['rule-selector-datetime-input']}`} onChange={onEverydayTimeChange} disabled={currentRule !== 'everyday' ? 'disabled' : ''} />
                            </div>
                            <div className={`${styles['rule-selector-container']}`}>
                                <input type='radio' id='everyweek-rule' name='rule' checked={currentRule === 'everyweek'} onChange={onRuleChange} value='everyweek' />
                                <label for='everyweek-rule' className={`${styles['rule-label']}`}>每周通知: </label>
                                <label for='week-day' className={`${styles['rule-label']}`}>星期</label>
                                <select id='week-day' className={`${styles['rule-selector-select']}`} defaultValue={getCurrentDay()} onChange={onEveryweekDayChange} disabled={currentRule !== 'everyweek' ? 'disabled' : ''}>
                                    {weekOptions.map(i => {
                                        return <option key={i} value={i}>{weekDisplayOptions[i]}</option>
                                    })}
                                </select>
                                <input type='time' className={`${styles['rule-selector-datetime-input']}`} onChange={onEveryweekTimeChange} disabled={currentRule !== 'everyweek' ? 'disabled' : ''} />
                            </div>
                            <div className={`${styles['rule-selector-container']}`}>
                                <input type='radio' id='everymonth-rule' name='rule' checked={currentRule === 'everymonth'} onChange={onRuleChange} value='everymonth' />
                                <label for='everymonth-rule' className={`${styles['rule-label']}`}>每月通知: </label>
                                <label for='month-day' className={`${styles['rule-label']}`}>每月</label>
                                <select id='month-day' className={`${styles['rule-selector-select']}`} defaultValue={getCurrentDate()} onChange={onEverymonthDateChange} disabled={currentRule !== 'everymonth' ? 'disabled' : ''}>
                                    {monthDateOptions.map(i => {
                                        return <option key={i} value={i}>{i}</option>
                                    })}
                                </select>
                                <label className={`${styles['rule-label']}`}>日</label>
                                <input type='time' className={`${styles['rule-selector-datetime-input']}`} onChange={onEverymonthTimeChange} disabled={currentRule !== 'everymonth' ? 'disabled' : ''} />
                            </div>
                            <div className={`${styles['rule-selector-container']}`}>
                                <input type='radio' id='everyyear-rule' name='rule' checked={currentRule === 'everyyear'} onChange={onRuleChange} value='everyyear' />
                                <label for='everyyear-rule' className={`${styles['rule-label']}`}>每年通知:</label>
                                <select className={`${styles['rule-selector-select']}`} defaultValue={getCurrentMonth()} onChange={onEveryyearMonthChange} disabled={currentRule !== 'everyyear' ? 'disabled' : ''}>
                                    {
                                        monthOptions.map((i) => {
                                            return <option key={i} value={i + 1}>{i + 1}</option>
                                        })
                                    }
                                </select>
                                <label className={`${styles['rule-label']}`}>月</label>
                                <select className={`${styles['rule-selector-select']}`} defaultValue={getCurrentDate()} onChange={onEveryyearDateChange} disabled={currentRule !== 'everyyear' ? 'disabled' : ''}>
                                    {
                                        monthDateOptions.map(i => {
                                            return <option key={i} value={i}>{i}</option>
                                        })
                                    }
                                </select>
                                <label className={`${styles['rule-label']}`}>日</label>
                                <input type='time' className={`${styles['rule-selector-select']}`} onChange={onEveryyearTimeChange} disabled={currentRule !== 'everyyear' ? 'disabled' : ''} />
                            </div>
                            <div className={`${styles['rule-selector-container']}`}>
                                <input type='radio' id='one-time-rule' className={`${styles['rule-selector-radio']}`} name='rule' checked={currentRule === 'one-time'} onChange={onRuleChange} value='one-time' />
                                <label for='one-time-rule'>一次性通知: </label>
                                <input type='date' className={`${styles['rule-selector-datetime-input']}`} onChange={onOneTimeDateChange} min={getMinDate()} max={getMaxDate()} disabled={currentRule !== 'one-time' ? 'disabled' : ''} />
                                <input type='time' className={`${styles['rule-selector-datetime-input']}`} onChange={onOneTimeTimeChange} disabled={currentRule !== 'one-time'} />
                            </div>
                            <label className={`${styles['create-textarea-label']}`}>通知內容: </label>
                            <textarea className={`${styles['create-schedule-textarea']}`} rows='5' cols='60' onChange={onScheduleTextAreaChange} onKeyDown={onScheduleTextAreaKeyDown}>
                            </textarea>
                            {<span className={`${styles['submit-err-msg']}`}>{submitErrorMessage}</span>}
                            <button className={`${styles['rule-submit-button']}`} onClick={onCreateSubmitClick} type='submit'>提交</button>
                        </form>
                    </div>
                    <div className={`${styles['schedule-list-container']}`}>
                        <span className={`${styles['schedule-list-header']}`}>使用者排程清單</span>
                        <ScheduleListComponent scheduleList={scheduleList} />
                    </div>
                </>
            }
        </main>
    );
}
