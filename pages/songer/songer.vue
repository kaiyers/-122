<template>
	<view>
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" title="歌手列表"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<view class="page">
			<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}">
				<view class="uni-list">
					<block v-for="(list,key) in lists" :key="key" v-if="list.data[0]">
						<view class="uni-list-cell-divider" :id="list.letter">
							{{list.letter}}
						</view>
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list.data" :key="index"
						 :class="list.data.length -1 == index ? 'uni-list-cell-last' : ''">
							<view class="uni-list-cell-navigate" style="justify-content: flex-start;" @tap="toSongerList(item.ting_uid)">
								<image :src="item.avatar_middle" class="simg"></image>
								{{item.name}}
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
			<view class="uni-indexed-list-bar" :class="touchmove ? 'active' : ''" @touchstart="touchStart" @touchmove="touchMove"
			 @touchend="touchEnd" @touchcancel="touchCancel" :style="{height:winHeight + 'px'}">
				<text v-for="(list,key) in lists" :key="key" class="uni-indexed-list-text" :class="touchmoveIndex == key ? 'active' : ''"
				 :style="{height:itemHeight + 'px',lineHeight:itemHeight + 'px'}">{{list.letter}}</text>
			</view>
			<view class="uni-indexed-list-alert" v-if="touchmove">
				{{lists[touchmoveIndex].letter}}
			</view>
		</view>
	</view>
</template>

<script>
	

	export default {
		data() {
			return {
				title: 'grid',
				lists: [],
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				winHeight: 0,
				scrollViewId: "A",
				titleHeight: 0,
				height:this.$statusBarHeight+44
			}
		},
		onLoad() {
			let winHeight = this.$windowHeight-this.height;
			this.itemHeight = winHeight / 26;
			this.winHeight = winHeight;
			this.getSonger();
		},
		methods: {
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.height) / this.itemHeight);
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.height) / this.itemHeight);
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			toSongerList(e){
				console.log(e)
				uni.navigateTo({
					url: '../songerSing/songerSing?tinguid='+e
				});
			},
			getSonger(){
				uni.request({
					url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=2.4.0&method=baidu.ting.artist.get72HotArtist&format=json&order=1&offset=0&limit=100',
					method: 'GET',
					data: {},
					success: res => {
						var artlist = res.data.artist;
						var al=[],bl=[],cl=[],dl=[],el=[],fl=[],gl=[],hl=[],il=[],jl=[],kl=[],ll=[],ml=[],nl=[],ol=[],pl=[],ql=[],rl=[],sl=[],tl=[],ul=[],vl=[],wl=[],xl=[],yl=[],zl=[];
						artlist.forEach(v=>{
							switch(v.firstchar){
								case 'A':
								  al.push(v)
								  break;
								case 'B':
								  bl.push(v)
								  break;
								case 'C':
								  cl.push(v)
								  break;
								case 'D':
								  dl.push(v)
								  break;
								case 'E':
								  el.push(v)
								  break;
								case 'F':
								  fl.push(v)
								  break;
								case 'G':
								  gl.push(v)
								  break;
								case 'H':
								  hl.push(v)
								  break;
								case 'I':
								  il.push(v)
								  break;
								case 'J':
								  jl.push(v)
								  break;
								case 'K':
								  kl.push(v)
								  break;
								case 'L':
								  ll.push(v)
								  break;
								case 'M':
								  ml.push(v)
								  break;
								case 'N':
								  nl.push(v)
								  break;
								case 'O':
								  ol.push(v)
								  break;
								case 'P':
								  pl.push(v)
								  break;
								case 'Q':
								  ql.push(v)
								  break;
								case 'R':
								  rl.push(v)
								  break;
								case 'S':
								  sl.push(v)
								  break;
								case 'T':
								  tl.push(v)
								  break;
								case 'U':
								  ul.push(v)
								  break;
								case 'V':
								  vl.push(v)
								  break;
								case 'W':
								  wl.push(v)
								  break;
								case 'X':
								  xl.push(v)
								  break;
								case 'Y':
								  yl.push(v)
								  break;
								case 'Z':
								  zl.push(v)
								  break;
							}
						})
						this.lists = [{
										"letter": "A",
										"data": al
									}, {
										"letter": "B",
										"data":bl
									}, {
										"letter": "C",
										"data":cl
									}, {
										"letter": "D",
										"data":dl
									}, {
										"letter": "E",
										"data":el
									}, {
										"letter": "F",
										"data":fl
									}, {
										"letter": "G",
										"data": gl
									}, {
										"letter": "H",
										"data": hl
									}, {
										"letter": "I",
										"data": il
									}, {
										"letter": "J",
										"data":jl
									}, {
										"letter": "K",
										"data": kl
									}, {
										"letter": "L",
										"data": ll
									}, {
										"letter": "M",
										"data":ml
									}, {
										"letter": "N",
										"data": nl
									}, {
										"letter": "O",
										"data": ol
									}, {
										"letter": "P",
										"data":pl
									}, {
										"letter": "Q",
										"data": ql
									}, {
										"letter": "R",
										"data": rl
									}, {
										"letter": "S",
										"data": sl
									}, {
										"letter": "T",
										"data": tl
									}, {
										"letter": "U",
										"data": ul
									}, {
										"letter": "V",
										"data": vl
									}, {
										"letter": "W",
										"data":wl
									}, {
										"letter": "X",
										"data": xl
									}, {
										"letter": "Y",
										"data": yl
									}, {
										"letter": "Z",
										"data": zl
									}]
					}
				});
			}
		}
	}
</script>

<style>
	.page {
		display: flex;
		flex-direction: row;
	}

	.scrollList {
		flex: 1;
		height: 100vh;
	}

	.uni-indexed-list-bar {
		width: 46upx;
		height: 100vh;
		background-color: lightgrey;
		display: flex;
		flex-direction: column;
	}

	.uni-indexed-list-bar.active {
		background-color: rgb(200, 200, 200);
	}

	.uni-indexed-list-text {
		color: #aaa;
		font-size: 22upx;
		text-align: center;
	}

	.uni-indexed-list-bar.active .uni-indexed-list-text {
		color: #333;
	}

	.uni-indexed-list-text.active,
	.uni-indexed-list-bar.active .uni-indexed-list-text.active {
		color: #007AFF;
	}

	.uni-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 160upx;
		height: 160upx;
		left: 50%;
		top: 50%;
		margin-left: -80upx;
		margin-top: -80upx;
		border-radius: 80upx;
		text-align: center;
		line-height: 160upx;
		font-size: 70upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.simg{
		width: 80upx;
		height: 80upx;
		border-radius: 10upx;
		display: inline-block;
		margin-right: 20upx;
	}
</style>
