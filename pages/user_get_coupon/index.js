// pages/coupon-list/index.js
import { getCouponReceive } from '../../api/user.js';
import { getCoupons } from '../../api/api.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'color': true,
      'title': '领取优惠券',
      'color': true,
      'class': '0'
    },
    couponsList:[],
    loading:false,
    loadend:false,
    page:1,
    limit:20,
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUseCoupons();
  },
  getCoupon:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = that.data.couponsList;
    //领取优惠券
    getCouponReceive({ couponId: id }).then(function (res) {
      list[index].is_use = true;
      that.setData({
        couponsList: list
      });
      app.Tips({ title: '领取成功' });
    },function(res){
      return app.Tips({title:res.msg});
    });
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
    var that=this
    if(this.data.loadend) return false;
    if(this.data.loading) return false;
    getCoupons({ page: this.data.page, limit: this.data.limit }).then(res=>{
      var list=res.data,loadend=list.length < that.data.limit;
      var couponsList = app.SplitArray(list, that.data.couponsList);
      that.setData({ 
        loading: true, 
        couponsList: couponsList,
        page:that.data.page+1,
        loadend: loadend
      });
    }).catch(err=>{
      that.setData({ loading: false });
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getUseCoupons();
  },


})