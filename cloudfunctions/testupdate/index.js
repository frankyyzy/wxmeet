const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // var filedvalue1 = event.data1
  // var filedvalue2 = event.data2
  try {
    return await db.collection('events').doc('test3').set({
      data: {
        tester: "test4"
      }
    })
  } catch (e) {
    console.log(e)
  }
}