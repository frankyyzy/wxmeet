// pages/profile/profile.js
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {

    user: '',
    dates: [],
    datechoose: [0, 0, 0, 0, 0, 0, 0, 0],
    totaldate: 0,
    start: -1,
    end: -1,
    edit: false,
    intervals: [],
    eventId:'',
    eventName:'',
    createTime: -1,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this
    that.setData({
        eventId: options.eventId,
        eventName: options.eventName,
        createTime: options.createTime,
        user: app.globalData.user
      })
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('events').where({
        _id: that.data.eventId
      }).get({
        success: function (res) {
          var passdates = res.data[0].dates
          var curdates = ["小时"]
          var datechoos = [0]
          for(let i = 0; i<passdates.length;i++) {
            curdates.push(passdates[i])
            datechoos.push(i+1)
          }
          var total = curdates.length
          that.setData({
            dates: curdates,
            totaldate: total,
            datechoose: datechoos
          })
          var intervalss = [];
          for (var i = 0; i < that.data.totaldate; i++) {
            var interves = [];
            for (var j = 0; j < 24; j++) {
              interves.push(false);
            }
            intervalss.push(interves);
            that.setData({
              intervals: intervalss
            })
          }
          
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
  onShow: function () { },

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

  bindStart: function (e) {
    this.setData({
      start: e.detail.value
    })
  },
  bindEnd: function (e) {
    this.setData({
      end: e.detail.value
    })
  },

  onSubmitTap: function () {
    wx.showLoading({
      title: '',
    })
    this.updateUser()
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: 'testupdate',
      data: {
        eventId: that.data.eventId,
        id: that.data.user,
        dates: that.data.dates,
        times: that.data.intervals,
      },
      success: res => {
        console.log(that.data.eventId)
        console.log('更新数据成功')
        wx.redirectTo({
          url: '/pages/masterEvent/masterEvent?eventId=' + that.data.eventId,
        })
      }
    })
  },
  updateUser: function () {
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('users').doc(that.data.user).update({
      data: {
        AttendEvent: _.push([[that.data.eventId, that.data.eventName, that.data.createTime]]),
      }
    })
  },

  mytouchstart: function (e) {
    var Name = parseInt(e.target.id[0])
    var idd = e.target.id
    var ID = '';
    for (let i = 1; i < idd.length; i++) {
      ID = ID + idd[i];
    }
    ID = parseInt(ID);
    console.log(e.clientX)
    console.log(ID)
    this.setData({
      starti: ID,
      startj: Name
    })

  },
  //长按事件
  mytouchmove: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    this.data.touchE = [sx, sy]
  },
  mytouchend: function (e) {
    
  },
  mytap: function (e) {
    var Name = parseInt(e.target.id[0])
    console.log(Name)
    var idd = e.target.id
    var ID = '';
    for (let i = 1; i < idd.length; i++) {
      ID = ID + idd[i];
    }
    ID = parseInt(ID);
    console.log(ID)
    var interv = []
    interv = this.data.intervals
    if (!interv[Name][ID]) {
      interv[Name][ID] = true;
    }
    else {
      interv[Name][ID] = false;
    }
    this.setData({
      intervals: interv
    })
  }

})
