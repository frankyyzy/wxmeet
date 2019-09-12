// pages/profile/profile.js
const app = getApp();

Page({
  /**
   * Page initial data
   */
  data: {
    user: '',
    dates: [],
    totaldate: 3,
    isCreate: false,
    intervals: [],
    prevIntervals: [], // array to store intervals before this touch operation
    toSet: false,
    eventId: '',
    eventName: '',
    createTime: -1,
    windowHeight: 0,
    windowWidtht: 0,
    timer: null,
    startHour: null,
    startDate: null,
    rowHeight: 30 // in px, hardcoded for now
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let that = this
    var datesTitle = ["小时"]
    if (options.isCreate) {
      datesTitle = datesTitle.concat(JSON.parse(options.datesArr))
      console.log(datesTitle);
      that.setData({
        eventName: options.eventName,
        dates: datesTitle,
        totaldate: datesTitle.length,
        user: app.globalData.user,
        isCreate: options.isCreate
      })
      var intervals = [];
      for (var i = 0; i < that.data.totaldate - 1; i++) {
        var interves = [];
        for (var j = 0; j < 24; j++) {
          interves.push(false);
        }
        intervals.push(interves);
      }
      that.setData({
        intervals: intervals
      })
    }
    else{
      console.log("not creating event")
    }
    // const db = wx.cloud.database()
    // const _ = db.command
    // db.collection('events').where({
    //   _id: that.data.eventId
    // }).get({
    //   success: function(res) {
    //     var passdates = res.data[0].dates;
    //     var curdates = ["小时"]
    //     var datechoose = [0]
    //     for (let i = 0; i < passdates.length; i++) {
    //       curdates.push(passdates[i])
    //       datechoose.push(i + 1)
    //     }
    //     var total = curdates.length
    //     that.setData({
    //       dates: curdates,
    //       totaldate: total,
    //       datechoose: datechoose
    //     })
    //     var intervals = [];
    //     for (var i = 0; i < that.data.totaldate - 1; i++) {
    //       var interves = [];
    //       for (var j = 0; j < 24; j++) {
    //         interves.push(false);
    //       }
    //       intervals.push(interves);
    //       that.setData({
    //         intervals: intervals
    //       })
    //     }


    //   }

    // })




    // set the height of each row 
    wx.getSystemInfo({
      success: function(res) {

        // 高度,宽度 单位为px
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          rowHeight: (res.windowHeight / 30)
          // rowHeight: 30
        })
        console.log(that.data.rowHeight)

      }
    })


  },

  blockTouchStart: function(e) {

    // deep copy 2d array
    let intervalToSet = []
    for (let dayArr of this.data.intervals) {
      let temp = []
      for (let value of dayArr) {
        temp.push(value);
      }
      intervalToSet.push(temp);

    }
    this.data.prevIntervals = intervalToSet;

    var date = parseInt(e.target.id[0]); // 0th char
    var hour = parseInt(e.target.id.substr(1)); // 1st to end 

    this.data.startDate = date;
    this.data.startHour = hour;

    this.setData({
      toSet: !this.data.prevIntervals[date][hour]
    })


  },

  blockTouchMove: function(e) {

    var horizontal = e.changedTouches[0].pageX;
    var vertical = e.changedTouches[0].pageY;
    var n = this.data.totaldate;

    var date = parseInt(n * horizontal / (0.98 * this.data.windowWidth)) - 1;
    var hour = vertical / this.data.rowHeight - 1;


    var sHour = this.data.startHour;
    var sDate = this.data.startDate;


    // deep copy 2d array
    var intervalToSet = [];

    for (let dayArr of this.data.prevIntervals) {
      let temp = []
      for (let value of dayArr) {
        temp.push(value);
      }
      intervalToSet.push(temp);
    }

    if (date >= sDate) {
      for (let currDate = sDate; currDate <= date; currDate++) {
        if (hour > sHour) {
          for (var i = sHour; i <= hour; i++) {
            intervalToSet[currDate][i] = this.data.toSet;
          }
        } else {
          for (var i = Math.floor(hour); i <= sHour; i++) {
            intervalToSet[currDate][i] = this.data.toSet;
          }
        }
      }
    } else {
      for (let currDate = date; currDate <= sDate; currDate++) {
        if (hour > sHour) {
          for (var i = sHour; i <= hour; i++) {
            intervalToSet[currDate][i] = this.data.toSet;
          }
        } else {
          for (var i = Math.floor(hour); i <= sHour; i++) {
            intervalToSet[currDate][i] = this.data.toSet;
          }
        }
      }

    }



    this.setData({
      intervals: intervalToSet
    })

  },


  blockTouchEnd: function(e) {
    this.setData({
      prevIntervals: this.data.intervals
    });

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
  onSubmitTap: function() {
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    var createTime = new Date().getTime()
    wx.cloud.callFunction({
      name: 'creatEvent',
      data: {
        id: that.data.user,
        name: that.data.eventName,
        dates: that.data.dates,
        createDate: createTime,
      },
      success: res => {
        that.setData({
          eventId: res.result._id
        })
        that.updateAttendeeOfEvent(createTime)
      }
    })
  },
  updateAttendeeOfEvent: function(createTime) {
    wx.showLoading({
      title: '',
    })
    wx.navigateBack({
      delta:2
    })
    this.updateSponsorAndAttendee(createTime)
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
        wx.navigateTo({
          url: '/pages/masterEvent/masterEvent?eventId=' + that.data.eventId,
        })
      }
    })
  },
  // onSubmitTap1: function() {
  //   wx.showLoading({
  //     title: '',
  //   })
  //   this.updateUser()
  //   var that = this
  //   const db = wx.cloud.database()
  //   const _ = db.command
  //   wx.cloud.callFunction({
  //     name: 'testupdate',
  //     data: {
  //       eventId: that.data.eventId,
  //       id: that.data.user,
  //       dates: that.data.dates,
  //       times: that.data.intervals,
  //     },
  //     success: res => {
  //       // console.log(that.data.eventId)
  //       wx.redirectTo({
  //         url: '/pages/masterEvent/masterEvent?eventId=' + that.data.eventId,
  //       })
  //     }
  //   })
  // },

  updateSponsorAndAttendee: function(createTime) {
    var that = this
    wx.cloud.callFunction({
      name: 'updateSponsorEvent',
      data: {
        id: that.data.user,
        eventId: that.data.eventId,
        eventName: that.data.eventName,
        createTime: createTime
      },
      success: res => {
        console.log('新增用户创建事件！')
        wx.cloud.callFunction({
          name: 'updateAttendEvent',
          data: {
            id: that.data.user,
            eventId: that.data.eventId,
            eventName: that.data.eventName,
            createTime: createTime
          },
          success: res => {}
        })
      }
    })
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
  }

})