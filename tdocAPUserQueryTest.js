const { DBGet, DBCloseAll } = require('./src/db/pool-manager.js')
const { docSQLConfig, tdocSQLConfig, inJungliSQLConfig } = require('./src/db/mssql')

const tdocAPUserQueryTest = async () => {
    // const tdocConnection = await DBGet('tdoc', tdocSQLConfig)
    // const user_id = 'HB0547'
    // const tdocQueryResult = await tdocConnection.query`select AP_USER_NAME, AP_PCIP from tdoc.AP_USER where ap_unit_id=(select ap_unit_id from tdoc.ap_user where DocUserId=${user_id}) and ap_off_job='N'`
    // console.log(tdocQueryResult)
    const docConnection = await DBGet('doc', docSQLConfig)
    const user_id = 'HB0547'
    const docQueryResult = await docConnection.query`select * from doc.Doc_User where user_id=${user_id}`
    console.log(docQueryResult.recordset[0])
    await DBCloseAll()
}

tdocAPUserQueryTest()