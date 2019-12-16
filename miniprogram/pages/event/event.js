// pages/group/group.js
const app = getApp()
const db = wx.cloud.database()
const totalNumOfHours = 24;
Page({

  /**
   * Page initial data
   */
  data: {
    color: [
      []
    ],
    nullHouse: true, //先设置隐藏
    display: "",
    pics: {},
    numOfPics: 0,
    times: [
      []
    ],
    timer: null,
    dates: [],
    Attendee: {},
    width_percent: 0,
    totaldate: 0,
    eventName: "",
    eventId: '',
    sponser: "",
    createDate: -1,
    rowHeight: 30 // in px
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log(options)
    wx.showLoading({})
    var that = this
    if (options.share) {
      wx.navigateTo({
        url: '/pages/selectTime/selectTime?share=true&eventId=' + options.eventId + '&eventName=' + options.eventName + '&createTime=' + options.createTime + '&datesArr=' + (options.datesArr) //  otherwise go to selectTime
      })
    }
    this.setData({
      eventId: options.eventId,
    })

    // set the height of each row 
    wx.getSystemInfo({
      success: function(res) {

        // 高度,宽度 单位为px
        that.setData({
          rowHeight: (res.windowHeight / 30)
        })
      }
    });
    if (app.globalData.authorize == false) {
      wx.navigateTo({
        url: '/pages/authorize/authorize',
      })
    }


  },

  setcolor: function(NumOfPeople) {


    //initialize 2d array
    var arr = new Array(this.data.times.length).fill(0).map(() => new Array(this.data.times[0].length).fill(0));

    for (var i = 0; i < this.data.times.length; i++) {
      for (var j = 0; j < this.data.times[0].length; j++) {
        arr[i][j] = "rgba(0, 151, 19," + (this.data.times[i][j] / NumOfPeople) + ")";
      }
    }
    this.setData({
      color: arr
    })

  },

  /** 
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },
  onShareAppMessage: function() {
    let that = this
    return ({
      title: '分享' + that.data.eventName,
      path: '/pages/loading/loading?share=true&eventId=' + that.data.eventId + "&sponserId=" + that.data.sponser + "&eventName=" + that.data.eventName + "&createTime=" + that.data.createDate + "&datesArr=" + JSON.stringify(that.data.dates),
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {


    var that = this;
    this.updateEventFromDB();

    this.setData({
      timer: setInterval(function() {
        //db call?
        that.updateEventFromDB();
      }, 10000)
    })
  },
  updateUser: function(info) {
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        id: app.globalData.user,
        nickName: info.nickName,
        profilePic: info.avatarUrl,
      },
      success: res => {}
    })
  },
  clear: function() {
    var arr = []
    for (var i = 0; i < totalNumOfHours; i++) {
      arr[i] = 0;
    }
    this.setData({
      times: arr
    })
  },
  updateEventFromDB: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'getEventTime',
      data: {
        eventID: that.data.eventId,
      },
      success: function(res) {


        let user = app.globalData.user
        that.setData({
          dates: res.result.data[0].dates,
          Attendee: res.result.data[0].Attendee,
          totaldate: res.result.data[0].dates.length,
          eventName: res.result.data[0].eventName,
          sponser: res.result.data[0].Sponser,
          createDate: res.result.data[0].createDate,

        });
        that.adjustTimeTable()
        that.attendeeUrl()
        wx.hideLoading()


      },
      fail: function() {
        console.log("error")
      }
    })
  },
  attendeeUrl: function() {
    var that = this;
    var picUrl = [];
   
    for (var id in this.data.Attendee) {
 
      db.collection('users').doc(id).get({
        success: function(res) {
          // res.data 包含该记录的数据
          picUrl.push(res.data.profilePic)
          that.setData({
            pics: picUrl
          })
        },

        error: e => {
          console.log("error")
        }
      })
    }
   
  },

  adjustTimeTable: function() {


    var attendeeArr = this.data.Attendee;

    var timesToSet = new Array(totalNumOfHours);

    for (var i = 0; i < timesToSet.length; i++) {
      timesToSet[i] = new Array(this.data.totaldate).fill(0)
    }

    for (var id in attendeeArr) {
      this.calcTime(timesToSet, attendeeArr[id]);
    }

    this.setcolor(Object.keys(attendeeArr).length) // pass in total number of people 

  },


  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {
    clearInterval(this.data.timer)
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {
    clearInterval(this.data.timer)
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  calcTime: function(timesToSet, multiDaySchedule) {
    for (var dayindex = 0; dayindex < multiDaySchedule.length; dayindex++) {
      this.update(timesToSet, dayindex, multiDaySchedule[dayindex])
    }
    this.setData({
      times: timesToSet
    })
  },

  update(timesToSet, dayindex, singleDaySchedule) {

    //update times array totalNumOfHours * totaldates
    for (var i = 0; i < totalNumOfHours; i++) {
      if (singleDaySchedule[i]) timesToSet[i][dayindex]++
    }
  },

  onTouchStart: function(e) {
    if (app.globalData.authorize == false) {
      wx.navigateTo({
        url: '/pages/authorize/authorize',
        success: function() {
          wx.showToast({
            title: '此功能仅限授权用户',
            icon: 'none',
            duration: 2000
          })
        }
      })
      return
    }
    var that = this
    var i = parseInt(e.target.dataset.i)
    var j = parseInt(e.target.dataset.j)

    // set number of pictures to show
    var numOfPicsToShow = this.data.times[i][j]
    this.setData({
      numOfPics: numOfPicsToShow,
      display: this.data.times[i][j].toString() + ((this.data.times[i][j] == 1) ? " person " : " people ") + "available on " + this.data.dates[j] + " between " + i.toString() + " to " + (i + 1).toString(),
      nullHouse: false
    })

    // // set the url for profile pics 
    // var attendeeID = [];

    // var attendeeDict = this.data.Attendee;

    // for (var id in attendeeDict) {

    //   if (attendeeDict[id][j]) { // validity check, this shouldn't be necessary if the database is in correct format
    //     if (attendeeDict[id][j][i]) {
    //       attendeeID.push(id);
    //     }
    //   }
    // }
    // var picUrl = []
    // //get pics or set default pic
    // for (var id of attendeeID) {
    //   if (this.data.attendeeID[id] == '') {
    //     picUrl.push('/image/default.png')
    //   } else {
    //     picUrl.push(this.data.attendeeID[id])
    //   }
    // }
    // picUrl.sort()
    // that.setData({
    //   pics: picUrl
    // })
  },

  onTouchEnd: function() {

    this.setData({
      nullHouse: true
    })
  },


  onBackHomeTap: function() {
    wx.reLaunch({
      url: '/pages/profile/profile',
    })
  },
  onEditTap: function() {
    //var edit = true
    var that = this
    let user = app.globalData.user
    let userIntervals = that.data.Attendee[user]
    wx.navigateTo({
      url: '/pages/selectTime/selectTime?eventId=' + that.data.eventId + '&eventName=' + that.data.eventName + '&datesArr=' + JSON.stringify(that.data.dates) + '&userIntervals=' + JSON.stringify(userIntervals) + '&createDate=' + that.data.createDate,
    })
  },
  onEndTap: function() {}


})