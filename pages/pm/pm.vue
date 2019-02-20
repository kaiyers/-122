<template>
	<view class="playIndex" :style="{height:pheight+'px'}">  
		<unibar fixed="true" backgroundColor='rgba(0,0,0,0.2)' color='#fff' left-icon="back" @click-left="back" @click-right="hideMenu" title=""></unibar>
		<view v-bind:style="{height: height+'px'}"></view>
		<view class="top">
			<view class="uuui">
				<swiper duration="500" style="height:100%">
					<swiper-item>   
						<image v-bind:class="[isPlay ? 'songImg' : 'songImgH']" :src="songinfo.pic_radio"></image>
					</swiper-item>
					<swiper-item>
						<scroll-view  scroll-y="true" scroll-with-animation='true' :scroll-top='marginTop' style="height: 100%;" v-if="noLrc">
							<view v-for="(item,index) in lrcList" :key='index' style="text-align: center;">
							   <text v-bind:class="[currentIndex222 == index ? 'currentTime' : 'currentTime1']">{{item[1]}}</text>
							</view>
						</scroll-view>
						<image v-bind:class="[isPlay ? 'songImg' : 'songImgH']" :src="songinfo.pic_radio"></image>
					</swiper-item>               
				</swiper>	
			</view>
			<view class="gm uni-ellipsis">{{songinfo.title}}</view>
			<view class="gs">{{songinfo.author}}</view>
		</view>
		<view class="center">
			<view class="c-t">
				<!-- <image src="../../static/logo.png" @tap="donwLoad()"></image> -->
				<image src="../../static/added.png" v-if="addShow" @tap="add()"></image>
				<image src="../../static/add.png" v-else @tap="add()"></image>
			</view>
			<view class="progress-box">
				<text>{{timed}}</text>
				<view style="width: 72%;position: relative;">
					<progress :percent="proGress" active stroke-width="4" active-mode='forwards' backgroundColor='rgba(0,0,0,0)' class="jindu"/>
					<progress :percent="downPer" active stroke-width="4" activeColor='#fff100' active-mode='forwards' class="huancun"/>
				</view>
				<text>{{alltime}}</text>
			</view>
		</view>
		<view class="bottom">
			<view class="pd">
				<view class="kl" @tap="changePlayStyle()">
					<image :src="playStyle.img"></image>
				</view>
				<view class="next" @tap="prevMusic()">
					<image src="../../static/prev.png"></image>
				</view>
				<view class="playOrPush" @tap="playOrPush()">
					<image src="../../static/push.png" v-if="isPlay"></image>
					<image src="../../static/play.png" v-else></image>
				</view>
				<view class="next" @tap="nextMusic()">
					<image src="../../static/next.png"></image>
				</view>
				<view class="list" @tap="showList()">
					<image src="../../static/list.png"></image>
				</view>
			</view>
		</view>
		<view class="popList" :animation="animationData">
			<scroll-view scroll-y="true" class="plist uni-list" style="height: 680upx">
				<view class="uni-list-cell" v-for="(item,index) in tsList" :key="index">
					<view class="uni-list-cell-navigate" @tap="parentHandleclick(index)">
						{{item.title}}
						<image src="../../static/add.png" @catchtap="add()"></image>
					</view>
				</view>
			</scroll-view>
			<view style="height: 80upx;text-align: center;line-height: 80upx;border-top: 2upx solid #B2B2B2;" @tap="hideList()">收起</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pheight:0,
				height:this.$statusBarHeight+44,
				isPlay:false,
				bitrate:{},
				bgAudioMannager:null,
				songinfo:{},
				tsList:[],
				playStyle:{},
				playStyleList:[
					{img:'../../static/nnt.png',name:'顺序播放'},
					{img:'../../static/loopOne.png',name:'单曲循环'},
					{img:'../../static/radom.png',name:'随机播放'},
					],
				num:0, // 播放类型
				listShow:false,
				playNo:0 ,// 第几首歌
				proGress:0, // 演唱进度条
				downPer:0,// 缓存进度条
				timed:'00:00' ,// 歌曲时间
				alltime:"00:00",// 总时间
				lrcList:[], // 歌词列表
				//文稿滚动距离
				marginTop:0,
				//当前正在第几行
				currentIndex222:0,
				mymusic:[], // 我的音乐列表
				addShow:false,
				noLrc:null,
				animationData: {}
			}
		},
		onLoad(e) {
			if(e.data){
				this.playMusic(e.data)
			}else{
				try {
					const value = uni.getStorageSync('sky');
					if (value) {
						this.playNo = value.pno;
						this.playMusicBack(value.sid)
					}
				} catch (e) {
					// error
				}
			}
			// 获取页面高度
			this.getpageHeight()
			this.playStyle = this.playStyleList[0];
			this.tsList = uni.getStorageSync('tsList');
			try {
				const value = uni.getStorageSync('mymusic');
				if (value) {
					this.mymusic = value;
				}else{
					uni.setStorageSync('mymusic', []);
				}
			} catch (e) {
				// error
			}
			let bgAudioMannager = this.$bgAudioMannager;			
			bgAudioMannager.onPlay(() => {
				console.log("开始播放");
			})
			bgAudioMannager.onPause(() => {
				console.log("暂停播放");
			})
			bgAudioMannager.onEnded(() => {
				this.nextMusic()
			})
			var that = this;
			bgAudioMannager.onTimeUpdate(function () {
				that.timed = that.formatSeconds(bgAudioMannager.currentTime); 
				that.alltime = that.formatSeconds(bgAudioMannager.duration);
				that.isPlay = !bgAudioMannager.paused
				that.proGress = bgAudioMannager.currentTime / bgAudioMannager.duration * 100;
				that.downPer = bgAudioMannager.buffered / bgAudioMannager.duration * 100;
				if (that.currentIndex222 >= 3) {//超过4行开始滚动
					that.marginTop= (that.currentIndex222 - 4) * 25
				 }
				// 文稿对应行颜色改变
				if (that.currentIndex222!=that.lrcList.length - 1){//
					var j = 0;
					for (var j = that.currentIndex222; j < that.lrcList.length; j++) {
					  // 当前时间与前一行，后一行时间作比较， j:代表当前行数
					  if (that.currentIndex222 == that.lrcList.length - 2) {
					   //最后一行只能与前一行时间比较
						if (parseFloat(bgAudioMannager.currentTime) > parseFloat(that.lrcList[that.lrcList.length - 1][0])) {
						  that.currentIndex222= that.lrcList.length - 1
						  return;
						}
					  } else {
						if (parseFloat(bgAudioMannager.currentTime) > parseFloat(that.lrcList[j][0]) && parseFloat(bgAudioMannager.currentTime) < parseFloat(that.lrcList[j + 1][0])) {
						  that.currentIndex222= j
						  return;
						}
					  }
					}
				}
			})
			this.bgAudioMannager = bgAudioMannager;
		},
		onShow() {
			var animation = uni.createAnimation({
				duration: 1000,
				transformOrigin: "100% 0%",
				timingFunction: 'ease',
			})
			this.animation = animation
			this.hideList()
		},
		methods: {
			// 删除数组中的某一项
			removeAaary(_arr, _obj){
				var length = _arr.length;
				for (var i = 0; i < length; i++) {
					if (_arr[i] == _obj) {
						if (i == 0) {
							_arr.shift(); //删除并返回数组的第一个元素
							return _arr;
						}
						else if (i == length - 1) {
							_arr.pop();  //删除并返回数组的最后一个元素
							return _arr;
						}
						else {
							_arr.splice(i, 1); //删除下标为i的元素
							return _arr;
						}
					}
				}
			},
			// 添加到我的喜欢
			add(){
				var mymusic = this.mymusic
				if(this.addShow){
					this.addShow = false
					this.removeAaary(mymusic, this.songinfo)
					uni.setStorageSync('mymusic', mymusic);
					this.mymusic = mymusic
					uni.showToast({
						title: '删除成功',
						icon:'none',
						mask: false,
						duration: 1500
					});
				}else{
					this.addShow = true
					// 如果数组里面本身不存在这个对象则把这个加进去
					if(JSON.stringify(mymusic).indexOf(JSON.stringify(this.songinfo))==-1){
						mymusic.push(this.songinfo); // 进行动态的操作
						uni.setStorageSync('mymusic', mymusic);
						this.mymusic = mymusic
						uni.showToast({
							title: '添加成功',
							icon:'none',
							mask: false,
							duration: 1500
						});
					}
				}
			},
			// 秒转分秒
			formatSeconds(value) {
				var theTime = parseInt(value);// 秒
				var theTime1 = 0;// 分
				if(theTime > 59) {
					theTime1 = parseInt(theTime/60);
					theTime = parseInt(theTime%60);
				}
				return (parseInt(theTime1)>9?parseInt(theTime1):'0'+parseInt(theTime1))+":"+(parseInt(theTime)>9?parseInt(theTime):'0'+parseInt(theTime));
			},
			// 获取页面高度
			getpageHeight(){
				var that = this;
				uni.getSystemInfo({
						success: function (res) {
							that.pheight = res.screenHeight
						}
				});
			},
			// 播放、暂停
			playOrPush(){
				if(this.isPlay){
					this.bgAudioMannager.pause();
					this.isPlay = false;
				}else{
					this.bgAudioMannager.title = this.songinfo.title;
					this.bgAudioMannager.singer = this.songinfo.author;
					this.bgAudioMannager.src = this.bitrate.show_link;
					this.bgAudioMannager.play();
					this.isPlay = true;
				}	
				uni.setStorageSync('ispl', this.isPlay);
			},
			// 改变播放类型
			changePlayStyle(){
				this.num ++
				if(this.num==3){
					this.num = 0
				}
				this.playStyle = this.playStyleList[this.num];
			},
			// 显示列表
			showList(){
				  // 旋转同时放大
				this.animation.opacity(1).scaleX(1).height(380).step()
				this.animationData = this.animation.export()
			},
			hideList(){
				this.animation.height(0).scaleX(0.1).step()
				this.animation.opacity(0).step()
				this.animationData = this.animation.export()
			},
			topm(){
				this.listShow = true
			},
			closePage(){
				this.listShow = false
			},
			// 列表选歌
			parentHandleclick(e) {
				try {
					const value = uni.getStorageSync('tsList');
					if (value) {
						this.tsList = value;
						this.playNo = e;
						this.playMusic(value[e].song_id)
					}
				} catch (e) {
					// error
				}
			},
			// 下一曲
			nextMusic(){
				if(this.playStyle.name=='顺序播放'){
					if(this.playNo==this.tsList.length-1){
						this.playNo = 0
					}else{
						this.playNo ++
					}
				}else if(this.playStyle.name=='随机播放'){
					this.playNo = Math.floor((Math.random()*this.tsList.length)); 
				}
				this.playMusic(this.tsList[this.playNo].song_id)
			},
			// 上一曲
			prevMusic(){
				if(this.playNo== -1){
					this.playNo = this.tsList.length-1
				}else{
					this.playNo --
				}
				this.playMusic(this.tsList[this.playNo].song_id)
			},
			// 播放音乐
			playMusic(e){
				uni.request({
					url: this.$serverUrl + 'baidu.ting.song.play&songid='+e,
					method: 'GET',
					data: {},
					success: res => {
						this.proGress=0; // 演唱进度条
						this.downPer=0;// 缓存进度条
						this.timed='00=00' ;// 歌曲时间
						this.alltime="00=00";// 总时间
						this.lrcList=[]; // 歌词列表
						//文稿滚动距离
						this.marginTop=0;
						//当前正在第几行
						this.currentIndex222=0;
						this.isPlay = true;
						this.bitrate = res.data.bitrate;
						this.songinfo = res.data.songinfo;
						this.bgAudioMannager.title = res.data.songinfo.title;
						this.bgAudioMannager.singer = res.data.songinfo.author;
						this.bgAudioMannager.src = res.data.bitrate.show_link;
						this.marginTop = 0;
						this.seekLrc(e)
						this.bgAudioMannager.play();
						let sky = {pno:this.playNo,sid:e}
						uni.setStorageSync('sky', sky);
					},
				});
			},
			// 回显音乐
			playMusicBack(e){
				uni.request({
					url: this.$serverUrl + 'baidu.ting.song.play&songid='+e,
					method: 'GET',
					data: {},
					success: res => {
						this.bitrate = res.data.bitrate;
						this.songinfo = res.data.songinfo;
						this.seekLrc(e)
					},
				});
			},
			// 下载音乐
// 			donwLoad(){
// 				uni.downloadFile({
// 					url: 'http://qukufile2.qianqian.com/data2/music/9735336D2DD33253C7AF558C6D5F305E/252319252/252319252.jpg',
// 					success: (e) => {
// 						console.log(e)
// 						uni.saveFile({
// 							tempFilePath: e.tempFilePath,
// 							success: () => {
// 								uni.showToast({
// 									icon: "none",
// 									title: "已保存到手机相册"
// 								})
// 								uni.getSavedFileList({
// 								  success: function (res) {
// 									console.log(res.fileList);
// 								  }
// 								});
// 							},
// 							fail: () => {
// 								uni.showToast({
// 									icon: "none",
// 									title: "保存到手机相册失败"
// 								})
// 							}
// 						});
// 					},
// 					fail: (e) => {
// 						uni.showModal({
// 							content: "下载失败，" + e.errMsg,
// 							showCancel: false
// 						})
// 					}
// 				});
// 			},
			// 搜索歌词
			seekLrc(e){
				uni.request({
					url: this.$serverUrl + 'baidu.ting.song.lry&songid='+e,
					method: 'GET',
					data: {},
					success: res => {
						if(res.data.lrcContent){
							if(res.data.lrcContent.indexOf("[") != -1){
								this.lrcList = this.sliceNull(this.parseLyric(res.data.lrcContent))
								this.noLrc = true
							}else{
								this.noLrc = false
							}
						}else{
							this.noLrc = false
						}
					},
				});
			},
			//去除空白
		  sliceNull(lrc) {
			var result = []
			for (var i = 0; i < lrc.length; i++) {
			  if (lrc[i][1] == "") {
			  } else {
				result.push(lrc[i]);
			  }
			}
			return result
		  },
		  parseLyric(text) {
			//将文本分隔成一行一行，存入数组
			var lines = text.split('\n'),
			  //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
			  pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
			  //保存最终结果的数组
			  result = [];
			//去掉不含时间的行
			while (!pattern.test(lines[0])) {
			  lines = lines.slice(1);
			};
			//上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
			lines[lines.length - 1].length === 0 && lines.pop();
			lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
			  //提取出时间[xx:xx.xx]
			  var time = v.match(pattern),
				//提取歌词
				value = v.replace(pattern, '');
			  //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
			  if(time){
				  time.forEach(function (v1, i1, a1) {
						//去掉时间里的中括号得到xx:xx.xx
						var t = v1.slice(1, -1).split(':');
						//将结果压入最终数组
						result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
				  });
			  }
			});
			//最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
			result.sort(function (a, b) {
			  return a[0] - b[0];
			});
			return result;
		  },
		}
	}
