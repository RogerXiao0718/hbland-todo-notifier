function translateToDBDateTime(ori_date) {
    ori_date.setTime(ori_date.getTime() + ( 8 * 60 * 60 * 1000))
    return ori_date
}

module.exports = translateToDBDateTime