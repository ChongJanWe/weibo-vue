<?php
    //前台传来id 循环遍历评论 找到一样的   删除
    // 获取id
    $id = $_REQUEST['id'];
    // 拿到评论数据
    $comments_list = file_get_contents('data/comments.txt');
    // 转为数组
    $comments_list = json_decode($comments_list,true);
    // 循环数组 找到id相等的项目
    foreach ($comments_list as $key => $value) {
        if ($id == $value['id']) {
            unset($comments_list[$key]);
        }
    }
    // 转为json
    $comments_list = json_encode($comments_list);
    //保存到数据库
    file_put_contents('data/comments.txt',$comments_list);
    // 返回
    print_r($comments_list);
