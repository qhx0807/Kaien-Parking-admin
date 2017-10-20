<template>
    <Menu :active-name="activeName" theme="dark" width="auto" @on-select="selectMenu">
        <div class="layout-logo-left"></div>
		<!-- <MenuItem v-for="item in menuList" :key="item.name" :name="item.name">
			<Icon :type="item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{item.text}}</span>
		</MenuItem> -->
		<MenuItem name="CarList" v-if="auth[0]==1 || auth[2]==1 || auth[4]==1">
			<Icon type="android-car" :size="iconSize"></Icon>
			<span class="layout-text">车辆列表</span>
		</MenuItem>
		<MenuItem name="Review" v-if="auth[1]==1 || auth[3]==1 || auth[5]==1">
			<Icon type="ios-keypad" :size="iconSize"></Icon>
			<span class="layout-text">操作审核</span>
		</MenuItem>
		<MenuItem name="Account" v-if="isadmin==1">
			<Icon type="ios-person" :size="iconSize"></Icon>
			<span class="layout-text">账户管理</span>
		</MenuItem>
		<MenuItem name="Log" v-if="auth[6]==1">
			<Icon type="ios-calendar" :size="iconSize"></Icon>
			<span class="layout-text">日志查询</span>
		</MenuItem>
		<MenuItem name="Setting"  v-if="isadmin==1">
			<Icon type="ios-gear" :size="iconSize"></Icon>
			<span class="layout-text">系统设置</span>
		</MenuItem>
    </Menu>
</template>

<script>
export default {
	name: "SidebarMenu",
	data() {
		return {
			activeName:'CarList',
			iconSize:18,
			menuList:[
				{
					name:'CarList',
					icon:'android-car',
					text:'车辆列表',
				},
				{
					name:'Review',
					icon:'ios-keypad',
					text:'操作审核',
				},

				{
					name:'Account',
					icon:'ios-person',
					text:'账户管理',
				},
				{
					name:'Log',
					icon:'ios-calendar',
					text:'日志查询',
				},
				{
					name:'Setting',
					icon:'ios-gear',
					text:'系统设置',
				},
			],
			auth:[],
			isadmin:null,
		}
	},
	created () {
		if(sessionStorage.auth){
			this.auth = sessionStorage.auth.split('')
			this.isadmin = sessionStorage.isadmin
		}else{
			//this.$Message.info("请登录~~")
			this.$router.replace({name:'Login'})
		}
	},
	methods:{
		selectMenu(e){
            this.$router.push({name: e})
		},
	}
};
</script>

<style lang="less" scoped>
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
	.ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
	color: rgba(255, 255, 255, 0.7);
}
.layout-menu-left {
  background: #464c5b;
  overflow: auto;
}
.layout-logo-left {
	width: 90%;
	height: 30px;
	background: #5b6270;
	border-radius: 3px;
	margin: 15px auto;
}
</style>
