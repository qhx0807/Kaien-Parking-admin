<template>
	<div>
        <Card :bordered="false">
            <p slot="title"><Icon type="search" size="16"></Icon> 查询</p>
           	<Form ref="formInline" :label-width="60">
					<Row>
						<Col span="3" style="padding-right:0px">
							<FormItem label="车牌号" style="margin-bottom:0px">
								<Input v-model="queryData.carcode" @on-keyup.enter="onClickSearch" placeholder="车牌号"></Input>
							</FormItem>
						</Col>
						<Col span="4" style="padding-right:12px">
							<FormItem label="备注" style="margin-bottom:0px">
								<Input v-model="queryData.remark"  @on-keyup.enter="onClickSearch" placeholder="备注关键字"></Input>
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
						<Col span="3" style="padding-right:12px">
							<FormItem label="停车类别" style="margin-bottom:0px">
								<Select v-model="queryData.currentparkingtype">
									<Option value="">全部</Option>
									<Option v-for="item in parkOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="3" style="padding-right:0px">
							<FormItem label="审核状态" style="margin-bottom:0px">
								<Select v-model="queryData.authstate">
									<Option value="">全部</Option>
									<Option v-for="item in authOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
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
						<Col span="1">
							<Button type="primary" :loading="searchLoading" @click="onClickSearch" icon="ios-search">搜索</Button>
						</Col>
					</Row>
			</Form>
        </Card>
		<Card :bordered="false" style="margin-top:16px;">
			<div class="operation-wrap">
				<Button type="primary" icon="plus" @click="onClickAdd">新增</Button>
				<Button  v-if="auth[7]==1" type="primary" icon="ios-upload" style="margin-left:8px;"  @click="onClickImport">导入</Button>
				<Button type="error" icon="trash-a" style="margin-left:8px;" @click="removeItems" :disabled="isDisabled">删除</Button>
			</div>
			<div class="table-wrap">
				<Table size="default" @on-selection-change="onSelectItem"  :loading="tableLoading" :columns="columns" :data="listData"></Table>
				<div style="margin: 10px;overflow: hidden">
					<div style="float: right;">
						<Page :total="totalListLength" :page-size-opts="pageSizeOpts" :page-size="pageSize" :current="currentPage" size="small" show-sizer show-total @on-change="changePage" @on-page-size-change="onPageSizeChange"></Page>
					</div>
				</div>
			</div>
		</Card>

		<Modal v-model="addModal" width="500">
			 <p slot="header" style="text-align:center">
				<span>新增</span>
			</p>
			<div style="padding:0 20px 0 0">
				<Form ref="formAdd" :model="addData" :rules="ruleAdd" :label-width="70" label-position="right">
					<Row>
						<Col span="24" style="padding:0 ">
							<FormItem prop="carcode" label="车牌号码" style="margin-bottom:24px">
								<Input v-model="addData.carcode" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="sorttype" label="分组" style="margin-bottom:24px">
								<Select v-model="addData.sorttype">
									<Option v-for="item in sortOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="cartype" label="车辆类型" style="margin-bottom:24px">
								<Select v-model="addData.cartype">
									<Option v-for="item in carOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="applyparkingtype" label="停车费别" style="margin-bottom:24px">
								<Select v-model="addData.applyparkingtype">
									<Option v-for="item in parkOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem label="起始日期" style="margin-bottom:24px">
								<DatePicker @on-change="onSelectDateAdd" style="width:100%" type="daterange" format="yyyy-MM-dd" placeholder="选择日期和时间"></DatePicker>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem label="备注说明" style="margin-bottom:24px">
								<Input type="textarea" :maxlength="100" :autosize="{minRows: 3,maxRows: 5}" v-model="addData.remark" placeholder="请输入"></Input>
								<p style="text-align:right">字数(限100字符)：{{addData.remark.length}}/100</p>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</div>
			<div slot="footer">
				<Button type="ghost" size="default"  @click="addModal=false">取消</Button>
				<Button type="primary" size="default" :loading="modal_loading" @click="onCliskSaveAdd('formAdd')">保存</Button>
			</div>
		</Modal>
		<Modal v-model="editModal" width="500">
			 <p slot="header" style="text-align:center">
				<span>修改</span>
			</p>
			<div style="padding:0 20px 0 0">
				<Form ref="fromEdit" :model="editData" :rules="ruleAdd" :label-width="70" label-position="right">
					<Row>
						<Col span="24" style="padding:0 ">
							<FormItem prop="carcode" label="车牌号码" style="margin-bottom:24px">
								<Input v-model="editData.carcode" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="sorttype" label="分组" style="margin-bottom:24px">
								<Select v-model="editData.sorttype">
									<Option v-for="item in sortOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="cartype" label="车辆类型" style="margin-bottom:24px">
								<Select v-model="editData.cartype">
									<Option v-for="item in carOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="applyparkingtype" label="停车费别" style="margin-bottom:24px">
								<Select v-model="editData.applyparkingtype">
									<Option v-for="item in parkOpts" :key="item.ID" :value="item.ParamValue">{{item.ParamValue}}</Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem label="起始日期" style="margin-bottom:24px">
								<DatePicker @on-change="onSelectDateEdit" v-model="editDateArr" style="width:100%" type="daterange" format="yyyy-MM-dd" placeholder="选择日期和时间"></DatePicker>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem label="备注说明" style="margin-bottom:24px">
								<Input type="textarea" :maxlength="100"  :autosize="{minRows: 3,maxRows: 5}" v-model="editData.remark" placeholder="请输入"></Input>
								<p style="text-align:right">字数(限100字符)：{{editData.remark.length}}/100</p>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</div>
			<div slot="footer">
				<Button type="ghost" size="default"  @click="editModal=false">取消</Button>
				<Button type="primary" size="default" :loading="modal_loading" @click="onCliskSaveEdit('fromEdit')">保存</Button>
			</div>
		</Modal>
		<Modal v-if="auth[7]==1" v-model="importModal" width="600">
			<p slot="header" style="text-align:center">
				<span>导入</span>
			</p>
			<div style="height:450px;"><!-- http:www.kaien.cc/DataImport.aspx -->
				<iframe src="http://39.108.15.145/DataImport.aspx" name="importIframe" height="100%" scrolling="auto"  width="100%" frameborder="0"></iframe>
			</div>
			<div slot="footer">
				<Button type="ghost" size="default"  @click="importModal=false">取消</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import { postApi } from '../axios'
