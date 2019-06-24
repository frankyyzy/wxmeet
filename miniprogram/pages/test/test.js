Page({
  data: {
    map: {},
    today: {
      month: 'current',
      day: new Date().getDate(),
      color: 'white',
      background: '#AAD4F5'
    },
    dayStyle: [{}],
    currentDate: "2019-06",
    size: 0

  },
  onLoad() {
    console.log(this.data.currentDate)
    var preDate = []
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (var i = 1; i <= lastDay; i++) {
      var col = 'grey'
      // if (i === date.getDate()) col = 'red'
      if (i >= date.getDate()) col = 'black'
      preDate.push({
        month: 'current',
        day: i,
        color: col,
      })
    }
    let month = new Date().getMonth() + 1
    var strMonth = month.toString()
    if (month < 10) strMonth = "0" + strMonth
    let strYear = new Date().getFullYear().toString()
    this.setData({
      currentDate: strYear + '-' + strMonth,
      dayStyle: preDate
    })
    var localMap = {}
    let key = (date.getFullYear()).toString() + (date.getMonth() + 1).toString()
    localMap[key] = this.data.dayStyle
    this.data.map = localMap;
    // console.log(this.data.map)

  },
  dayClick: function(event) {
    if (this.checkDate(event) == false) return
    let key = (event.detail.year).toString() + (event.detail.month).toString()
    console.log(event)
    var localMap = this.data.map
    let clickDay = event.detail.day
    var selectedDays = this.data.dayStyle
    // console.log(this.data.map)
    if (selectedDays[clickDay - 1].color === 'black') {
      if (this.data.size >= 7) {
        wx.showToast({
          title: '最多可选7天',
        })
        return
      }
      selectedDays[clickDay - 1] = {
        month: 'current',
        day: clickDay,
        color: 'white',
        background: '#09B83E'
      }
      this.data.size++
    } else {
      selectedDays[clickDay - 1] = {
        month: 'current',
        day: clickDay,
        color: 'black',
      }
      this.data.size--
    }
    this.setData({
      dayStyle: selectedDays
    })
    localMap[key] = this.data.dayStyle
    this.data.map = localMap
    // console.log(this.data.dayStyle)
  },
  next: function(event) {
    let key = (event.detail.currentYear).toString() + (event.detail.currentMonth).toString()
    var lastDay = new Date(event.detail.currentYear, event.detail.currentMonth, 0).getDate();
    console.log(event)
    var localMap = this.data.map
    if (!localMap[key]) {
      localMap[key] = []
      for (var i = 1; i <= lastDay; i++) {
        localMap[key].push({
          month: 'current',
          day: i,
          color: 'black',
        })
      }
    }
    this.setData({
      dayStyle: localMap[key]
    })
    this.data.map = localMap
  },
  prev: function(event) {
    let key = (event.detail.currentYear).toString() + (event.detail.currentMonth).toString()
    var localMap = this.data.map
    this.setData({
      dayStyle: localMap[key]
    })
  },
  checkDate: function(event) {
    let day = new Date().getDate()
    // console.log('day' + day + 'e' + event.detail.day)
    let month = new Date().getMonth() + 1
    // console.log('mon' + month + 'e' + event.detail.month)

    if (event.detail.month > month) return true
    if (event.detail.month == month && event.detail.day >= day) return true
    return false
  }

})