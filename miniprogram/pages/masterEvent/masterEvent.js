// pages/group/group.js
const opacity1 = 0.1;
const opacity2 = 0.9;
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    color: [],
    nullHouse: true, //先设置隐藏
    display: "",
    times: wx.getStorageSync('times'),
    timer: null
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


  },

  setcolor: function(NumOfPeople) {
    console.log("setting color" + NumOfPeople);
    var arr = []
    console.log(this.data.times)

    for (var i = 0; i < this.data.times.length; i++) {

      console.log("opacity" + (this.data.times[i] / NumOfPeople));
      arr[i] = "rgba(0, 151, 19," + (this.data.times[i] / NumOfPeople) + ")";
    }
    this.setData({
      color: arr
    })
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
    var that = this
    this.getTime()
    this.setData({
      timer: setInterval(function () {
        that.getTime()
      }, 10000)
    })

  },

  clear: function() {
    var arr = []
    for (var i = 0; i < 24; i++) {
      arr[i] = 0;
    }
    this.setData({
      times: arr
    })
  },

  getTime: function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('events').doc('test').get({
      success: function(res) {
        that.calcTime(res.data.Attendee)
      }
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {
    clearInterval(this.data.timer)
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {
    clearInterval(this.data.timer)
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

  calcTime: function(arr) {
    var localArr = []
    for (var i = 0; i < 24; i++) {
      localArr[i] = 0
    }
    for (var i in arr) {
      this.update(arr[i], localArr)
    }
    console.log(Object.keys(arr).length)
    // app.globalData.times = localArr
    this.setData({
      times: localArr
    })
    this.setcolor(Object.keys(arr).length)
    wx.hideLoading()
    // wx.setStorageSync('times', app.globalData.times)
  },

  update(arr, localArr) {
    for (var i = 0; i < 24; i++) {
      if (arr[i]) localArr[i]++
    }
  },


  onBackHomeTap: function() {
    wx.redirectTo({
      url: '/pages/profile/profile',
    })
  },
  onEditTap: function() {
    var edit = true
    wx.navigateTo({
      url: '/pages/createEvent/createEvent?edit=' + edit,
    })
  },
  onTouchStart: function(e) {
    var ID = parseInt(e.target.id)
    // wx.showToast({
    //   title: this.data.times[ID].toString(),
    //  })
    this.setData({
      display: this.data.times[ID].toString() + " people are available",
      nullHouse: false
    })

  },
  onTouchEnd: function() {
    wx.hideToast();
    this.setData({
      nullHouse: true
    })
  }

})