// pages/profile/profile.js
const date = new Date()
const day = []
const startTime = []
const endTime = []

for (let i = 1; i<=7; i++) {
  day.push(i);
}

for (let i = 0; i <= 23; i++) {
  startTime.push(i)
}

for (let i = 0; i <= 23; i++) {
  endTime.push(i)
}

Page({

  /**
   * Page initial data
   */
  data: {
    user: '',
    nickName:'',
    profilePic: '',
    day: day,
    startTime: startTime,
    endTime: endTime,
    intervals: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let that = this
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        that.setData({
          user: res.result.openId
        })
        that.setUser()
      }
    })


    //详情见云开发手册command eq,lt,gt,in,and等
    //此处查询theAttrYouSearch中等于aaa的记录

  },
  getUser: function(){
    // console.log('getUser')
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          profilePic: res.userInfo.avatarUrl
        })
        that.updateUser()
        // console.log("mydata" + that.data.nickName)
      }
    })
  },
  setUser: function() {
    let that = this
    const db = wx.cloud.database()
    const _ = db.commond
    try {
      db.collection("users").doc(that.data.user).get({
        fail: function() {
          console.log("fail" + that.data.user)
          db.collection("users").add({
            data: {
              _id: that.data.user,
              AttendEvent: 'test',
              SponsorEvent: '',
              nickName: '',
              profilePic:''
            }
          })
        }
      })
    } catch (e) {
      console.log(e)
    }

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
    this.getUser()
    this.updateInterval()
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('events').doc('test').update({
      data: {
        Attendee: {
          [this.data.user]: _.set((this.data.intervals))
        }
      }
    })
    wx.redirectTo({
      url: '/pages/masterEvent/masterEvent',
    })


  },
  updateInterval: function () {
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
  updateUser: function(){
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('users').doc(this.data.user).update({
      data: {
        AttendEvent: 'test',
        nickName: this.data.nickName,
        profilePic: this.data.profilePic,
      }
    })
  }

})
