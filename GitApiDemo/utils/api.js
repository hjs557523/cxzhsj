//记得pull request。github api有单ip的限制
const githubHost = 'https://api.github.com/';//github接口域名
var githubApi = {

  userUrl: function(githubName) {
    //console.log('调用了这个模块');
    return githubHost + 'users/' + githubName; 
  },

  repoUrl: function(githubName) {
    return this.userUrl(githubName) + '/repos?per_page=100';
  },

  prUrl: function (githubName) {
    return githubHost + 'search/issues?q=type:pr+is:merged+author:' + githubName + '&per_page=100';
  }
}

//对wx.request进行封装为promise对象
function fetch(url) {
  console.log("fetch start");
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'token a0b7c5cc05e32b938535f596401fe12b45e3be67'
      },
      success: (res) => {
        console.log("success");
        res.ok = true;
        resolve(res);
      },

      fail: () => {
        console.log("fail");
        reject();
        wx.redirectTo({
          url: '/pages/detail/detail',
        })
      }
    });
  })
}

module.exports = {
  githubApi: githubApi,
  fetch: fetch
}