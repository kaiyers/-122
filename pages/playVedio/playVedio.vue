<template>
	<view>
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" :title="title"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<video id="myVideo" :src="src" @error="videoErrorCallback" @play='mvp()' direction='90' controls></video>
		<view class="mvinfo">
			<view>{{title}}</view>
			<view>
				<text>{{singer}}</text>
				<text>{{publishTime}}</text>
			</view>
			<view>{{desc}}</view>
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
				singer:'',
				publishTime:'',
				desc:'',
				bgAudioMannager:null,
				for:null
			};
		},
		onReady: function (res) {
			this.videoContext = uni.createVideoContext('myVideo')
		},
		onLoad(e) {
			this.mvid = e.data;
			this.for = e.for;
		},
		onShow() {
			if(this.for){
				this.getMvInfoKg(this.mvid)
			}else{
				this.getMvInfo(this.mvid)
			}
			this.bgAudioMannager = this.$bgAudioMannager;
		},
		onPullDownRefresh() {
			console.log("下拉刷新");
			this.getMvInfo(this.mvid)
		},
		methods:{
			getMvInfo(e){
				uni.request({
					url: 'https://api.bzqll.com/music/netease/mv?key=579621905&id='+e,
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
							this.singer=ret.data.data.singer;
							this.publishTime=ret.data.data.publishTime;
							this.desc=ret.data.data.desc;
							this.title = ret.data.data.name;
							this.src = 'https://api.bzqll.com/music/netease/mvUrl?key=579621905&id='+e+'&r=720';
						}
					}
				});
			},
			getMvInfoKg(e){
				uni.request({
					url: 'https://api.bzqll.com/music/kugou/mv?key=579621905&id='+e,
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
							this.singer=ret.data.data.singer;
							this.publishTime='';
							this.desc='';
							this.title = ret.data.data.songname;
							this.src = ret.data.data.mvdata.hd.downurl;
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
