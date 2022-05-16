---
slug: 两个数组的交集II
title: 两个数组的交集II
author: 坚持学习的小陈同学
author_title: 前端工程师 / B站UP主
author_image_url: https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4
description: 请输入描述
tags: [LeetCode Array]
# activityId: 相关动态 ID
# bvid: 相关视频 ID（与 activityId 2选一）
# oid: oid
---

<!-- truncate -->
## Title

给你两个整数数组 nums1 和 nums2 ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。



示例 1：

输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2,2]
示例 2:

输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出：[4,9]


提示：

1 <= nums1.length, nums2.length <= 1000
0 <= nums1[i], nums2[i] <= 1000


进阶：

如果给定的数组已经排好序呢？你将如何优化你的算法？
如果 nums1 的大小比 nums2 小，哪种方法更优？
如果 nums2 的元素存储在磁盘上，内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？
相关标签
数组
哈希表
双指针
二分查找
排序

## 解决方案

### 方法1 哈希表：

由于同一个数字在两个数组中都可能出现多次，因此需要用哈希表存储每个数字出现的次数。
首先遍历第一个数组，并在哈希表中记录第一个数组中的每个数字以及对应出现的次数
然后遍历第二个数组，对于第二个数组中的每个数字，如果在哈希表中存在这个数字，则将该数字添加到答案，并减少哈希表中该数字出现的次数。
为了降低空间复杂度，首先遍历较短的数组并在哈希表中记录每个数字以及对应出现的次数，然后遍历较长的数组得到交集。

##### 时间复杂度：

O(m+n)，其中 m 和 n 分别是两个数组的长度。需要遍历两个数组并对哈希表进行操作，哈希表操作的时间复杂度是 O(1)，因此总时间复杂度与两个数组的长度和呈线性关系。

##### 空间复杂度：

O(min(m,n))，其中 m 和 n 分别是两个数组的长度。对较短的数组进行哈希表的操作，哈希表的大小不会超过较短的数组的长度。为返回值创建一个数组 intersection，其长度为较短的数组的长度。

##### 代码

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */ 
var intersect = function(nums1, nums2) {
  let hashMap = new Map();
  const result = []
  if(nums1.length > nums2){
      [nums1,nums2] = [nums2,nums1]
  }
  nums1.forEach((item)=>{
      if(hashMap.has(item)){
        hashMap.set(item,hashMap.get(item)+1)
      }else{
          hashMap.set(item,1)
      }
  })
  nums2.forEach((item)=>{
      if(hashMap.has(item) && hashMap.get(item)>0){
            result.push(item)
            hashMap.set(item,hashMap.get(item)-1)
      }
  })
  return result
};
```



### 方法2排序 + 双指针：

如果两个数组是有序的，则可以使用双指针的方法得到两个数组的交集。
首先对两个数组进行排序，然后使用两个指针遍历两个数组。
初始时，两个指针分别指向两个数组的头部。每次比较两个指针指向的两个数组中的数字，如果两个数字不相等，则将指向较小数字的指针右移一位，如果两个数字相等，将该数字添加到答案，并将两个指针都右移一位。当至少有一个指针超出数组范围时，遍历结束。

##### 时间复杂度:

​	O(mlogm+nlogn)，其中 m 和 n 分别是两个数组的长度。对两个数组进行排序的时间复杂度是O(mlogm+nlogn)，遍历两个数组的时间复杂度是 O(m+n)，因此总时间复杂度是 O(mlogm+nlogn)。

##### 空间复杂度：

​	O(min(m,n))，其中 mm 和 nn 分别是两个数组的长度。为返回值创建一个数组 intersection，其长度为较短的数组的长度。不过在 C++ 中，我们可以直接创建一个 vector，不需要把答案临时存放在一个额外的数组中，所以这种实现的空间复杂度为 O(1)。

```javascript
var intersect = function(nums1, nums2) {
    nums1.sort((a,b)=>a-b)
    nums2.sort((a,b)=>a-b)
    let p1 = 0;
    let p2 = 0;
    const arr = [];
    while(p1 !== nums1.length && p2 !== nums2.length){
        if(nums1[p1] === nums2[p2]){
            arr.push(nums1[p1])
            p1++
            p2++
        }else if (nums1[p1] < nums2[p2]){
            p1++
        }else{
            p2++
        }
    }
    return arr
};
```

## 题目心得



## 牢记

JS-Map API:

- map.get()
- map.has()
- map.set(key,value)
- map.delete(key)