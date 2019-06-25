// pages/profile/profile.js
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {

    user: '',
    date: ['小时', '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
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
          that.setData({
            dates: res.data[0].dates
          })
          console.log(that.data)
        }
      })
    console.log(that.data)
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
        AttendEvent: {
          [that.data.eventId]: _.set([that.data.eventName, that.data.createTime])
        }
        //_.push([[that.data.eventId, that.data.eventName, that.data.createTime]]),
      }
    })
  },
  checkboxChange: function (e) {
    var IDarray = e.detail.value
    this.setData({
      dates: IDarray
    })
    var datechoos = [0, 0, 0, 0, 0, 0, 0, 0]
    var total = IDarray.length
    for (var i = 0; i < IDarray.length; i++) {
      datechoos[parseInt(IDarray[i]) + 1] = 1;
    }
    if (total > 0) {
      datechoos[0] = 1;
    }
    this.setData({
      datechoose: datechoos,
      totaldate: total
    })
    var intervalss = [];
    for (var i = 0; i < this.data.totaldate; i++) {
      var interves = [];
      for (var j = 0; j < 24; j++) {
        interves.push(false);
      }
      intervalss.push(interves);
      this.setData({
        intervals: intervalss
      })
    }


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
