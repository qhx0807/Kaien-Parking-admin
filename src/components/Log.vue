<template>
	<div>
        <Card :bordered="false">
            <p slot="title"><Icon type="search" size="16"></Icon> 查询</p>
           	<Form ref="formInline" :label-width="60">
					<Row>
						<Col span="5" style="padding-right:12px">
							<FormItem label="日期" style="margin-bottom:0px">
								<DatePicker type="daterange" :options="dateOpts" @on-change="onSelectDate" style="width: 100%" format="yyyy-MM-dd" placeholder="选择起始日期"></DatePicker>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="账户" style="margin-bottom:0px">
								<Input v-model="queryData.account"  @on-keyup.enter="onClickSearch" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="车牌号" style="margin-bottom:0px">
								<Input v-model="queryData.carcode"  @on-keyup.enter="onClickSearch" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<!-- <Col span="4" style="padding-right:12px">
							<FormItem label="审核状态" style="margin-bottom:0px">
								<Input v-model="queryData.authstate" placeholder="请输入"></Input>
							</FormItem>
						</Col> -->
						<Col span="3">
							<Button type="primary" :loading="searchLoading" @click="onClickSearch" icon="ios-search">搜索</Button>
						</Col>
					</Row>
			</Form>
        </Card>
		<Card :bordered="false" style="margin-top:16px;">
			<div class="table-wrap">
				<Table size="small" :loading="tableLoading"  :columns="columns" :data="listData"></Table>
				<div style="margin: 10px;overflow: hidden">
					<div style="float: right;">
						<Page :total="totalListLength" :page-size-opts="pageSizeOpts" :page-size="pageSize" :current="currentPage" size="small" show-sizer show-total @on-change="changePage" @on-page-size-change="onPageSizeChange"></Page>
					</div>
				</div>
			</div>
		</Card>
	</div>
</template>

<script>
import { postApi } from '../axios'
export default {
	name: 'Log',
	data() {
		return {
			queryData:{
				Ctype:'LogQuery',
				pagesize:'10',
				pageno:'1',
				starttime:'',
				endtime:'',
				account:'',
				carcode:'',
				eventdes:'',
				oac:sessionStorage.getItem("name"),
			},
			dateOpts:{
				disabledDate (date) {
					return date && date.valueOf() > Date.now();
				}
			},
			columns:[
				{
					title: '账户',
					key: 'Account',
					width:100,
				},
				{
					title: 'ID',
					key: 'id',
					width:60,
				},
				{
					title: '时间',
					key: 'LogTime',
					width:170,
				},
				{
					title: '车牌号',
					key: 'CarCode',
					width:150,
				},
				{
					title: '事件',
                    key: 'Event',
				},
				
			],
			searchLoading:false,
			tableLoading:false,
			listData:[],
			totalListLength:0,
			searchLoading:false,
			pageSize:10,
			currentPage:1,
			pageSizeOpts:[5,10,15,20,30],
			accountData:[],
		}
	},
	created(){
		this.onLoad(this.queryData)
		this.getAccountList()
	},
	methods:{
		onLoad(obj){
			this.tableLoading = true
			postApi( obj, 
				function(response){
					console.log(response)
					this.tableLoading = false
					this.searchLoading = false
					if(response.data.data){
						let d = JSON.parse(response.data.data)
						this.listData = d
						this.totalListLength = response.data.totalrecords
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
					this.tableLoading = false
					this.searchLoading = false
				}.bind(this))
		},
		getAccountList(){
			let queryData = {
				Ctype:'QueryAccount',
				oac:sessionStorage.getItem("name"),
			}
			postApi( queryData, 
				function(response){
					if(response.data){
						this.accountData = response.data
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
					this.tableLoading = false
				}.bind(this))
		},
		onSelectDate(e){
			this.queryData.starttime = e[0]
			this.queryData.endtime = e[1]
		},
		onClickSearch(){
			this.queryData.pageno = '1'
			this.queryData.pagesize = '5'
			this.pageSize = 5
			this.currentPage = 1
			this.searchLoading = true
			this.tableLoading = true
			this.onLoad(this.queryData)
		},
		changePage(e){
			this.currentPage = e
			this.queryData.pageno = e
			this.onLoad(this.queryData)
		},
		onPageSizeChange(e){
			this.pageSize = e
			this.queryData.pagesize = e
			this.onLoad(this.queryData)
		}
	}
}
</script>

<style lang="less">
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
		padding: 8px;
	}
</style>
