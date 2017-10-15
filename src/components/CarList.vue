<template>
	<div>
        <Card :bordered="false">
            <p slot="title"><Icon type="search" size="16"></Icon> 查询</p>
           	<Form ref="formInline" :label-width="60">
					<Row>
						<Col span="4">
							<FormItem label="输入框">
								<Input v-model="searchData.input" placeholder="请输入"></Input>
							</FormItem>
						</Col>
					</Row>
			</Form>
        </Card>
		<Card :bordered="false" style="margin-top:16px;">
			<div>
				<h3>一套基于 Vue.js 的高质量UI组件库</h3>
			</div>
		</Card>
	</div>
</template>

<script>
export default {
	name: 'CarList',
	data() {
		return {
			msg: 'Welcome to Your Vue.js App',
			searchData:{
				input:'',
			}
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
</style>
