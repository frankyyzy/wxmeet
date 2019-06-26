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
  onLoad: function(options) {
    console.log("loading")

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

    this.setSponsorAndAttendEvent();


    this.setData({
      SponsorEvent: app.globalData.SponsorEvent,
      AttendEvent: app.globalData.AttendEvent
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

    this.setSponsorAndAttendEvent();


    this.setData({
      SponsorEvent: app.globalData.SponsorEvent,
      AttendEvent: app.globalData.AttendEvent
    })


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
    let eventId = this.data.SponsorEvent[parseInt(event.currentTarget.id)][0]
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


  setSponsorAndAttendEvent: function() {
    var that = this;
    const db = wx.cloud.database()
    db.collection('users').where({
      _id: app.globalData.user
    }).get({
      success: function(res) {

        // n^2 solution, use hashmap for better performance
        app.globalData.SponsorEvent = res.data[0].SponsorEvent


        var allEvents = res.data[0].AttendEvent;
        var sponsorEventToSet = [];
        for (var AllEventTuple in allEvents) {
          var IsSponser = false;
          for (var SponserEventTuple in app.globalData.SponsorEvent) {
            if (SponserEventTuple === AllEventTuple) {
              IsSponser = true;
              break;
            }
          }
          if (!IsSponser) {
            sponsorEventToSet.push(AllEventTuple);
          }
        }
        app.globalData.AttendEvent = sponsorEventToSet;

      },
      fail: function(res) {
        console.log("error");
      }
    })
  },

})