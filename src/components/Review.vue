<template>
	<div>
        <Card :bordered="false">
            <p slot="title"><Icon type="search" size="16"></Icon> 查询</p>
           	<Form ref="formInline" :label-width="60">
					<Row>
						<Col span="4" style="padding-right:12px">
							<FormItem label="车牌号" style="margin-bottom:0px">
								<Input v-model="queryData.carcode" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="车辆类型" style="margin-bottom:0px">
								<Select v-model="queryData.cartype">
									<Option value="">全部</Option>
									<Option value="客车">客车</Option>
									<Option value="货车">货车</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="月票过期" style="margin-bottom:0px">
								<Select v-model="queryData.monthlyticketexpiremonth">
									<Option value="">全部</Option>
									<Option value="0">未逾期</Option>
									<Option value="1">1个月</Option>
									<Option value="2">2个月</Option>
									<Option value="3">3个月</Option>
									<Option value="4">4个月</Option>
									<Option value="5">5个月</Option>
									<Option value="6">6个月</Option>
									<Option value="7">7个月</Option>
									<Option value="8">8个月</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="停车类别" style="margin-bottom:0px">
								<Select v-model="queryData.applyparkingtype">
									<Option value="">全部</Option>
									<Option value="月票车" >月票车</Option>
									<Option value="免费车" >免费车</Option>
									<Option value="限免车" >限免车</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="备注" style="margin-bottom:0px">
								<Input v-model="queryData.remark" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="3">
							<Button type="primary" :loading="searchLoading" @click="onClickSearch" icon="ios-search">搜索</Button>
						</Col>
					</Row>
			</Form>
        </Card>
		<Card :bordered="false" style="margin-top:16px;">
			<div class="operation-wrap">
				<Button type="primary" icon="checkmark" :disabled="isDisabled" @click="onClickAuth(1)">通过</Button>
				<Button type="error" icon="close" style="margin-left:8px;" @click="onClickAuth(0)" :disabled="isDisabled">驳回</Button>
			</div>
			<div class="table-wrap">
				<Table size="default"  @on-selection-change="onSelectItem" :loading="tableLoading" :columns="columns" :data="listData"></Table>
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
	name: 'Review',
	data() {
		return {
			msg: 'Welcome to Your Vue.js App',
			queryData:{
				Ctype:'CarCodeMgrQuery',
				carcode:'',
				pagesize:'5',
				pageno:'1',
				currentparkingtype:'',
				cartype:'',
				remark:'',
				monthlyticketexpiremonth:'',
				applyparkingtype:'',
				sorttype:'',
				authstate:'已申请',
				oac:sessionStorage.getItem("name"),
			},
			tableLoading:false,
			columns: [
					{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '车牌号',
                        key: 'CarCode'
                    },
                    {
                        title: '车辆类型',
                        key: 'CarType'
                    },
                    {
                        title: '停车类别',
                        key: 'CurrentParkingType'
					},
					{
                        title: '开始时间',
                        key: 'StartTime'
					},
					{
						title: '结束时间',
                        key: 'EndTime'
					},
					{
						title: '逾期时间',
                        key: 'expiremonths'
					},
					{
						title: '申请停车类别',
                        key: 'applyParkingType'
					},
					{
						title: '分组信息',
                        key: 'SortType'
					},
					{
						title: '审核状态',
                        key: 'AuthState'
					},
					{
						title: '备注',
						key: 'Remark',
						width:200,
						render: (h, params) => {
							const str = params.row.Remark.length > 20 ? params.row.Remark.substring(0,18)+'...' : params.row.Remark
							const indent = params.row.Remark.length > 20 ? '20px' : '0'
							return h('Tooltip', {
								props: {
                                    placement: 'bottom'
                                }
							}, [
								h('div', str),
								h('div',{
									slot: 'content',
									style: {
										maxWidth: '250px',
										wordBreak: 'break-all',
										wordWrap: 'break-word',
										whiteSpace:'normal',
										textIndent: indent,
                                    },
								}, params.row.Remark)
							])
						}
					},
					{
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.passItem(params.row.CarCode)
                                        }
                                    }
                                }, '通过'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.refuseItem(params.row.CarCode)
                                        }
                                    }
                                }, '驳回')
                            ]);
                        }
                    }
                ],
			listData: [],
			totalListLength:0,
			selectedData:[],
			isDisabled:true,
			pageSizeOpts:[5,10,15,20,30],
			searchLoading:false,
			pageSize:5,
			currentPage:1,
		}
	},
	created(){
		this.onLoadIn(this.queryData)
	},
	watch:{
		"selectedData":function(n, o){
			if(n.length>0){
				this.isDisabled = false
			}else{
				this.isDisabled = true
			}
		}
	},
	methods:{
		onLoadIn(obj){
			this.tableLoading = true
			postApi( obj, 
				function(response){
					//console.log(response)
					this.tableLoading = false
					this.searchLoading = false
					if(response.data.data){
						let d = JSON.parse(response.data.data)
						this.listData = d
						this.totalListLength = d.length
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
					this.tableLoading = false
					this.searchLoading = false
				}.bind(this))
		},
		onSelectItem(e){
			this.selectedData = e
		},
		onClickAuth(e){
			if(this.selectedData.length===0){
				return false
			}
			let arr = []
			this.selectedData.forEach( item => {
				arr.push(item.CarCode)
			})
			let state = '通过'
			let content = '通过审核？'
			if(e===0){
				state = '拒绝'
				content = '拒绝审核？'
				
			}else{
				state = '通过'
				content = '通过审核？'
				
			}
			let authdata = {
				Ctype:'CarCodeMgrAuth',
				carcodelist:arr.toString(),
				authstate:state,
				oac:sessionStorage.getItem("name"),
			}
			this.$Modal.confirm({
				title:'确认提示',
				content:content,
				onOk: ()=> {
					postApi( authdata, 
                        function(response){
							console.log(response)
							if(response.data.ok){
								this.$Message.info("操作成功！")
								this.onLoadIn(this.queryData)
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
							}else{
								this.$Message.warning(response.data)
							}
                        }.bind(this),function(error){
							console.log(error)
							
                        }.bind(this))
				}
			})
			


		},
		passItem(code){
			let authdata = {
				Ctype:'CarCodeMgrAuth',
				carcodelist:code,
				authstate:'通过',
				oac:sessionStorage.getItem("name"),
			}
			this.$Modal.confirm({
				title:'确认提示',
				content:'通过审核？',
				onOk: ()=> {
					postApi( authdata, 
                        function(response){
							console.log(response)
							if(response.data.ok){
								this.$Message.info("操作成功！")
								this.onLoadIn(this.queryData)
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
							}else{
								this.$Message.warning(response.data)
							}
                        }.bind(this),function(error){
							console.log(error)
							
                        }.bind(this))
				}
			})
		},
		refuseItem(code){
			let authdata = {
				Ctype:'CarCodeMgrAuth',
				carcodelist:code,
				authstate:'拒绝',
				oac:sessionStorage.getItem("name"),
			}
			this.$Modal.confirm({
				title:'确认提示',
				content:'拒绝审核？',
				onOk: ()=> {
					postApi( authdata, 
                        function(response){
							console.log(response)
							if(response.data.ok){
								this.$Message.info("操作成功！")
								this.onLoadIn(this.queryData)
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
							}else{
								this.$Message.warning(response.data)
							}
                        }.bind(this),function(error){
							console.log(error)
							
                        }.bind(this))
				}
			})
		},
		onClickSearch(){
			this.queryData.pageno = '1'
			this.queryData.pagesize = '5'
			this.pageSize = 5
			this.currentPage = 1
			this.searchLoading = true
			this.onLoadIn(this.queryData)
		},
		changePage(e){
			this.currentPage = e
			this.queryData.pageno = e
			this.onLoadIn(this.queryData)
		},
		onPageSizeChange(e){
			this.pageSize = e
			this.queryData.pagesize = e
			this.onLoadIn(this.queryData)
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
