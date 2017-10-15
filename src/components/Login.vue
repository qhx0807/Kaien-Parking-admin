<template>
    <div class="wrap">
        <!-- <div class="login">
            <div>后台管理系统</div>
             <Button type="primary">Primary</Button>
        </div> -->
        <Card class="login">
            <div class="login-title">WXPARKING ADMIN</div>
            <Form ref="fromlogin" :model="fromlogin" :rules="ruleLogin">
                <FormItem prop="user">
                    <Input type="text" v-model="fromlogin.user" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password"  style="margin-bottom:26px">
                    <Input type="password"  v-model="fromlogin.password" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:6px;padding-left:2px">
                     <Checkbox v-model="fromlogin.checkbox">记住我</Checkbox>
                </FormItem>

                <FormItem>
                    <Button type="primary" @click="handleSubmit('fromlogin')" long>登录</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            fromlogin:{
                user: '',
                password: '',
                checkbox:true,
            },
            ruleLogin:{
                user: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.wrap{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f3f3f3;
    .login{
        width: 320px;
        height: 330px;
        padding: 20px;
        .login-title{
            text-align: center;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            margin-bottom: 24px;
            vertical-align: text-bottom;
            font-size: 16px;
            text-transform: uppercase;
            color: rgba(0, 0, 0, .65);
        }
    }
}
</style>
