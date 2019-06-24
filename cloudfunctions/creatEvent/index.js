const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('events').add({
      data: {
        eventName: event.name,
        dates: event.dates,
        createDate: event.createDate,
        Sponser: event.id,
        Attendee: {},
      }
    })
  } catch (e) {
    console.log(e)
  }
}