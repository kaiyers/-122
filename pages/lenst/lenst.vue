<template>
	<view>
		<unibar fixed="true" backgroundColor='#000' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" title="鬼吹灯"></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<audio :src="sk.url" :name="sk.title" :poster="sk.pic"  controls style="position: fixed;bottom: 0;" @ended='playk()'></audio>
		<view class="uni-product-list">
			<view class="uni-product" v-for="(product,index) in skulist" :key="index" @tap="readSelf(index)">
				<view class="image-view">
					<image class="uni-product-image" :src="product.pic"></image>
				</view>
				<view class="uni-product-title">{{product.title}}</view>
				<!-- <view class="uni-product-price">
					<text class="uni-product-price-original">{{product.name}}</text>
					<text class="uni-product-tip">第 {{product.zhang}} 章</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				skulist:[],
				height:this.$statusBarHeight+44,
				sk:{url:'',title:'',pic:''},
				idx:0
			};
		},
		onLoad() {
			
		},
		onShow() {
			this.getfun()
		},
		methods:{
			getfun(){
				var skulist = []
				for (let i=1;i<=68;i++) {
					let sku={}
					sku.title='鬼吹灯'+i;
					sku.pic='http://www.520tingshu.com/pic/uploadimg/2011-7/20117189232815057.jpg';
					sku.url='http://tingmp3.meiwenfen.com/%E9%AC%BC%E5%90%B9%E7%81%AF%E9%9D%92%E9%9B%AA%E7%89%88/%E7%B2%BE%E7%BB%9D%E5%8F%A4%E5%9F%8E'+(i<10?"0"+i:i)+'.mp3';
					skulist.push(sku)
				}
				this.skulist = skulist
			},
			readSelf(e){
				this.idx=e
				var lik = this.skulist
				this.sk = lik[e]
				// this.playaudio()
			},
			playk(){
				this.idx ++
				var lik = this.skulist
				this.sk = lik[this.idx]
				// this.playaudio()
			},
			playaudio(){
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = this.sk.url;
				innerAudioContext.onPlay(() => {
				  console.log('开始播放');
				});
				innerAudioContext.onError((res) => {
				  console.log(res.errMsg);
				  console.log(res.errCode);
				});
			}
		}
	}
</script>

<style>
	
</style>
