---
slug: JS中字符串与数组的关系
title: JS中字符串与数组的关系
author: 潜心专研的小陈同学
author_title: 前端工程师 / B站UP主
author_url: https://i2.hdslb.com/bfs/face/9d7aad773fd142dc3fc75886008d41d2ecedb3f1.jpg@160w_160h_1c_1s.webp
author_image_url: https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4
description: 请输入描述
tags: [前端, JavaScript]
# activityId: 相关动态 ID
# bvid: 相关视频 ID（与 activityId 2选一）
# oid: oid
---


> 本文产自于本人阅读《你不知道的JavaScript(中卷)》第二章前两节，文章采用了书籍原文以及个人理解构成。这是一本指引JavaScript使用者语言进阶的书，非常推荐有心的人士静下来研读。
>
> 在阅读这两节时不知道读我这篇文章的读者有没有和我此前一样对于JS中字符串和数组之间的关系十分混淆，懂了却没完全懂的感觉。如果有的话，欢迎阅读该文

## 1.字符串是字符数组么？

首先答案是否定的，JavaScript 中的字符串和字符数组并不是一回事，最多只是看上去相似而已。

但不可否认的是字符串和数组的确很相似，它们都是类数组，都有 length 属性以及 indexOf(..)（从 ES5 开始数组支持此方法）和 concat(..) 方法。比如：

```javascript
var a = "foo";
var b = ["f","o","o"];
//length属性
a.length; // 3
b.length; // 3
//indexOf方法
a.indexOf( "o" ); // 1
b.indexOf( "o" ); // 1
//concat方法
var c = a.concat( "bar" ); // "foobar"
var d = b.concat( ["b","a","r"] ); // ["f","o","o","b","a","r"]

a === c; // false
b === d; // false

a; // "foo"
b; // ["f","o","o"]
```

从以上代码能很好的看出字符串和数组共有以上属性，但这并不意味着字符串就是字符数组，比如：

```javascript
var a = "foo";
var b = ["f","o","o"];

a[1] = "O";
b[1] = "O";

a; // "foo"
b; // ["f","O","o"]
```

此处的变量a字符串在下标改变属性后，并未发生改变。这是因为在JavaScript中字符串是不可变的，而数组是可变的。其中字符串不可变是指字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符串。而数组的可变在于它的成员函数都是在其原始值上进行操作。

```javascript
c = a.toUpperCase();
a === c; // false
a; // "foo"
c; // "FOO"
b.push( "!" );
b; // ["f","O","o","!"]
```

## 2.字符串‘借用’数组函数

许多数组函数用来处理字符串很方便。虽然字符串没有这些函数，但可以通过“借用”数 组的非变更方法来处理字符串：

```javascript
a.join; // undefined
a.map; // undefined
var c = Array.prototype.join.call( a, "-" );
var d = Array.prototype.map.call( a, function(v){
 return v.toUpperCase() + ".";
} ).join( "" );
c; // "f-o-o"
d; // "F.O.O."
```

在上例中通过call函数以及数组原始对象的函数将目标字符串作为函数调用对象进行操作

在数组函数中有一个特例字符串无法使用-可变更成员函数**reverse()**，一个程序员中通用的破解就是通过**split**将目标字符串转换为数组再调用该方法的暴力破解方法。

> 本篇文章到此结束，欢迎读者们共同讨论，转载标注。