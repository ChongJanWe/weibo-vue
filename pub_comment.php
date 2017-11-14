<?php
    //前端传来id 和 评论内容 保存下来
    $comment = $_REQUEST['comment'];
    //获取之前的内容
    $comment_list = json_decode(file_get_contents('data/comments.txt'),true);
    //push新加的数据
    $comment = [
        'id'=>count($comment_list),
        'weibo_id'=>$comment['weibo_id'],
        'content'=>$comment['content']
    ];
    $comment_list[] = $comment;
    //保存
    file_put_contents('data/comments.txt',json_encode($comment_list));
    echo json_encode($comment);
?>