const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    eventId: '',
    user: '',
    eventName: '',
    dayStyle1: [{}],
    dayStyle2: [{}],
    currDate: 14,
    currMonth: 9,
    currMonthYear: 2019,
    currMonthCopy: [{}],
    nextMonthCopy: [{}],
    nextMonthYear: 2019,
    nextMonth: 10,
    size: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    this.setData({
      user: app.globalData.user
    })
    var initDate = []
    let date = new Date();

    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (var i = 1; i <= lastDay; i++) {
      var col = 'LightGray'
      if (i === date.getDate()) {
        col = 'white'
        initDate.push({
          month: 'current',
          monthNum: date.getMonth() + 1,
          day: i,
          color: col,
          background: 'DarkGray',
          selected: false
        })
      } else if (i > date.getDate()) {
        var colorDate = new Date(date.getFullYear(), date.getMonth(), i);
        if (colorDate.getDay() === 6) col = 'CornflowerBlue'
        else if (colorDate.getDay() === 0) col = 'LightCoral'
        else col = 'black'
      }
      initDate.push({
        month: 'current',
        monthNum: date.getMonth() + 1,
        day: i,
        color: col,
        selected: false
      })
    }
    var initDateNextMonth = []
    var nextMonthDate = new Date()
    if (date.getMonth() == 11) {
      nextMonthDate = new Date(date.getFullYear() + 1, 0)
    } else {
      nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1)
    }


    let nextMonthLastDay = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1, 0).getDate()
    for (var i = 1; i <= nextMonthLastDay; i++) {
      // if (i === date.getDate()) col = 'red'
      var colorDate = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), i);
      if (colorDate.getDay() === 6) col = 'CornflowerBlue'
      else if (colorDate.getDay() === 0) col = 'LightCoral'
      else col = 'black'
      initDateNextMonth.push({
        month: 'current',
        monthNum: nextMonthDate.getMonth() + 1,
        day: i,
        color: col,
        selected: false
      })
    }
    this.setData({
      currDate: date.getDate(),
      currMonth: date.getMonth() + 1,
      currYear: date.getFullYear(),
      nextMonthYear: nextMonthDate.getFullYear(),
      nextMonth: nextMonthDate.getMonth() + 1,
      dayStyle2: initDateNextMonth,
      nextMonthCopy: JSON.parse(JSON.stringify(initDateNextMonth)),
      currMonthCopy: JSON.parse(JSON.stringify(initDate)),
      dayStyle1: initDate,
    })
  },

  bindinput(event) {
    this.setData({
      eventName: event.detail.value
    })
  },
  //根据指定年月获得当月天数
  dayClick: function(event) {
    if (this.checkDate(event) == false) return
    let index = event.detail.day
    let month = event.detail.month
    // console.log(this.data.dayStyle1[index])
    var chosenStyle = (month == this.data.currMonth) ? this.data.dayStyle1 : this.data.dayStyle2
    var chosenCopy = (month == this.data.currMonth) ? this.data.currMonthCopy : this.data.nextMonthCopy
    if (chosenStyle[index].selected) {
      chosenStyle[index] = chosenCopy[index]
      this.data.size--
    } else {
      if (this.data.size >= 7) {
        wx.showToast({
          icon:'none',
          title: '请选择小于7天日期',
        })
        return
      }
      chosenStyle[index] = {
        month: 'current',
        day: index,
        color: 'white',
        // background: '#09B83E',
        background: 'MediumSeaGreen',
        monthNum: month,
        selected: true
      }
      this.data.size++
    }
    this.setData({
      dayStyle1: this.data.dayStyle1,
      dayStyle2: this.data.dayStyle2
    })

  },
  checkDate: function(event) {
    if (event.detail.month > this.data.currMonth) return true
    if (event.detail.month == this.data.currMonth && event.detail.day >= this.data.currDate) return true
    return false
  },
  onSubmitTap: function() {
    if (this.data.eventName == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入事件名称',
        duration: 2000
      })
      return
    }
    if (this.data.size == 0){
      wx.showToast({
        title: '请选择心仪的日期',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var datesArr = []
    var arr = this.data.dayStyle1
    for(var i in arr){
      if(arr[i].selected == true){
        datesArr.push(arr[i].monthNum.toString()+'/'+arr[i].day.toString())
      }
    }
    arr= this.data.dayStyle2
    for (var i in arr) {
      if (arr[i].selected == true) {
        datesArr.push(arr[i].monthNum.toString() + '/' + arr[i].day.toString())
      }
    }
    var that = this
    datesArr = JSON.stringify(datesArr);
    console.log(datesArr)
    wx.navigateTo({
      url: '/pages/selectTime/selectTime?eventName=' + that.data.eventName + '&datesArr=' + datesArr + '&isCreate=' + true
    })

  },



  inputStartTime(e){
    console.log(e.detail.value)
  }
})