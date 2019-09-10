// pages/profile/profile.js
const app = getApp()
const green = "green"
const white = "white"
Page({
  /**
   * Page initial data
   */
  data: {

    user: '',
    dates: [],
    // datechoose: [0, 0, 0, 0, 0, 0, 0, 0],
    totaldate: 3,
    start: -1,
    end: -1,
    edit: false,
    intervals: [],
    eventId: '',
    eventName: '',
    createTime: -1,
    windowHeight: 0,
    windowWidtht: 0,
    touchIntervals: [],
    startx: 0,
    starty: 0,
    startj: -1,
    starti: -1,
    lasti: -1,
    lastj: -1,
    endx: 0,
    endy: 0,
    buttom: false,
    select: "white",
    color: [
      []
    ],
    previousColor: [
      []
    ]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      eventId: options.eventId,
      eventName: options.eventName,
      createTime: options.createTime,
      user: app.globalData.user,
      // x:30,
      // y:30
    })
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('events').where({
      _id: that.data.eventId
    }).get({
      success: function (res) {
        var passdates = res.data[0].dates
        var curdates = ["小时"]
        var datechoos = [0]
        for (let i = 0; i < passdates.length; i++) {
          curdates.push(passdates[i])
          datechoos.push(i + 1)
        }
        var total = curdates.length
        that.setData({
          dates: curdates,
          totaldate: total,
          datechoose: datechoos
        })
        var intervalss = [];
        var color = [
          []
        ];
        for (var j = 0; j < that.data.totaldate - 1; j++) {
          color[j] = []
          for (var i = 0; i < 24; i++) {
            color[j][i] = white
          }
        }
        for (var i = 0; i < that.data.totaldate - 1; i++) {
          var interves = [];
          for (var j = 0; j < 24; j++) {
            interves.push(false);
            // color[i][j]=("rgba(0,255,0,100)")
          }
          intervalss.push(interves);
        }
        console.log(color)
        that.setData({
          intervals: intervalss,
          color: color
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        // 屏幕宽度、高度
        // 高度,宽度 单位为px
        that.setData({
          windowHeight: res.windowHeight,

          windowWidth: res.windowWidth

        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () { },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  // onPullDownRefresh: function() {

  // },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  onSubmitTap: function () {
    wx.showLoading({
      title: '',
    })
    this.updateUser()
    var that = this
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: 'testupdate',
      data: {
        eventId: that.data.eventId,
        id: that.data.user,
        dates: that.data.dates,
        times: that.data.intervals,
      },
      success: res => {
        // console.log(that.data.eventId)
        wx.redirectTo({
          url: '/pages/masterEvent/masterEvent?eventId=' + that.data.eventId,
        })
      }
    })
  },
  updateUser: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'updateAttendEvent',
      data: {
        id: that.data.user,
        eventId: that.data.eventId,
        eventName: that.data.eventName,
        createTime: that.data.createTime
      },
      success: res => { }
    })
  },

  mytouchstart: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    var n = this.data.totaldate;

    this.data.startj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
    this.data.starti = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    this.data.lastj = this.data.startj
    this.data.lasti = this.data.starti
    this.data.previousColor = JSON.parse(JSON.stringify(this.data.color))
    // var arr = [
    //   []
    // ]
    // for (var j = 0; j < this.data.totaldate - 1; j++) {
    //   arr[j] = []
    //   for (var i = 0; i < 24; i++) {
    //     arr[j][i] = false
    //   }
    // }
    // this.data.arr = arr
    var color = 'color[' + this.data.startj + '][' + this.data.starti + ']'
    this.setData({
      [color]: (this.data.color[this.data.startj][this.data.starti] == green) ? white : green
    })
    this.data.select = this.data.color[this.data.startj][this.data.starti]
    // this.data.arr[this.data.startj][this.data.starti] = true
    // if (this.data.first) {
    //   this.data.arr = arr
    //   this.data.first = false
    // } 
    // var intervalls = this.data.intervals
    // if (sy < 0.065 * this.data.windowHeight) {
    //   this.setData({
    //     buttom: true,
    //   })
    // } else {
    //   this.setData({
    //     startx: sx,
    //     starty: sy,
    //     buttom: false,
    //   })
    // }
    // var that = this
    // this.setData({
    //   timer: setInterval(function (){
    //     that.setData({
    //       intervals: that.data.intervals
    //     })
    //   },100)
    // })

  },
  onSelect: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
    // console.log("hi")
    var n = this.data.totaldate;
    var startj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
    var starti = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    var otherside = false

    // console.log("now"+startj)
    // console.log("last"+this.data.lastj)
    // if (this.data.lasti > this.data.starti && starti < this.data.starti) {
    //   // console.log('here')
    //   for (var i = this.data.lasti; i > this.data.starti; i--) {
    //     var color = 'color[' + this.data.startj + '][' + i + ']'
    //     this.setData({
    //       [color]: this.data.previousColor[this.data.startj][i]
    //     })
    //   }
    //   otherside = true
    // } else if (this.data.lasti < this.data.starti && starti > this.data.starti) {
    //   console.log('where')
    //   for (var i = this.data.lasti; i < this.data.starti; i++) {
    //     var color = 'color[' + this.data.startj + '][' + i + ']'
    //     this.setData({
    //       [color]: this.data.previousColor[this.data.startj][i]
    //     })
    //   }
    //   otherside = true

    // }
    //swipe down, after the initial i
    // if (starti > this.data.lasti && starti > this.data.starti) {
    for (var j = 0; j < this.data.totaldate - 1; j++) {
      for (var i = 0; i < 24; i++) {
        if (i >= this.data.starti && i <= starti) {
          if (j == this.data.startj) {
            var color = 'color[' + j + '][' + i + ']'
            this.setData({
              [color]: this.data.select
            })
          }
          if (j > this.data.startj && j <= startj) {
            if (this.data.color[j][i] == this.data.color[this.data.startj][i]) continue
            var color = 'color[' + j + '][' + i + ']'
            this.setData({
              [color]: this.data.color[this.data.startj][i]
            })
          }
          // else if (j > this.data.startj && j > startj) {
          //   if(this.data.color[j][i] == this.data.previousColor[j][i]) continue
          //   var color = 'color[' + j + '][' + i + ']'
          //   this.setData({
          //     [color]: this.data.previousColor[j][i]
          //   })
          // }
          else if (j < this.data.startj && j >= startj) {
            if (this.data.color[j][i] == this.data.color[this.data.startj][i]) continue
            var color = 'color[' + j + '][' + i + ']'
            this.setData({
              [color]: this.data.color[this.data.startj][i]
            })
          }
          else if (j < this.data.startj && j < startj) {
            if (this.data.color[j][i] == this.data.previousColor[j][i]) continue
            var color = 'color[' + j + '][' + i + ']'
            this.setData({
              [color]: this.data.previousColor[j][i]
            })
          }
        }
        else {
          if (this.data.color[j][i] == this.data.previousColor[j][i]) continue
          var color = 'color[' + j + '][' + i + ']'
          this.setData({
            [color]: this.data.previousColor[j][i]
          })
        }
        // else if (i < this.data.starti)
      }
    }
    // }
    // if (starti > this.data.lasti && starti > this.data.starti) {
    //   if (startj >= this.data.lastj && startj >= this.data.startj) {
    //     for (var i = this.data.starti; i <= starti; i++) {
    //       for (var j = this.data.startj; j <= startj; j++) {
    //         if (otherside && i < this.data.starti) continue
    //         if (this.data.color[j][i] == this.data.select) continue
    // var color = 'color[' + j + '][' + i + ']'
    // this.setData({
    //   [color]: this.data.select
    // })
    //       }
    //     }
    //   } else if (startj < this.data.lastj && startj >= this.data.startj) {
    //     console.log('here')
    //     for (var i = this.data.starti; i <= starti; i++) {

    //       for (var j = this.data.lastj; j > startj; j--) {
    //         // if (otherside && i < this.data.starti) continue
    //         // if (this.data.color[j][i] == this.data.select) continue
    //         var color = 'color[' + j + '][' + i + ']'
    //         this.setData({
    //           [color]: this.data.previousColor[j][i]
    //         })
    //       }
    //     }
    //   }
    // }

    // } else if (starti < this.data.lasti && starti > this.data.starti) {
    //   for (var i = this.data.lasti; i >= starti; i--) {
    //     var color = 'color[' + this.data.startj + '][' + i + ']'
    //     // console.log(this.data.previousColor)
    //     this.setData({
    //       [color]: this.data.previousColor[this.data.startj][i]
    //     })
    //   }
    // } else if (starti < this.data.lasti && starti < this.data.starti) {
    //   for (var i = this.data.lasti; i >= starti; i--) {
    //     if (otherside && i > this.data.starti) continue
    //     var color = 'color[' + this.data.startj + '][' + i + ']'
    //     this.setData({
    //       [color]: this.data.select
    //     })
    //   }
    // } else if (starti > this.data.lasti && starti < this.data.starti) {
    //   for (var i = this.data.lasti; i <= starti; i++) {
    //     var color = 'color[' + this.data.startj + '][' + i + ']'
    //     // console.log(this.data.previousColor)
    //     this.setData({
    //       [color]: this.data.previousColor[this.data.startj][i]
    //     })
    //   }
    // }
    this.data.lasti = starti
    // if (startj > this.data.lastj && startj > this.data.startj) {
    //   for (var j = this.data.lastj + 1; j <= startj; j++) {
    //     for (var i = this.data.starti; i <= starti; i++) {
    //       var color = 'color[' + j + '][' + i + ']'
    //       this.setData({
    //         [color]: this.data.select
    //       })
    //     }
    //   }
    // }
    this.data.lastj = startj
  },
  onChange: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;

    var n = this.data.totaldate;
    var startj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
    var starti = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
    var otherside = false
    if (this.data.lasti > this.data.starti && starti < this.data.starti) {
      // console.log('here')
      for (var i = this.data.lasti; i > this.data.starti; i--) {
        var color = 'color[' + this.data.startj + '][' + i + ']'
        this.setData({
          [color]: this.data.previousColor[this.data.startj][i]
        })
      }
      otherside = true
    } else if (this.data.lasti < this.data.starti && starti > this.data.starti) {
      console.log('where')
      for (var i = this.data.lasti; i < this.data.starti; i++) {
        var color = 'color[' + this.data.startj + '][' + i + ']'
        this.setData({
          [color]: this.data.previousColor[this.data.startj][i]
        })
      }
      otherside = true

    }
    if (starti > this.data.lasti && starti > this.data.starti) {
      if (startj >= this.data.lastj && startj >= this.data.startj) {
        for (var j = this.data.startj; j <= startj; j++) {
          for (var i = this.data.starti; i <= starti; i++) {
            if (otherside && i < this.data.starti) continue
            var color = 'color[' + j + '][' + i + ']'
            this.setData({
              [color]: this.data.select
            })
          }
        }
      }
    } else if (starti < this.data.lasti && starti > this.data.starti) {
      for (var i = this.data.lasti; i >= starti; i--) {
        var color = 'color[' + this.data.startj + '][' + i + ']'
        // console.log(this.data.previousColor)
        this.setData({
          [color]: this.data.previousColor[this.data.startj][i]
        })
      }
    } else if (starti < this.data.lasti && starti < this.data.starti) {
      for (var i = this.data.lasti; i >= starti; i--) {
        if (otherside && i > this.data.starti) continue
        var color = 'color[' + this.data.startj + '][' + i + ']'
        this.setData({
          [color]: this.data.select
        })
      }
    } else if (starti > this.data.lasti && starti < this.data.starti) {
      for (var i = this.data.lasti; i <= starti; i++) {
        var color = 'color[' + this.data.startj + '][' + i + ']'
        // console.log(this.data.previousColor)
        this.setData({
          [color]: this.data.previousColor[this.data.startj][i]
        })
      }
    }
    this.data.lasti = starti
    // if (startj > this.data.lastj && startj > this.data.startj) {
    //   for (var j = this.data.lastj + 1; j <= startj; j++) {
    //     for (var i = this.data.starti; i <= starti; i++) {
    //       var color = 'color[' + j + '][' + i + ']'
    //       this.setData({
    //         [color]: this.data.select
    //       })
    //     }
    //   }
    // }
    this.data.lastj = startj
  },
  //   if (this.data.arr[starti] == false) {
  //     var index = 'intervals[' + startj + '][' + starti + ']'
  //     var color = 'color[' + startj + '][' + starti + ']'
  //     this.setData({
  //       [index]: !this.data.intervals[startj][starti],
  //       [color]: (this.data.color[startj][starti] == "green") ? "white" : "green"
  //     })
  //     this.data.arr[starti] = true
  //   }
  // },
  //长按事件
  mytouchmove: function (e) {
    // console.log(e)
    if (this.data.first) {
      var sx = e.touches[0].pageX;
      var sy = e.touches[0].pageY;
      var n = this.data.totaldate;

      this.data.startj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
      this.data.starti = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
      var arr = []
      for (var i = 0; i < 24; i++) {
        arr[i] = false
      }
      this.data.arr = arr
      this.data.first = false
    } else {
      var sx = e.touches[0].pageX;
      var sy = e.touches[0].pageY;
      // this.setData({
      //   endx: sx,
      //   endy: sy,
      // })
      var n = this.data.totaldate;
      // var intervalls = this.data.intervals;
      // var startxx = this.data.startx;
      // var startyy = this.data.starty;
      // var startxx = sx;
      // var startyy = sy;
      var startj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
      // var endj = parseInt(n * sx / (0.98 * this.data.windowWidth)) - 1;
      var starti = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
      // var endi = parseInt((sy - 0.065 * this.data.windowHeight) / (0.935 * this.data.windowHeight / 25)) - 1;
      // var x = 'posx['+ 0 + ']'
      // var y = 'posy[' + starti + ']'
      this.setData({
        x: sx,
        y: sy

      })
      // console.log("starti" + starti)
      // console.log("endi" + endi)
      // console.log("startj" + startj)
      // console.log("endj" + endj)
      // for (var j = this.dstartj; j <= endj; j++) {
      // for (var i = starti; i <= endi; i++) {
      //   if (this.data.arr[starti] == false) {
      //     // this.data.intervals[this.data.startj][starti] = !this.data.intervals[this.data.startj][starti]
      //     var index = 'intervals[' + this.data.startj + '][' + starti + ']'
      //     // var index = 'intervals[' + this.data.startj + '][' + endi + ']'

      //     this.setData({
      //       [index]: !this.data.intervals[this.data.startj][starti],
      //     })
      //     this.data.arr[starti] = true
      //   }
      // }
    }

    // this.setData({
    //   intervals: this.data.intervals
    // })
    // }
    // }
    // }
    // }
    // this.data.intervals = intervalls
  },
  mytouchend: function (e) {
    for (var j = 0; j < this.data.totaldate - 1; j++) {
      for (var i = 0; i < 24; i++) {
        if (this.data.color[j][i] == green) {
          this.data.intervals[j][i] = true
        } else {
          this.data.intervals[j][i] = false
        }
      }
    }

  },
  mytap: function (e) {
    var Name = parseInt(e.target.id[0])
    var idd = e.target.id
    var ID = '';
    for (let i = 1; i < idd.length; i++) {
      ID = ID + idd[i];
    }
    ID = parseInt(ID);
    var interv = []
    interv = this.data.intervals
    if (!interv[Name][ID]) {
      interv[Name][ID] = true;
    } else {
      interv[Name][ID] = false;
    }
    this.setData({
      intervals: interv
    })
  },
  testposition: function (e) {
    var sx = e.touches[0].pageX;
    var sy = e.touches[0].pageY;
  }

})