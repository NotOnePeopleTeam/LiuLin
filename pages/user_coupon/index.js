// pages/coupon-list/index.js

import { getUserCoupons } from '../../api/api.js';

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '我的优惠券',
      'color': true,
      'class': '0'
    },
    couponsList:[],
    loading:false,
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUseCoupons();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 获取领取优惠券列表
  */
  getUseCoupons:function(){
    var that = this;
    getUserCoupons(0).then(res=>{
    console.log(res.data)

      that.setData({ loading: true, couponsList: res.data });
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})