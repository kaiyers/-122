<template>
	<view>
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" title="播放列表"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<view class="uni-list">
			<view class="uni-list-cell" v-for="(item,index) in tsList" :key="index">
				<view class="uni-list-cell-navigate uni-ellipsis" @tap="play(index)">
					<view>{{item.title}}</view>
					<image src="../../static/added.png" @tap="add(index)" v-if="item.isAdd"></image>
					<image src="../../static/add.png" @tap="add(index)" v-else></image>
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
				tsList:[],
				height:this.$statusBarHeight
			};
		},
		onLoad() {
			try {
				const value = uni.getStorageSync('tsList');
				if (value) {
					this.tsList = value;
				}
			} catch (e) {
				// error
			}
		},
		methods:{
			add(index){
				console.log(index)
				let tsList = this.tsList;
				if(tsList[index].isAdd){
					tsList[index].isAdd = false
				}else{
					tsList[index].isAdd = true
				}
				console.log(tsList)
				this.tsList = tsList
			},
			play(e){
				this.$refs.mychild.parentHandleclick(e);
			},
		}
	}
</script>

<style>
	image{
		width: 34upx;
		height: 34upx;
	}
	.uni-list{
		padding-top: 90upx;
	}
</style>
