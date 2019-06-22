// pages/profile/profile.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    user: "",
    SponsorList: [],
    AttendingList: []
  },
  /*
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    var db = wx.cloud.database()
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        that.setData({
          user: res.result.openId
        })
        db.collection("users").where({
          _id: that.data.user
        }).get({
          success: (res)=>{
            console.log(res)
          }
        })
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

  onCreateEventTap: function (){
    var edit = false
    wx.navigateTo({
      url: '../selectTime/selectTime?edit=' + edit,
    })
  },

  onSponserEventTap: function () {
    wx.redirectTo({
      url: '../masterEvent/masterEvent',
    })
  },

  onAttendingEventTap: function () {
    wx.redirectTo({
      url: '../guestEvent/guestEvent',
    })
  },

  onCalenderTap: function () {
    wx.redirectTo({
      url: '../calender/calender',
    })
  },






})