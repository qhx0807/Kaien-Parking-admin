<template>
    <div>
        <div class="layout-logo-left"></div>
        <template v-for="(item, index) in menuList">
            <!-- <Dropdown  placement="right-start" :key="index">
                <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                    <Icon :size="22" :color="iconColor" :type="item.icon"></Icon>
                </Button>
                <DropdownMenu style="width: 150px;" slot="list">
                    <DropdownItem :name="item.name" ><Icon :type="item.icon"></Icon><span style="padding-left:10px;">{{ item.text }}</span></DropdownItem>
                </DropdownMenu>
            </Dropdown> -->
            <Tooltip :class="{active:active==index}" :key="index" :content="item.text" placement="right">
                <Button style="width: 60px;margin-left: 0px;padding:10px 0;" type="text"  @click="selectMenu(index,item.name)">
                    <Icon :size="22" :color="iconColor" :type="item.icon"></Icon>
                </Button>
            </Tooltip>
        </template>
    </div>
</template>

<script>
export default {
	name: "SidebarMenu",
	data() {
		return {
			activeName:'CarList',
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
            iconColor:'#ffffff',
            active:0,
		}
	},
	methods:{
		selectMenu(index,e){
            this.active = index
            this.$router.push({name: e})
		},
	}
};
</script>

<style lang="less" scoped>
.layout-logo-left {
	width: 90%;
	height: 30px;
	background: #5b6270;
	border-radius: 3px;
	margin: 15px auto;
}
.active{
    background: #363E4F;
}
</style>
