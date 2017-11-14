new Vue({
	el: '#weibo_box',
	data: {
		weibo_list: [],	//存储微博列表
		weibo_info: {	//微博信息
			id: '',		//微博id
			uid: '',	//用户id
			type: '',	//微博类型 font\img\music
			title: '',	//标题
			desc: '',	//微博描述
			img_src: '',	//上传图片的地址
			song: {			//音乐对象
				name: '',		//音乐名字
				artists: '',	//演唱者
				audio_src: '',	//媒体地址
			},
			tags: '',		//微博标签
		},
        comment_list: [],	//评论列表
        comment_info: {	//评论信息
            id: '',		//评论id 用于删除
            weibo_id: '',	//微博id 用于映射
            content: '',	//评论内容
        },
        music_list: [],		//搜索音乐时显示的列表
		search_music_text: '',	//搜索音乐的文本框内容

		pubBox_status: false,	//是否显示发布框
		pubBox_title_status: false,		//是否显示发布框的标题
		pubBox_content_status: false,	//显示发布主题内容
		preview_box_status: false,	//是否显示图片预览
		pubBtn_disabled: true,	//是否disabled发布按钮

		pubBtn_status: true,		//是否显示发布框
		editBtn_status: false,	//是否显示编辑框

		music_list_status: false,	//是否显示音乐列表
		keyup_timer: null,	//用于按钮松开定时触发函数
		show_music_preview: false,	//显示音乐预览
		cur_comments_box: null,	//评论窗口index index为多少就显示哪个 null为隐藏所有
        pubBox_tags_status: false,

		cur_choose_music: -1,  //搜索音乐时高亮的li索引
	},
	created() {
		//vue创建时请求数据
		this.init();
	},
	watch: {
		weibo_info:{
			handler:function(val,oVal) {
			},
			deep: true	//深度监听
		},
		//路径名要加上引号
		'weibo_info.desc':function(val,oVal) {
			if (val) {
				this.pubBtn_disabled = false;
			} else {
				this.pubBtn_disabled = true;
			}
		}
	},
	methods: {
		init: function () {
		//初始化
			// 请求数据
			$.get('list.php', (rtnData) => {
				if (rtnData) {
					//将微博信息保存在weibo_list
					// console.log(rtnData);
					this.weibo_list.push(...JSON.parse(rtnData));
				}
			});
		},
		//显示发布框
		show_pubBox: function (type) {
			//每次点开都清空内容
            this.weibo_info = {	//微博信息
                'id': '',		//微博id
				'uid': '',	//用户id
				'type': type,	//微博类型 font\img\music
				'title': '',	//标题
				'desc': '',	//微博描述
				'img_src': '',	//上传图片的地址
				'song': {			//音乐对象
					'name': '',		//音乐名字
					'artists': '',	//演唱者
					'audio_src': '',	//媒体地址
                },
                'tags': '',		//微博标签
            };
            this.search_music_text = '';
            //重置
            this.pubBox_title_status = false;
		    this.pubBox_content_status = false;
            this.preview_box_status = false;
            this.pubBox_tags_status = false;
            this.music_list_status = false;
            this.show_music_preview = false;
            //显示发布框
            this.pubBox_status = true;
            switch (type) {
            	case 'font': 
		            this.pubBox_title_status = true;
		            this.pubBox_content_status = true;
		            this.pubBox_tags_status = true;
		        break;
		        case 'img':
		        	this.pubBox_title_status = false;
		            this.pubBox_content_status = false;
            }
		},
		//隐藏发布框
		hide_pubBox: function (type) {
			this.preview_box_status = false;
			this.pubBox_status = false;
		},
		//点击发布 发布微博
		pub_weibo: function () {
			//微博的标签 字符串转为数组
			if(this.weibo_info.tags) {
                this.weibo_info.tags = this.weibo_info.tags.split(',');
			}
            //1.把数据传给后台 回调函数修改weibo_list
			$.post('pub.php',{'weibo':this.weibo_info},(rtnData) => {
                //2.初始化
                this.weibo_list.unshift(JSON.parse(rtnData));
				//3.隐藏发布框
				this.hide_pubBox();
			})
		},
		//发布图片微博，选择文件后的 预览功能
		preview_img: function () {
			//1.获取文件	weibo_file是在html绑定ref的属性名
			// console.log(this.$refs.weibo_file.files[0]);
			var file = this.$refs.weibo_file.files[0];
			//2.创建filereader实例
			var fr = new FileReader();
			//3.将图片将转成 base64 格式
			fr.readAsDataURL(file);
			//4.成功后的回调函数
			//因为回调函数里面要用到this
			var self = this;
			fr.onloadend = function () {
				self.weibo_info.img_src = this.result;
				// 显示预览图
				self.preview_box_status = true;
			}
			this.pubBox_content_status = true;
			this.pubBox_tags_status = true;
		},
		// 搜索音乐
		search_music: function (event) {
			//如果输入框内容为空
			if (!this.search_music_text || event.keyCode == '38' || event.keyCode == '40' || event.keyCode == '13') {
				return;
			}
            //清空music_list
            this.music_list = [];
            //先清除定时器
			clearTimeout(this.keyup_timer);
			//开启定时器 作用是让用户输入完成后执行
			//这里设置了定时器 所以里面的this变为window了 在这里定义一个self保存this
			var self = this; 
			this.keyup_timer = setTimeout(function(){
				$.getJSON('http://s.music.163.com/search/get/?version=1&src=lofter&type=1&filterDj=false&s='+self.search_music_text+'&limit=8&offset=0&callback=?',(data)=>{
	                // 如果有返回值 
	                if (data['result']) {
	                    var songs = data['result'].songs;
	                    // 将返回来的数据里面的歌曲和演唱者等信息保存到music_list
	                    for (var i = 0; i < songs.length; i++) {
	                    	(function (i) {
		                    	self.music_list.push({
	                    			//添加歌名
			                    	name:songs[i].name,
		                    		// 添加艺术家
		                    		artists:songs[i].artists[0].name,
			                    	//添加图片路径
			                    	img_src:songs[i].album.picUrl,
			                    	// 添加audio路径
			                    	audio_src:songs[i].audio,
		                    	});
		                    })(i);
	                    }
	                    // 显示music_list
	                    self.music_list_status = true;
	                }
	            })
			},500);
		},
		// 音乐搜索框 按上下可以高亮音乐列表
        change_select_music: function (event) {
			if (event.keyCode == '38') {
				//向上
				if (this.cur_choose_music <= 0) {
					this.cur_choose_music = this.music_list.length - 1;
				} else {
                    this.cur_choose_music--;
				}
			} else {
				//向下
                if (this.cur_choose_music >= this.music_list.length - 1) {
                    this.cur_choose_music = 0;
                } else {
                    this.cur_choose_music++;
                }
			}
        },
		// enter创建音乐预览效果
		enter_choose_music: function () {
			console.log(this.music_list[this.cur_choose_music]);
            this.weibo_info = {
                id: this.weibo_info.id, //微博id
                uid: '',	//用户id
                type: 'music',	//微博类型 font\img\music
				title: '',
                desc: this.weibo_info.desc,	//微博描述
                img_src: this.music_list[this.cur_choose_music].img_src,	//上传图片的地址
                song: {			//音乐对象
                    name: this.music_list[this.cur_choose_music].name,		//音乐名字
                    artists: this.music_list[this.cur_choose_music].artists,	//演唱者
                    audio_src: this.music_list[this.cur_choose_music].audio_src,	//媒体地址
                },
				tags: [],
            };
            this.show_music_preview = true;
            this.music_list_status = false;
            this.pubBox_content_status = true;
            this.pubBox_tags_status = true;
        },
		// 点击music_list里面的li	创建音乐预览效果
		click_choose_music: function (item) {
			this.weibo_info = {	
				id: this.weibo_info.id, //微博id
				uid: '',	//用户id
				type: 'music',	//微博类型 font\img\music
                title: '',
				desc: this.weibo_info.desc,	//微博描述
				img_src: item.img_src,	//上传图片的地址
				song: {			//音乐对象
					name: item.name,		//音乐名字
					artists: item.artists,	//演唱者
					audio_src: item.audio_src,	//媒体地址
				},
                tags: [],
			};
			this.show_music_preview = true;
			this.music_list_status = false;
			this.pubBox_content_status = true;
			this.pubBox_tags_status = true;
		},
		//关闭音乐预览
		close_music_preview: function () {
			this.show_music_preview = false;
			this.pubBox_content_status = false;
			this.weibo_info.desc = '';
			this.pubBox_tags_status = false;
            this.search_music_text = '';
		},
		// 删除微博
		del_weibo: function (item) {
			//1.先把后台的删除了 再删除前端的
			$.post('del_weibo.php',{id:item.id},(resData)=> {
				//2.获取到需要删除的微博	item
				//3.删除weibo_list数组里面的item
				this.weibo_list.splice(this.weibo_list.indexOf(item),1);
			});
		},
		//显示编辑微博盒子
		show_edit_weibo_box: function (item) {
			//思路： 请求后台 获得数据 数据填入发布框 发布(替换原来的)
			//思路2: 打开发布框 数据填入相应位置 点击发布 发送数据到后台
			//1.打开发布框
			// console.log(item.id);
			this.show_pubBox(item.type);
			//2.填入数据	
			this.weibo_info.id = item.id;
			this.weibo_info.desc = item.desc;
			if (item.type==='img') {
				//如果是图片微博 要显示缩略图
				this.weibo_info.img_src = item.img_src;
				this.preview_box_status = true;
			} else if (item.type==='music') {
				this.weibo_info.img_src = item.img_src;
				this.weibo_info.song = item.song;
				//显示音乐预览
				this.show_music_preview = true;
			}
			//不显示发布按钮 显示完成编辑按钮
			this.pubBtn_show = false;
			this.editBtn_show = true;
		},
		//编辑微博
		edit_weibo: function () {

			//1.把数据传给后台 回调函数修改weibo_list
			
			$.post('edit_weibo.php',{'weibo':this.weibo_info},(data) => {
				//2.初始化
				this.init();
				//3.隐藏发布框
				this.hide_pubBox();
			});
		},
		//显示/隐藏评论窗口
		toggle_comments_box: function (index,id) {
			//如果当前index等于index 说明要关闭评论窗口
			if (this.cur_comments_box == index) {
				this.cur_comments_box = null;
				this.comment_list = [];
			}
			//显示评论窗口 加载评论
			else {
				//显示
                this.cur_comments_box = index;
                //加载评论
                this.load_comments(id);
            }
		},
		//加载评论
		load_comments: function (id) {
            $.post('get_comments.php',{id:id},(rtnData) => {
            	if(rtnData){
                    this.comment_list.push(...JSON.parse(rtnData));
				}
			});
        },
		//发布评论
		pub_comment: function (id) {
			//思路：前端 把数据传给后台
			//需要传的数据 weibo的id 内容
			if (this.comment_info.content!=''){
                this.comment_info.weibo_id = id;
                $.post('pub_comment.php',{comment:this.comment_info},(rtnData) => {
                    this.comment_list.unshift(JSON.parse(rtnData));
					this.comment_info.content = '';
				});
			} else{
                alert("评论不能为空!");
			}
        },
		//删除评论
		del_comment: function (id) {
			//思路
			//点击删除  传入id 交给后台
			$.post('del_comment.php',{id:id},(rtnData) => {
				console.log(rtnData);
                this.comment_list = JSON.parse(rtnData);
			})
        }
	}
})