const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var eventID = event.eventID
  // var vdata1 = event.data1
  // var vdata2 = event.data2
  try {
    return await db.collection('events').where({
      _id: eventID
    }).get()
  } catch (e) {
    console.log(e)
  }
}