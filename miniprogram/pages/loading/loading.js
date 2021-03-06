// pages/loading/loading.js
const app = getApp();
Page({
  /**
   * Page initial data
   */
  data: {
    url: app.globalData.url
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      timer: setInterval(function() {
        that.setData({
          url: app.globalData.url
        });
      }, 1000)
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    // this.setData({
    // url: app.globalData.url
    // })
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function(res) {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {
    clearInterval(this.data.timer);
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {}
});
