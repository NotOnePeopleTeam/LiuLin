// pages/map/map.js
const app = getApp();

import {
  storeListMap
} from '../../api/activity.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hosList:[],
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '门店列表',
      'color': false
    },
    latitude: 0,
    longitude: 0,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    // 查看附近店铺的个数
    limit: 10,
    isAuto: false,//没有授权的不会自动授权
    iShidden: true,//是否隐藏授权
      // text:"这是一个页面"
  
    // 搜索框状态
    inputShowed: true,
    // 搜索框值
    inputVal: "",
    //搜索渲染推荐数据 
  },
  // 搜索
// goSearch: function(e) {
//   var that = this;
//   var formData = e.detail.value;
//   if (formData) {
//    wx.request({
//     url: `${app.globalData.url}/api/store_list`,
//    data: {
//     title: formData
//    },
   
//    header: {
//     'Content-Type': 'application/json'
//    },
//    success: function(res) {
//     that.setData({
//     search: res.data,
//     })
//     if (res.data.msg=='无相关视频'){
//     wx.showToast({
//      title: '无相关视频',
//      icon: 'none',
//      duration: 1500
//     })
//     }else{
//     let str = JSON.stringify(res.data.result.data);
//     wx.navigateTo({
//      url: '' 
//     })
//     }
//    }
//    })
//   } else {
   
//    wx.showToast({
//    title: '输入不能为空',
//    icon: 'none',
//    duration: 1500
//    })
   
//   }
//   },
  // 
  input1:function(e){
    // let name = event.currentTarget.name;
    this.setData({
      name:e.detail.value
    })
    console.log(e.detail.value)
  }, 
  // storeListMap: function () {
  //   console.log(111111111111111)
  //   var that = this;
  //   var data = {
  //     latitude: that.data.latitude,
  //     longitude: that.data.longitude,
  //     latitude_current: that.data.latitude,
  //     longitude_current: that.data.longitude,
  //   };
  //   console.log(data)
  //   storeListMap(data).then(res => {
  //     var map = res.data;
  //     console.log(map)
  //   }).catch(err => {
  //     // that.setData({ pageloading: false });
  //   });
  // },
  
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.getPosition()
    // this.storeListMap()
  },
  // 搜索
  btn(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    
  },

  
  // 清除搜索框值
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  // 获取搜索框值
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    console.log( e.detail.value)
    var that = this
    var data = {
      content: that.data.inputVal
    }
    this.getShop();
  },
  // 获取选中推荐列表中的值
  btn_name: function (res) {

  },
  getPosition() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        // console.clear()
        console.log(res)
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.getShop(res.latitude, res.longitude,res.name)
      }
    })
  },
  
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
          console.log('=====')
          let markers = []
          for (let i = 0; i < list.length; i++) {
            let item = {
              iconPath: list[i].image,
              id: list[i].id,
              name:list[i].name,
              latitude: parseFloat(list[i].latitude),
              longitude: parseFloat(list[i].longitude),
              width: 50,
              height: 50
            }
            markers.push(item)
          }
          console.log(markers)
          console.log(markers.name)
          this.setData({
            markers: markers
          })
        }
      }
    })
  },
    /**
   * 打开属性插件
  */
 selecAttr: function () {
  if (app.globalData.isLog === false)
    this.setData({ isAuto: true, iShidden: false })
  else
    this.setData({ 'attribute.cartAttr': true, isOpen: true })
},
})