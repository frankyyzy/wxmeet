// pages/database/database.js
Page({

  /**
   * Page initial data
   */
  data: {
    name: '',
    id:'',
    dbName: '',
    changeName: '',
    allName: {}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var that = this
    setInterval(function(){
      that.checkNames()},5000
    )
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  },
  onSubmit: function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('name').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        name: that.data.name,
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        that.data.id = res._id
        that.checkNames()
      }
    })
  },
  bindinput: function(event) {
    this.data.name = event.detail.value
  },
  onCheck: function(){
    const db = wx.cloud.database()
    var that = this
    db.collection('name').doc(that.data.id).get({
      success:function(res){
        that.setData({
          dbName: res.data.name
        })
      }
    })
  },
  bindchange: function(event){
    this.data.changeName = event.detail.value
  },
  onChange: function(){
    const db = wx.cloud.database()
    var that = this
    db.collection('name').doc(that.data.id).update({
      data: {
        name: that.data.changeName
      }
    }).then(function() {
      that.checkNames()
    })
    
  },
  onDelete: function(){
    const db = wx.cloud.database()
    var that = this
    db.collection('name').doc(that.data.id).remove()
    that.checkNames()
  },
  checkNames: function(){
    const db = wx.cloud.database()
    var that = this
    //get the entire collection and get all the names
    db.collection('name').get({
      success: function(res){
        that.setData({
          allName: res.data
        })
      }
    })

  }

})