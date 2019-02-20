<template>
	<view>
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" title="我最喜欢"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in mymusic" :key="index">
				<view class="uni-media-list" @tap="play(index)">
					<image class="uni-media-list-logo" :src="item.pic_premium"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{item.title}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{item.author}}</view>
					</view>
				</view>
			</view>
		</view>
		<play ref="mychild"></play>
		<view style="height: 120upx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mymusic:[],
				height:this.$statusBarHeight
			};
		},
		onLoad() {
			try {
				const value = uni.getStorageSync('mymusic');
				if (value) {
					this.mymusic = value;
				}else{
					// uni.setStorageSync('mymusic', []);
				}
			} catch (e) {
				// error
			}
		},
		onShow() {
			
		},
		methods:{
			play(e){
				this.ts()
				this.$refs.mychild.parentHandleclick(e);
			},
			// 暂存播放列表
			ts(){
				uni.setStorageSync('tsList', this.list);
			},
		}
	}
</script>

<style>
	.uni-list{
		padding-top: 90upx;
	}
</style>


