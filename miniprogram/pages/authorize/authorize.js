// pages/authorize/authorize.js
// import requestUrl from '../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //获取用户信息是否在当前版本可用
    user: '',
    nickName: '',
    profilePic: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  bindGetUserInfo: function(e) { //点击的“拒绝”或者“允许
    var that = this
    if (e.detail.userInfo) { //点击了“允许”按钮，
      this.setUser(e.detail.userInfo)
      wx.redirectTo({
        // url: that.globalData.url+'?eventId='+that.globalData.event
        url: "pages/profile/profile"
      })
    }
    else{
      wx.showToast({
        title: 'Goodbye',
        icon: 'loading'
      })
    }
  },
  setUser: function(info) {
    let that = this
    const db = wx.cloud.database()
    const _ = db.commond
    try {
      db.collection("users").doc(app.globalData.user).update({
        data: {
          nickName:(info.nickName),
          profilePic: (info.avatarUrl),
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
})