<template>
    <div>
        <Row>
            <Col span="4">
                <Card :bordered="false">
                    <p slot="title">数据类别</p>
                    <ul class="data-type">
                        <li v-for="(item, index) in typeData" :class="{active:activeItem==index}" :key="item.ParamCode" @click="onClickTypeItem(index,item.ParamCode,item.IsExtendable)">{{item.ParamValue}}</li>
                    </ul>
                </Card>
            </Col>
            <Col span="1" style="text-align:left"> 
                <Icon style="margin-left:20px;margin-top:100px" type="arrow-right-a" size="30"></Icon>
            </Col>
            <Col span="19" style="position: relative;">
                <Spin fix v-if="pageLoading">加载中...</Spin>
                <Card :bordered="false">
                    <p slot="title">内容</p>
                    <div class="data-wrap">
                        <ul>
                            <li v-for="(item, index) in listData" :key="item.ID" @mouseover="onMouseInItem(index)" @mouseout="onMouseOutItem(index)">
                                {{item.ParamValue}}
                                <div class="mask" v-show="maskShow==index">
                                    <Icon type="edit" v-if="item.ismodiable==1" @click.native="editCode(item)" class="edit-icon" size="21" color="#ffffff"></Icon>
                                    <Icon type="ios-trash"  v-if="item.isDelable==1"  @click.native="delCode(item)" class="del-icon" size="22" color="#ffffff"></Icon>
                                </div>
                            </li>
                            <li v-if="activeItem != -1 && isExtendable==1" @click="clickAddLi" class="add-li" @mouseover="addcolor='#424242'" @mouseout="addcolor='#cccccc'"><Icon size="50" :color="addcolor" type="android-add"></Icon></li>
                        </ul>
                    </div>
                    <div style="clear:both"></div>
                </Card>
            </Col>
        </Row>

        <Modal v-model="editModal" width="400">
            <p slot="header" style="text-align:center">
				<span>修改</span>
			</p>
            <div>
                <Input v-model="editData.ParamValue" placeholder="请输入"></Input>
            </div>
            <div slot="footer">
				<Button type="ghost" size="default"  @click="editModal=false">取消</Button>
				<Button type="primary" size="default" :loading="modal_loading" @click="onCliskSaveEdit">保存</Button>
			</div>
        </Modal>
        <Modal v-model="addModal" width="400">
            <p slot="header" style="text-align:center">
				<span>新增</span>
			</p>
            <div style="padding:0 20px 0 0">
                <Form ref="fromAdd" :model="addData" :rules="ruleAdd" :label-width="40" label-position="right">
                    <Row>
                        <Col span="24" style="padding:0 ">
							<FormItem prop="paramvalue" label="值" style="margin-bottom:24px">
								<Input v-model="addData.paramvalue" placeholder="请输入"></Input>
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
    </div> 
</template>

