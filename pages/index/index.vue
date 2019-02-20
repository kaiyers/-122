<template>
	<view class="content">  
		<swiper class="swiper" indicator-dots autoplay interval="5000" duration="300">
			<swiper-item @tap="gowyy()">
				<image src="http://img0.imgtn.bdimg.com/it/u=122974694,2809775938&fm=26&gp=0.jpg"></image>
			</swiper-item>
			<swiper-item @tap="gokg()">
				<image src="https://imgessl.kugou.com/commendpic/20190108/20190108190956902072.jpg"></image>
			</swiper-item>
			<navigator url="../lenst/lenst">
				<swiper-item>
					<image src="http://www.520tingshu.com/pic/uploadimg/2011-7/20117189232815057.jpg"></image>
				</swiper-item>
			</navigator>
			<swiper-item v-for="(item,index) in bannerList" :key='index' @tap="gomv()">
				<image :src="item.randpic"></image>
			</swiper-item>
		</swiper>
		<view class="header">
			<view class="input-view" @tap="toSeek()">
				<uni-icon type="search" size="22" color="#666666"></uni-icon>
				<input confirm-type="search" class="input" type="text" placeholder="输入搜索关键词" />
			</view>
		</view>
		<scroll-view class="sst" scroll-x="true">
			<view class="ssd" v-for="(item,index) in timList" :key='index' @tap="toStyleList(item.type)">
				<image :src="item.img" class="ssd-1"></image>
				<view class="ssd-2">{{item.text}}</view>
			</view>
		</scroll-view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index">
				<view class="uni-media-list" @tap="play(index)">
					<image class="uni-media-list-logo" :src="item.pic_big"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">
							<text class="uni-ellipsis" style="width: 80%;">{{item.title}}</text><text style="color: #4CD964;">{{item.language}}</text>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">
							<text class="uni-ellipsis" style="width: 80%;">{{item.author}}</text><text style="color: #BBBBBB;">{{item.publishtime}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		 <play ref="mychild"></play>
		 <view style="height: 120upx;"></view>
	</view>
</template>  

<script>
	import uniIcon from '../../components/uni-icon.vue';
	export default {
		//  type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜 
		data() {
			return {
				title: 'Hello',
				pth:this.$statusBarHeight,
				list:[],
				timList: [
					{img:'../../static/added.png',text:'我最喜欢',type:0},
					{img:'http://qukufile2.qianqian.com/data2/pic/246584869/246584869.jpg',text:'歌手列表',type:666},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/78310a55b319ebc4845c84eb8026cffc1e17169f.jpg',text:'新歌排榜',type:1},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/c83d70cf3bc79f3d98ca8e36b8a1cd11728b2988.jpg',text:'热歌排榜',type:2},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/b8014a90f603738d0f3b6724b11bb051f819ec47.jpg',text:'摇滚歌曲',type:11},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/b8014a90f603738d0f3b6724b11bb051f819ec47.jpg',text:'爵士歌曲',type:12},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/b8014a90f603738d0f3b6724b11bb051f819ec47.jpg',text:'流行歌曲',type:16},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/8d5494eef01f3a291bf6bec89b25bc315c607cfd.jpg',text:'欧美金曲',type:21},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/6f061d950a7b0208b85e57e760d9f2d3572cc825.jpg',text:'经典老歌',type:22},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/f7246b600c33874400bd477a530fd9f9d72aa0b8.jpg',text:'情歌对唱',type:23},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/f703738da97739121a5aed67fa198618367ae2bc.jpg',text:'影视金曲',type:24},
					{img:'http://hiphotos.qianqian.com/ting/pic/item/738b4710b912c8fca95d9ecbfe039245d688210d.jpg',text:'网络歌曲',type:25},
				],
				bannerList:[]
			}
		},
		components: {
			uniIcon
		},
		onLoad() {
			this.getData();
			this.tapImg()
		},
		onPullDownRefresh() {
			console.log("下拉刷新");
			this.getData();
		},
		methods: {
			getData() {
				uni.request({			 
					url: this.$serverUrl + 'baidu.ting.song.getRecommandSongList&song_id=877578&num=15',
					success: (ret) => {
						if (ret.statusCode !== 200) {
							console.log("失败!");
						} else {
							this.list = ret.data.result.list;
							uni.stopPullDownRefresh();
						}
					}
				});
			},
			tapImg(){
				uni.request({				 
					url: "http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=2.4.0&method=baidu.ting.plaza.getFocusPic&format=json&limit=111 ",
					success: (ret) => {
						if (ret.statusCode !== 200) {
							console.log("失败!");
						} else {
							this.bannerList = ret.data.pic;
						}
					}
				});
			},
			play(e){
				this.ts()
				this.$refs.mychild.parentHandleclick(e);
			},
			// 暂存播放列表
			ts(){
				uni.setStorageSync('tsList', this.list);
			},
			toSeek(){
				uni.navigateTo({
					url:"../seekDetail/seekDetail",
				})
			},
			gomv(){
				uni.navigateTo({
					// url:"../mvList/mvList"
					url:"../qqmv/qqmv"
				})
			},
			gowyy(){
				uni.navigateTo({
					url:"../mvList/mvList"
				})
			},
			gokg(){
				uni.navigateTo({
					url:"../kgsmv/kgsmv"
				})
			},
			toStyleList(er){
				if(er){
					if(er==666){
						uni.navigateTo({
							// url:"../seekDetail/seekDetail",
							url:"../songer/songer"
						})
					}else{
						uni.navigateTo({
							url:"../mlist/mlist?type=" + er
						})
					}
				}else{
					uni.navigateTo({
						url:"../mylist/mylist"
					})
				}
			}
		}
	}
</script>

<style>
	.swiper{
		height: 400upx;
	}
	swiper-item image{
		width: 100%;
		height: 100%;
	}
	.sst{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		white-space:nowrap;
		margin: 20upx 0;
	}
	.ssd{
		display: inline-block;
		padding: 0 16upx;
	}
	.ssd-1{
		width: 80upx;
		height: 80upx;
		border-radius: 10upx;
		display: block;
		margin: 0 auto;
	}
	.ssd-2{
		text-align: center;
		font-size: 24upx;
	}
	.header {
		display: flex;
		flex-direction: row;
		padding: 10px 15px;
		align-items: center;
		background: #E7E7E7;
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
