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

		<Modal v-model="addModal" width="500">
			 <p slot="header" style="text-align:center">
				<span>新增账户</span>
			</p>
			<div style="padding:0 20px 0 0">
				<Form ref="fromAdd" :model="addData" :rules="ruleAdd" :label-width="70" label-position="right">
					<Row>
						<Col span="24" style="padding:0 ">
							<FormItem prop="account" label="账户名" style="margin-bottom:24px">
								<Input v-model="addData.account" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="password" label="登录密码" style="margin-bottom:24px">
								<Input v-model="addData.password" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem label="权限分配" style="margin-bottom:24px">
								<CheckboxGroup v-model="authArr">
									<Checkbox :label="0">月票车的变更权限（增删改）</Checkbox>
									<Checkbox :label="1">月票车的审核权限</Checkbox>
									<Checkbox :label="2">免费车的变更权限（增删改）</Checkbox>
									<Checkbox :label="3">免费车的审核权限</Checkbox>
									<Checkbox :label="4">限免车的变更权限（增删改）</Checkbox>
									<Checkbox :label="5">限免车的审核权限</Checkbox>
									<Checkbox :label="6">日志查看权限</Checkbox>
								</CheckboxGroup>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</div>
			<div slot="footer">
				<Button type="ghost" size="default"  @click="addModal=false">取消</Button>
				<Button type="primary" size="default" :loading="modal_loading" @click="onCliskSaveAdd('fromAdd')">保存</Button>
			</div>
		</Modal>

		<Modal v-model="editModal" width="500">
			 <p slot="header" style="text-align:center">
				<span>修改账户</span>
			</p>
			<div style="padding:0 20px 0 0">
				<Form ref="fromEdit" :model="editData" :rules="ruleAdd" :label-width="70" label-position="right">
					<Row>
						<Col span="24" style="padding:0 ">
							<FormItem prop="account" label="账户名" style="margin-bottom:24px">
								<Input v-model="editData.account" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem prop="password" label="登录密码" style="margin-bottom:24px">
								<Input v-model="editData.password" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem label="权限分配" style="margin-bottom:24px">
								<CheckboxGroup v-model="authArr">
									<Checkbox :label="0">月票车的变更权限（增删改）</Checkbox>
									<Checkbox :label="1">月票车的审核权限</Checkbox>
									<Checkbox :label="2">免费车的变更权限（增删改）</Checkbox>
									<Checkbox :label="3">免费车的审核权限</Checkbox>
									<Checkbox :label="4">限免车的变更权限（增删改）</Checkbox>
									<Checkbox :label="5">限免车的审核权限</Checkbox>
									<Checkbox :label="6">日志查看权限</Checkbox>
								</CheckboxGroup>
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
	</div>
</template>

<script>
import { postApi } from '../axios'
export default {
	name: 'Account',
	data() {
		return {
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
				{
					title: '权限编码',
					key: 'AuthCode'
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
										this.onClickEdit(params.row)
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
										this.delAccount(params.row)
									}
								}
							}, '删除')
						]);
					}
				}
			],
			totalListLength:0,
			tableLoading:false,
			addData:{
				Ctype:'AddAccount',
				account:'',
				password:'',
				authcode:'',
				oac:sessionStorage.getItem("name"),
			},
			editData:{
				id:'',
				Ctype:'ModiAccount',
				account:'',
				password:'',
				authcode:'',
				oac:sessionStorage.getItem("name"),
			},
			addModal:false,
			editModal:false,
			modal_loading:false,
			authArr:[],
			ruleAdd:{
				account:[
                    { required: true, message: '请输入车牌号', trigger: 'blur' }
				],
				password:[
					{ required: true, message: '请输入账户密码', trigger: 'blur' }
				],
			},
			auth:[0,0,0,0,0,0,0],
		}
	},
	created () {
		this.loadAccount()	
	},
	methods:{
		loadAccount(){
			this.tableLoading = true
			let queryData = {
				Ctype:'QueryAccount',
				oac:sessionStorage.getItem("name"),
			}
			postApi( queryData, 
				function(response){
					//console.log(response)
					this.tableLoading = false
					if(response.data){
						this.listData = response.data
						this.totalListLength = response.data.length
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
					this.tableLoading = false
				}.bind(this))
		},
		changePage(){
			
		},
		onClickAdd(){
			this.authArr = []
			this.addModal = true
		},
		onClickEdit(e){
			this.editModal = true
			this.editData.id = e.ID
			this.editData.account = e.Account
			this.editData.password = e.Password
			this.editData.authcode = e.AuthCode

			let authStr = e.AuthCode.split('')
			let authArr = []
			authStr.forEach(function(item,index){
				if(item==1){
					authArr.push(index)
				}
			})
			this.authArr = authArr
			
		},
		onCliskSaveAdd(name){
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.modal_loading = true
					let auth = [0, 0, 0, 0, 0, 0, 0]
					this.authArr.forEach(function(item){
						auth[item] = 1
					})
					this.addData.authcode = auth.join('')
					
					postApi( this.addData, 
                        function(response){
                            this.modal_loading = false
							//console.log(response)
							this.addModal = false
							if(response.data.ok){
								this.$Message.info("添加成功！")
								this.loadAccount()
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
		onCliskSaveEdit(name){
			this.$refs[name].validate((valid) => {
				if(valid){
					this.modal_loading = true
					let auth = [0, 0, 0, 0, 0, 0, 0]
					this.authArr.forEach(function(item){
						auth[item] = 1
					})
					this.editData.authcode = auth.join('')
					
					postApi( this.editData, 
                        function(response){
                            this.modal_loading = false
							//console.log(response)
							this.editModal = false
							if(response.data.ok){
								this.$Message.info("修改成功！")
								this.loadAccount()
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
							}
                        }.bind(this),function(error){
							this.modal_loading = false
							this.editModal = false
							console.log(error)
							
                        }.bind(this))

				}else{
					this.$Message.error('表单验证失败!')
				}
			})
		},
		delAccount(row){
			let removeData={
				Ctype:'DelAccount',
				id:row.ID,
				oac:sessionStorage.getItem("name"),
			}
			this.$Modal.confirm({
				title:'提示',
				content:'确认删除此账户吗？ <b>'+row.Account+'</b>',
				onOk: ()=>{
					postApi( removeData, 
                        function(response){
							//console.log(response)
							if(response.data.ok){
								this.$Message.info("移除成功！")
								this.loadAccount()
							}else if(response.data.error){
								this.$Message.warning(response.data.error)
							}
                        }.bind(this),function(error){
							console.log(error)
							
                        }.bind(this))
				}
			})
		},
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
