// pages/profile/profile.js
Page({

  /**
   * Page initial data
   */
  data: {
    user: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this
    wx.cloud.callFunction({
      name: 'login',
      complete: res=>{
        console.log(res.result.openId)
        that.setData({user: res.result.openId})
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    // console.log(getApp().globalData.userInfo)
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  bindStart: function (e) {
    this.setData({
      start: e.detail.value
    })
  },
  bindEnd: function (e) {
    this.setData({
      end: e.detail.value
    })
  },

  onSubmitTap: function (){
    wx.setStorage({
      key: "start",
      data: this.data.start,
    })
    wx.setStorage({
      key: "end",
      data: this.data.end,
    })
    const db = wx.cloud.database()
    // db.collection('events').add({
    //   // data 字段表示需新增的 JSON 数据
    //   data: {
    //     // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
    //     start: this.data.start,
    //     end: this.data.end
    //   },
    //   success: function (res) {
    //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    //     console.log(res)
    //   }
    // })
    // db.collection('events').doc
    // db.collection('user').update({
    //   data:{
    //     attendingEvents: 'test'
    //   }
    // })



  }

})