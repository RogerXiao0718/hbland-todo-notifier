
export default function  getScheduleRuleText(scheduleRule) {
    if (scheduleRule === 'one-time') {
        return '一次性通知'
    } else if (scheduleRule === 'everyday') {
        return '每日通知'
    } else if (scheduleRule === 'everyweek') {
        return '每周通知'
    } else if (scheduleRule === 'everymonth') {
        return '每月通知'
    } else if (scheduleRule === 'everyyear') {
        return '每年通知'
    }
}