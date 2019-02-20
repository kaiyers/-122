<template>
	<view class="poo">
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" title="QQ-MV"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<view class="header">
			<view class="input-view">
				<uni-icon type="search" size="22" color="#666666"></uni-icon>
				<input confirm-type="search" class="input" type="text" @tap="toSeek()" disabled="" placeholder="输入搜索关键词" />
			</view>
			<uni-icon type="info" size="22" color="#666666"></uni-icon>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index">
				<view class="uni-media-list" @tap="readSelf(item.id)">
					<image class="uni-media-list-logo" :src="item.pic"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">
							<text class="uni-ellipsis">{{item.name}}</text>
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
		<!-- <view class="popBoxs" style="background: #0000FF;">
			<view class="tt">地区</view>
			<view class="te">  
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
			</view>
			<view class="tt">类型</view>
			<view class="te">
				<view class="tage">552</view>
				<view class="tage">552</view>
			</view>
			<view class="tt">年代</view>
			<view class="te">
				<view class="tage">552</view>
				<view class="tage">552</view>
				<view class="tage">552</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import uniIcon from '../../components/uni-icon.vue';
	export default {
		data() {
			return {
				height:this.$statusBarHeight+44,
				refreshing: false,
				list: [],
				fetchPageNum: 0
			}
		},
		components: {
			uniIcon
		},
		onLoad() {
			this.getData();
		},
		onReachBottom() {
            console.log("滑动到页面底部")
			this.getData();
		},
		methods: {
			getData() {
				uni.request({  //  https://api.bzqll.com/music/tencent/hotMvList?key=579621905&year=0&tag=0&area=0&limit=100&offset=0
					url: 'https://api.bzqll.com/music/tencent/hotMvList?key=579621905&year=0&tag=0&area=0&limit=20&offset='+this.fetchPageNum,
					success: (ret) => {
						if (ret.data.code !== 200) {
							uni.showToast({
								title: ret.data.msg,
								mask: false,
								duration: 1500,
								icon:'none'
							});
						} else {
							this.list = this.list.concat(ret.data.data);
							this.fetchPageNum += 20;
						}
					}
				});
			},
			toSeek(){
				uni.navigateTo({
					url:"../qqsmv/qqsmv"
				})
			},
			readSelf(e) {
				uni.navigateTo({
					url:"../qqpmv/qqpmv?data=" + e
				})
			},
		}
	}
</script>

<style>
	/* @import '../../common/common.css'; */
	.poo .popboxs{
		background: #0A98D5;
		overflow: hidden;
		width: 94%;
		padding: 30upx;
	}
	.poo .popboxs .tt{
		height: 60upx;
		line-height: 60upx;
		padding-left: 30upx;
		border-bottom: 2upx solid #BBBBBB;
		margin-bottom: 14upx;
	}
	.poo .popboxs .te .tage{
		display: inline-block;
		margin: 0 10upx 14upx;
		padding: 4upx 8upx;
		font-size: 24upx;
		border: 2upx solid #1196DB;
		color: #1196DB;
		border-radius: 8upx;
	}
	.uni-media-list-body{
		height: auto;
	}
	.uni-media-list-logo{
		width: 110upx;
		height: 110upx;
	}
	.header {
		display: flex;
		position: relative;
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
