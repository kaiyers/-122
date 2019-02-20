<script>
	import Vue from 'vue'
	export default {
		onLaunch: function () {
			console.log('App Launch')
		},
		onShow: function () {
			Vue.prototype.$bgAudioMannager = uni.getBackgroundAudioManager();
			this.getpageHeight()
		},
		methods:{
			// 获取页面高度
			getpageHeight(){
				uni.getSystemInfo({
						success: function (res) {  
							Vue.prototype.$windowHeight = res.screenHeight;
							console.log(res.screenHeight)
							console.log(res.windowHeight)
							Vue.prototype.$statusBarHeight = res.statusBarHeight
						}
				});
			},
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import "./common/uni.css";
	/*每个页面公共css */
	.uni-media-list-logo{
		border-radius: 6upx;
	}
	._view{
		text-align: left;
	}
	.uni-media-list-text-top,.uni-media-list-text-bottom{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
