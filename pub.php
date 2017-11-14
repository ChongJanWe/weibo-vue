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
    }

    $weibo_type = $_REQUEST['weibo']['type'];
    //如果传过来的值的类型是图片(文件类型)
    if ($weibo_type == 'img') {
        //保存图片
        //1.获取图片字符串
        $img_file = $_REQUEST['weibo']['img_src'];
        //2.保存图片
        $img_src = saveBase64($img_file);
    }
    // 图片是网上的图 直接保存
    else{
        //保存图片
        $img_src = $_REQUEST['weibo']['img_src'];
    }

    //获取weibo.txt里面的微博列表
    $weibo_list = file_get_contents('data/weibo.txt');
    //转为数组
    $weibo_list = json_decode($weibo_list,true);
    //将前端传过来的数据存下来
    $weibo = [
        'id'=>count($weibo_list),
        'uid'=>1,
        'type'=>$_REQUEST['weibo']['type'],
        'title'=>$_REQUEST['weibo']['title'],
        'desc'=>$_REQUEST['weibo']['desc'],
        'img_src'=>$img_src,
        'song'=>$_REQUEST['weibo']['song'],
        'tags'=>$_REQUEST['weibo']['tags'],
    ];
    $weibo_list[] = $weibo;
    file_put_contents('data/weibo.txt',json_encode($weibo_list));
    print_r(json_encode($weibo));
?>