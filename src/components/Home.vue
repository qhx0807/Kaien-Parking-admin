<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 4}">
        <Row type="flex">
            <Col :span="spanLeft" class="layout-menu-left" :style="menuStyleObj">
                <Menu active-name="1" theme="dark" width="auto">
                    <div class="layout-logo-left"></div>
                    <MenuItem name="1">
                        <Icon type="ios-navigate" :size="iconSize"></Icon>
                        <span class="layout-text">选项 1</span>
                    </MenuItem>
                    <MenuItem name="2">
                        <Icon type="ios-keypad" :size="iconSize"></Icon>
                        <span class="layout-text">选项 2</span>
                    </MenuItem>
                    <MenuItem name="3">
                        <Icon type="ios-analytics" :size="iconSize"></Icon>
                        <span class="layout-text">选项 3</span>
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
                                    <li>个人信息</li>
                                    <li>退出登录</li>
                                </ul>
                            </div>
                        </Poptip>
                    </div>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem href="#">首页</BreadcrumbItem>
                        <BreadcrumbItem href="#">应用中心</BreadcrumbItem>
                        <BreadcrumbItem>某应用</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div class="layout-content" :style="mainContentHeight">
                    <div class="layout-content-main">
                        <ul>
                            <li>
                                内容区域<br><br><br><br><br>
                            </li>
                            

                        </ul>
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
                spanLeft: 4,
                spanRight: 20,
                menuStyleObj:{
                    height:'',
                    overflow: 'auto',
                },
                mainContentHeight:{
                    minHeight:'',
                },
                avatarColor:'#00a2ae',
                user:'admin',
            }
        },
        computed: {
            iconSize () {
                return this.spanLeft === 2 ? 14 : 24;
            }
        },
        created(){
            let winH = document.body.clientHeight;
            let winW = document.body.clientWidth;
            
            this.menuStyleObj.height = winH + 'px';
            this.mainContentHeight.minHeight = winH - 169 +'px'
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
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        //min-height: 820px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
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