export default {
	name: 'CarList',
	data() {
		return {
			searchData:{
				input:'',
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
						key: 'CarCode',
						width:100,
                    },
					{
						title: '申请停车类别',
                        key: 'applyParkingType',
						width:120,
					},
					{
                        title: '当前停车类别',
						key: 'CurrentParkingType',
						width:120,
					},
                    {
                        title: '类型',
						key: 'CarType',
						width: 60,
                    },
					{
                        title: '开始时间',
						key: 'StartTime',
						width:150,
					},
					{
						title: '结束时间',
						key: 'EndTime',
						width:150,
					},
					{
						title: '逾期(月)',
						key: 'expiremonths',
						width:85,
					},
					{
						title: '分组信息',
						key: 'SortType',
						width:100,
					},
					{
						title:'生效日期',
						key:'StartDate',
						width: 100,
						render:(h, params) => {
							return params.row.StartDate ? params.row.StartDate.substring(0,10) : ''
						}
					},
					{
						title:'失效日期',
						key:'EndDate',
						width: 100,
						render:(h, params) => {
							return params.row.EndDate ? params.row.EndDate.substring(0,10) : ''
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
						width: 150,
						render: (h, params) => {
							const str = params.row.Remark && params.row.Remark.length > 15 ? params.row.Remark.substring(0,14)+'...' : params.row.Remark
							const indent = params.row.Remark && params.row.Remark.length > 15 ? '20px' : '0'
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
						title:'驳回理由',
						key:'RejectReason',
						width: 150,
						render: (h, params) => {
							if(params.row.RejectReason == null || params.row.RejectReason.length < 10){
								return params.row.RejectReason
							}else if(params.row.RejectReason && params.row.RejectReason.length >= 10){
								let str = params.row.RejectReason.substring(0,8)+'...'
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
											textIndent: '10px',
										},
									}, params.row.RejectReason)
								])
							}

							
						}
					},
					{
                        title: '操作',
                        key: 'action',
                        width: 140,
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
                                            this.onEditShow(params.row)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
            listData: [],
			addModal:false,
			editModal:false,
			importModal:false,
			modal_loading:false,
			pageSizeOpts:[5,10,15,20,30],
			addData:{
				Ctype:'CarCodeMgrAdd',
				carcode:'',
				cartype:'',
				remark:'',
				applyparkingtype:'',
				startdate:'',
				enddate:'',
				sorttype:'',
				oac:sessionStorage.getItem("name"),
			},
			queryData:{
				Ctype:'CarCodeMgrQuery',
				carcode:'',
				pagesize:'5',
				pageno:'1',
				applyparkingtype:'',
				cartype:'',
				remark:'',
				monthlyticketexpiremonth:'',
				currentparkingtype:'',
				sorttype:'',
				authstate:'',
				oac:sessionStorage.getItem("name"),
			},
			ruleAdd:{
				carcode:[
					{ required: true, message: '请输入车牌号', trigger: 'blur' },
					{ type: 'string', min: 7, max: 7,  message: '车牌号为七位字符', trigger: 'blur' }
				],
				cartype:[
					{ required: true, message: '请选择车辆类型', trigger: 'blur' }
				],
				applyparkingtype:[
					{ required: true, message: '请选择停车类别', trigger: 'blur' }
				],
				sorttype:[
					{ required: true, message: '请选择分组', trigger: 'blur' }
				]
			},
			totalListLength:0,
			isDisabled:true,
			selectedData:[],
			editData:{
				Ctype:'CarCodeMgrModi',
				carcode:'',
				cartype:'',
				remark:'',
				applyparkingtype:'',
				authstate:'',
				startdate:'',
				enddate:'',
				sorttype:'',
				oac:sessionStorage.getItem("name"),
			},
			searchLoading:false,
			pageSize:5,
			currentPage:1,
			authOpts:[],
			carOpts:[],
			parkOpts:[],
			sortOpts:[],
			auth:[],
			editDateArr: [
				new Date('2017-09-20'),
				new Date('2017-10-20')
			],
		}
	},
	created(){
		if(sessionStorage.auth){
			this.auth = sessionStorage.auth.split('')
		}else{
			this.$Message.info("sessionStorage is not supported")
		}
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
						//console.log(this.parkOpts)
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
		onClickAdd(){
			this.addModal = true
			this.$refs['formAdd'].resetFields()
		},
		onCliskSaveAdd(name){
			 this.$refs[name].validate((valid) => {
                if (valid) {
                    this.modal_loading = true
                    postApi( this.addData, 
                        function(response){
                            this.modal_loading = false
							console.log(response)
							this.addModal = false
							if(response.data.ok){
								this.$Message.info("添加成功！")
								this.onLoadIn(this.queryData)
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
							}
                        }.bind(this),function(error){
							this.modal_loading = false
							this.addModal = false
							console.log(error)
							
                        }.bind(this))

                } else {
                    this.$Message.error('表单验证失败!')
                }
            })
		},
		onSelectItem(e){
			this.selectedData = e
		},
		onEditShow(e){
			console.log(e)
			this.editData.carcode = e.CarCode
			this.editData.cartype = e.CarType
			this.editData.remark = e.Remark || ''
			this.editData.applyparkingtype = e.applyParkingType
			this.editData.authstate = e.AuthState 
			this.editData.sorttype = e.SortType
			//this.editData.StartDate = e.StartDate
			//this.editData.EndDate = e.EndDate

			let arr = []
			let sd = e.StartDate ? e.StartDate.substring(0,10) : ''
			let ed = e.EndDate ? e.EndDate.substring(0,10) : ''
			arr.push(new Date(sd))
			arr.push(new Date(ed))
			this.editDateArr = arr
			//alert(arr)
			this.editModal = true
		},
		onCliskSaveEdit(name){
			this.$refs[name].validate((valid) => {
                if (valid) {
                    this.modal_loading = true
                    postApi( this.editData, 
                        function(response){
                            this.modal_loading = false
							console.log(response)
							this.editModal = false
							if(response.data.ok){
								this.$Message.info("修改成功！")
								this.onLoadIn(this.queryData)
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
							}else{
								this.$Message.warning(response.data)
							}
                        }.bind(this),function(error){
							this.modal_loading = false
							this.editModal = false
							console.log(error)
							
                        }.bind(this))

                } else {
                    this.$Message.error('表单验证失败!')
                }
            })
		},
		remove(e){
			let removeData = {
				Ctype:'CarCodeMgrModi',
				carcode:'',
				cartype:'',
				remark:'',
				applyparkingtype:'临停车',
				authstate:'',
				startdate:'',
				enddate:'',
				sorttype:'',
				oac:sessionStorage.getItem("name"),
			}

			removeData.carcode = e.CarCode
			removeData.cartype = e.CarType
			removeData.remark = e.Remark
			removeData.authstate = e.AuthState
			removeData.sorttype = e.SortType
			//removeData.startdate = e.startdate
			//removeData.enddate = e.enddate

			this.$Modal.confirm({
				title:'提示',
				content:'确认移除车辆 <b>'+removeData.carcode+'</b>？',
				onOk: ()=>{
					postApi( removeData, 
                        function(response){
							//console.log(response)
							if(response.data.ok){
								this.$Message.info("移除成功！")
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
		removeItems(){
			if(this.selectedData.length===0){
				return false
			}
			let arr = []
			this.selectedData.forEach( item => {
				arr.push(item.CarCode)
			})
			
			let removeListData = {
				Ctype:'CarCodeMgrDel',
				carcodelist: arr.toString(),
				oac:sessionStorage.getItem("name"),
			}

			this.$Modal.confirm({
				title: '确认删除提示',
				content: '<p>您将移除选择车辆？</p>',
				loading: true,
				onOk: () => {
					postApi( removeListData, 
						function(response){
							console.log(response)
							this.$Modal.remove()
							if(response.data.ok){
								this.$Message.info("移除成功！")
								this.onLoadIn(this.queryData)
							}else if(response.data.error){
								this.$Message.warning(response.data.error)	
							}else{
								this.$Message.warning(response.data)
							}
						}.bind(this),function(error){
							this.$Modal.remove()
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
		},
		onClickImport(){
			this.importModal = true
		},
		onSelectDateAdd(e){
			this.addData.startdate = e[0]
			this.addData.enddate = e[1]
		},
		onSelectDateEdit(e){
			this.editData.startdate = e[0]
			this.editData.enddate = e[1]
			//console.log(e)
			//alert(this.editDateArr)
		},
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
		padding: 16px 8px;
	}
	.operation-wrap{
		padding: 5px 8px;
	}
</style>
