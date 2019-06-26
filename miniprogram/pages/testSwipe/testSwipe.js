// pages/detail/detail.js
const app = getApp()
const db = wx.cloud.database()
const totalNumOfHours = 24;
Page({

  /**
   * Page initial data
   */
  data: {
    currentTab: 0,
    color: [
      []
    ],
    nullHouse: true, //先设置隐藏
    display: "",
    pics: [],
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
    
    user: '',
    dates: [],
    datechoose: [0, 0, 0, 0, 0, 0, 0, 0],
    totaldate: 0,
    start: -1,
    end: -1,
    edit: false,
    intervals: [],
    createTime: -1,
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '',
    })

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    var that = this
    this.setData({
      eventId: options.eventId,
    })
    console.log('myId' + this.data.eventId)
    wx.cloud.callFunction({
      name: 'getEventTime',
      data: {
        eventID: that.data.eventId,
      },
      success: function(res) {
        console.log("entering ")

        that.setData({
          dates: res.result.data[0].dates,
          Attendee: res.result.data[0].Attendee,
          totaldate: res.result.data[0].dates.length,
          eventName: res.result.data[0].eventName,
        });

        that.adjustTimeTable()
        wx.hideLoading()


      },
      fail: function(res) {

        console.log("error")
      }
    })
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
      path: '/pages/loading/loading?url=/' + that.route + '&eventId=' + that.data.eventId
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    console.log("showing")

    var that = this
    this.adjustTimeTable()


    this.setData({
      timer: setInterval(function() {
        wx.showLoading({
          title: '',
        })
        //db call?
        that.adjustTimeTable()
        wx.hideLoading()
      }, 10000)
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

  adjustTimeTable: function() {

    console.log("adjusting")

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
    var i = parseInt(e.target.dataset.i)
    var j = parseInt(e.target.dataset.j)

    // set number of pictures to show
    var numOfPicsToShow = this.data.times[i][j]
    this.setData({
      numOfPics: numOfPicsToShow,
      display: this.data.times[i][j].toString() + " people are available",
      nullHouse: false
    })

    // set the url for profile pics 
    var picUrl = [];
    var attendeeID = [];

    var attendeeDict = this.data.Attendee;

    for (var id in attendeeDict) {

      if (attendeeDict[id][j]) { // validity check, this shouldn't be necessary if the database is in correct format
        if (attendeeDict[id][j][i]) {
          attendeeID.push(id);
        }
      }
    }

    // get profile pics from id 
    for (var id of attendeeID) {

      var that = this
      //get url from the user id 
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

  onTouchEnd: function() {

    this.setData({
      nullHouse: true
    })
  },


  onBackHomeTap: function() {
    wx.redirectTo({
      url: '/pages/profile/profile',
    })
  },
  onEditTap: function() {
    var edit = true
    wx.navigateTo({
      url: '/pages/createEvent/createEvent?edit=' + edit,
    })
  },
  onEndTap: function() {
    // wx.cloud.callFunction({
    //   name: 'removeEvent',
    //   data: {
    //     eventId: that.data.eventId,
    //     id: that.data.user,
    //     dates: that.data.dates,
    //     times: that.data.intervals,
    //   },
    //   success: res => {
    //     console.log(that.data.eventId)
    //     console.log('更新数据成功')
    //     wx.redirectTo({
    //       url: '/pages/masterEvent/masterEvent?eventId=' + that.data.eventId,
    //     })
    //   }
    // })
  },
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})