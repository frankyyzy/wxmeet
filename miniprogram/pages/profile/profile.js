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

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wxmeet-5taii',
        traceUser: true,
      })
    }

    var that = this;

    const db = wx.cloud.database()
    db.collection('users').where({
      _id: app.globalData.user
    }).get({
      success: function(res) {
        console.log(res.data)

        // n^2 solution, use hashmap for better performance
        that.globalData.SponsorEvent = res.data[0].SponsorEvent


        var allEvents = res.data[0].AttendEvent;
        var sponsorEventToSet = [];
        for (var AllEventTuple in allEvents) {
          var IsSponser = false;
          for (var SponserEventTuple in that.globalData.SponsorEvent) {
            if (SponserEventTuple === AllEventTuple) {
              IsSponser = true;
              break;
            }
          }
          if (!IsSponser) {
            sponsorEventToSet.push(AllEventTuple);
          }
        }
        that.globalData.AttendEvent = sponsorEventToSet;




        that.setData({
          SponsorEvent: app.globalData.SponsorEvent,
          AttendEvent: app.globalData.AttendEvent
        })

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

  onCreateEventTap: function() {
    var edit = false
    wx.navigateTo({
      url: '../createEvent/createEvent?edit=' + edit,
    })
  },

  onSponserEventTap: function(event) {
    let id = event.currentTarget.id
    wx.navigateTo({
      url: '../masterEvent/masterEvent?eventId=' + id,
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
            success: function (res) {
              var Attendeelist = res.data.Attendee
              wx.cloud.callFunction({
                name: 'deleteEventUser',
                data: {
                  eventId: (id),
                  Attendee: Attendeelist
                }
              })
            }
          })
        } else {
        }
      }
    })
  }


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


})