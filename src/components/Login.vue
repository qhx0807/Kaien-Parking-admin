<template>
    <div class="wrap">
        <canvas id="canvas"></canvas>
        <Card class="login">
            <div class="login-title">铠恩国际停车管理系统</div>
            <Form ref="fromlogin" :model="fromlogin" :rules="ruleLogin">
                <FormItem prop="account">
                    <Input type="text" v-model="fromlogin.account" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password"  style="margin-bottom:26px">
                    <Input @on-keyup="onPressEnter" type="password"  v-model="fromlogin.password" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:6px;padding-left:2px">
                     <Checkbox v-model="remerberMe">记住我</Checkbox>
                </FormItem>

                <FormItem>
                    <Button type="primary" :loading="submitLoading" @click="handleSubmit('fromlogin')" long>登录</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import { postApi } from '../axios'
export default {
    name: 'Login',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            fromlogin:{
                Ctype:'Login',
                account: '',
                password: '',
            },
            remerberMe:true,
            submitLoading:false,
            ruleLogin:{
                account: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    //{ type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            }
        }
    },
    mounted(){
        this.bgCanvas()
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.submitLoading = true
                    postApi( this.fromlogin, 
                        function(response){
                            this.submitLoading = false
                            //console.log(response)
                            if(response.data.error){
                                this.$Modal.error({
                                    title:'登录失败',
                                    content:response.data.error,
                                })
                            }else if(response.data.ok){
                                window.sessionStorage.setItem("name", this.fromlogin.account)
                                window.sessionStorage.setItem("auth", response.data.ok)
                                if(response.data.ok=='11111111'){
                                    window.sessionStorage.setItem("isadmin", '1')
                                }else{
                                    window.sessionStorage.setItem("isadmin", '0')
                                }
                                //this.$store.commit('UPDATE_AUTH', [1,1,1,1,1,1,1,1])
                                this.$router.replace({name: 'CarList'})
                            }else{
                                this.$Message.warning(response.data)
                            }
                        }.bind(this),function(error){
                            this.submitLoading = false
                            console.log(error)
                            this.$Message.error('连接失败!')
                        }.bind(this))

                } else {
                    this.$Message.error('表单验证失败!')
                }
            })
        },
        onPressEnter(e){
            if(e.keyCode===13){
                this.handleSubmit('fromlogin')
            }
        },
        bgCanvas(){
            class Circle {
                //创建对象
                //以一个圆为对象
                //设置随机的 x，y坐标，r半径，_mx，_my移动的距离
                //this.r是创建圆的半径，参数越大半径越大
                //this._mx,this._my是移动的距离，参数越大移动
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.r = Math.random() * 11;
                    this._mx = Math.random();
                    this._my = Math.random();
                }
                //canvas 画圆和画直线
                //画圆就是正常的用canvas画一个圆
                //画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
                drawCircle(ctx) {
                    ctx.beginPath();
                    //arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
                    ctx.arc(this.x, this.y, this.r, 0, 360)
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(204, 204, 204, 0.3)';
                    ctx.fill();
                }

                drawLine(ctx, _circle) {
                    let dx = this.x - _circle.x;
                    let dy = this.y - _circle.y;
                    let d = Math.sqrt(dx * dx + dy * dy)
                    if (d < 210) {
                        ctx.beginPath();
                        //开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
                        ctx.moveTo(this.x, this.y);   //起始点
                        ctx.lineTo(_circle.x, _circle.y);   //终点
                        ctx.closePath();
                        ctx.strokeStyle = 'rgba(204, 204, 204, 0.3)';
                        ctx.stroke();
                    }
                }

                // 圆圈移动
                // 圆圈移动的距离必须在屏幕范围内
                move(w, h) {
                    this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
                    this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
                    this.x += this._mx / 2;
                    this.y += this._my / 2;
                }
            }
            //鼠标点画圆闪烁变动
            class currentCirle extends Circle {
                constructor(x, y) {
                    super(x, y)
                }
                drawCircle(ctx) {
                    ctx.beginPath();
                    //注释内容为鼠标焦点的地方圆圈半径变化
                    //this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
                    this.r = 8;
                    ctx.arc(this.x, this.y, this.r, 0, 360);
                    ctx.closePath();
                    //ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')'
                    ctx.fillStyle = 'rgba(204, 204, 204, 0.3)'
                    ctx.fill();
                }
            }
            //更新页面用requestAnimationFrame替代setTimeout
            window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            let canvas = document.getElementById("canvas");
            let ctx = canvas.getContext("2d");
            let w = canvas.width = canvas.offsetWidth;
            let h = canvas.height = canvas.offsetHeight;
            let circles = [];
            let current_circle = new currentCirle(0, 0)
            let draw = function () {
                ctx.clearRect(0, 0, w, h);
                for (let i = 0; i < circles.length; i++) {
                    circles[i].move(w, h);
                    circles[i].drawCircle(ctx);
                    for (let j = i + 1; j < circles.length; j++) {
                        circles[i].drawLine(ctx, circles[j])
                    }
                }
                if (current_circle.x) {
                    current_circle.drawCircle(ctx);
                    for (var k = 1; k < circles.length; k++) {
                        current_circle.drawLine(ctx, circles[k])
                    }
                }
                requestAnimationFrame(draw)
            }
            let init = function (num) {
                for (var i = 0; i < num; i++) {
                    circles.push(new Circle(Math.random() * w, Math.random() * h));
                }
                draw();
            }
            window.addEventListener('load', init(70));
            window.onmousemove = function (e) {
                e = e || window.event;
                current_circle.x = e.clientX;
                current_circle.y = e.clientY;
            }
            window.onmouseout = function () {
                current_circle.x = null;
                current_circle.y = null;
            };

        }
    }
}
</script>

<style lang="less" scoped>
.wrap{
    #canvas{
        display: block;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
    }
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login{
        width: 320px;
        height: 330px;
        padding: 20px;
        .login-title{
            text-align: center;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            margin-bottom: 24px;
            vertical-align: text-bottom;
            font-size: 16px;
            text-transform: uppercase;
            color: rgba(0, 0, 0, .65);
        }
    }
}
</style>
