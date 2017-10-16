import axios from 'axios'


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

export const postApi = (params, succ_foo, error_foo) => {
    axios({
        method:"post",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:"http://192.168.2.231:807/SwsWeb.ashx",
        data:{
            methodName:"p_costManage.GetHJForScheId",
               parameters:"2045",
               u_login:"admin",
               u_pass:"admin",
               login_key:"",
               no_login_key:"1",
        },
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
         }],
    }).then(response => {
        succ_foo(response)
    })
    .catch(error => {
        error_foo(error)
    })
}