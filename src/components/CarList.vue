<template>
	<div>
        <Card :bordered="false">
            <p slot="title"><Icon type="search" size="16"></Icon> 查询</p>
           	<Form ref="formInline" :label-width="60">
					<Row>
						<Col span="4">
							<FormItem label="输入框" style="margin-bottom:0px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
							
						</Col>
						<Col span="4">
							<FormItem label="输入框" style="margin-bottom:0px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="4">
							<FormItem label="输入框" style="margin-bottom:0px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="4">
							<FormItem label="输入框" style="margin-bottom:0px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="4">
							<FormItem label="输入框" style="margin-bottom:0px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="3"  offset="1">
							<Button type="primary" icon="ios-search">搜索</Button>
						</Col>
					</Row>
			</Form>
        </Card>
		<Card :bordered="false" style="margin-top:16px;">
			<div class="operation-wrap">
				<Button type="primary" icon="plus" @click="onClickAdd">新增</Button>
				<Button type="error" icon="trash-a" style="margin-left:8px;" disabled>删除</Button>
			</div>
			<div class="table-wrap">
				<Table size="default"  :loading="tableLoading" :columns="columns1" :data="data1"></Table>
				<div style="margin: 10px;overflow: hidden">
					<div style="float: right;">
						<Page :total="100" :current="1" size="small" show-sizer show-total @on-change="changePage"></Page>
					</div>
				</div>
			</div>
		</Card>

		<Modal v-model="addModal" width="600">
			 <p slot="header" style="text-align:center">
				<span>新增</span>
			</p>
			<div >
				<Form ref="formAdd" :label-width="60" label-position="right">
					<Row>
						<Col span="12">
							<FormItem label="输入框" style="margin-bottom:24px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem label="输入框" style="margin-bottom:24px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem label="输入框" style="margin-bottom:24px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem label="输入框" style="margin-bottom:24px">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
						<Col span="24">
							<FormItem label="输入框" style="margin-bottom:24px">
								<Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</div>
			<div slot="footer">
				<Button type="ghost" size="default"  @click="addModal=false">取消</Button>
				<Button type="primary" size="default" :loading="modal_loading" @click="onCliskSaveAdd">保存</Button>
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
			columns1: [
					{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '年龄',
                        key: 'age'
                    },
                    {
                        title: '地址',
                        key: 'address'
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
                                            this.show(params.index)
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
            data1: [
					
                    {
                        name: '王小明',
                        age: 18,
                        address: '北京市朝阳区芍药居'
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        name: '李小红',
                        age: 30,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    }
				],
			addModal:false,
			modal_loading:false,
		}
	},
	created(){
		//postApi()
	},
	watch:{

	},
	methods:{
		changePage(){

		},
		onClickAdd(){
			this.addModal = true
		},
		onCliskSaveAdd(){
			this.modal_loading = true
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
		padding: 16px 8px;
	}
	.operation-wrap{
		padding: 5px 8px;
	}
</style>
