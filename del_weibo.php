<?php
    // 删除微博也要删除微博的评论
	// 后台删除微博 得到id
	$id = $_REQUEST['id'];
	// 获取微博列表
	$weibo_list = file_get_contents('data/weibo.txt');
	// 获得评论列表
    $comment_list = file_get_contents('data/comments.txt');
	// 转为数组
	$weibo_list = json_decode($weibo_list,true);
	$comment_list = json_decode($comment_list,true);
	// 遍历数组 找到id和前端传过来的id一样的项
	foreach ($weibo_list as $key => $value) {
		if ($id == $value['id']) {
            if ($value['type'] == 'img') {
                unlink($value['img_src']);
            }
			unset($weibo_list[$key]);
		}
	}
	//删除该微博的评论
	foreach ($comment_list as $key => $value) {
	    if ($id == $value['weibo_id']){
	        unset($comment_list[$key]);
        }
    }
	// 保存到weibo.txt
	file_put_contents('data/weibo.txt',json_encode($weibo_list));
	file_put_contents('data/comments.txt',json_encode($comment_list));
	echo json_encode(['status'=>1]);
?>