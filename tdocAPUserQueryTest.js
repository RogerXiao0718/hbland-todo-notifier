const { DBGet, DBCloseAll } = require('./src/db/pool-manager.js')
const { docSQLConfig, tdocSQLConfig, inJungliSQLConfig } = require('./src/db/mssql')

const tdocAPUserQueryTest = async () => {
    const tdocConnection = await DBGet('tdoc', tdocSQLConfig)
    // const user_id = 'HB0547'
    // const tdocQueryResult = await tdocConnection.query`select AP_USER_NAME, AP_PCIP from tdoc.AP_USER where ap_unit_id=(select ap_unit_id from tdoc.ap_user where DocUserId=${user_id}) and ap_off_job='N'`
    // const tdocQueryResult = await tdocConnection.query`select * from tdoc.AP_USER where DocUserId=${user_id} and ap_off_job='N'`
    // console.log(tdocQueryResult)
    const docConnection = await DBGet('doc', docSQLConfig)
    const user_id = 'HB0547'
    // const docQueryResult = await docConnection.query`select * from doc.Doc_User where unit_id='5' and now_job='Y' and user_job_id='13'`
    // console.log(docQueryResult.recordset[0])
    const docQueryResult = await docConnection.query`select UNIT_ID from doc.Doc_User where user_id=${user_id}`
    let unit_id = docQueryResult.recordset[0].UNIT_ID
    console.log('unit_id', unit_id)
    const managerQueryResult = await docConnection.query`select user_id from doc.doc_user where unit_id=${'5'} and user_job_id='13' and now_job='Y'`
    let manager_id = managerQueryResult.recordset[0].user_id
    
    console.log(manager_id) 
    await DBCloseAll()
}

tdocAPUserQueryTest()