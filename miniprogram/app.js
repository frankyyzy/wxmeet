//app.js
App({
  globalData: {
    appid: 'wxd6397161949fd434',
    secret: 'ee5b16d9d571a666979d75d38ee27c2c',
    times: []
  },
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wxmeet-5taii',
        traceUser: true,
      })
    }

    // this.globalData.times = wx.getStorageSync('attendee')
    // console.log(this.globalData.times)
    // for(var i = 0; i < 24; i++) 
    // this.globalData.times[i] = 0
    // wx.setStorageSync('times', this.globalData.times)
    // this.updateTimes()
  },

})