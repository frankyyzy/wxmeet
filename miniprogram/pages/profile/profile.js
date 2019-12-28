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
    timer: null
  },
  /*
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log("onLoad");
    console.log(this.data.SponsorEvent);
    // this.onUpdateEvents()
    // this.setData({
    //   SponsorEvent: app.globalData.SponsorEvent,
    //   AttendEvent: app.globalData.AttendEvent
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    console.log("on ready");
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    if (app.globalData.user) {
      this.onUpdateEvents();
    }
    console.log("on show"+this.data.SponsorEvent);
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
    console.log("touch start called");
    let id = event.currentTarget.id;
    var sponsorE = this.data.SponsorEvent;
    //reset all other delete button when new event is selected
    for (let index in sponsorE) {
      sponsorE[index].right=0;
      console.log(sponsorE[index]);
    }
    
    this.setData({
      startX: event.changedTouches[0].clientX,
      startY: event.changedTouches[0].clientY,
      sponsorE: this.data.SponsorEvent
    })
    return; 
  },
  //滑动事件处理
  touchmove: function (event) {
    console.log("touchmove called");
    let that = this;
    let id = event.currentTarget.id;
    var sponsorE = that.data.SponsorEvent;
    let index = event.currentTarget.dataset.index;//当前索引
    let startX = that.data.startX;//开始X坐标
    let startY = that.data.startY;//开始Y坐标
    let touchMoveX = event.changedTouches[0].clientX//滑动变化坐标
    let touchMoveY = event.changedTouches[0].clientY//滑动变化坐标
    //获取滑动角度
    let angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    for(let i in sponsorE){
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          sponsorE[i].right = 0
        else{ //左滑
          if(startX-touchMoveX>207)
            sponsorE[i].right=207; 
          else
            sponsorE[i].right=startX-touchMoveX;
        }
      }
      console.log(sponsorE[i]);
    }
    //更新数据
    that.setData({
      sponsorE: that.data.SponsorEvent
    })
  },
  bindEnd:function(){
    console.log("bindend called");
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  deleteEvent:function(){
    let that = this;
    let id = event.currentTarget.id;
    var AttendEvent = this.data.AttendEvent;
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
});
