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
							<FormItem label="审核状态" style="margin-bottom:0px">
								<Select v-model="queryData.authstate">
									<Option value="">全部</Option>
									<Option value="无申请" >无申请</Option>
									<Option value="已申请" >已申请</Option>
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
				<Button type="primary" icon="plus" @click="onClickAdd">新增</Button>
				<Button type="primary" icon="ios-upload" style="margin-left:8px;"  @click="onClickImport">导入</Button>
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
									<Option value="1" ></Option>
									<Option value="2" ></Option>
									<Option value="3" ></Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="cartype" label="车辆类型" style="margin-bottom:24px">
								<Select v-model="addData.cartype">
									<Option value="客车"></Option>
									<Option value="货车"></Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="applyparkingtype" label="停车费别" style="margin-bottom:24px">
								<Select v-model="addData.applyparkingtype">
									<Option value="月票车" ></Option>
									<Option value="免费车" ></Option>
									<Option value="限免车" ></Option>
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
								<Select v-model="addData.sorttype">
									<Option value="1" ></Option>
									<Option value="2" ></Option>
									<Option value="3" ></Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="cartype" label="车辆类型" style="margin-bottom:24px">
								<Select v-model="editData.cartype">
									<Option value="客车"></Option>
									<Option value="货车"></Option>
								</Select>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="applyparkingtype" label="停车费别" style="margin-bottom:24px">
								<Select v-model="editData.applyparkingtype">
									<Option value="月票车" ></Option>
									<Option value="免费车" ></Option>
									<Option value="限免车" ></Option>
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
		<Modal v-model="importModal" width="600">
			<p slot="header" style="text-align:center">
				<span>导入</span>
			</p>
			<div style="height:450px;">
				<iframe src="http://wap.baidu.com/" name="importIframe" height="100%" scrolling="auto"  width="100%" frameborder="0"></iframe>
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
						title:'修改到期日期',
						key:'applyenddate'
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
                                            this.onEditShow(params.index)
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
                                            this.remove(params.index)
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
				currentparkingtype:'',
				cartype:'',
				remark:'',
				monthlyticketexpiremonth:'',
				applyparkingtype:'',
				sorttype:'',
				authstate:'',
				oac:sessionStorage.getItem("name"),
			},
			ruleAdd:{
				carcode:[
                    { required: true, message: '请输入车牌号', trigger: 'blur' }
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
					console.log(response)
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
							//console.log(response)
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
		onEditShow(index){
			console.log(this.listData[index])
			this.editData.carcode = this.listData[index].CarCode
			this.editData.cartype = this.listData[index].CarType
			this.editData.remark = this.listData[index].Remark
			this.editData.applyparkingtype = this.listData[index].applyParkingType
			this.editData.authstate = this.listData[index].AuthState
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
		remove(index){
			let removeData = {
				Ctype:'CarCodeMgrModi',
				carcode:'',
				cartype:'',
				remark:'',
				applyparkingtype:'临停车',
				authstate:'',
				oac:sessionStorage.getItem("name"),
			}
			removeData.carcode = this.listData[index].CarCode
			removeData.cartype = this.listData[index].CarType
			removeData.remark = this.listData[index].Remark
			removeData.authstate = this.listData[index].AuthState

			this.$Modal.confirm({
				title:'提示',
				content:'确认移除车辆 <b>'+removeData.carcode+'</b>？',
				onOk: ()=>{
					postApi( removeData, 
                        function(response){
							console.log(response)
							if(response.data.ok){
								this.$Message.info("移除成功！")
								this.onLoadIn(this.queryData)
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
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
			alert(arr)
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
