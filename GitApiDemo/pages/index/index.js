//index.js
//获取应用实例
var app = getApp();
var parallel = require('../../utils/parallel.js').default;
var API = require('../../utils/api.js');

Page({
  data: {
    githubName: '',
    detail: {},    
  },


  bindInputGitHubUserName: function(e) {
    this.setData({
      githubName: e.detail.value
    })
  },

  bindSearch: function() {
    var userUrl = API.githubApi.userUrl(this.data.githubName);
    var repoUrl = API.githubApi.repoUrl(this.data.githubName);
    var prUrl = API.githubApi.prUrl(this.data.githubName);
    console.log(userUrl);
    console.log(repoUrl);
    console.log(prUrl);

    var me = this;

    wx.showToast({
      title: '正在加载中...',
      icon: 'Loading',
      duration: 20000
    });

    var tasks = [userUrl, repoUrl, prUrl].map(function(url) {
      return function() {
        return API.fetch(url);
      }
    });

    //github api请求慢，因此使用回调
    parallel(tasks, function(user, repo, pr) {
      wx.hideToast();//全部数据加载完成，再关闭Toast
      wx.setStorageSync(app.storageName, {
        user: user,
        repo: repo,
        pr: pr
      });
      wx.navigateTo({
        url: '../detail/detail',
      })
    })
  },



  // //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // onLoad: function () {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
