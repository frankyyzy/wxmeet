 //app.js
 App({
   globalData: {
     appid: 'wxd6397161949fd434',
     secret: 'ee5b16d9d571a666979d75d38ee27c2c',
     user: null,
     AttendEvent: [],
     SponsorEvent: [],
     url: '/pages/profile/profile' //used in app.js and authorize.js, initial url to go to, include the eventID param
   },


   // implement login, authorize functionality, redirection if the user open the app for the first time 
   onLaunch: function(options) {

     wx.showLoading()

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
     var that = this
     wx.cloud.callFunction({
       name: 'login',
       complete: res => {
         that.globalData.user = res.result.openId
         that.setSponsorAndAttendEvent();

         if (options.query.share) {
           if (that.globalData.user === options.query.sponserId) {
             that.globalData.url = "/pages/masterEvent/masterEvent?eventId=" + options.query.eventId
           } else {
             that.globalData.url = "/pages/selectTime/selectTime?eventId=" + options.query.eventId //  otherwise go to selectTime
           }
         }

         wx.getSetting({
           success: function(res) {
             if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
               wx.getUserInfo({
                 success: function(res) {
                   that.updateUser(res.userInfo)
                   wx.redirectTo({
                     url: that.globalData.url
                   })
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
     })

   },


   // implement redirection for reopening the app
   onShow: function(options) {

     if (this.globalData.user != null) {

       setSponsorAndAttendEvent();

       if (options.query.share) {
         if (this.globalData.user === options.query.sponserId) {
           this.globalData.url = "/pages/masterEvent/masterEvent?eventId=" + options.query.eventId

         } else {

           this.globalData.url = "/pages/selectTime/selectTime?eventId=" + options.query.eventId

         }
       }
     }

     wx.redirectTo({
       url: this.globalData.url
     })

   },

   setSponsorAndAttendEvent: function() {
     var that = this;
     const db = wx.cloud.database()
     db.collection('users').where({
       _id: this.globalData.user
     }).get({
       success: function(res) {
         if (res.data.length == 0) {
           that.setNewUser()
           return
         }

         // n^2 solution, use hashmap for better performance
         that.globalData.SponsorEvent = res.data[0].SponsorEvent


         var allEvents = res.data[0].AttendEvent;
         var sponsorEventToSet = [];
         for (var AllEventTuple in allEvents) {
           var IsSponser = false;
           for (var SponserEventTuple in that.globalData.SponsorEvent) {
             if (SponserEventTuple === AllEventTuple) {
               IsSponser = true;
               break;
             }
           }
           if (!IsSponser) {
             sponsorEventToSet.push(AllEventTuple);
           }
         }
         that.globalData.AttendEvent = sponsorEventToSet;

       },
       fail: function(res){
         console.log("error");
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
     wx.redirectTo({
       url: '/pages/authorize/authorize'
     })
   },
   updateUser: function(info) {
     const db = wx.cloud.database()
     db.collection('users').doc(this.globalData.user).update({
       data: {
         nickName: info.nickName,
         profilePic: info.avatarUrl
       }
     })
   }
 })