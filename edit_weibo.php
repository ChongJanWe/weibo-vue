<?php
	/**
     * @param  string   base64字符串
     * @return string   图片保存后的路径
     */
    function saveBase64($img_file) {
        //匹配图片格式    
        if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $img_file, $result)){
            //是获取图片的类型，例如.jpg、.gif
            $type = $result[2]; 
            //保存文件路径
            $file_src = "data/".time().".{$type}";
            //保存
            if (file_put_contents($file_src, base64_decode(str_replace($result[1], '', $img_file)))){
                return $file_src;
            }else{
                return '';
            }
        }
    };
	//得到传过来的对象
	$weibo = $_REQUEST['weibo'];
	//得到id
	$id = $weibo['id'];
	//如果传过来的值的类型是图片(文件类型)
    if ($weibo['type'] == 'img') {
        //保存图片
        //1.获取图片字符串
        $img_file = $_REQUEST['weibo']['img_src'];
        //2.保存图片
        $img_src = saveBase64($img_file);
        $weibo['img_src'] = $img_src;
    }
	// 获取微博列表
	$weibo_list = file_get_contents('data/weibo.txt');
	// 转为数组
	$weibo_list = json_decode($weibo_list,true);
	// 遍历数组 找到id和前端传过来的id一样的项
	foreach ($weibo_list as $key => $value) {
		if ($id == $value['id']) {
			$weibo_list[$key] = $weibo;
		}
	};
	// 保存到weibo.txt
	file_put_contents('data/weibo.txt',json_encode($weibo_list));
	echo json_encode(['status'=>1]);
?>
