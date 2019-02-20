<template>
	<view>
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" title="MV"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<view class="header">
			<view class="input-view">
				<uni-icon type="search" size="22" color="#666666"></uni-icon>
				<input confirm-type="search" class="input" type="text" placeholder="输入搜索关键词" @confirm="startSeek" />
			</view>
		</view>
		<!-- <view @tap="jk()" >kkki</view> -->
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index">
				<view class="uni-media-list" @tap="readSelf(item.hash)">
					<image class="uni-media-list-logo" :src="item.imgurl"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">
							<text class="uni-ellipsis">{{item.filename}}</text>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis" style="margin: 8upx 0;">
							<text style="color: #4CD964;">{{item.singername}}</text>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">
							<text class="uni-ellipsis" style="width: 96%;">{{item.intro==null?' ':item.intro}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '../../components/uni-icon.vue';
	export default {
		data() {
			return {
				height:this.$statusBarHeight+44,
				list: [],
				searchPageNum: 0,
			}
		},
		components: {
			uniIcon
		},
		onLoad() {
			
		},
		onReachBottom() {
            console.log("滑动到页面底部")
			this.seeklist();
		},
		methods: {
			jk(){
				const downloadTask = uni.downloadFile({
					url: 'http://fs.w.kugou.com/201901251316/b827501096aad15617239f1c1db1e400/G154/M0A/1E/01/OocBAFxGnBCAFMF6AD9rvrGHA88168.mp3', //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功',res);
							uni.saveFile({
							  tempFilePath: res.tempFilePath,
							  success: function (res) {
								var savedFilePath = res.savedFilePath;
								uni.getSavedFileList({
								  success: function (res) {
									console.log(res.fileList);
									uni.openDocument({
									  filePath: res.fileList[0].filePath,
									  success: function (res) {
										console.log('打开文档成功');
									  }
									});
								  }
								});
							  }
							});
						}
					}
				});
				
				downloadTask.onProgressUpdate((res) => {
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
			},
			
			
			
			
			
			startSeek(e){
				this.list = []
				console.log('5555')
				this.seekText = e.detail.value;
				this.seeklist()
			},
			seeklist(){	
				uni.request({ 
					url: 'https://api.bzqll.com/music/kugou/search?key=579621905&s='+this.seekText+'&type=mv&limit=20&offset='+this.searchPageNum,
					success: (ret) => {
						if (ret.data.code !== 200) {
							uni.showToast({
								title: ret.data.msg,
								mask: false,
								duration: 1500,
								icon:'none'
							});
						} else {
							console.log(ret)
							this.list = this.list.concat(ret.data.data);
							this.searchPageNum += 20;
						}
					}
				});
			},
			readSelf(e) {
				uni.navigateTo({
					url:"../playVedio/playVedio?for=kg&data=" + e
				})
			},
		}
	}
</script>

<style>
	@import '../../common/common.css';
	.uni-media-list-body{
		height: auto;
	}
	.uni-media-list-logo{
		width: 110upx;
		height: 110upx;
	}
	.header {
		display: flex;
		flex-direction: row;
		padding: 10px 15px;
		align-items: center;
		background: #fff;
	}
	.input-view {
		display: flex;
		align-items: center;
		flex-direction: row;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 15px;
		padding: 0 10px;
		flex: 1;
	}
	.input {
		flex: 1;
		padding: 0 5px;
		height: 24px;
		line-height: 24px;
		font-size: 16px;
	}
</style>