</script>

<style>
	.playIndex{
		background-image: url("https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3316177935,2516232429&fm=11&gp=0.jpg");
		background-size: 100% 100%;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.top{
		height: 60%;
		background: rgba(0,0,0,0.2);
		border-bottom-left-radius: 30%;
		border-bottom-right-radius: 30%;
	}
	.uuui{
		padding: 20upx;
		height: 76%;
	}
	.gm,.gs{
		text-align: center;
	}
	.gm{
		font-size: 46upx;
		font-weight: bold;
		color: #fff;
	}
	.gs{
		font-size: 24upx;
		font-weight: bold;
		color: #F1F1F3;
	}
	.center image{
		width: 48upx;
		height:48upx;
		margin: 0 60upx;
	}
	.popList image{
		width: 48upx;
		height:48upx;
	}
	.c-t{
		margin: 5% 0;
		text-align: center;
	}
	.progress-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30upx;
	}
	.currentTime{
	  color:#fff;
	  font-weight: bold;
	  transition: all .1s linear;
	}
	.currentTime1{
	  color:#CCCCCC;
	  font-weight: normal;
	  transition: all .2s linear;
	}
	.bottom{
		margin-top: 40upx;
		padding: 20upx 40upx;
	}
	.closePage{
		position: absolute;
		top: 90upx;
		right: 24upx;
		width: 50upx;
		height: 50upx;
		z-index: 99999;
	}
	.songImgH{
	  width:440upx;
	  height:440upx;
	  border-radius: 440upx;
	  background: rgba(0,0,0,0);
	  display: block;
	  border:10rpx solid #f74609;
	  margin: 0rpx auto;
	}
	.songImg{
	  width:440upx;
	  height:440upx;
	  border-radius: 440upx;
	  background: rgba(0,0,0,0);
	  display: block;
	  border:10rpx solid #f74609;
	  margin: 0rpx auto;
	  animation: myfirst 8s linear 0s infinite;
	}
	@keyframes myfirst
	{
	  0%   {border-color: red; transform: rotate(0deg);}
	  25%  {border-color: yellow; transform: rotate(90deg);}
	  50%  {border-color: blue; transform: rotate(180deg);}
	  75%  {border-color: green; transform: rotate(270deg);}
	  100% {border-color: red;transform: rotate(360deg);}
	}
	.jindu ,.huancun{
		position: absolute;
		top: -6upx;
		left: 0;
		margin: auto;
		width: 100%;
		z-index: 10;
	}
	.jindu{
		z-index: 60;
	}
	.popList{
		position: absolute;
		opacity: 0;
		bottom: 20upx;
		width: 86%;
		height: 0upx;
		padding: 10upx;
		box-shadow: 0 0 20rpx 2rpx #000;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 666;
	}
</style>
