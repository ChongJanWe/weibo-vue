<?php
    //前台传过来 id
    //获取到数据库里面id为 当前id的所有评论
    //获取id
    $id = $_REQUEST['id'];
    //等下要返回的当前微博 评论列表
    $cur_comments = [];
    //获取所有评论
    $comment_list = file_get_contents('data/comments.txt');
    if ($comment_list) {
        $comment_list = json_decode($comment_list,true);
        //判断
        foreach ($comment_list as $index => $value) {
            //找到了
            if ($value['weibo_id'] == $id) {
                $cur_comments[] = $value;
            }
        }
        //翻转数组
        $cur_comments = array_reverse($cur_comments);

        //返回数组
        print_r(json_encode($cur_comments));

    }