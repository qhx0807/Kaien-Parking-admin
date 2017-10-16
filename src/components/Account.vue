<template>
	<div>
		<Card :bordered="false" style="margin-top:16px;">
			<div class="operation-wrap">
				<Button type="primary" icon="plus"  @click="onClickAdd">新增</Button>
			</div>
			<div class="table-wrap">
				<Table size="default"  :loading="tableLoading" :columns="columns" :data="listData"></Table>
				<div style="margin: 10px;overflow: hidden">
					<div style="float: right;">
						<Page :total="totalListLength" :current="1" size="small" show-sizer show-total @on-change="changePage"></Page>
					</div>
				</div>
			</div>
		</Card>
	</div>
</template>

<script>
import { postApi } from '../axios'
export default {
	name: 'Account',
	data() {
		return {
			msg: 'Welcome to Your Vue.js App',
			listData:[],
			columns:[
				{
					title:'ID',
					key:'ID',
				},
				{
					title: '用户名',
					key: 'Account'
				},
			],
			totalListLength:0,
			tableLoading:false,
		}
	},
	created () {
		this.loadAccount()	
	},
	methods:{
		loadAccount(){
			let queryData = {
				Ctype:'QueryAccount'
			}
			postApi( queryData, 
				function(response){
					console.log(response)
					if(response.data){
						this.listData = response.data
						this.totalListLength = response.data.length
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){

				}.bind(this))
		},
		changePage(){
			
		},
		onClickAdd(){

		}
	}
}
</script>

<style lang="less" scoped>
.ivu-card-head{
	padding: 8px 16px!important;
}
.ivu-card-body{
	padding: 16px 8px!important;
}
.ivu-table-wrapper{
	border:none!important;
}
.ivu-table:before{
	height:0;
}
.ivu-table:after{
	width:0;
}
.table-wrap{
	padding: 16px 8px;
}
.operation-wrap{
	padding: 5px 8px;
}
</style>
