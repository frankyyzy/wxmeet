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
    nullHouse: true,  //先设置隐藏
    display: "",
    times: app.globalData.times,
    pics: [],
    numOfPics: [0,1],
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
    const db = wx.cloud.database()
    var that = this
    this.getTime()
    setInterval(function() {
      that.getTime()
    }, 10000)

    
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

  getTime: function () {
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
    app.globalData.times = localArr
    this.setData({
      times: app.globalData.times
    })
    this.setcolor(Object.keys(arr).length)
    wx.setStorageSync('times', app.globalData.times)
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
    wx.redirectTo({
      url: '/pages/createEvent/createEvent',
    })
  },
  onTouchStart: function(e){
    var ID = parseInt(e.target.id)

    // set number of pictures to show
    var numOfPicsToShow = this.data.times[ID]
    this.setData({
      numOfPics: Array(numOfPicsToShow).fill().map((v, i) => i)
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
  onTouchEnd: function () {
    wx.hideToast();
    this.setData({
      nullHouse: true
    })
  }

})