<template>
    <div>
        <Row>
            <Col span="4">
                <Card :bordered="false">
                    <p slot="title">数据类别</p>
                    <ul class="data-type">
                        <li :class="{active:activeItem==0}" @click="onClickTypeItem">车辆类型</li>
                        <li>车辆类型</li>
                        <li>车辆类型</li>
                        <li>车辆类型</li>
                        <li>车辆类型</li>
                        <li>车辆类型</li>
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
                            
                            <li @mouseover="onMouseInItem" @mouseout="onMouseOutItem">
                                月票车 
                                <div class="mask" v-show="maskShow==1">
                                    <Icon type="edit" class="edit-icon" size="21" color="#ffffff"></Icon>
                                    <Icon type="ios-trash" class="del-icon" size="22" color="#ffffff"></Icon>
                                </div>
                            </li>
                            <li>月票车</li>
                            <li>月票车</li>
                            <li>月票车</li>
                            <li class="add-li" @mouseover="addcolor='#424242'" @mouseout="addcolor='#cccccc'"><Icon size="50" :color="addcolor" type="android-add"></Icon></li>
                        </ul>
                    </div>
                    <div style="clear:both"></div>
                </Card>
            </Col>
        </Row>
    </div> 
</template>

<script>
import { postApi } from '../axios'
export default {
    name: 'Setting',
    data(){
        return {
            activeItem: 0,
            typeData:[],
            maskShow:0,
            addcolor:'#cccccc',
            queryData:{
                Ctype:'DataDIcQuery',
                oac:sessionStorage.getItem("name"),
            },
            pageLoading:false,

        }
    },
    created () {
        this.getListData(this.queryData)
        Array.prototype.unique = function(){
        var res = [];
        var json = {};
        for(var i = 0; i < this.length; i++){
            if(!json[this[i]]){
                res.push(this[i]);
                json[this[i]] = 1;
            }
        }
            return res;
        }
        var arr = [112,112,34,'你好',112,112,34,'你好','str','str1'];
        //alert(arr.unique());
    },
    methods:{
        getListData(obj){
            this.pageLoading = true
			postApi( obj, 
				function(response){
					console.log(response)
					this.pageLoading = false
					if(response.data.data){
						
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
					this.pageLoading = false
				}.bind(this))
        },
        onClickTypeItem(type){
            let d = {
                Ctype:'DataDicDetailQuery',
                paramsort: type,
                oac:sessionStorage.getItem("name"),
            }
             this.pageLoading = true
            postApi( d, 
				function(response){
					console.log(response)
					this.pageLoading = false
					if(response.data.data){
						
					}else if(response.data.error){
						this.$Message.warning(response.data.error)
					}
				}.bind(this),function(error){
					this.pageLoading = false
				}.bind(this))
        },
        onMouseInItem(){
            this.maskShow = 1
        },
        onMouseOutItem(){
            this.maskShow = -1
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
                .edit-icon{
                    position: absolute;
                    bottom: 40px;
                    left: 30px;
                    cursor: pointer;
                }
                .del-icon{
                    position: absolute;
                    bottom: 40px;
                    right: 30px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
