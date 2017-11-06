<template>
	<div>
        <Card :bordered="false">
            <p slot="title"><Icon type="search" size="16"></Icon> 查询</p>
           	<Form ref="formInline" :label-width="60">
					<Row>
						<Col span="3" style="padding-right:0px">
							<FormItem label="车牌号" style="margin-bottom:0px">
								<Input v-model="queryData.carcode" @on-keyup.enter="onClickSearch"  placeholder="车牌号"></Input>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="备注" style="margin-bottom:0px">
								<Input v-model="queryData.remark" @on-keyup.enter="onClickSearch"  placeholder="备注关键字"></Input>
							</FormItem>
						</Col>
						<Col span="3" style="padding-right:12px">
							<FormItem label="车辆类型" style="margin-bottom:0px">
								<Select v-model="queryData.cartype">
									<Option value="">全部</Option>
									<Option v-for="item in carOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="3" style="padding-right:12px">
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
						<Col span="3" style="padding-right:0px">
							<FormItem label="停车类别" style="margin-bottom:0px">
								<Select v-model="queryData.applyparkingtype">
									<Option value="">全部</Option>
									<Option v-for="item in parkOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						
						<Col span="3" style="padding-right:12px">
							<FormItem label="分组" style="margin-bottom:0px">
								<Select v-model="queryData.sorttype">
									<Option value="">全部</Option>
									<Option v-for="item in sortOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
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
				<Button type="error" icon="close" style="margin-left:8px;" @click="onClickAuthMore" :disabled="isDisabled">驳回</Button>
			</div>
			<div class="table-wrap">
				<Table size="default"  width="100%"  @on-selection-change="onSelectItem" :loading="tableLoading" :columns="columns" :data="listData"></Table>
				<div style="margin: 10px;overflow: hidden">
					<div style="float: right;">
						<Page :total="totalListLength" :page-size-opts="pageSizeOpts" :page-size="pageSize" :current="currentPage" size="small" show-sizer show-total @on-change="changePage" @on-page-size-change="onPageSizeChange"></Page>
					</div>
				</div>
			</div>
		</Card>
		<Modal v-model="rejectModal" width="500">
			<p slot="header" style="text-align:center">
				<span>驳回：{{setcarcode}}</span>
			</p>
			<div style="padding:0 20px 0 0">
				<Input type="textarea" :maxlength="100" :autosize="{minRows: 4,maxRows: 5}" v-model="rejectReason" placeholder="请输入驳回原因..."></Input>
				<p style="text-align:left;margin-top:7px">字数(限100字符)：{{rejectReason.length}}/100</p>
			</div>
			<div slot="footer">
				<Button type="ghost" size="default"  @click="rejectModal=false">取消</Button>
				<Button type="primary" size="default" :loading="modal_loading" @click="refuseItem">保存</Button>
			</div>
		</Modal>
		<Modal v-model="rejectModalMore" width="500">
			<p slot="header" style="text-align:center">
				<span>驳回：{{setcarcodelist}}</span>
			</p>
			<div style="padding:0 20px 0 0">
				<Input type="textarea" :maxlength="100" :autosize="{minRows: 4,maxRows: 5}" v-model="rejectReason" placeholder="请输入驳回原因..."></Input>
				<p style="text-align:left;margin-top:7px">字数(限100字符)：{{rejectReason.length}}/100</p>
			</div>
			<div slot="footer">
				<Button type="ghost" size="default"  @click="rejectModalMore=false">取消</Button>
				<Button type="primary" size="default" :loading="modal_loading" @click="refuseMore">保存</Button>
			</div>
		</Modal>
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
				authstate:'待审核',
				oac:sessionStorage.getItem("name"),
			},
			tableLoading:false,
			rejectModal:false,
			rejectModalMore:false,
			columns: [
					{
                        type: 'selection',
                        width: 60,
						align: 'center',
						fixed:'left',
                    },
                    {
                        title: '车牌号',
						key: 'CarCode',
						width:100,
					},
					{
						title: '申请停车类别',
						key: 'applyParkingType',
						width: 150,
					},
					{
                        title: '当前停车类别',
						key: 'CurrentParkingType',
						width: 150,
					},
                    {
                        title: '类型',
						key: 'CarType',
						width: 70,
						
                    },
					{
                        title: '开始时间',
						key: 'StartTime',
						width: 160,
					},
					{
						title: '结束时间',
						key: 'EndTime',
						width: 160,
					},
					{
						title: '逾期(月)',
						key: 'expiremonths',
						width:100,
					},
					{
						title: '分组',
						key: 'SortType',
						width: 100,
					},
					{
						title:'生效日期',
						key:'StartDate',
						width: 150,
						render:(h, params) => {
							return params.row.StartDate ? params.row.StartDate.substring(0,10) : ''
						}
					},
					{
						title:'失效日期',
						key:'EndDate',
						width: 150,
						render:(h, params) => {
							return params.row.EndDate ? params.row.EndDate.substring(0,10) : ''
						}
					},
					{
						title:'失效日期变更',
						key:'ApplyEndDate',
						width: 150,
						render:(h, params) => {
							return params.row.ApplyEndDate ? params.row.ApplyEndDate.substring(0,10) : ''
						}
					},
					{
						title: '状态',
						key: 'AuthState',
						width:80
					},
					{
						title: '备注',
						key: 'Remark',
						width:200,
						render: (h, params) => {
							const str = params.row.Remark.length > 15 ? params.row.Remark.substring(0,14)+'...' : params.row.Remark
							const indent = params.row.Remark.length > 15 ? '20px' : '0'
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
						fixed:'right',
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
											//this.refuseItem(params.row.CarCode)
											this.onClickRejectBtn(params.row.CarCode)
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
			modal_loading:false,
			rejectReason:'',
			authOpts:[],
			carOpts:[],
			parkOpts:[],
			sortOpts:[],
			setcarcode:'',
			setcarcodelist:'',
		}
	},
	created(){
		this.onLoadIn(this.queryData)
		this.loadBaseData()
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
		loadBaseData(){
			let a = {
                Ctype:'DataDicDetailQuery',
                paramsort: 'AuthState',
                oac:sessionStorage.getItem("name"),
			}
			let c = {
                Ctype:'DataDicDetailQuery',
                paramsort: 'CarType',
                oac:sessionStorage.getItem("name"),
			}
			let p = {
                Ctype:'DataDicDetailQuery',
                paramsort: 'ParkingType',
                oac:sessionStorage.getItem("name"),
			}
			let s = {
                Ctype:'DataDicDetailQuery',
                paramsort: 'SortType',
                oac:sessionStorage.getItem("name"),
            }
			postApi( a, 
				function(response){
					//console.log(response)
					if(response.data){
						this.authOpts = response.data
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
				}.bind(this))
			postApi( c, 
				function(response){
					//console.log(response)
					if(response.data){
						this.carOpts = response.data
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
				}.bind(this))
			postApi( p, 
				function(response){
					//console.log(response)
					if(response.data){
						response.data.splice(0,1)
						this.parkOpts = response.data
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
				}.bind(this))
			postApi( s, 
				function(response){
					//console.log(response)
					if(response.data){
						this.sortOpts = response.data
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
				}.bind(this))
		},
		onLoadIn(obj){
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
				carcodelist: this.setcarcode,
				authstate:'拒绝',
				rejectreason: this.rejectReason,
				oac:sessionStorage.getItem("name"),
			}
			this.modal_loading = true
			postApi( authdata, 
				function(response){
					console.log(response)
					this.modal_loading = false
					this.rejectModal = false
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
					this.modal_loading = false
					
				}.bind(this))

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
		},
		onClickRejectBtn(code){
			this.setcarcode = code
			this.rejectModal = true
		},
		onClickAuthMore(){
			let arr = []
			this.selectedData.forEach( item => {
				arr.push(item.CarCode)
			})
			this.setcarcodelist = arr.join('，')
			this.rejectReason = ''
			this.rejectModalMore = true
		},
		refuseMore(){
			if(this.selectedData.length===0){
				return false
			}
			this.modal_loading = true
			let arr = []
			this.selectedData.forEach( item => {
				arr.push(item.CarCode)
			})
			let authdata = {
				Ctype:'CarCodeMgrAuth',
				carcodelist:arr.toString(),
				authstate:'拒绝',
				oac:sessionStorage.getItem("name"),
			}
			postApi( authdata, 
				function(response){
					console.log(response)
					this.modal_loading = false
					this.rejectModalMore = false
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
					this.modal_loading = false
					this.rejectModalMore = false
				}.bind(this))
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
