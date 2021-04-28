// pages/lucky/index.js
var util = require("../../utils/util.js");
import {
  HTTP_REQUEST_URL
} from '../../config.js';
import {
  drawPrice,
  drawLucky,
  // prize_tips
} from '../../api/activity.js';
var app = getApp();

Page({
  //奖品配置
  awardsConfig: {
    chance: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    chance: true,
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '幸运转盘',
      'color': true,
      'class': '0'
    },
    awardss: [], 
    awardsList: {}, 
    animationData: {}, 
    btnDisabled: '',  
    draw_id: 0 , //  中奖id
    imgbg: HTTP_REQUEST_URL,
    dui:false,
  },
  jilu:function(){
    wx.navigateTo({
      url: '../../pages/lucky_jilu/index',
    })
  },
  close: function () {
   this.setData({
     dui:false
   })
  },
  duihuan:function(){
    this.setData({
      dui:true
    })
  },
  shangpin:function(){
    wx.reLaunch({
      url: '../goods_cate/goods_cate',
    })
  },
  zhifu:function(){
    
  },
  getIndex:function(prizeArr,win_id){
    for(var i=0;i<prizeArr.length;i++){
      if(win_id==prizeArr[i].id){
        return i;
      }
    }
  },
  draw_product: function () {
    var that = this;
    drawPrice().then(res => {
      console.log(res.data)
      that.setData({
        remark:res.data.draw.remark,
        awardss: res.data.prize,
        id: res.data.prize.id,
        image:res.data.prize.image,
        prize: res.data.prize.prize,
        draw_id: res.data.draw.id
      });
      this.drawAwardRoundel();
    });
  },
  getdrawLucky: function () {
    var that = this;
    drawLucky({
      'draw_id': that.data.draw_id,
      'remark': that.data.remark,
    }).then(res => {
      if (res.data.code == 0) {
        wx.showModal({
          content: res.data.msg,
        })
        return false;
      }
     // console.log(res.data)
      var awardIndex = this.getIndex( that.data.awardss,res.data.win_id);
    
      //Math.ceil(Math.random()*5);
      var runNum = 8; //旋转8周
      var duration = 4000; //时长
      // 旋转角度
      this.runDeg = this.runDeg || 0;
      // console.log(this.runDeg)
      this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / that.data.awardss.length));
      //创建动画
      var animationRun = wx.createAnimation({
        duration: duration,
        timingFunction: 'ease'
      })
      animationRun.rotate(this.runDeg).step();
      this.setData({
        animationData: animationRun.export(),
        btnDisabled: 'disabled'
      });
      // 中奖提示
      // var awardsConfig = this.awardsConfig;
      var awardsConfig = this.data.awardss;
      // var image = "<image src='this.data.awardss[awardIndex].image'></image>"
      console.log(awardsConfig)
      setTimeout(function () {
        wx.showModal({
          // title: '恭喜',
          // '获得' +
          content:  (this.data.awardss[awardIndex]. prize_tips),
          showCancel: false
        });
        console.log(this.data.awardss[awardIndex].prize)
        this.setData({
          btnDisabled: '',
          chance: true
        });
      }.bind(this), duration);
      this.draw_product();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.draw_product();
    // this.getdrawLucky();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    this.drawAwardRoundel();
    this.draw_product();
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  //画抽奖圆盘
  drawAwardRoundel: function () {
    var that = this;
    var awards = that.data.awardss;
    var awardsList = [];
    var turnNum = 1 / awards.length; // 文字旋转 turn 值
    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({
        turn: i * turnNum + 'turn',
        lineTurn: i * turnNum + turnNum / 2 + 'turn',
        award: awards[i].prize,
        image: awards[i].image
      });
    }
    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList
    });
  },
  //发起抽奖
  playReward: function () {
    this.getdrawLucky();
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
  // onShareAppMessage: function () {
  //   var that = this;
  //   return util.doShare("大转盘抽奖", "pages/zp/zp", that);
  // }
  onShareAppMessage: function () {
    console.log('pages/index/index?spid=' + this.data.uid);
    return {
      title: '柳林酒业',
      path: '/pages/index/index?spid=' + this.data.uid,
    }
  }
})