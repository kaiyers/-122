<template>
	<view class="playBttom pd">
		<view class="musicInfo ps" @tap="topm()">
			<image :src="songinfo.pic_radio" v-bind:class="[isPlay ? 'miconr' : 'mIcon']" v-if="songinfo.pic_radio"></image>
			<image src="http://img2.imgtn.bdimg.com/it/u=870973730,3810810520&fm=26&gp=0.jpg" class="mIcon" v-else></image>
			<view class="na">
				<view class="uni-ellipsis mname">{{songinfo.title?songinfo.title:'歌曲名称'}}</view>
				<view class="uni-ellipsis mauther">{{songinfo.author?songinfo.author:'歌手'}}</view>
			</view>
		</view>
		<view class="capotin pd">
			<view class="playOrPush" @tap="playOrPush()">
				<image src="../../static/push.png" v-if="isPlay"></image>
				<image src="../../static/play.png" v-else></image>
			</view>
			<view class="next" @tap="nextMusic()">
				<image src="../../static/next.png"></image>
			</view>
			<view class="list" @tap="showList()">
				<image src="../../static/list.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isPlay:false,
				bitrate:{},
				bgAudioMannager:null,
				songinfo:{},
				tsList:[],
				playNo:0 ,// 第几首歌
				mymusic:[], // 我的音乐列表
			}
		},
		onLoad() {
			let bgAudioMannager = this.$bgAudioMannager;			
			bgAudioMannager.onPlay(() => {
				console.log("开始播放");
			})
			bgAudioMannager.onPause(() => {
				console.log("暂停播放");
			})
			bgAudioMannager.onEnded(() => {
				this.nextMusic()
			})
			var that = this;
			bgAudioMannager.onTimeUpdate(function () {
				that.isPlay = !bgAudioMannager.paused
			})
			this.bgAudioMannager = bgAudioMannager;
			this.tsList = uni.getStorageSync('tsList');
		},
		onShow() {
			console.log('显示页面SD卡附近')
			try {
				const value = uni.getStorageSync('sky');
				if (value) {
					this.playNo = value.pno;
					this.playMusicBack(value.sid);
				}
			} catch (e) {
				// error
			}
			try {
				const value = uni.getStorageSync('ispl');
				this.isPlay = value;
			} catch (e) {
				// error
			}
		},
		methods: {
			// 播放、暂停
			playOrPush(){
				if(this.isPlay){
					this.bgAudioMannager.pause();
					this.isPlay = false
				}else{
					this.bgAudioMannager.title = this.songinfo.title;
					this.bgAudioMannager.singer = this.songinfo.author;
					this.bgAudioMannager.src = this.bitrate.show_link;
					this.bgAudioMannager.play();
					this.isPlay = true
				}
			},
			// 显示列表
			showList(){
				uni.navigateTo({
					url:"../tslists/tslists"
				})
			},
			topm(){
				uni.navigateTo({
					url:"../pm/pm"
				})
			},
			// 列表选歌
			parentHandleclick(e) {
				try {
					const value = uni.getStorageSync('tsList');
					if (value) {
						this.tsList = value;
						this.playNo = e;
						this.playMusic(value[e].song_id)
					}
				} catch (e) {
					// error
				}
			},
			// 列表选歌
			pptty(e) {
				console.log('ffffffd',e)
				this.isPlay = e
			},
			// 上一曲
			prevMusic(){
				if(this.playNo== -1){
					this.playNo = this.tsList.length-1
				}else{
					this.playNo --
				}
				this.playMusic(this.tsList[this.playNo].song_id)
			},
			// 播放音乐
			playMusic(e){
				uni.request({
					url: this.$serverUrl + 'baidu.ting.song.play&songid='+e,
					method: 'GET',
					data: {},
					success: res => {
						this.isPlay = true;
						this.bitrate = res.data.bitrate;
						this.songinfo = res.data.songinfo;
						this.bgAudioMannager.title = res.data.songinfo.title;
						this.bgAudioMannager.singer = res.data.songinfo.author;
						this.bgAudioMannager.src = res.data.bitrate.show_link;
						this.marginTop = 0;
						this.bgAudioMannager.play();
						let sky = {pno:this.playNo,sid:e}
						uni.setStorageSync('sky', sky);
					},
				});
			},
			// 回显音乐
			playMusicBack(e){
				uni.request({
					url: this.$serverUrl + 'baidu.ting.song.play&songid='+e,
					method: 'GET',
					data: {},
					success: res => {
						this.bitrate = res.data.bitrate;
						this.songinfo = res.data.songinfo;
					},
				});
			}
		}
	}
</script>

<style>
	.playBttom{
		position: fixed;
		bottom: 0;
		height: 120upx;
		background: #f9f9f9;
		border-top: 2upx solid #e0e0e0;
		width: 100%;
		z-index: 200;
	}
	.pd{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.ps{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.musicInfo{
		margin-left: 22upx;
	}
	.mIcon{
		width: 98upx;
		height: 98upx;
		border-radius: 98upx;
		margin-right: 24upx;
	}
	.miconr{
	  width:98upx;
	  height:98upx;
	  border-radius: 98upx;
	  margin-right: 24upx;
	  animation: myfirstr 8s linear 0s infinite;
	}
	@keyframes myfirstr
	{
	  0%   {transform: rotate(0deg);}
	  25%  {transform: rotate(90deg);}
	  50%  {transform: rotate(180deg);}
	  75%  {transform: rotate(270deg);}
	  100% {transform: rotate(360deg);}
	}
	.na{
		width: 260upx;
	}
	.mname{
		font-size: 26upx;
		font-weight: bold;
		color: #3d3d3d;
	}
	.mauther{
		font-size: 20upx;
		color: #999999;
	}
	.capotin{
		margin-right: 22upx;
		padding: 10upx;
	}
	.next{
		margin: 0 48upx;
	}
	.playOrPush,.next{
		width: 60upx;
		height: 60upx;
		border-radius: 60upx;
		background: #1196db;
	}
	.bottom .playOrPush{
		width: 100upx;
		height: 100upx;
		border-radius: 100upx;
		background: #1196db;
	}
	.bottom .playOrPush image{
		display: block;
		margin: 20upx auto;
		width: 56upx;
		height: 60upx;
	}
	.list,.kl{
		border: 2px solid #1196db;
		width: 56upx;
		height: 56upx;
		border-radius: 60upx;
	}
	.capotin view image,.bottom view image{
		display: block;
		margin: 10upx auto;
		width: 36upx;
		height: 40upx;
	}
	.popList{
		position: absolute;
		bottom: 30upx;
		height: 742upx;
		width: 90%;
		left: 0;
		right: 0;
		border-radius: 30upx;
		margin: 0 auto;
		background: #fff;
		overflow: hidden;
		border: 2upx solid #999999;
	}
	.popTop{
		height: 95upx;
		position: fixed;
		width: 90%;
		background: #fbfbfb;
		border-top-left-radius: 30upx;
		border-top-right-radius: 30upx;
		border-bottom: 2upx solid #999999;
		z-index: 230;
	}
	.popBop{
		height: 95upx;
		position: fixed;
		width: 90%;
		bottom: 30upx;
		text-align: center !important;
		line-height: 95upx;
		background: #fbfbfb;
		border-bottom-left-radius: 30upx;
		border-bottom-right-radius: 30upx;
		border-top: 2upx solid #999999;
		z-index: 230;
		font-weight: bold;
		color: #007AFF;
	}
	.ddt{
		height: 95upx;
		width: 2upx;
	}
</style>
