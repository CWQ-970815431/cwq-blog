---
slug: 最常考CSS水平垂直居中-五种工作常用方法
title: 最常考CSS水平垂直居中-五种工作常用方法
author_image_url: `https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4`
sidebar_label: 
description:
tags: CSS
---


# 最常考CSS水平垂直居中

1. 首先是最简单的定位方法

```javascript
<style>
div{
  width: 200px;
  height: 200px;
  background: #000;
  /* 方法一  */
  /* position: absolute;
  top:0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto; */
  /* 方法二 */
   /* position: absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%) */
}
</style>
<body>
    <div></div>
</body>
```

2. 通过弹性盒模型以及栅格布局来居中

```javascript
<style> 
/* 方法三 */
   /* body {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items:center;
  } */
  /* 方法四 */
  /* body{
    height: 100vh;
    display: grid;
    place-items:center;
  } */
    div{
        width: 200px;
        height: 200px;
        background: #000;
    }
</style>
<body>
   <div></div>
  
</body>
```

3. 通过行内元素的特性

```javascript
<style> 
  /* 方法五 */
  /* body{
    height: 100ch;
    line-height: 100vh;
    text-align: center;
  }
  div{
    display: inline-block;
  } */
      div{
      width: 200px;
      height: 200px;
      background: #000;
      }
</style>
<body>
   <div></div>
</body>
```

