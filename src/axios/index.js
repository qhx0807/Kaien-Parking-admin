import axios from 'axios'

// const apiUrl = "https://bird.ioliu.cn/v1?url=http://39.108.15.145/parkingpay.ashx?"

const apiUrl = "../parkingpay.ashx?"

axios.interceptors.request.use(function(config){
    //在请求发出之前进行一些操作
    //console.log(config)
    return config;
  },function(error){
    //Do something with request error
    return Promise.reject(error);
  });

  axios.interceptors.response.use(function(res){
    //在这里对返回的数据进行处理
    // if(res.data.name=="qhx"){
    // 	return 123;
    // }
    return res;
},function(error){
    //Do something with response error
    return Promise.reject(error);
})

export const postApi = (data, succ_foo, error_foo) => {
    let datastr = ''
    for (let it in data) {
        datastr += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    axios({
        method:"get",
        url: apiUrl + datastr,
    }).then(response => {
        succ_foo(response)
    })
    .catch(error => {
        error_foo(error)
    })
}