// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'wxmeet-5taii'
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = wx.cloud.database()
    const _ = db.command
    return await db.collection('events').doc('test').update({
      data: {
        Attendee: {
          [event.id]: _.set((event.intervals))
        }
      }
    })
  } catch (e) {
    console.error(e)
  }
}