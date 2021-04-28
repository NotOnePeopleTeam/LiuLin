
const app = getApp();
import {
  getIndexData,
  getCoupons,
  getTemlIds,
  getLiveList,
} from '../../api/api.js';
import {
  CACHE_SUBSCRIBE_MESSAGE,
  HTTP_REQUEST_URL
} from '../../config.js';

// 砍价 // 拼团 // 秒杀
import {
  getCombinationList,
  getBargainList,
  getSeckillIndexTime,
  getSeckillList,
} from '../../api/activity.js';
import {
  openPinkSubscribe,
  // kaiPinkSubscribe
} from '../../utils/SubscribeMessage.js';
import {
  openBargainSubscribe
} from '../../utils/SubscribeMessage.js';
import wxh from '../../utils/wxh.js';
import {
  shareBind,
  getUserInfo
} from '../../api/user.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    itemNew: [],
    activityList: [],
    menus: [],
    bastBanner: [],
    bastInfo: '',
    bastList: [],
    fastInfo: '',
    fastList: [],
    firstInfo: '',
    firstList: [],
    salesInfo: '',
    likeInfo: [],
    lovelyBanner: {},
    benefit: [],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 1500,
    duration: 1500,
    parameter: {
      'navbar': '0',
      'return': '0'
    },
    countDownHour: "00",
    countDownMinute: "00",
    countDownSecond: "00",

    window: false,
    iShidden: false,
    navH: "",
    newGoodsBananr: '',
    selfLongitude: '',
    selfLatitude: '',
    liveList: [],
    liveInfo: {},
    // 拼团
    combinationList: [],
    limit: 10,
    page: 1,
    loading: false,
    loadend: false,
    // 砍价
    bargainList: [],
    page: 0,
    limit: 20,
    // 秒杀
    seckillList: [],
    timeList: [],
    active: 0,
    scrollLeft: 0,
    interval: 0,
    status: 1,
    countDownHour: "00",
    countDownMinute: "00",
    countDownSecond: "00",
    page: 1,
    limit: 4,
    loading: false,
    loadend: false,
    pageloading: false,
    // 地图
    hasLocation: true,
    location: {
      longitude: "",
      latitude: "",
      name: "",
      address: ""
    },
    imgbg: HTTP_REQUEST_URL
  },

  // settimeList: function (e) {
  //   var that = this;
  //   that.setData({
  //     active: e.currentTarget.dataset.index
  //   });
  //   if (that.data.interval) {
  //     clearInterval(that.data.interval);
  //     that.setData({
  //       interval: null
  //     });
  //   }
  //   that.setData({
  //     interval: 0,
  //     countDownHour: "00",
  //     countDownMinute: "00",
  //     countDownSecond: "00",
  //     status: that.data.timeList[that.data.active].status,
  //     loadend: false,
  //     page: 1,
  //     seckillList: [],
  //   });
  //   // wxh.time(e.currentTarget.dataset.stop, that);
  //   that.getSeckillList();
  // },

  getShop(latitude, longitude) {
    wx.request({
      url: `${app.globalData.url}/api/store_list`,
      method: 'GET',
      data: {
        //传入的参数
        latitude_current: latitude,
        longitude_current: longitude,
        longitude: longitude,
        latitude: latitude,
        limit: this.data.limit
      },
      success: (res) => {
        console.log(res)
        if (res.data.msg == 'ok') {
          let list = res.data.data.list
          console.log(list)
          this.setData({
            name: list[0].name,
          })
        }
      }
    })
  },
  closeTip: function () {
    wx.setStorageSync('msg_key', true);
    this.setData({
      iShidden: true
    })
  },
  setGoodsSearch: function () {
    wx.navigateTo({
      url: '/pages/goods_search/index',
    })
  },
  miaosha() {
    wx.navigateTo({
      url: '/pages/activity/goods_seckill/index',
    })
  },
  map: function () {
    wx.navigateTo({
      url: '/pages/goods_details_store/index',
    })
  },
  nearbyinfo() {
    wx.navigateTo({
      url: '/pages/nearbyinfo/nearbyinfo',
    })
  },
  nearby() {
    wx.navigateTo({
      url: '/pages/nearby/nearby',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.getUserInfo();
    if (options.spid) {
      this.setData({
        spid: options.spid
      })
    }
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        //赋值经纬度
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        that.getShop(res.latitude, res.longitude)
      }
    })

    // that.chooseMapViewTap();
    // 秒杀、砍价、拼团
    that.getSeckillConfig();
    that.getCombinationList();
    that.getBargainList();
    wxh.selfLocation(1);
    that.setData({
      navH: app.globalData.navHeight
    });
    if (options.spid) app.globalData.spid = options.spid;
    if (options.scene) app.globalData.code = decodeURIComponent(options.scene);
    if (wx.getStorageSync('msg_key')) that.setData({
      iShidden: true
    });
    that.getTemlIds();
    that.getLiveList();

  },

  getLiveList: function () {
    getLiveList(1, 20).then(res => {
      if (res.data.length == 1) {
        this.setData({
          liveInfo: res.data[0]
        });
      } else {
        this.setData({
          liveList: res.data
        });
      }
    }).catch(res => {

    })
  },
  // 砍价
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  openSubscribe: function (e) {
    let page = e.currentTarget.dataset.url;
    wx.showLoading({
      title: '正在加载',
    })
    openBargainSubscribe().then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: page,
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },


  /**
   * 商品详情跳转
   */
  goDetail: function (e) {
    let item = e.currentTarget.dataset.items
    if (item.activity && item.activity.type === "1") {
      wx.navigateTo({
        url: `/pages/activity/goods_seckill_details/index?id=${item.activity.id}&time=${item.activity.time}&status=1`
      });
    } else if (item.activity && item.activity.type === "2") {
      wx.navigateTo({
        url: `/pages/activity/goods_bargain_details/index?id=${item.activity.id}`
      });
    } else if (item.activity && item.activity.type === "3") {
      wx.navigateTo({
        url: `/pages/activity/goods_combination_details/index?id=${item.activity.id}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/goods_details/index?id=${item.id}`
      });
    }
  },
  getTemlIds() {
    let messageTmplIds = wx.getStorageSync(CACHE_SUBSCRIBE_MESSAGE);
    if (!messageTmplIds) {
      getTemlIds().then(res => {
        if (res.data)
          wx.setStorageSync(CACHE_SUBSCRIBE_MESSAGE, JSON.stringify(res.data));
      })
    }
  },
  catchTouchMove: function (res) {
    return false
  },
  onColse: function () {
    this.setData({
      window: false
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //倒计时
    let getTime = () => {
      let stopDate = +new Date("2099-12-12"); //获取截至时间戳(.getTime()==+) 
      let nowDate = +new Date() //获取当前时间戳
      let dTime = stopDate - nowDate; //计算时间差
      let s = dTime / 1000; //计算秒
      let m = s / 60; //计算分钟
      let h = m / 60; //计算小时
      let day = h / 24; //计算天
      // console.log(s)
      this.setData({
        day: parseInt(day),
        h: parseInt(h % 24),
        m: parseInt(m % 60),
        s: parseInt(s % 60)
      })

      if (parseInt(s % 60) < 10) {
        // console.log(s)
        this.setData({
          s: "0" + parseInt(s % 60),
        })
      }
      if (parseInt(m % 60) < 10) {
        // console.log(s)
        this.setData({
          m: "0" + parseInt(m % 60),
        })
      }
      if (parseInt(h % 60) < 10) {
        // console.log(s)
        this.setData({
          h: "0" + parseInt(h % 60),
        })
      }
    }
    getTime()
    setInterval(() => {
      getTime()
    }, 1000)

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getIndexConfig();
    if (app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
    this.getSeckillList()
    this.getUserInfo();
  },
  get_issue_coupon_list: function () {
    var that = this;
    getCoupons({
      page: 1,
      limit: 3
    }).then(res => {
      that.setData({
        couponList: res.data
      });
      if (!res.data.length) that.setData({
        window: false
      });
    });
  },
  getIndexConfig: function () {
    var that = this;
    getIndexData().then(res => {
      that.setData({
        imgUrls: res.data.banner,
        menus: res.data.menus,
        itemNew: res.data.roll,
        activityList: res.data.activity,
        bastBanner: res.data.info.bastBanner,
        bastInfo: res.data.info.bastInfo,
        bastList: res.data.info.bastList,
        fastInfo: res.data.info.fastInfo,
        fastList: res.data.info.fastList,
        firstInfo: res.data.info.firstInfo,
        firstList: res.data.info.firstList,
        salesInfo: res.data.info.salesInfo,
        likeInfo: res.data.likeInfo,
        lovelyBanner: res.data.lovely.length ? res.data.lovely[0] : {},
        benefit: res.data.benefit,
        logoUrl: res.data.logoUrl,
        couponList: res.data.couponList,
        newGoodsBananr: res.data.newGoodsBananr
      });
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userInfo']) {
            that.setData({
              window: that.data.couponList.length ? true : false
            });
          } else {
            that.setData({
              window: false,
              iShidden: true
            });
          }
        }
      });
    })
  },
  // 拼团
  openSubcribe: function (e) {
    let page = e.currentTarget.dataset.url;
    wx.showLoading({
      title: '正在加载',
    })
    openPinkSubscribe().then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: page,
      });
    }).catch(() => {
      wx.hideLoading();
    });
    // kaiPinkSubscribe().then(res => {
    //   wx.hideLoading();
    //   wx.navigateTo({
    //     url: page,
    //   });
    // }).catch(() => {
    //   wx.hideLoading();
    // });
  },
  // 砍价
  getCombinationList() {
    var that = this;
    if (that.data.loadend) return;
    if (that.data.loading) return;
    var data = {
      page: that.data.page,
      limit: that.data.limit
    };
    that.setData({
      loading: true
    });
    getCombinationList(data).then(function (res) {
      var combinationList = that.data.combinationList;
      var limit = that.data.limit;
      that.data.page++;
      console.log(that.data.combinationList)
      that.setData({
        loadend: limit > res.data.length,
        combinationList: combinationList.concat(res.data),
        page: that.data.page,
        loading: false,
      });
      console.log(that.data.combinationList)
    }).catch(() => {
      // that.setData({loading:false});
    })
  },
  getBargainList() {
    console.log(11111111)
    var that = this;
    // if (that.data.loadend) return;
    // if (that.data.loading) return;
    // that.setData({loading:true});
    getBargainList({
      page: that.data.page,
      limit: that.data.limit
    }).then(function (res) {
      that.setData({
        bargainList: that.data.bargainList.concat(res.data),
        page: that.data.page + 1,
        loadend: that.data.limit > res.data.length,
        loading: false
      });
    }).catch(res => {
      that.setData({
        loading: false
      });
    });
  },
  // 秒杀
  goDetails: function (e) {
    wx.navigateTo({
      url: '/pages/activity/goods_seckill_details/index?id=' + e.currentTarget.dataset.id + '&time=' + this.data.timeList[this.data.active].stop + '&status=' + this.data.status
    })
  },
  settimeList: function (e) {
    var that = this;
    that.setData({
      active: e.currentTarget.dataset.index
    });
    if (that.data.interval) {
      clearInterval(that.data.interval);
      that.setData({
        interval: null
      });
    }
    that.setData({
      interval: 0,
      countDownHour: "00",
      countDownMinute: "00",
      countDownSecond: "00",
      status: that.data.timeList[that.data.active].status,
      loadend: false,
      page: 1,
      seckillList: [],
    });
    // wxh.time(e.currentTarget.dataset.stop, that);
    that.getSeckillList();
  },

  getSeckillConfig: function () {
    console.log(666)
    let that = this;
    getSeckillIndexTime().then(res => {
      // debugger
      var date = new Date();
      var hNow = date.getHours();
      //分
      var mNow = date.getMinutes();
      console.log(res)
      const seckillTime = res.data.seckillTime;
      for (const index in seckillTime) {
        const hhhh = seckillTime[index].time.split(':')[0];
        const m = seckillTime[index].time.split(':')[1];
        if (hNow <= hhhh) {
          that.setData({
            active: index
          });
          break;
        }
      }
      that.setData({
        topImage: res.data.lovely,
        timeList: res.data.seckillTime,
      });
      // TODO: 计算秒杀开始时间
      // 秒杀时间
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      //获取当前时间
      var n = timestamp * 1000;
      var date = new Date(n);
      //年
      var Y = date.getFullYear();
      //月
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      //时
      var h = date.getHours();
      //分
      var m = date.getMinutes();
      //秒
      var s = date.getSeconds();
      // console.log(Y + M + D + h + m + s)
      console.log(timestamp)


      // console.log()
      if (that.data.timeList.length) {
        // wxh.time(that.data.timeList[that.data.active].stop, that);
        that.setData({
          scrollLeft: (that.data.active - 1.37) * 100
        });
        setTimeout(function () {
          that.setData({
            loading: true
          })
        }, 2000);
        that.setData({
          seckillList: [],
          page: 1
        });
        that.setData({
          status: that.data.timeList[that.data.active].status
        });
        that.getSeckillList();
      }
    });
  },
  getSeckillList() {
    var that = this;
    var data = {
      page: that.data.page,
      limit: that.data.limit
    };
    // if (that.data.loadend) return;
    // if (that.data.pageloading) return;
    // that.setData({ pageloading: true });
    getSeckillList(that.data.timeList[that.data.active].id, data).then(res => {
      var seckillList = res.data;
      var loadend = seckillList.length < that.data.limit;
      that.data.page++;
      console.log(that.data.timeList[that.data.active])
      that.setData({
        seckillList: that.data.seckillList.concat(seckillList),
        page: that.data.page,
        pageloading: false,
        loadend: loadend
      });
      wxh.time(that.data.timeList[that.data.active].stop, that)
    }).catch(err => {
      // that.setData({ pageloading: false });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      window: false
    });
    if (this.data.interval) {
      clearInterval(this.data.interval);
      this.setData({
        interval: null
      });
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getIndexConfig();
    if (app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCombinationList(); //拼团
    this.getBargainList(); //砍价
    this.getSeckillList(); //秒杀
  },
  /*
   * 获取用户信息
   */
  getUserInfo: function () {
    console.log("start:")
    var that = this;
    getUserInfo().then(res => {
      console.log("start:"+res)
      // let isState = true;
      // if ((res.data.is_promoter || res.data.statu == 2) && this.data.sharePacket.priceName != 0) {
      //   isState = false;
      // }
      that.setData({
        // 'sharePacket.isState': isState,
        uid: res.data.uid
      });
      console.log("start")
      app.globalData.uid = res.data.uid;

      console.log(app.globalData)
      console.log(res);
      shareBind({
        spread: that.data.spid,
        uid: res.data.uid
      }).then(res => {
        // console.log(res);

      })
    }).catch(err => {
      console.log(err);
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('pages/index/index?spid=' + this.data.uid);
    return {
      title: '柳林酒业',
      path: '/pages/index/index?spid=' + this.data.uid,
    }
  }
})