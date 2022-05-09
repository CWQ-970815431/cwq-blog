---
slug: 买卖股票的最佳时机 II
title: 买卖股票的最佳时机 II
author: 坚持学习的小陈同学
author_title: 前端工程师 / B站UP主
author_image_url: https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4
description: 请输入描述
tags: LeetCode
# activityId: 相关动态 ID
# bvid: 相关视频 ID（与 activityId 2选一）
# oid: oid
---

<!-- truncate -->
## Title

给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。

在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。

返回 你能获得的 最大 利润 。

示例 1：

输入：prices = [7,1,5,3,6,4]
输出：7
解释：在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6 - 3 = 3 。
总利润为 4 + 3 = 7 。
示例 2：

输入：prices = [1,2,3,4,5]
输出：4
解释：在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5 - 1 = 4 。
总利润为 4 。
示例 3：

输入：prices = [7,6,4,3,1]
输出：0
解释：在这种情况下, 交易无法获得正利润，所以不参与交易可以获得最大利润，最大利润为 0 。


提示：

1 <= prices.length <= 3 * 104
0 <= prices[i] <= 104
相关标签
贪心
数组
动态规划

## 解决方案

### 1.只要后一天的价格比前一天的高就在这俩天进行买卖

```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let result =0
    for(let i = 0;i < prices.length-1 ; i++){
        if(prices[i] < prices[i+1]){
            result+=prices[i+1] - prices[i]
        }
    }
    return result
};
```

### 2.贪心算法解决

下面我随便画了一个股票的曲线图，可以看到如果股票一直上涨，只需要找到股票上涨的最大值和股票开始上涨的最小值，计算他们的差就是这段时间内股票的最大利润。如果股票下跌就不用计算，最终只需要把所有股票上涨的时间段内的利润累加就是我们所要求的结果

![image.png](https://pic.leetcode-cn.com/1610414787-FKOtDL-image.png)

```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let result =0
    let minUp = prices[0]
    let maxUp = 0
    for(let i = 0;i < prices.length-1 ; i++){
        if(prices[i] < prices[i+1]){
            maxUp=prices[i+1]
        }else {
            const num  = maxUp-minUp
            if(num>0){
                result+=num
            }
            minUp = prices[i+1]
            maxUp = 0
        }
         if(i == prices.length-2 && maxUp){
               const num  = maxUp-minUp
            if(num>0){
                result+=num
            }  
         }
    }
    return result
};
```

## 题目心得

学习到了贪心算法的基本思路

## 牢记

贪心算法一般按如下步骤进行：

①建立数学模型来描述问题 。

②把求解的问题分成若干个子问题  。

③对每个子问题求解，得到子问题的局部最优解  。

④把子问题的解局部最优解合成原来解问题的一个解  。