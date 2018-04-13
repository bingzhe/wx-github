//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: "",
    detail: {}
  },
  bindInputName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  //取到user
  getUserinfo() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.github.com/users/' + this.data.name,
        success: function (resp) {
          wx.hideToast();
          if (resp.statusCode === 200) {
            app.globalData.userinfo = resp.data
            resolve()
          } else {
            wx.showModal({
              content: '没查找到ID,请确认输入',
              confirmText: '关闭',
              showCancel: false,
            })
          }
        },
        fail: function (resp) {
          reject(resp)
        }
      })
    })
  },

  //取到repository
  getRepoinfo() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.github.com/users/' + this.data.name + '/repos?per_page=100',
        success: function (resp) {
          if (resp.statusCode === 200) {
            app.globalData.repoinfo = resp.data
            resolve()
          }
        },
        fail: function (resp) {
          reject(resp)
        }
      })
    })
  },

  //取到pr
  getPrinfo() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.github.com/search/issues?q=type:pr+is:merged+author:'
          + this.data.name + '&per_page=100',
        success: function (resp) {
          if (resp.statusCode === 200) {
            wx.hideToast();
            
            app.globalData.prinfo = resp.data

            wx.navigateTo({
              url: '../detail/detail'
            })
            resolve()
          }
        },
        fail: function (resp) {
          reject(resp)
        }
      })
    })

  },

  //查找获取数据
  bindSearch() {
    if (!this.data.name) {
      wx.showModal({
        content: '请输入Github ID',
        confirmText: '关闭',
        showCancel: false,
      })
      return
    }

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 20000
    });

    this.getUserinfo().then(this.getRepoinfo).then(this.getPrinfo);


  }
  //取到
})
