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
  onLongPress: function(event) {
    let that = this
    let index = parseInt(event.currentTarget.id)
    let eventId = this.data.SponsorEvent[index][0]
    var sponsorE = this.data.SponsorEvent
    console.log(that.data.SponsorEvent[(index)])
    wx.showModal({
      title: '提示',
      content: '确定要删除此事件吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('yes')
          sponsorE.splice(index, 1)
          that.setData({
            SponsorEvent: sponsorE
          })
          wx.cloud.callFunction({
            name:'deleteEventUser',
            data:{
              tuple:that.data.SponsorEvent[(index)]
            },
            success: function(res){
              console.log(res)
            }
          })
        } else {
          console.log('nah')
        }
      }
    })
  }






})