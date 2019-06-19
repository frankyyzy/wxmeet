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

    // const db = wx.cloud.database()
    // db.collection('events').get({
    //   success: res => {
    //     // res.data 包含该记录的数据
    //     console.log('hello')
    //     console.log(res.data)
    //   },
      fail: err => {
        console.log('error')
      }
    // })

    var arr = []
    for (var i = 0; i < 24; i++) {
      arr[i] = 0
    }
    this.setData({
      times: arr
    })

    const db = wx.cloud.database()
    var start, end;
    var that=this
    db.collection('events').doc('94b1e1fc5d0a5d28046e17606e2457ca').get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        start = res.data.start
        end = res.data.end
        console.log("s" + start + "e" + end)
        if (start >= 0 && end >= start) {
          that.update(start, end)
        }

      },

      fail: err => {
        console.log('error')
      }
    });
    console.log("here")

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
    console.log("updating...")
    for (var i = 0; i < 24; i++) {
      var value = 0
      if (i >= start && i <= end) value = 1
      var key = "times[" + i + "]"
      this.setData({ [key]: value })
    }
    console.log(this.data)
  }
})