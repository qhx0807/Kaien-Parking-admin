<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 4}">
        <Row type="flex">
            <Col :span="spanLeft" class="layout-menu-left" :style="menuStyleObj">
                <Menu :active-name="activeName" theme="dark" width="auto" @on-select="selectMenu">
                    <div class="layout-logo-left"></div>
                    <MenuItem name="CarList">
                        <Icon type="android-car" :size="iconSize" title="车辆列表"></Icon>
                        <span class="layout-text">车辆列表</span>
                    </MenuItem>
                    <MenuItem name="Review">
                        <Icon type="ios-keypad" :size="iconSize" title="操作审核"></Icon>
                        <span class="layout-text">操作审核</span>
                    </MenuItem>
                    <MenuItem name="Account">
                        <Icon type="ios-person" :size="iconSize" title="账户管理"></Icon>
                        <span class="layout-text">账户管理</span>
                    </MenuItem>
                    <MenuItem name="Log">
                        <Icon type="ios-calendar" :size="iconSize" title="日志查询"></Icon>
                        <span class="layout-text">日志查询</span>
                    </MenuItem>
                </Menu>
            </Col>
            <Col :span="spanRight"  :style="menuStyleObj">
                <div class="layout-header">
                    <Button type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                    <div class="avatar">
                        <Poptip trigger="hover"  placement="bottom-end" width="100">
                            <Avatar size="large" :style="{background: avatarColor}">{{ user }}</Avatar>
                            <div slot="title">欢迎您，admin</div>
                            <div slot="content" class="poptip-content">
                                <ul>
                                    <li><Icon type="person" size="16"></Icon> 个人信息</li>
                                    <li><Icon type="power" size="14"></Icon> 退出登录</li>
                                </ul>
                            </div>
                        </Poptip>
                    </div>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem>首页</BreadcrumbItem>
                        <BreadcrumbItem>{{breadcrumbname}}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div class="layout-content" :style="mainContentHeight">
                    <div class="layout-content-main">
                        <router-view/>
                    </div>
                </div>
                <div class="layout-copy">
                    2001-2017 &copy; Kaien International Furniture
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                spanLeft: 1,
                spanRight: 23,
                menuStyleObj:{
                    height:'',
                    overflow: 'auto',
                },
                mainContentHeight:{
                    minHeight:'',
                },
                avatarColor:'#00a2ae',
                user:'admin',
                breadcrumbname:'全部车辆',
                activeName:'CarList',
            }
        },
        computed: {
            iconSize () {
                return this.spanLeft === 2 ? 15 : 24;
            }
        },
        watch:{
            "$route":function(to, from){
                this.activeName = to.name
                switch(to.name){
                    case "CarList":
                        this.breadcrumbname = "全部车辆"
                        break
                    case "Review":
                        this.breadcrumbname = "操作审核"
                        break
                    case "Account":
                        this.breadcrumbname = "账户管理"
                        break
                    case "Log":
                        this.breadcrumbname = "日志查询"
                        break
                }
            }
        },
        created(){
            let winH = document.body.clientHeight;
            let winW = document.body.clientWidth;
            
            this.menuStyleObj.height = winH + 'px';
            this.mainContentHeight.minHeight = winH - 169 +'px'
            
            this.activeName = this.$route.name
            switch(this.$route.name){
                case "CarList":
                    this.breadcrumbname = "全部车辆"
                    break
                case "Review":
                    this.breadcrumbname = "操作审核"
                    break
                case "Account":
                    this.breadcrumbname = "账户管理"
                    break
                case "Log":
                    this.breadcrumbname = "日志查询"
                    break
            }
        },
        methods: {
            toggleClick () {
                if (this.spanLeft === 4) {
                    this.spanLeft = 1;
                    this.spanRight = 23;
                } else {
                    this.spanLeft = 4;
                    this.spanRight = 20;
                }
            },
            selectMenu(e){
                this.$router.push({name: e})
            }
        }
    }
</script>

<style scoped lang="less">
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
        color: rgba(255, 255, 255, 0.7);
        //border-right: 2px solid rgba(255, 255, 255, 0.7);
    }
    .layout{
        //border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        //border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        //min-height: 820px;
        margin: 15px;
        overflow: hidden;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
       
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
        overflow: auto;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .avatar{
        float: right;
        margin-right: 40px;
        margin-top: 11px;
    }
    .poptip-content{
        ul{
            li{
                height: 35px;
                line-height: 35px;
                cursor: pointer;
                &:hover{
                    color: black;
                }
            }
        }
    }
</style>
