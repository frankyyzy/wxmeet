//app.js
App({
  globalData: {
    appid: 'wxd6397161949fd434',
    secret: 'ee5b16d9d571a666979d75d38ee27c2c',
    user: null,
    AttendEvents: [],
    SponsorEvents: [],
    times: []
  },
  onLaunch: function() {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wxmeet-5taii',
        traceUser: true,
      })
    }
    wx.showLoading({
      title: '',
    })
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
              that.setNewUser()
            }
            wx.getSetting({
              success: function(res) {
                if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
                  wx.getUserInfo({
                    success: function(res) {
                      that.updateUser(res.userInfo)
                      // console.log(res.userInfo)
                      wx.hideLoading()
                      // wx.redirectTo({
                      //   url: '/pages/profile/profile', //授权页面
                      //   // url: '/pages/authorize/authorize', //授权页面

                      // })
                    }
                  })
                } else { //未授权，跳到授权页面
                  wx.redirectTo({
                    url: '/pages/authorize/authorize', //授权页面
                  })
                }
              }
            })
          }
        })
      }
    })

  },
  setNewUser: function() {
    const db = wx.cloud.database()
    db.collection('users').doc(this.globalData.user).set({
      data: {
        nickName: '',
        profilePic: '',
        SponsorEvent: [],
        AttendEvent: []
      }
    })
  },
  updateUser: function(info) {
    const db = wx.cloud.database()
    console.log(this.globalData.user)
    db.collection('users').doc(this.globalData.user).update({
      data: {
        nickName: info.nickName,
        profilePic: info.avatarUrl
      }
    })
  }


})