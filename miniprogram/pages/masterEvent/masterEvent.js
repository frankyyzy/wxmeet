// pages/group/group.js
const app = getApp()
const db = wx.cloud.database()
const totalNumOfHours = 24;
Page({

  /**
   * Page initial data
   */
  data: {
    attendee: new Array(totalNumOfHours),
    color: [[]],
    nullHouse: true, //先设置隐藏
    display: "",
    pics: [],
    numOfPics: 0,
    times: [[]],
    // times: wx.getStorageSync('times'),
    timer: null,
    dates: [],
    Attendee: {},
    width_percent: 0,
    totaldate: 0,
    date: ['小时', '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    datechoose: [0, 0, 0, 0, 0, 0, 0, 0],
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
        
        that.setData({
          dates: res.result.data[0].dates,
          Attendee: res.result.data[0].Attendee,
          totaldate: res.result.data[0].dates.length
        });
        that.setDateChoose();


      }, fail: function (res) {

        console.log("error")
      }
    })

  },

  setDateChoose: function(){
    var dateToChoose = [1, 0, 0, 0, 0, 0, 0, 0];
    for (var i in this.data.dates){
      dateToChoose[parseInt(this.data.dates[i])+1] = 1;
      this.setData({
        datechoose: dateToChoose
      })
    }
  },

  setcolor: function(NumOfPeople){


    //initialize 2d array
    var arr = new Array(this.data.times.length).fill(0).map(() => new Array(this.data.times[0].length).fill(0));

    for (var i = 0; i < this.data.times.length; i++){
      for ( var j = 0 ; j < this.data.times[0].length; j++){
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

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    var that = this
    this.adjustTimeTable()
    this.setData({
      timer: setInterval(function () {
        that.adjustTimeTable()
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
  
    for (var id in attendeeArr){
        this.calcTime(timesToSet,attendeeArr[id]);
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

  calcTime: function(timesToSet,multiDaySchedule) {
    for (var dayindex=0;  dayindex< multiDaySchedule.length; dayindex++ ){
      this.update(timesToSet,dayindex, multiDaySchedule[dayindex] )
    }
    // var localArr = []
    // for (var i = 0; i < totalNumOfHours; i++) {
    //   localArr[i] = 0
    // }
    // for (var i in arr) {
    //   this.update(arr[i], localArr)
    // }
    
    this.setData({
      times: timesToSet
    })
    // wx.hideLoading()
    // wx.setStorageSync('times', app.globalData.times)
  },

  update(timesToSet,dayindex,singleDaySchedule) {

    //update times array totalNumOfHours * totaldates
    for (var i = 0; i < totalNumOfHours; i++) {
      if (singleDaySchedule[i]) timesToSet[i][dayindex]++
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
    console.log(this.data.Attendee)

    // for ( var key in this.data.Attendee[ID]){
      
    //   var id = this.data.attendee[ID][key];
    //   var that = this;


    //   //get url from the user id 
    //   db.collection('users').doc(id).get({
    //     success: function (res) {
    //       // res.data 包含该记录的数据
    //       picUrl.push(res.data.profilePic)
    //       that.setData({
    //         pics: picUrl
    //       })
    //       that.setData({
    //         display: numOfPicsToShow.toString() + " people are available",
    //         nullHouse: false
    //       })

    //     },

    //     error: e =>{
    //       console.log("error")
    //     }
    //   })

    // }


  },
  onTouchEnd: function() {
  
    this.setData({
      nullHouse: true
    })
  }

})