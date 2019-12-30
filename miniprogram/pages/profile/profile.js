// pages/profile/profile.js

const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  /**
   * Page initial data
   */
  data: {
    SponsorEvent: app.globalData.SponsorEvent,
    AttendEvent: app.globalData.AttendEvent,
    listR:[10, 12],
    timer: null,
      delBtnWidth: 130,
      data: [{ content: "1", right: 0 }, { content: "2", right: 0 }, { content: "3", right: 0 }, { content: "4", right: 0 }, { content: "5", right: 0 }, { content: "6", right: 0 }, { content: "7", right: 0 }, { content: "8", right: 0 }, { content: "9", right: 0 }, { content: "10", right: 0 }],
      isScroll: true,
      windowHeight: 0
  },
  /*
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log("onLoad");
    //this.onUpdateEvents()  
    this.setData({
      SponsorEvent: app.globalData.SponsorEvent,
      AttendEvent: app.globalData.AttendEvent
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    console.log("onShow");
    if (app.globalData.user) {
      this.onUpdateEvents();
      console.log("update events");
    }
  },
  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {
    this.onUpdateEvents();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {},

  onCreateEventTap: function() {
    var edit = false;
    wx.navigateTo({
      url: "../createEvent/createEvent?edit=" + edit
    });
  },

  onSponserEventTap: function(event) {
    let eventId = event.currentTarget.id;
    if(this.data.SponsorEvent[eventId][2]==0)
      wx.navigateTo({
        url: "../event/event?eventId=" + eventId
      });
  },

  onAttendingEventTap: function(event) {
    let eventId = event.currentTarget.id;

    wx.navigateTo({
      url: "../event/event?eventId=" + eventId
    });
  },

  onCreateLongPress: function(event) {
    let that = this;
    let id = event.currentTarget.id;
    var sponsorE = this.data.SponsorEvent;

    wx.showModal({
      title: "提示",
      content: "确定要删除此事件吗？",
      success: function(res) {
        if (res.confirm) {
          delete sponsorE[id];
          that.setData({
            SponsorEvent: sponsorE
          });
          db.collection("events")
            .doc(id)
            .get({
              success: function(res) {
                var Attendeelist = res.data.Attendee;
                Attendeelist[res.data.Sponser] = {};
                wx.cloud.callFunction({
                  name: "deleteEventUser",
                  data: {
                    eventId: id,
                    Attendee: Attendeelist
                  }
                });
              }
            });
        } else {
        }
      }
    });
  },

  onAttendLongPress: function(event) {
    let that = this;
    let id = event.currentTarget.id;
    var AttendEvent = this.data.AttendEvent;

    wx.showModal({
      title: "提示",
      content: "确定要取消加入此事件吗？",
      success: function(res) {
        if (res.confirm) {
          delete AttendEvent[id];
          that.setData({
            AttendEvent: AttendEvent
          });
          wx.cloud.callFunction({
            name: "deleteAttendEvent",
            data: {
              eventId: id,
              userId: app.globalData.user
            }
          });
        }
      }
    });
  },

  onUpdateEvents: function() {
    var that = this;
    const db = wx.cloud.database();
    db.collection("users")
      .doc(app.globalData.user)
      .get({
        success: function(res) {
          app.globalData.SponsorEvent = res.data.SponsorEvent;
          app.globalData.AttendEvent = res.data.AttendEvent;
          for (let key in app.globalData.SponsorEvent) {
            if (key in app.globalData.AttendEvent) {
              delete app.globalData.AttendEvent[key];
            }
          }
          that.setData({
            SponsorEvent: app.globalData.SponsorEvent,
            AttendEvent: app.globalData.AttendEvent
          });
          wx.stopPullDownRefresh();
        },
        fail: function(res) {
          console.error("error on updating events in profile.js");
        }
      });
  },

  touchstart: function (event) {
    let id = event.currentTarget.id;
    var sponsorE = this.data.SponsorEvent;
    //reset all other delete button when new event is selected
    for (let index in sponsorE) {
      sponsorE[index][2]=0;
    }
    this.data.SponsorEvent=sponsorE;
    this.setData({
      isTouch:true,
      startX: event.changedTouches[0].clientX,
      startY: event.changedTouches[0].clientY,
      SponsorEvent: this.data.SponsorEvent,
    })
  },

  touchmove: function (event) {
    let id = event.currentTarget.id;
    var sponsorE = this.data.SponsorEvent;
    let startX = this.data.startX;//开始X坐标
    let startY = this.data.startY;//开始Y坐标
    let touchMoveX = event.changedTouches[0].clientX//滑动变化坐标
    let touchMoveY = event.changedTouches[0].clientY//滑动变化坐标
    let angle = this.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    if (Math.abs(angle) > 30) return;
    if (touchMoveX > startX)
      sponsorE[id][2] = 0;
    else{ 
      if (startX - touchMoveX > this.data.delBtnWidth)
        sponsorE[id][2] = this.data.delBtnWidth; 
      else
        sponsorE[id][2]=startX-touchMoveX;
    }
    this.data.SponsorEvent = sponsorE;
    this.setData({
      SponsorEvent: this.data.SponsorEvent,
    })
  },

  bindEnd:function(event){
    var item = this.data.SponsorEvent[event.currentTarget.id];
    if(item[2]>=this.data.delBtnWidth / 2){
      item[2] = this.data.delBtnWidth;
      this.data.SponsorEvent[event.currentTarget.id] = item;
      this.setData({
        SponsorEvent:this.data.SponsorEvent
      })
    }else{
      item[2] = 0;
      this.data.SponsorEvent[event.currentTarget.id]=item;
      this.setData({
        SponsorEvent:this.data.SponsorEvent
      })
    }
  },

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  deleteEvent:function(event){
    let that = this;
    let id = event.currentTarget.dataset.id;
    var sponsorE=this.data.SponsorEvent;
    if (this.data.SponsorEvent[id][2] != this.data.delBtnWidth) return;
    delete sponsorE[id];
    that.setData({
      SponsorEvent: sponsorE
    });
    db.collection("events")
      .doc(id)
      .get({
        success: function (res) {
          var Attendeelist = res.data.Attendee;
          Attendeelist[res.data.Sponser] = {};
          wx.cloud.callFunction({
            name: "deleteEventUser",
            data: {
              eventId: id,
              Attendee: Attendeelist
            }
          });
        }
      });
    console.log("event deleted");
  }

});
