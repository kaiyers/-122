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
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index">
				<view class="uni-media-list" @tap="readSelf(item.vid)">
					<image class="uni-media-list-logo" :src="item.coverUrl"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">
							<text class="uni-ellipsis">{{item.title}}</text>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis" style="margin: 8upx 0;">
							<text style="color: #4CD964;">{{item.singer}}</text>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">
							<text class="uni-ellipsis" style="width: 96%;">{{item.desc==null?' ':item.desc}}</text>
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
			startSeek(e){
				this.list = []
				console.log('5555')
				this.seekText = e.detail.value;
				this.seeklist()
			},
			seeklist(){
				uni.request({
					url: 'https://api.bzqll.com/music/netease/search?key=579621905&s='+this.seekText+'&type=video&limit=20&offset='+this.searchPageNum,
					success: (ret) => {
						if (ret.data.code !== 200) {
							uni.showToast({
								title: ret.data.msg,
								mask: false,
								duration: 1500,
								icon:'none'
							});
						} else {
							console.log(ret.data.data.videos)
							this.list = this.list.concat(ret.data.data.videos);
							this.searchPageNum += 20;
						}
					}
				});
			},
			readSelf(e) {
				uni.navigateTo({
					url:"../playVedio/playVedio?data=" + e
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
