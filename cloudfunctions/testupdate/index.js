const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('events').doc(event.eventId).update({
      data: {
        Attendee: {
           [event.id]:_.set((event.times))
         }
      }
    })
  } catch (e) {
    console.log(e)
  }
}