<template>
	<view>
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" :title="title"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<video id="myVideo" :src="src" @error="videoErrorCallback" @play='mvp()' direction='90' controls></video>
		<view class="mvinfo">
			<view>{{title}}</view>
			<view>
				<text>{{mvinfo.singer}}</text>
				<text>{{mvinfo.publishTime}}</text>
			</view>
			<view>{{mvinfo.desc}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				height:this.$statusBarHeight+44,
				src: '',
				title:'视频播放',
				mvinfo:{},
				bgAudioMannager:null
			};
		},
		onReady: function (res) {
			this.videoContext = uni.createVideoContext('myVideo')
		},
		onLoad(e) {
			this.mvid = e.data;
		},
		onShow() {
			this.getMvInfo(this.mvid)
			this.bgAudioMannager = this.$bgAudioMannager;
		},
		onPullDownRefresh() {
			console.log("下拉刷新");
			this.getMvInfo(this.mvid)
		},
		methods:{
			getMvInfo(e){
				uni.request({
					url: 'https://api.bzqll.com/music/tencent/mv?key=579621905&id='+e,
					method: 'GET',
					data: {},
					success: ret => {
						if (ret.data.code !== 200) {
							uni.showToast({
								title: ret.data.msg,
								mask: false,
								duration: 1500,
								icon:'none'
							});
						} else {
							uni.stopPullDownRefresh()
							this.mvinfo = ret.data.data;
							this.title = ret.data.data.name;
							this.src = 'https://api.bzqll.com/music/tencent/mvUrl?key=579621905&id='+e+'&r=3';
						}
					}
				});
			},
			videoErrorCallback: function (e) {
				console.log('视频错误信息:')
				console.log(e.target.errMsg)
			},
			mvp(){
				this.bgAudioMannager.pause();
			}
		}
	}
</script>

<style>
	#myVideo{
		width: 100%;
	}
	page{
		background: #000000;
	}
	.mvinfo{
		padding: 20upx 40upx;
	}
	.mvinfo view{
		color: #D3D3D3;
		text-align: left;
		font-size: 28upx;
		margin-bottom: 20upx;
	}
	.mvinfo view:nth-child(1){
		font-size: 32upx;
		font-weight: bold;
		color: #fff;
		margin-bottom: -4upx;
	}
	.mvinfo view:nth-child(2){
		font-size: 24upx;
		color: #B2B2B2;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
