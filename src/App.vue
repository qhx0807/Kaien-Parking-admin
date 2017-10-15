<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
	name: 'app'
}
</script>

<style>
html,body{
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}
#app {
	font-family: "Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	height: 100%;
}

</style>
