// pages/group/group.js
Page({

  /**
   * Page initial data
   */
  data: {
    times: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    const db = wx.cloud.database()
    db.collection('events').get({
      success: res => {
        // res.data 包含该记录的数据
        console.log('hello')
        console.log(res.data)
      },
      fail: err => {
        console.log('error')
      }
    })

    var arr = []
    for (var i = 0; i < 24; i++) {
      arr[i] = 0
    }
    this.setData({
      times: arr
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
    var that = this
    var start = wx.getStorageSync("start");
    var end = wx.getStorageSync("end");
    console.log("s" + start + "e" + end)
    if (start >= 0 && end >= start) {
      this.update(start, end)
    }
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

  update(start, end) {
    for (var i = 0; i < 24; i++) {
      var value = 0
      if (i >= start && i <= end) value = 1
      var key = "times[" + i + "]"
      this.setData({ [key]: value })
    }
    console.log(this.data)
  }
})