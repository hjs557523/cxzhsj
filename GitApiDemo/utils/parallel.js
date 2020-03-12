/**
 * 并行处理异步操作
 */

/**
 * task: 任务数组，每一个任务task是一个创建promise对象的函数
 * callback: 回调函数,Function对象
 */
export default function parallel(tasks, callback) {
  var len = tasks.length;
  var results = [];//初始结果为空数组
  tasks.forEach(function(task, i) {
    //去fetch每一个url
    task().then(function(res) {
      if(res.ok) {
        return res;
      }
    }).then(function(json) {
      console.log(json);
      len--;
      results[i] = json.data;
      if(len == 0) {
        callback.apply(null, results);
      }
    })
  })
  
}