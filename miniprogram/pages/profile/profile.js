// pages/profile/profile.js

const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * Page initial data
   */
  data: {
    SponsorEvent: app.globalData.SponsorEvent,
    AttendEvent: app.globalData.AttendEvent,
    timer: null
  },
  /*
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.onUpdateEvents()
    this.setData({
      SponsorEvent: app.globalData.SponsorEvent,
      AttendEvent: app.globalData.AttendEvent
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
    this.onUpdateEvents()
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

    this.onUpdateEvents();
   

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

  onCreateEventTap: function() {
    var edit = false
    wx.navigateTo({
      url: '../createEvent/createEvent?edit=' + edit,
    })
  },

  onSponserEventTap: function(event) {
    console.log(event)
    let eventId = event.currentTarget.id
    console.log(eventId)
    wx.navigateTo({
      url: '../masterEvent/masterEvent?eventId=' + eventId,
    })
  },

  onAttendingEventTap: function() {
    wx.redirectTo({
      url: '../guestEvent/guestEvent',
    })
  },

  onLongPress: function(event) {
    let that = this
    let id = event.currentTarget.id
    var sponsorE = this.data.SponsorEvent

    console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定要删除此事件吗？',
      success: function(res) {
        if (res.confirm) {
          delete sponsorE[id]
          that.setData({
            SponsorEvent: sponsorE
          })
          db.collection('events').doc(id).get({
            success: function(res) {
              var Attendeelist = res.data.Attendee
              Attendeelist[res.data.Sponser] = {}
              console.log(Attendeelist)
              wx.cloud.callFunction({
                name: 'deleteEventUser',
                data: {
                  eventId: (id),
                  Attendee: Attendeelist
                }
              })
            }
          })
        } else {}
      }
    })
  },


  onUpdateEvents: function() {

    var that = this;
    const db = wx.cloud.database()
    db.collection('users').doc(app.globalData.user).get({
      success: function (res) {
       

        var SponsorEvent = res.data.SponsorEvent
        var AttendEvent = {}
        for (var id in res.data.AttendEvent) {
          if (!SponsorEvent[id]) AttendEvent[id] = res.data.AttendEvent[id]
        }
        app.globalData.SponsorEvent = SponsorEvent
        app.globalData.AttendEvent = AttendEvent
        that.setData({
          SponsorEvent: app.globalData.SponsorEvent,
          AttendEvent: app.globalData.AttendEvent
        })
        wx.stopPullDownRefresh();

      },
      fail: function (res) {
        console.log("can't get user from db")
      }
    })
  }

})