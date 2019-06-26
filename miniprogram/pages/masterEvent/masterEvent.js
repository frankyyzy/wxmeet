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
    sponser: "",
    createDate: -1,
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
    wx.cloud.callFunction({
      name: 'getEventTime',
      data: {
        eventID: that.data.eventId,
      },
      success: function(res) {
       
        
        
        that.setData({
          dates: res.result.data[0].dates,
          Attendee: res.result.data[0].Attendee,
          totaldate: res.result.data[0].dates.length,
          eventName: res.result.data[0].eventName,
          sponser: res.result.data[0].Sponser,
          createDate: res.result.data[0].createDate,
        });
        console.log(that.data.sponser)

        that.adjustTimeTable()
        wx.hideLoading()


      },
      fail: function(res) {

        console.log("error")
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
    return({
      title: '分享'+ that.data.eventName,
      path: '/pages/loading/loading?share=true&eventId=' + that.data.eventId + "&sponserId=" + that.data.sponser + "&eventName=" + that.data.eventName + "&createTime=" + that.data.createDate,
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
   

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
  }


})