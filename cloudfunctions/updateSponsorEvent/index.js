const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('users').doc(event.id).update({
      data: {
        SponsorEvent: {
          [event.eventId]: _.set([event.eventName, event.createTime])
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}