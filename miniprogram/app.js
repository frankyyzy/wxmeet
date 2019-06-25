 //app.js
 App({
   globalData: {
     appid: 'wxd6397161949fd434',
     secret: 'ee5b16d9d571a666979d75d38ee27c2c',
     user: null,
     eventId:null,
     AttendEvent: [],
     SponsorEvent: [],
     url:'/pages/profile/profile',
     times: []
   },
   onLaunch: function(options) {
     if (!wx.cloud) {
       console.error('请使用 2.2.3 或以上的基础库以使用云能力')
     } else {
       wx.cloud.init({
         env: 'wxmeet-5taii',
         traceUser: true,
       })
     }
     var that = this
     wx.showLoading()
     if (options.url) {
       app.globalData.url = options.url
       app.globalData.eventId = options.eventId
       console.log('my id' + options.eventId)
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
               that.setNewUser()
               return
             }
             console.log(res.data)


             // n^2 solution, use hashmap for better performance
             that.globalData.SponsorEvent = res.data[0].SponsorEvent


             var allEvents = res.data[0].AttendEvent;
             var sponsorEventToSet = [];
             for (var AllEventTuple in allEvents) {
               var IsSponser = false;
               for (var SponserEventTuple in that.globalData.SponsorEvent) {
                 if (SponserEventTuple === AllEventTuple){
                   IsSponser = true;
                   break;
                 }
               }
               if (!IsSponser){
                 sponsorEventToSet.push(AllEventTuple);
               }
             }
             that.globalData.AttendEvent = sponsorEventToSet;

             // console.log(that.globalData)
             wx.getSetting({
               success: function(res) {
                 if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
                   wx.getUserInfo({
                     success: function(res) {
                       that.updateUser(res.userInfo)
                       // console.log(res.userInfo)
                       wx.hideLoading()
                       var turn = that.globalData.url
                       wx.redirectTo({
                         url: turn+'?eventId='+that.globalData.eventId,
                         // url: '/pages/authorize/authorize', //授权页面

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
                 console.log("fail1")
               }
             })
           }
         })
       }
     })
   },
   onShow: function(options){
     if(options.query.url && this.globalData.user != null){
       wx.redirectTo({
         url: options.query.url + '?eventId=' + options.query.eventId,
       })
     }
   },
   setNewUser: function() {
     const db = wx.cloud.database()
     db.collection('users').doc(this.globalData.user).set({
       data: {
         nickName: '',
         profilePic: '',
         SponsorEvent: {},
         AttendEvent: {}
       }
     })
     wx.redirectTo({
       url: '/pages/authorize/authorize'
     })
   },
   updateUser: function(info) {
     const db = wx.cloud.database()
    //  console.log(this.globalData.user)
     db.collection('users').doc(this.globalData.user).update({
       data: {
         nickName: info.nickName,
         profilePic: info.avatarUrl
       }
     })
   }
 })