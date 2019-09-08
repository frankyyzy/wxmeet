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
    totaldate: 3,
    start: -1,
    end: -1,
    edit: false,
    intervals: [],
    eventId: '',
    eventName: '',
    createTime: -1,
    windowHeight: 0,
    windowWidtht: 0,
    touchIntervals: [],
    startx: 0,
    starty: 0,
    startj: 0,
    endx: 0,
    endy: 0,
    buttom: false,
    arr: [],
    timer: null,
    startSelect: false,
    startHour: null,
    startDate: null,
    rowHeight: 30 // in px, hardcoded for now
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
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
      success: function(res) {
        var passdates = res.data[0].dates
        var curdates = ["小时"]
        var datechoos = [0]
        for (let i = 0; i < passdates.length; i++) {
          curdates.push(passdates[i])
          datechoos.push(i + 1)
        }
        var total = curdates.length
        that.setData({
          dates: curdates,
          totaldate: total,
          datechoose: datechoos
        })
        var intervalss = [];
        for (var i = 0; i < that.data.totaldate - 1; i++) {
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


    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        // 屏幕宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 高度,宽度 单位为px
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth
        })
      }
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
  onShow: function() {},

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

  onSubmitTap: function() {
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
        // console.log(that.data.eventId)
        console.log('更新数据成功')
        wx.redirectTo({
          url: '/pages/masterEvent/masterEvent?eventId=' + that.data.eventId,
        })
      }
    })
  },

  updateUser: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'updateAttendEvent',
      data: {
        id: that.data.user,
        eventId: that.data.eventId,
        eventName: that.data.eventName,
        createTime: that.data.createTime
      },
      success: res => {
        console.log('新增用户参与事件！')
      }
    })
  },

  mytouchstart: function(e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    var n = this.data.totaldate;

    this.data.startj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;

    var arr = []
    for (var i = 0; i < 24; i++) {
      arr[i] = false
    }
    this.data.arr = arr
  },

  mytouchmove: function(e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    var n = this.data.totaldate;
    var startxx = sx;
    var startyy = sy;
    var startj = parseInt(n * startxx / (0.98 * this.data.windowWidth)) - 1;
    var endj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
    var starti = parseInt((startyy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    var endi = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    console.log("starti" + starti)
    console.log("endi" + endi)
    console.log("startj" + startj)
    console.log("endj" + endj)
    // for (var j = startj; j <= endj; j++) {
    for (var i = starti; i <= endi; i++) {
      if (this.data.arr[i] == false) {
        // this.data.intervals[startj][i] = !this.data.intervals[startj][i]
        var index = 'intervals[' + this.data.startj + '][' + i + ']'
        this.setData({
          [index]: !this.data.intervals[this.data.startj][i],
        })
        this.data.arr[i] = true
      }
    }
  },

  blockTouchStart: function(e) {
    var date = parseInt(e.target.id[0]); // 0th char
    var hour = parseInt(e.target.id.substr(1)); // 1st to end 
    if (!this.data.startSelect) {
      this.data.startSelect = true;
      this.data.startDate = date;
      this.data.startHour = hour;
    }

  },

  blockTouchMove: function (e) {

    var horizontal = e.changedTouches[0].pageX;
    var vertical = e.changedTouches[0].pageY;
    var n = this.data.totaldate;

    var date = parseInt(n * horizontal / (0.98 * this.data.windowWidth)) - 1;
    var hour = vertical / this.data.rowHeight - 1;
   

    if (this.data.startSelect) {

      console.debug("here")
      

      var sHour = this.data.startHour;
      var sDate = this.data.startDate;

      if (hour > sHour) {
        for (var i = sHour; i <= hour; i++) {
          this.setData({
            ['intervals[' + date + '][' + i + ']']: !this.data.intervals[date][hour],
          })

        }

      } else {
        for (var i = hour; i <= sHour; i++) {
          console.log(i);
          console.log(hour)
          this.setData({
            ['intervals[' + date + '][' + i + ']']: !this.data.intervals[date][hour],
          })

        }

      }


    }


  },


  blockTouchEnd: function(e) {

    var horizontal = e.changedTouches[0].pageX;
    var vertical = e.changedTouches[0].pageY;
    var n = this.data.totaldate;

    var date = parseInt(n * horizontal / (0.98 * this.data.windowWidth)) - 1;
    //var hour = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    var hour  = vertical / this.data.rowHeight - 1;
    console.log(hour);




    if (this.data.startSelect) {
      this.data.startSelect = false;



      var sHour = this.data.startHour;
      var sDate = this.data.startDate;

      if (hour > sHour) {
        for (var i = sHour; i <= hour; i++) {
          this.setData({
            ['intervals[' + date + '][' + i + ']']: !this.data.intervals[date][hour],
          })

        }

      } else {
        for (var i = hour; i <= sHour; i++) {
          console.log(i);
          console.log(hour)
          this.setData({
            ['intervals[' + date + '][' + i + ']']: !this.data.intervals[date][hour],
          })

        }

      }


    }


  },

  mytap: function(e) {
    var date = parseInt(e.target.id[0]); // 0th char
    var hour = parseInt(e.target.id.substr(1)); // 1st to end 
    var interv = this.data.intervals;
    interv[date][hour] = !interv[date][hour];
    this.setData({
      intervals: interv
    })
  },

  testposition: function(e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    console.log(sx)
    console.log(sy)
  }

})