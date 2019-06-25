const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    thisYear: '',
    thisMonth: '',
    thisMonthArr: [],
    today: new Date().getDate(),
    nextYear: '',
    nextMonth: '',
    nextMonthArr: [],
    tIntervals: [],
    nIntervals: [],
    intervals: [],
    eventId: '',
    user: '',
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      user: app.globalData.user
    })
    //初始化日历数据
    var nextM_start = new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth() + 1)); //下一个月
    var thisMonthArr = this.getDateArr(new Date());
    var nextMonthArr = this.getDateArr(nextM_start);
    var tIntervals = [];
    var nIntervals = [];
    var intervals = [];
    var value = '';
    this.setData({
      thisYear: new Date().getFullYear(),
      thisMonth: new Date().getMonth() + 1,
      nextYear: nextM_start.getFullYear(),
      nextMonth: nextM_start.getMonth() + 1,
      thisMonthArr: thisMonthArr,
      nextMonthArr: nextMonthArr
    })
  },
  select_date: function (e) {
    //如果点击项为空百项目，不继续执行
    var date = e.currentTarget.dataset.date;
    if (date == '' || date <= 0) {
      return;
    }
    var index = e.currentTarget.dataset.key;
    var item = e.currentTarget.dataset.keyitem;
    var month = e.currentTarget.dataset.month;
    var tInterv = this.data.tIntervals;
    var nInterv = this.data.nIntervals;
    var interv = this.data.intervals;
    var currMonth = 0;
    var thisMonth = new Date().getMonth() + 1;
    if (month == 'thisMonth') {
      var that = this.data.thisMonthArr;
      currMonth = thisMonth;
    } else {
      var that = this.data.nextMonthArr;
      currMonth = thisMonth + 1;
    }
    //切换选中状态
    if (that[index][item].state == true) {
      that[index][item].state = false;
    } else if (that[index][item].state == false) {
      that[index][item].state = true;
    }

    if (month == 'thisMonth') {
      var selected = parseInt(date) + parseInt(item);
      var check = true
      let tLength = tInterv.length
      let curr = 0;
      if (selected < 10) {
        curr = currMonth + "0" + selected.toString(10);
      }
      else {
        curr = currMonth + selected.toString(10);
      }
      for (let i = 0; i < tLength; i++) {
        if (tInterv[i] === curr) {
          check = false
          tInterv.splice(i, i + 1);
        }
      }
      if (check) {
        let once = true
        let end = 0
        let length = tInterv.length;
        if (length === 0) { tInterv.push(curr); }
        for (let i = 0; i < length; i++) {
          if (once == true) {
            if (parseInt(tInterv[i]) > parseInt(curr)) {
              tInterv.splice(i, 0, curr)
              once = false;
            }
            end += 1
          }
          if ((end >= length) && once) {
            tInterv.push(curr)
            once = true;
            end = 0
          }
        }
      }

    }
    else {
      var check = true
      let nLength = nInterv.length
      var selected = parseInt(date);
      let curr = 0;
      if (selected < 10) {
        curr = currMonth + "0" + selected.toString(10);
      }
      else {
        curr = currMonth + selected.toString(10);
      }
      for (let i = 0; i < nLength; i++) {
        if (nInterv[i] === curr) {
          check = false
          nInterv.splice(i, i + 1);
        }
      }
      if (check) {
        let once = true
        let end = 0
        let length = nInterv.length;
        if (length === 0) { nInterv.push(curr); }
        for (let i = 0; i < length; i++) {
          if (once == true) {
            if (parseInt(nInterv[i]) > parseInt(curr)) {
              nInterv.splice(i, 0, curr)
              once = false;
            }
            end += 1
          }
          if ((end >= length) && once) {
            nInterv.push(curr)
            once = true;
            end = 0
          }
        }
      }
    }
    //console.log(tInterv)
    //console.log(nInterv)
    interv = tInterv.concat(nInterv)
    console.log(interv)
    //console.log(that);
    //根据月份设置数据
    if (month == 'thisMonth') {
      this.setData({
        thisMonthArr: that,
      });
    } else {
      this.setData({
        nextMonthArr: that,
      });
    }

    this.setData({
      tIntervals: tInterv,
      nIntervals: nInterv,
      intervals: interv
    })
  },

  bindinput(event){
    this.setData({
    value: event.detail.value
    })
  },
  //根据指定年月获得当月天数
  mGetDate(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
  },
  //根据指定年月获得当月日历数组
  getDateArr(date) {
    //根据指定年月
    //var myDate = new Date();
    var myDate = date;
    var thisYear = myDate.getFullYear(); //获取完整的年份
    var thisMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var firstDay = new Date(thisYear + ',' + thisMonth + ',01').getDay(); //本月第一天星期几,0表示星期天
    var nowDay = myDate.getDate(); // 今天是几号
    var monthNum = this.mGetDate(thisYear, thisMonth); //本月多少天

    var monthArray = [];
    var week = 1; //第一周
    var oneDay = '';
    var isToday = false;
    monthArray[week] = new Array(); //声明本周的二维数组

    //循环当月的每一天
    for (var k = 1; k <= monthNum; k++) {
      isToday = false;
      //组装当前日期
      oneDay = thisYear + ',' + thisMonth + ',' + k;
      var witchDay = new Date(oneDay).getDay(); //当前是星期几
      //如果当期循环日期为今天
      if (k == nowDay) {
        isToday = true;
      }
      //如果是第一周
      if (week == 1) {
        //判断当前日期是否是本月第一天
        if (k == 1) {
          //第一天之前的日期补为空
          for (var a = 0; a < firstDay; a++) {
            monthArray[week][a] = {
              date: '',
              isToday: isToday,
              state: false
            };
          }
        }
      }
      monthArray[week][witchDay] = {
        date: k,
        isToday: isToday,
        state: false
      };

      //如果已经是周六，切换到下一周
      if (witchDay == 6) {
        week++;
        monthArray[week] = new Array(); //声明本周的二维数组
      }
    }
    monthArray.splice(0, 1); //删除下标为0的空元素
    //console.log(monthArray);
    return monthArray;
  },
  onSubmitTap: function () {
    wx.showLoading({
      title: '',
    })
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    var createTime = new Date().getTime()
    wx.cloud.callFunction({
      name: 'creatEvent',
      data: {
        id: that.data.user,
        name: that.data.value,
        dates: that.data.intervals,
        createDate: createTime, 
      },
      success: res => {
        console.log('创建事件成功')
        that.setData({
          eventId: res.result._id
        })
        db.collection('users').doc(that.data.user).update({
          data: {
            SponsorEvent:{
              [res.result._id]: _.set([that.data.value, createTime])
            }
          }
        })
        console.log(that.data.eventId)
        wx.redirectTo({
          url: '/pages/selectTime/selectTime?eventId=' + that.data.eventId + '&eventName=' + that.data.value + '&createTime=' + createTime,
        })
      }
    })
  },
})

