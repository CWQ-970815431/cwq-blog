/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  mySidebar: [{
    type: 'doc',
    id: 'all-intro', // 文档 ID
    label: '开始', // 侧边栏标签
  },
  {
    type: 'category',
    label: 'html(18)',
    items: [
      "html/01第一个html",
      "html/02LocalStorage与SessionStorage",
      "html/03HTML DOM节点操作",
      "html/04iframe框架及优缺点",
      "html/05Cookie与Session",
      "html/06HTML5新特性",
      "html/07Canvas基础",
      "html/08前端性能优化方案",
      "html/09行内元素和块级元素",
      "html/10Web Worker",
      "html/11300ms点击延迟",
      "html/12事件冒泡与阻止冒泡机制",
      "html/13可替换元素和非替换元素",
      "html/14HTML与XHTML区别",
      "html/15常见的兼容性问题",
      "html/16DOM和BOM的区别",
      "html/17实现图片懒加载",
      "html/18Shadow DOM的理解",
    ]
  },
  {
    type: 'category',
    label: 'css(1)',
    items: [
      "css/最常考CSS水平垂直居中-五种工作常用方法"
    ]
  },
    {
      type: 'category',
      label: 'JavaScript',
      items: [
        'javascript/JavaScript文档引言',
        {
          type: 'category',
          label: 'this相关',
          items: ["javascript/JavaScript中this的四种指向情况",
            "javascript/JS中的原型模式",]
        },
        {
          type: 'category',
          label: '数据类型',
          items: ["javascript/JS中字符串与数组的关系"]
        },
      ],
    },
  {
    type: 'category',
    label: 'LeetCode',
    items: [
      'leetcode/LeetCode文档引言',
      {
        type: 'category',
        label: '数组',
        items: ["leetcode/array/删除排序数组中的重复项",
            "leetcode/array/买卖股票的最佳时机 II",
            "leetcode/array/旋转数组",
            "leetcode/array/存在重复元素",
            "leetcode/array/只出现一次的数字",
            "leetcode/array/两个数组的交集II",
            "leetcode/array/加一",
            "leetcode/array/移动零",
            "leetcode/array/两数之和",
            "leetcode/array/有效的数独",
            "leetcode/array/旋转图像",
         ]
      },
      {
        type: 'category',
        label: '字符串',
        items: ["leetcode/string/反转字符串",
        ]
      },
    ],
  },
  {
    type: 'category',
    label: '微信小程序(0)',
    items: []
  },
  {
    type: 'category',
    label: 'HTTP(0)',
    items: []
  },
  {
    type: 'category',
    label: 'Browser(0)',
    items: []
  },
  {
    type: 'category',
    label: 'Webpack(0)',
    items: []
  },
  {
    type: 'category',
    label: 'git代码托管(0)',
    items: []
  },
  {
    type: 'category',
    label: '数据结构与算法(0)',
    items: []
  },
  {
    type: 'category',
    label: '设计模式(0)',
    items: []
  },
  {
    type: 'category',
    label: '编码规范(0)',
    items: []
  },
  {
    type: 'category',
    label: '杂谈(0)',
    items: []
  },
  ],
};