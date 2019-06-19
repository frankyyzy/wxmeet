//app.js
App({
  globalData: {
    appid: 'wxd6397161949fd434',
    secret: 'ee5b16d9d571a666979d75d38ee27c2c'
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
  }
})