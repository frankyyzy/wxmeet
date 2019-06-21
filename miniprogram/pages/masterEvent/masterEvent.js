// pages/group/group.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * Page initial data
   */
  data: {
    attendee: new Array(24),
    color: [],
    nullHouse: true, //先设置隐藏
    display: "",
    pics: [],
    numOfPics: [0,1],
    times: wx.getStorageSync('times'),
    timer: null,
    dates: [],
    Attendee: {},
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    var that = this
    wx.cloud.callFunction({
      name: 'getEventTime',
      data: {
        eventID: 'test_event',
      }, success: function (res) {
        console.log(res.result.data[0])
        that.data.dates = res.result.data[0].dates
        that.data.Attendee = res.result.data[0].Attendee
        console.log("dates:" + that.data.dates)
        console.log(that.data.Attendee)
      }, fail: function (res) {
        console.log(res)
      }
    })



  },

  setcolor: function(NumOfPeople){
 
    var arr = []
    for (var i = 0; i < this.data.times.length; i++) {
      arr[i] = "rgba(0, 151, 19," + (this.data.times[i] / NumOfPeople) + ")";
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

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    var that = this
    this.getTime()
    this.setData({
      timer: setInterval(function () {
        that.getTime()
      }, 10000)
    })

  },

  clear: function() {
    var arr = []
    for (var i = 0; i < 24; i++) {
      arr[i] = 0;
    }
    this.setData({
      times: arr
    })
  },

  getTime: function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('events').doc('test').get({
      success: function(res) {
        that.calcTime(res.data.Attendee);
        that.updateAttendee(res.data.Attendee);
      }
    })
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
  updateAttendee: function (dict_id_to_scheduleArr) {
    var attendeeArr = [[]];
   
  

    for (var id in dict_id_to_scheduleArr){
      var scheduleArr = dict_id_to_scheduleArr[id]
     
      for (var i = 0; i < 24; i++) {
        if (scheduleArr[i]) {
          if (attendeeArr[i]){
            attendeeArr[i].push(id);
          } else {
            attendeeArr[i] = [id];
          }
        
        }
      }
    }
    
    this.setData({
      attendee: attendeeArr
    })
  },

  calcTime: function(arr) {
    var localArr = []
    for (var i = 0; i < 24; i++) {
      localArr[i] = 0
    }
    for (var i in arr) {
      this.update(arr[i], localArr)
    }
    console.log(Object.keys(arr).length)
    // app.globalData.times = localArr
    this.setData({
      times: localArr
    })
    this.setcolor(Object.keys(arr).length)
    wx.hideLoading()
    // wx.setStorageSync('times', app.globalData.times)
  },

  update(arr, localArr) {
    for (var i = 0; i < 24; i++) {
      if (arr[i]) localArr[i]++
    }
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
  onTouchStart: function(e) {
    var ID = parseInt(e.target.id)

    // set number of pictures to show
    var numOfPicsToShow = this.data.times[ID]
    this.setData({
      numOfPics: Array(numOfPicsToShow).fill().map((v, i) => i),
      display: this.data.times[ID].toString() + " people are available",
      nullHouse: false
    })
    
    // set the url for profile pics 
    var picUrl = [];

    for ( var key in this.data.attendee[ID]){
      
      var id = this.data.attendee[ID][key];
      var that = this;


      //get url from the user id 
      db.collection('users').doc(id).get({
        success: function (res) {
          // res.data 包含该记录的数据
          picUrl.push(res.data.profilePic)
          console.log(id)
          console.log(picUrl)
          that.setData({
            pics: picUrl
          })
          that.setData({
            display: numOfPicsToShow.toString() + " people are available",
            nullHouse: false
          })

        },

        error: e =>{
          console.log(e)
        }
      })

    }


  },
  onTouchEnd: function() {
    wx.hideToast();
    this.setData({
      nullHouse: true
    })
  }

})