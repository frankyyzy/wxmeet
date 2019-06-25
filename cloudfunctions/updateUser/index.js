const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('users').doc(event.id).update({
      data: {
        nickName: _.set(event.nickName),
        profilePic: _.set(event.profilePic)
      }
    })
  } catch (e) {
    console.log(e)
  }
}