<script>
import { postApi } from '../axios'
export default {
    name: 'Setting',
    data(){
        return {
            activeItem: -1,
            typeData:[],
            maskShow:-1,
            addcolor:'#cccccc',
            queryData:{
                Ctype:'DataDicQuery',
                oac:sessionStorage.getItem("name"),
            },
            pageLoading:false,
            listData:[],
            isExtendable:0,
            editModal:false,
            addModal:false,
            editData:{},
            modal_loading:false,
            addData:{
                Ctype:'ParamAdd',
                sorttype:'',
                paramvalue:'',
                oac:sessionStorage.getItem("name"),
            },
            ruleAdd:{
                paramvalue:[
                    { required: true, message: '请输入值', trigger: 'blur' }
				],
            },
            getDetailData:{},
        }
    },
    created () {
        this.getListData(this.queryData)
    },
    methods:{
        getListData(obj){
            this.pageLoading = true
			postApi( obj, 
				function(response){
					//console.log(response)
					this.pageLoading = false
					if(response.data){
                        this.typeData = response.data
					}else if(response.error){
						this.$Message.warning(response.data.error)
					}else{
                        this.$Message.warning(response)
                    }
				}.bind(this),function(error){
					this.pageLoading = false
				}.bind(this))
        },
        onClickTypeItem(index, type, isExt){
            this.isExtendable = isExt
            this.addData.sorttype = type
            let d = {
                Ctype:'DataDicDetailQuery',
                paramsort: type,
                oac:sessionStorage.getItem("name"),
            }
            this.getDetailData = d
             this.pageLoading = true
            postApi( d, 
				function(response){
					//console.log(response)
					this.pageLoading = false
					if(response.data){
                        this.listData = response.data
                        this.activeItem = index
					}else if(response.data.error){
						this.$Message.warning(response.error)
					}else{
                        this.$Message.warning(response)
                    }
				}.bind(this),function(error){
					this.pageLoading = false
				}.bind(this))
        },
        onMouseInItem(index){
            this.maskShow = index
        },
        onMouseOutItem(index){
            this.maskShow = -1
        },
        editCode(item){
            console.log(item)
            this.editData = item
            this.editModal = true
        },
        onCliskSaveEdit(){
            if(!this.editData.ParamValue){
                this.$Message.info("请输入...")
                return false
            }
            this.modal_loading = true
            let d = {
                Ctype:'ParamModi',
                id:this.editData.ID,
                oac:sessionStorage.getItem("name"),
                paramvalue: this.editData.ParamValue,
            }
            postApi( d, 
				function(response){
					console.log(response)
                    this.modal_loading = false
                    this.editModal = false
					if(response.data.ok){
                        this.$Message.info("修改成功！")
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}else{
                        this.$Message.warning(response)
                    }
                    this.getDetail(this.getDetailData)
				}.bind(this),function(error){
                    this.getDetail(this.getDetailData)
                    this.modal_loading = false
                    this.editModal = false
				}.bind(this))
        },
        delCode(item){
            let d = {
                Ctype:'ParamDel',
                id: item.ID,
            }
            this.$Modal.confirm({
                title: '确认删除提示',
                content: '<p>您将删除此条数据？</p>',
                loading: true,
                onOk: ()=> {
                    postApi( d, 
                        function(response){
                            console.log(response)
                             this.$Modal.remove();
                            if(response.data.ok){
                                this.$Message.info("删除成功！")
                            }else if(response.data.error){
                                this.$Message.warning(response.data.error)
                            }else{
                                this.$Message.warning(response)
                            }
                            this.getDetail(this.getDetailData)
                        }.bind(this),function(error){
                             this.$Modal.remove();
                        }.bind(this))
                }
            })
        },
        clickAddLi(){
            this.addData.paramvalue = ''
            this.addModal = true
        },
        onCliskSaveAdd(name){
            this.$refs[name].validate((valid) =>{
                if(valid){
                    this.modal_loading = true
                    postApi( this.addData, 
                        function(response){
                            console.log(response)
                            this.modal_loading = false
                            this.addModal = false
                            if(response.data.ok){
                                this.$Message.info("已添加！")
                            }else if(response.data.error){
                                this.$Message.warning(response.data.error)
                            }else{
                                this.$Message.warning(response)
                            }
                            this.getDetail(this.getDetailData)
                        }.bind(this),function(error){
                            this.modal_loading = false
                            this.addModal = false
                        }.bind(this))
                }
            })
        },
        getDetail(obj){
            this.pageLoading = true
            postApi( obj, 
				function(response){
					this.pageLoading = false
					if(response.data){
                        this.listData = response.data
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}else{
                        this.$Message.warning(response)
                    }
				}.bind(this),function(error){
					this.pageLoading = false
				}.bind(this))
        }
    }
}
</script>

<style lang="less" scoped>
.data-type{
    list-style: none;
    &:first-child{
        border-top: 1px solid #f3f3f3;
    }
    li{
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #f3f3f3;
        border-left: 1px solid #f3f3f3;
        border-right: 1px solid #f3f3f3;
        cursor: pointer;
        text-align: center;
        &.active{
            background-color: #424242;
            color: #ffffff;
            border-bottom: 1px solid #424242;
            border-left: 1px solid #424242;
            border-right: 1px solid #424242;
        }
    }
}
.data-wrap{
    min-height:300px;
    padding:10px;
    ul{
        list-style: none;
        li{
            display: block;
            position: relative;
            height: 108px;
            width: 108px;
            float: left;
            border: 1px dashed #cccccc;
            margin: 0 30px 30px 0;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover{
                border: 1px dashed #ffffff;
            }
            &.add-li{
                cursor: pointer;
                &:hover{
                    border: 1px dashed #424242;
                }
            }
            .mask{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom:0;
                border-radius: 6px;
                background-color: rgba(0, 0, 0, .6);
                display: flex;
                justify-content: center;
                align-items: center;
                .edit-icon{
                    // position: absolute;
                    // bottom: 40px;
                    // left: 30px;
                    margin: 10px;
                    cursor: pointer;
                }
                .del-icon{
                    // position: absolute;
                    // bottom: 40px;
                    // right: 30px;
                    margin: 10px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
