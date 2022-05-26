---
slug: 实现strStr
title: 实现strStr
author: 坚持学习的小陈同学
author_title: 前端工程师 / B站UP主
author_image_url: https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4
description: 请输入描述
tags: [LeetCode String]
# activityId: 相关动态 ID
# bvid: 相关视频 ID（与 activityId 2选一）
# oid: oid
---

<!-- truncate -->
## Title

实现 strStr() 函数。

给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。

说明：

当 needle 是空字符串时，我们应当返回什么值呢？这是一个在面试中很好的问题。

对于本题而言，当 needle 是空字符串时我们应当返回 0 。这与 C 语言的 strstr() 以及 Java 的 indexOf() 定义相符。



示例 1：

输入：haystack = "hello", needle = "ll"
输出：2
示例 2：

输入：haystack = "aaaaa", needle = "bba"
输出：-1


提示：

1 <= haystack.length, needle.length <= 104
haystack 和 needle 仅由小写英文字符组成
相关标签
双指针
字符串
字符串匹配

## 解决方案

### BF算法

即暴力(Brute Force)算法，是普通的模式匹配算法，BF算法的思想就是将目标串S的第一个字符与模式串T的第一个字符进行匹配，若相等，则继续比较S的第二个字符和 T的第二个字符；若不相等，则比较S的第二个字符和T的第一个字符，依次比较下去，直到得出最后的匹配结果。BF算法是一种蛮力算法。

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    var haystackLengh =haystack.length;
    var needleLengh =needle.length;
    
    for(let i =0;i<=haystackLengh-needleLengh;i++){
        let j
        for( j=0;j<needleLengh;j++){
            if(haystack.charAt(i+j) !== needle.charAt(j)){
                break
            }
        }
        if(j == needleLengh){
            return i
        }
    }
    return -1
};
```

### Sunday算法

Daniel M.Sunday于1990年提出的一种字符串模式匹配算法。 其核心思想是：在匹配过程中，模式串并不被要求一定要按从左向右进行比较还是从右向左进行比较，它在发现不匹配时，算法能跳过尽可能多的字符以进行下一步的匹配，从而提高了匹配效率。 记模式串为S，子串为T，长度分别为N，M。

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    const haystackLength = haystack.length;
    const needleLength = needle.length;
    const list = listmenu(needle)
    let i;
    for( i =0;i <= haystackLength-needleLength;){
        let j;
        for(j=0;j<needleLength;j++){
            if(haystack[i+j] !== needle[j]){
                var x = haystack[i+needleLength]
                i += list[x] ? list[x] : list['other']//在偏移表中查询
                break
            }
        }
        if(j==needleLength){
            return i
        }
    }
    return -1
};
//生成一个模式串对应的偏移表
function listmenu(need){
    var res={}
    var len = need.length;
    for(let i = 0; i < len;i++){
        res[need[i]] = len -i
    }
    res['other'] = len+1
    return res
}
```

## 题目心得



## 牢记

