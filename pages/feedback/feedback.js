// pages/feedback/feedback.js

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: 20,
    status: 2,
    focus: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '意见反馈',
    })
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  bindTextAreaBlur: function (e) {

  },
  bindFormSubmit: function (e) {
    var that = this
    var content = e.detail.value.textarea
    var openid = wx.getStorageSync("openid")
    if (content !== '') {
      const data = {
        content: content,
        openid: openid
      };
      api.tickling({
        data,
        method: 'POST',
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        success: (res) => {
          console.log(res.data.code)
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
          }
        },
      })
    } else {
      wx.showLoading({
        title: '内容不能为空',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    }
  },
  onShow: function () {
    this.onLoad();
  },
})