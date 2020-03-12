// pages/detail/detail.js
var formate = require('../../utils/formate.js');
var getYear = formate.getYear;
var computePopularity = formate.computePopularity;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    repo: [],
    prs: [],
    language: []
  },

  onShareAppMessage: function() {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
  },

  collectPr: function(prs) {
    //p:result, c:prs[]的元素
    prs = prs.reduce(function(p, c) {
      if(!p[c.repository_url]) {
        p[c.repository_url] = {
          popularity: 1
        };
      } else {
        p[c.repository_url].popularity += 1;
      }
      return p;
    },{});

    // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，
    // 数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 
    return Object.keys(prs).map(function(v) {
      return {
        name: v.replace('https://api.github.com/repos/',''),//仓库名
        popularity: prs[v].popularity//获得该项目的热度值
      }
    });
  },

  /**
   * 形式：
   * [{language}] => [{xxx: {popularity: xxx}, xxx: {popularity: xxx},...}]
   */
  collectLanguage: function(repo) {
    var language = {};
    var total = 0;
    // 遍历每一个仓库
    repo.forEach(function(r) {
      var lang = r.language;//获取仓库项目的语言
      if (!lang) {//没有语言
        return false;
      }else if(!language[lang]) {
        language[lang] = {
          popularity: 1
        };
      } else {
        language[lang].popularity += 1;
      }
      total++;
    });

    return Object.keys(language).map(function(langName) {
      return {
        name: langName,
        popularity: language[langName].popularity,
        percent: Math.round(language[langName].popularity/total * 100)
      }
    })
  },


  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var detail = wx.getStorageSync(app.storageName) || {};
    var repo = detail.repo.filter(function (r) {
      return !r.fork//没有被fork的项目就不展示？
    });

    var prs = this.collectPr(detail.pr.items);

    detail.user.year = getYear(detail.user.created_at);

    repo.sort(function(p, c) {
      return (computePopularity(p) > computePopularity(c))
    }).reverse();

    prs.sort(function(p, c) {
      return p.popularity > c.popularity;
    }).reverse();

    this.setData({
      user: detail.user,
      repo: repo.slice(0, 5),
      prs: prs.slice(0, 5),
      language: this.collectLanguage(repo)
    })
    
    console.log(detail.user);

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