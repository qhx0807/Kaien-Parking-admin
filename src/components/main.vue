<template>
    <div class="main">
        <div class="sidebar-menu-con"  :style="{width: hideMenuText?'60px':'200px', overflow: hideMenuText ? 'visible' : 'auto',}">
			<SidebarMenu v-show="!hideMenuText"></SidebarMenu>
			<SidebarMenuShrink v-show="hideMenuText"></SidebarMenuShrink>
		</div>
		<div class="main-header-con" :style="{paddingLeft: hideMenuText ? '60px' : '200px'}">
			<Button type="text" @click="toggleClick">
				<Icon type="navicon" size="32"></Icon>
			</Button>
			<div class="avatar">
				<Poptip trigger="hover"  placement="bottom-end" width="100">
					<Avatar size="large" :style="{background: avatarColor}">{{ username }}</Avatar>
					<div slot="title">欢迎您，{{username}}</div>
					<div slot="content" class="poptip-content">
						<ul>
							<!-- <li><Icon type="person" size="16"></Icon> 个人信息</li> -->
							<li @click="loginOut"><Icon type="power" size="14"></Icon> 退出登录</li>
						</ul>
					</div>
				</Poptip>
			</div>
		</div>
		<div class="main-page-con" :style="{paddingLeft: hideMenuText ? '60px' : '200px'}">
			<div class="breadcrumb-con">
				<Breadcrumb>
					<BreadcrumbItem>首页</BreadcrumbItem>
					<BreadcrumbItem>{{breadcrumbname}}</BreadcrumbItem>
				</Breadcrumb>
				<div class="page" :style="mainContentHeight">
					<router-view></router-view>
				</div>
				<div class="copy">
                    2001-2017 &copy; Kaien International Furniture
                </div>
			</div>
		</div>
    </div>
</template>

<script>
import SidebarMenu from './main_components/SidebarMenu.vue'
import SidebarMenuShrink from './main_components/SidebarMenuShrink.vue'
export default {
	name: "Main",
	components:{
		SidebarMenu,
		SidebarMenuShrink,
	},
	data() {
		return {
			hideMenuText:true,
			username:'admin',
			avatarColor:'#00a2ae',
			breadcrumbname:'全部车辆',
			mainContentHeight:{
				minHeight:'',
			},
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
				case "Setting":
					this.breadcrumbname = "系统设置"
					break
			}
		}
	},
	created(){
		if(sessionStorage.getItem("name")){
			this.username = sessionStorage.getItem("name")
		}else{
			this.$Message.info("请登录~~")
			this.$router.replace({name:'Login'})
		}


		let winH = document.body.clientHeight;
		let winW = document.body.clientWidth;
		
		//this.menuStyleObj.height = winH + 'px';
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
			case "Setting":
				this.breadcrumbname = "系统设置"
				break
		} 
	},
	methods: {
		toggleClick(){
			this.hideMenuText = !this.hideMenuText
		},
		loginOut(){
			this.$Modal.confirm({
				title: '登出提示',
				content: '<p>确认退出当前账号吗？</p>',
				onOk: () => {
					this.$Message.info('已退出')
					window.sessionStorage.clear()
					this.$router.replace({name:'Login'})
				}
			})
		}
	}
};
</script>

<style lang="less" scoped>
.main {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #f0f0f0;
	.sidebar-menu-con{
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
		z-index: 1010;
		background: rgb(73, 80, 96);
		//transition: width .2s linear;
	}
	&-header-con{
		transition: padding .2s linear;
        box-sizing: border-box;
        position: fixed;
        display: block;
        padding-left: 200px;
        width: 100%;
        height: 60px;
		z-index: 1000;
		background-color: #ffffff;
		box-shadow: 0 2px 1px 1px rgba(100,100,100,.1);
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
	}
	&-page-con{
		box-sizing: border-box;
        padding: 60px 0 10px;
        background-color: #F0F0F0;
		z-index: -1;
		transition: padding .2s linear;
		.breadcrumb-con{
			clear: both;
			padding: 10px 15px 0;
		}
		.page{
            margin: 10px 0;
		}
		.copy{
			text-align: center;
			padding: 10px 0 20px;
			color: #9ea7b4;
		}
	}
}
</style>

