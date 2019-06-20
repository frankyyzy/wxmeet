// pages/group/group.js
Page({

  /**
   * Page initial data
   */
  data: {
    times: [],
    event: [{}]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    const db = wx.cloud.database()
    var start, end;
    var that = this
    this.getTime()
    setInterval(function () {
      that.getTime()
    }, 10000)
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    this.getTime()
  },

  clear: function () {
    var arr = []
    for (var i = 0; i < 24; i++) {
      arr[i] = 0
    }
    this.setData({
      times: arr
    })
  },
  getTime: function () {
    const db = wx.cloud.database()
    var that = this
    db.collection('events').doc('test').get({
      success: function (res) {
        that.calcTime(res.data.Attendee)
      }
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  },

  calcTime: function (arr) {
    var localArr = []
    for (var i = 0; i < 24; i++) {
      localArr[i] = 0
    }
    for (var i in arr) {
      this.update(arr[i], localArr)
    }
    this.setData({
      times: localArr
    })
  },
  update(arr, localArr) {
    for (var i = 0; i < 24; i++) {
      if (arr[i]) localArr[i]++
    }
  },


  onBackHomeTap: function(){
    wx.redirectTo({
      url: '/pages/profile/profile',
    })
  },
  onEditTap: function () {
    wx.redirectTo({
      url: '/pages/createEvent/createEvent',
    })
  }
})