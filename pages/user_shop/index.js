// pages/user_shop/index.js
import {
  getProductslist,
  getProductHot
} from '../../api/store.js';

const app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '积分活动专场',
      'color': false,
      // 'class': '0'
    },
    productList: [],
  },
  //设置where条件
  setWhere: function () {
    if (this.data.price == 0)
      this.data.where.priceOrder = '';
    else if (this.data.price == 1)
      this.data.where.priceOrder = 'desc';
    else if (this.data.price == 2)
      this.data.where.priceOrder = 'asc';
    if (this.data.stock == 0)
      this.data.where.salesOrder = '';
    else if (this.data.stock == 1)
      this.data.where.salesOrder = 'desc';
    else if (this.data.stock == 2)
      this.data.where.salesOrder = 'asc';
    this.data.where.news = this.data.nows ? 1 : 0;
    this.setData({
      where: this.data.where
    });
  },
  //查找产品
  get_product_list: function (isPage) {
    let that = this;
    this.setWhere();
    if (that.data.loadend) return;
    if (that.data.loading) return;
    if (isPage === true) that.setData({
      productList: []
    });
    that.setData({
      loading: true,
      loadTitle: ''
    });
    getProductslist(that.data.where).then(res => {
      console.log(res.data)
      let list = res.data;
      let productList = app.SplitArray(list, that.data.productList);
      let loadend = list.length < that.data.where.limit;
      that.setData({
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? '已全部加载' : '加载更多',
        productList: productList,
        ['where.page']: that.data.where.page + 1,
      });
    }).catch(err => {
      that.setData({
        loading: false,
        loadTitle: '加载更多'
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      ['where.sid']: 58 || 0,
      title: options.title || '',
      ['where.keyword']: options.searchValue || '',
      navH: app.globalData.navHeight
    });
    this.get_product_list();
    // this.get_host_product();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})