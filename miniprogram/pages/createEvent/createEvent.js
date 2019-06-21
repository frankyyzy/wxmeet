// pages/profile/profile.js

Page({

  /**
   * Page initial data
   */
  data: {
    user: '',
    nickName:'',
    profilePic: '',
    date: [ '小时','星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dates: [],
    datechoose: [0,0,0,0,0,0,0,0],
    totaldate: 0,
    start: -1,
    end: -1,
    intervals: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let that = this
    this.setData({
      edit: options.edit,
      user: app.globalData.user
    })
    console.log("edit" + this.data.edit)
  },
  updateTimes: function() {
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('events').doc('test').get({
      success: function(res) {
        that.calcTime(res.data.Attendee)
      }
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
    this.setData({
      user: app.globalData.user
    })
    // app.globalData.times = localArr
    wx.setStorageSync('times', localArr)
    // console.log("global" + localArr)
  },
  update(arr, localArr) {
    for (var i = 0; i < 24; i++) {
      if (arr[i]) localArr[i]++
    }
  },
  // getUser: function() {
  //   var that = this
  //   wx.getUserInfo({
  //     success: function(res) {
  //       that.setData({
  //         nickName: res.userInfo.nickName,
  //         profilePic: res.userInfo.avatarUrl
  //       })
  //       that.updateUser()
  //     }
  //   })
  // },
  // setUser: function() {
  //   let that = this
  //   const db = wx.cloud.database()
  //   const _ = db.commond
  //   try {
  //     db.collection("users").doc(that.data.user).set({
  //       data: {
  //         AttendEvent: 'test',
  //         SponsorEvent: '',
  //         nickName: '',
  //         profilePic: ''
  //       }
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // },
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

  bindStart: function(e) {
    this.setData({
      start: e.detail.value
    })
  },
  bindEnd: function(e) {
    this.setData({
      end: e.detail.value
    })
  },

  onSubmitTap: function() {
    wx.showLoading({
      title: '',
    })
    this.updateUser()
    this.updateInterval()
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: 'updateEvent',
      data: {
        id: that.data.user,
        intervals: that.data.intervals
      },
      success: res => {
        // console.log("time" + res.data)
        if (this.data.edit == true) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.redirectTo({
            url: '/pages/masterEvent/masterEvent',
          })
        }
      }
    })


  },
  updateInterval: function() {
    var arr = []
    for (var i = 0; i < 24; i++) {
      var value = false
      if (i >= this.data.start && i <= this.data.end) value = true
      arr[i] = value
    }
    this.setData({
      intervals: arr
    })
  },
  updateUser: function() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('users').doc(app.globalData.user).update({
      data: {
        AttendEvent: _.push(['test']),
        // nickName: this.data.nickName,
        // profilePic: this.data.profilePic,
      }
    })
  },
   checkboxChange: function (e) {
    var IDarray = e.detail.value
    this.setData({
      dates:IDarray
    })
    console.log(IDarray)
    var datechoos=[0,0,0,0,0,0,0,0]
    var total = IDarray.length
    for(var i = 0; i < IDarray.length;i++){
      datechoos[parseInt(IDarray[i])+1] = 1;
    }
    if (total>0){
      datechoos[0] = 1;
    }
    this.setData({
      datechoose:datechoos,
      totaldate:total
    })  
    var intervalss = [];
    for(var i = 0; i < this.data.totaldate; i++) {
      var interves = [];
      for(var j = 0; j < 24; j++) {    
        interves.push(false);
      }
      intervalss.push(interves);
      this.setData({
        intervals: intervalss
      })
      console.log(this.data.intervals)
    }
    
    
  },
  mytouchstart: function(e) {
    console.log(e.timeStamp + '- touch start')
  },
  //长按事件
  mylongtap: function(e) {
    console.log(e.timeStamp + '- long tap')
  },
  mytouchend: function(e) {
    console.log(e.timeStamp + '- touch end')
  },
  mytap: function (e) {
    var Name = parseInt(e.target.id[0])
    console.log(Name)
    var idd = e.target.id
    var ID = '';
    for(let i = 1; i<idd.length;i++){
      ID = ID +idd[i];
    }
    ID = parseInt(ID);
    console.log(ID)
    var interv = []
    interv = this.data.intervals
    if(!interv[Name][ID]){
      interv[Name][ID] = true;
    }
    else{
      interv[Name][ID] = false;
    }
    this.setData({
      intervals: interv
    })
    console.log()
  }

})
