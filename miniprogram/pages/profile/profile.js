// pages/profile/profile.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    SponsorEvent: app.globalData.SponsorEvent,
    AttendEvent: app.globalData.AttendEvent
  },
  /*
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.SponsorEvent)
    this.setData({
      SponsorEvent: app.globalData.SponsorEvent,
      AttendEvent: app.globalData.AttendEvent
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