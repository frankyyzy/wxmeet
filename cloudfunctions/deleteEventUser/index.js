const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let eventId = event.eventId
    let Attendee = event.Attendee
    for (var id in Attendee) {
      await db.collection('users').doc(id).update({
        data: {
          AttendEvent: {
            [eventId]: _.remove()
          },
          SponsorEvent: {
            [eventId]: _.remove()
          }
        }
      })
    }
    await db.collection('events').doc(eventId).remove()

  } catch (e) {
    console.log(e)
  }
}