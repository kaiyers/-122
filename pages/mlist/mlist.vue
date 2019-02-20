<template>
	<view>
		<unibar fixed="true" :backgroundColor='backgroundColor' :color='color' left-icon="back" @click-left="back" @click-right="hideMenu" :title="title"></unibar>
		<image :src="billboard.pic_s260" style="display: block;width: 100%;height: 240px;"></image>
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
		<text class="loadMore">加载中...</text>
		<play ref="mychild"></play>
		<view style="height: 120upx;"></view>
	</view>
</template>

<script>
	export default {
		//  type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜 
		data() {
			return {
				list:[],
				billboard:{},
				types:null,
				off:0,
				backgroundColor:'rgba(0,0,0,0)',
				title:'',
				color:'rgba(0,0,0)'
			}
		},
		onLoad(e) {
			this.types = e.type
			this.getData(0);
		},
		// 监听页面滚动
		onPageScroll(e){
			if(e.scrollTop>200){
				this.backgroundColor='rgba(0,0,0,1)';
				this.title=this.billboard.name;
				this.color='rgba(255,255,255,1)'
			}else{
				this.backgroundColor='rgba(0,0,0,0)';
				this.title='';
				this.color='rgba(0,0,0)'
			}
		},
		onReachBottom() {
		    console.log("滑动到页面底部")
			this.off += 20
			this.getData(this.off)
		},
		methods: {
			getData(offset) {
				var liik = this.list
				uni.request({				 
					url: this.$serverUrl + 'baidu.ting.billboard.billList&type='+this.types+'&size=20&offset='+offset,
					success: (ret) => {
						if (ret.statusCode !== 200) {
							console.log("失败!");
						} else {
							ret.data.song_list.forEach(value=>{
								liik.push(value)
							})
							this.list = liik;
							this.billboard = ret.data.billboard;
							uni.setNavigationBarTitle({
								title: ret.data.billboard.name //页面标题为路由参数
							})
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
			}
		}
	}
</script>

<style>

</style>
