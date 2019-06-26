 //app.js
 App({
   globalData: {
     appid: 'wxd6397161949fd434',
     secret: 'ee5b16d9d571a666979d75d38ee27c2c',
     user: null,
     eventId: null,
     AttendEvent: [],
     SponsorEvent: [],
     url: '/pages/profile/profile',
     times: []
   },
   onLaunch: function(options) {
    //  console.log("hi")
     if (!wx.cloud) {
       console.error('请使用 2.2.3 或以上的基础库以使用云能力')
     } else {
       wx.cloud.init({
         env: 'wxmeet-5taii',
         traceUser: true,
       })
     }
     var that = this
    //  wx.showLoading()
     if (options.url) {
       that.globalData.url = options.url
       that.globalData.eventId = options.eventId
       console.log('my id' + options.eventId)
     }
     wx.cloud.callFunction({
       name: 'login',
       complete: res => {
         that.globalData.user = res.result.openId
         console.log(that.globalData.user)

         const db = wx.cloud.database()
         db.collection('users').doc(that.globalData.user).get({
           fail: function() {
             that.setNewUser()
           },
           success: function(res) {
             var SponsorEvent = res.data.SponsorEvent
             var AttendEvent = {}
             for (var id in res.data.AttendEvent) {
               if (!SponsorEvent[id]) AttendEvent[id] = res.data.Attendee[id]
             }
             that.globalData.SponsorEvent = SponsorEvent
             that.globalData.AttendEvent = AttendEvent
             wx.getSetting({
               success: function(res) {
                 if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
                   wx.getUserInfo({
                     success: function(res) {
                       that.updateUser(res.userInfo)
                       wx.hideLoading()
                       var turn = that.globalData.url
                      //  wx.redirectTo({
                      //    url: turn + '?eventId=' + that.globalData.eventId,
                      //  })
                     }
                   })
                 } else { //未授权，跳到授权页面
                   wx.redirectTo({
                     url: '/pages/authorize/authorize', //授权页面
                   })
                 }
               },
               fail: function() {
                 console.log("fail1")
               }
             })
           }
         })
       }
     })
   },
   onShow: function(options) {
     if (options.query.url && this.globalData.user != null) {
       wx.redirectTo({
         url: options.query.url + '?eventId=' + options.query.eventId,
       })
     }
   },
   setNewUser: function() {
     let that = this
     wx.cloud.callFunction({
       name: 'createUser',
       data: {
         id: that.globalData.user,
       },
       success: res => {
         console.log('创建用户成功！')
         wx.redirectTo({
           url: '/pages/authorize/authorize'
         })
       }
     })
   },
   updateUser: function(info) {
     console.log(info.nickName)
     console.log(this.globalData.user)
     wx.cloud.callFunction({
       name: 'updateUser',
       data: {
         id: this.globalData.user,
         nickName: info.nickName,
         profilePic: info.avatarUrl,
       },
       success: res => {
         console.log('更新用户数据成功！')
       }
     })
   }
 })