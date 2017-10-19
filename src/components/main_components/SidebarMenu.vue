<template>
    <Menu :active-name="activeName" theme="dark" width="auto" @on-select="selectMenu">
        <div class="layout-logo-left"></div>
		<MenuItem v-for="item in menuList" :key="item.name" :name="item.name">
			<Icon :type="item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{item.text}}</span>
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
	//border-right: 2px solid rgba(255, 255, 255, 0.7);
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
