 //app.js
 App({
   globalData: {
     appid: 'wxd6397161949fd434',
     secret: 'ee5b16d9d571a666979d75d38ee27c2c',
     user: null,
     AttendEvent: [],
     SponsorEvent: [],
     url: '/pages/profile/profile', //used in app.js and authorize.js, initial url to go to, include the eventID param
     userSet: false
   },


   // implement login, authorize functionality, redirection if the user open the app for the first time 
   onLaunch: function(options) {

    //  wx.showLoading()

     //cloud ability init
     if (!wx.cloud) {
       console.error('请使用 2.2.3 或以上的基础库以使用云能力')
     } else {
       wx.cloud.init({
         env: 'wxmeet-5taii',
         traceUser: true,
       })
     }
     if (options.query.share) {
       if (that.globalData.user === options.query.sponserId) {
         that.globalData.url = "/pages/masterEvent/masterEvent?eventId=" + options.query.eventId
       } else {
         that.globalData.url = "/pages/selectTime/selectTime?eventId=" + options.query.eventId + '&eventName=' + options.query.eventName + '&createTime=' + options.query.createTime //  otherwise go to selectTime
       }
     }
     //perform login and authorization
     var that = this
     wx.cloud.callFunction({
       name: 'login',
       complete: res => {
         that.globalData.user = res.result.openId
         that.setSponsorAndAttendEvent()
       }
     })

   },


   // implement redirection for reopening the app
   onShow: function(options) {
    //  console.log(options)
     if (this.globalData.userSet) {

       this.setSponsorAndAttendEvent();


       console.log(options)
       console.log(this.globalData)

       if (options.query.share) {
         if (this.globalData.user === options.query.sponserId) {
           this.globalData.url = "/pages/masterEvent/masterEvent?eventId=" + options.query.eventId

         } else {
           that.globalData.url = "/pages/selectTime/selectTime?eventId=" + options.query.eventId + '&eventName=' + options.query.eventName + '&createTime=' + options.query.createTime

         }
         wx.redirectTo({
           url: this.globalData.url
         })
       }
     }
   },

   setSponsorAndAttendEvent: function() {
     var that = this;
     const db = wx.cloud.database()
     db.collection('users').doc(that.globalData.user).get({
       fail: function() {
         that.setNewUser()
       },
       success: function(res) {

         var SponsorEvent = res.data.SponsorEvent

         var AttendEvent = {}
         for (var id in res.data.AttendEvent) {

           console.log(SponsorEvent[id])
           if (!SponsorEvent[id]) {
             console.log("here")
             console.log(id)
             console.log(AttendEvent)
             console.log(res.data)
             AttendEvent[id] = res.data.AttendEvent[id]
             console.log("set correct")
           }

         }
         console.log("outa here")

         that.globalData.SponsorEvent = SponsorEvent
         that.globalData.AttendEvent = AttendEvent
         if (that.globalData.userSet == false) {
           wx.getSetting({
             success: function(res) {
               if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
                 wx.getUserInfo({
                   success: function(res) {
                     that.updateUser(res.userInfo)
                     that.globalData.userSet = true
                    //  wx.redirectTo({
                    //    url: that.globalData.url
                    //  })
                   },
                   fail: function() {
                     console.log("fail")
                   }
                 })
               } else { //未授权，跳到授权页面
                 wx.redirectTo({
                   url: '/pages/authorize/authorize', //授权页面
                 })
               }
             },
             fail: function() {
               console.log("can't get setting")
             }
           })
         }
       },
     })
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