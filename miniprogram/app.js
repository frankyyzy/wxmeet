 //app.js
 App({
   globalData: {
     user: null,
     authorize: false,
     AttendEvent: [],
     SponsorEvent: [],
     url: '/pages/profile/profile', //used in app.js and authorize.js, initial url to go to, include the eventID param
     userSet: false
   },


   // implement login, authorize functionality, redirection if the user open the app for the first time 
   onLaunch: function(options) {

     //  wx.showLoading();
     var that = this
     //cloud ability init
     if (!wx.cloud) {
       console.error('请使用 2.2.3 或以上的基础库以使用云能力')
     } else {
       wx.cloud.init({
         env: 'wxmeet-5taii',
         traceUser: true,
       })
     } 
     //perform login and authorization
     wx.cloud.callFunction({
       name: 'login',
       complete: res => {
         that.globalData.user = res.result.openId
         that.checkAuthorize()
         if (options.query.share) {
           if (that.globalData.user === options.query.sponserId) {
             that.globalData.url = "/pages/masterEvent/masterEvent?eventId=" + options.query.eventId
           } else {
             that.globalData.url = "/pages/masterEvent/masterEvent?share=true&eventId=" + options.query.eventId + '&eventName=' + options.query.eventName + '&createTime=' + options.query.createTime + '&datesArr=' + (options.query.datesArr) //  otherwise go to selectTime
           }
         }
         that.setSponsorAndAttendEvent();
       }
     })

   },


   // implement redirection for reopening the app
   onShow: function(options) {
     var that = this
     if (this.globalData.user != null) {
       this.checkAuthorize()
       if (options.query.share) {
         if (this.globalData.user === options.query.sponserId) {
           this.globalData.url = "/pages/masterEvent/masterEvent?eventId=" + options.query.eventId

         } else {
           that.globalData.url = "/pages/masterEvent/masterEvent?share=true&eventId=" + options.query.eventId + '&eventName=' + options.query.eventName + '&createTime=' + options.query.createTime + '&datesArr=' + (options.query.datesArr) //  otherwise go to selectTime

         }
         this.setSponsorAndAttendEvent()
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
           if (!SponsorEvent[id]) {
             AttendEvent[id] = res.data.AttendEvent[id]
           }

         }

         that.globalData.SponsorEvent = SponsorEvent
         that.globalData.AttendEvent = AttendEvent
         wx.redirectTo({
           url: that.globalData.url,
         })
       },
     })
   },
   checkAuthorize: function() {
     let that = this
     wx.getSetting({
       success: function(res) {
         if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
           wx.getUserInfo({
             success: function(res) {
               that.updateUser(res.userInfo)
               that.globalData.authorize = true

             },
             fail: function() {
               console.log("fail")
               that.globalData.authorize = false
             }
           })
         } else { //if the user is not authorize 
           that.globalData.authorize = false
         }
       },
       fail: function() {
         that.globalData.authorize = false
         console.log("can't get setting")
       }
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
         that.setSponsorAndAttendEvent()
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
       success: res => {}
     })
   }
 })