//app.js
App({
  globalData: {
    appid: 'wxd6397161949fd434',
    secret: 'ee5b16d9d571a666979d75d38ee27c2c',
    user: null,
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
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        this.globalData.user = res.result.openId
        const db = wx.cloud.database()
        db.collection('users').where({
          _id: this.globalData.user
        }).get({
          success: function(res) {
            if (res.data.length == 0) {
              wx.redirectTo({
                url: '../authorize/authorize', //授权页面
              })
            } else {
              wx.getSetting({
                success: (res) => {
                  if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
                    wx.getUserInfo({
                      success: (res) => {
                        console.log(res)
                      }
                    })
                  } else { //未授权，跳到授权页面
                    wx.redirectTo({
                      url: '../authorize/authorize', //授权页面
                    })
                  }
                }
              })
            }
          }
        })
      }
    })

  },


})