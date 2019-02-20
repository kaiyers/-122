<template>
	<view>
		<unibar fixed="true" :backgroundColor='backgroundColor' :color='color' left-icon="back" @click-left="back" @click-right="hideMenu" :title="title"></unibar>
		<image :src="songInfo.avatar_big" class="topImg"></image>
		<view id="tab-bar" :class="isXuan?'header_k':'uni-swiper-tab'" :style="{top:isXuan ? height+'px':''}">
		    <view :class="['swiper-tab-loo',tabIndex==0 ? 'active' : '']" data-current="0" @tap="tapTab">歌曲/{{songInfo.songs_total}}</view>
			<view :class="['swiper-tab-loo',tabIndex==1 ? 'active' : '']" data-current="1" @tap="tapTab">简介</view>
		</view>
		<view>
			<view v-if="tabIndex==0">
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in songlist" :key="index">
						<view class="uni-media-list" @tap="play(index)">
							<image class="uni-media-list-logo" :src="item.pic_radio"></image>
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
			</view>
			<view v-else class="intro">
				{{songInfo.intro}}
			</view>
		</view>
		<play ref="mychild"></play>
		<view style="height: 60px;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tinguid:'',
				limts:20,
				isXuan:false,
				songInfo:{},
				songlist:[],
				songnums:0,
				tabIndex: 0,    
				heightSi:0,
				backgroundColor:'rgba(0,0,0,0)',
				title:'',
				height:this.$statusBarHeight+44,
				color:'rgba(0,0,0)'
			};
		},
		// 监听页面滚动
		onPageScroll(e){
			if(e.scrollTop>195){
				this.backgroundColor='rgba(0,0,0,1)';
				this.title=this.songInfo.name;
				this.color='rgba(255,255,255,1)';
				this.isXuan =true
			}else{
				this.backgroundColor='rgba(0,0,0,0)';
				this.title='';
				this.color='rgba(0,0,0)';
				this.isXuan =false
			}
		},
		onLoad(e) {
			this.tinguid = e.tinguid;
			this.getSongInfo(e.tinguid)
			this.getGeshou(e.tinguid,20);
		},
		onShow() {
			this.heightSi = this.$windowHeight-40
		},
		onReachBottom() {
		    console.log("滑动到页面底部")
			if(this.limts<this.songnums){
				this.limts += 20
				this.getGeshou(this.tinguid,this.limts)
			}
		},
		methods:{
			getGeshou(e,limts){
				var songlist = this.songlist;
				uni.request({
					url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=2.4.0&method=baidu.ting.artist.getSongList&format=json&order=2&tinguid='+e+'&offset=0&limits='+limts,
					method: 'GET',
					data: {},
					success: res => {
						if(res.data.songlist.length){
							res.data.songlist.forEach(v=>{
								songlist.push(v)
							})
						}
						this.songlist = songlist;
						this.songnums = res.data.songnums;
						console.log(res)
					}
				});
			},
			play(e){
				this.ts()
				this.$refs.mychild.parentHandleclick(e);
			},
			// 暂存播放列表
			ts(){
				uni.setStorageSync('tsList', this.songlist);
			},
			getSongInfo(e){
				uni.request({
					url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=2.4.0&method=baidu.ting.artist.getinfo&format=json&tinguid='+e,
					method: 'GET',
					data: {},
					success: res => {
						console.log(res)
						this.songInfo=res.data
					}
				});
			},
			async tapTab(e) { //点击tab-bar
			    if (this.tabIndex === e.target.dataset.current) {
			        return false;
			    } else {
			        this.tabIndex = e.target.dataset.current
			    }
			}
		}
	}
</script>

<style>
	.topImg{
		width: 100%;
		height: 200px;
		display: block;
	}
	.swiper-tab-loo{
		color: #959595;
		flex: 1;
		text-align: center;
		font-size: 28upx;
		font-weight: bold;
		transition: all .3s linear; 
	}
	.active{
		color: #0A98D5;
		transition: all .3s linear; 
	}
	.uni-swiper-tab {
		width:100%;
		white-space:nowrap;
		height:40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f9f9f9;
		border-bottom:1px solid #f9f9f9;
		transition: all .3s ease-in;
	}
	.intro{
		padding: 10px 12px;
		width: 95%;
		line-height: 50upx;
		font-size: 28upx;
		color: #959595;
	}
	.header_k {
		width:100%;
		white-space:nowrap;
		height:40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f9f9f9;
		border-bottom:1px solid #f9f9f9;
		position: fixed;
		left: 0;
		background: #f9f9f9;
		z-index: 666;
		width: 100%;
	}
</style>
