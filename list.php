<?php
	//获取微博数据
	$weibo_list = file_get_contents('data/weibo.txt');
	if ($weibo_list) {
		//转为数组
		$weibo_list = json_decode($weibo_list,true);
		//翻转数组
		$weibo_list = array_reverse($weibo_list);
		//转为json
		$weibo_list = json_encode($weibo_list);
	}
	echo($weibo_list);
?>
