

export default function checkDateValid(datetime) {
    const currDate = new Date()
    if (datetime > currDate) {
        return true
    } else {
        return false
    }
}