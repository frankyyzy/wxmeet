const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let eventId = event.eventId
    let userId = event.userId
    await db.collection('events').doc(eventId).update({
      data: {
        Attendee:{
          [userId]:_.remove()
        }
      }
    })
    await db.collection('users').doc(userId).update({
      data:{
        AttendEvent:{
          [eventId]:_.remove()
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}