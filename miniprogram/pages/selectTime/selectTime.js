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
    windowHeight:0,
    windowWidtht:0,
    touchIntervals:[],
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,
    buttom: false,
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
    var value = wx.getStorageSync('time');
    if(!value){
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
        success: function (res) {
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
    }
    else{
      that.setData({
        intervals: vale,
      })
    }
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

  onSubmitTap: function () {
    wx.setStorageSync("time", this.data.intervals)
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
  updateUser: function () {
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

  mytouchstart: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    var intervalls = this.data.intervals
    if (sy < 0.065 * this.data.windowHeight) {
      this.setData({
        buttom: true,
      })
    }
    else{
      this.setData({
        touchIntervals:intervalls,
        startx: sx,
        starty: sy,
        buttom: false,
      })
    }


  },
  //长按事件
  mytouchmove: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    this.setData({
      endx: sx,
      endy: sy,
    })
    var n = this.data.totaldate;
    var intervalls = this.data.touchIntervals;
    var startxx = this.data.startx;
    var startyy = this.data.starty;
    var startj = parseInt(n * startxx / (0.98 * this.data.windowWidth)) - 1;
    var endj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
    var starti = parseInt((startyy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    var endi = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    
    // for (var i = starti; i <= endi; i++) {
    //   for (var j = startj; j <= endj; j++) {
    //     if (!intervalls[j][i]) {
    //       intervalls[j][i] = true;
    //     }
    //     else {
    //       intervalls[j][i] = false;
    //     }
    //   }
    // }
    // this.setData({
    //   intervals: intervalls,
    // })

  },
  mytouchend: function (e) {
    if(!this.data.buttom) {
      var intervalls = this.data.intervals
      var startxx = this.data.startx;
      var startyy = this.data.starty;
      var endxx = this.data.endx;
      var endyy = this.data.endy;
      var n = this.data.totaldate;
      var startj = parseInt(n * startxx / (0.98 * this.data.windowWidth)) - 1;
      var endj = parseInt(n * endxx / (0.98 * this.data.windowWidth)) - 1;
      var starti = parseInt((startyy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
      var endi = parseInt((endyy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
      console.log(starti)
      console.log(endi)
      console.log(startj)
      console.log(endj)
      for (var i = starti; i <= endi; i++) {
        for (var j = startj; j <= endj; j++) {
          if (!intervalls[j][i]) {
            intervalls[j][i] = true;
          }
          else {
            intervalls[j][i] = false;
          }
        }
      }
      this.setData({
        intervals: intervalls,
      })
    }
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
  },
  testposition: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    console.log(sx)
    console.log(sy)
  }

})
