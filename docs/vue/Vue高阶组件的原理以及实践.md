---
slug: Vue高阶组件的原理以及实践
title: Vue高阶组件的原理以及实践
author: 坚持学习的小陈同学
author_title: 前端工程师 / B站UP主
author_image_url: https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4
description: 请输入描述
tags: [Vue 源码]
# activityId: 相关动态 ID
# bvid: 相关视频 ID（与 activityId 2选一）
# oid: oid
---

<!-- truncate -->
## 前言

高阶组件在许多使用Vue框架进行开发的前端工程师的印象中，大部分都比较陌生。Vue官网也没有推出这一方案的使用，大概是官方也觉得不好用。但这不影响我们来学习高阶组件的这种思维，看完本篇希望你对高阶组件有基本的认识。

## 高阶组件

高阶组件让我们想到一个函数式编程常会出现的类似名称的“高阶函数”。

**高阶函数**：为一个函数接受一个函数并返回一个新函数，使得新函数具有这个函数原先的功能又能够自定义的添加新的功能。

同样，高阶组件也具备与高阶函数一样的性质。高阶组件：接受一个组件并返回一个组件，这个组件具有原组件的功能，并拥有了新自定义的功能。以下我们一起实现一个简单的高阶组件:

假设我们有一个需求，有一个渲染列表，每个列表都为一个图片以及一些文本信息，其模板结构为：

```
<template>
    <div>
        <img src="https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4" />
            <div> 用户名称 </div>
    </div>
</template>
​
```

其中用户名称需要我们得到用户的ID发起请求再去获取,每个列表元素从父组件中拿到图片的URL,用户名称，以及用户ID,以下为实例代码。

```
<template>
    <div> 
        <smart-avatar :id="'testId'" :src="https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4"/>
    </div>    
</template>
​
​
//模拟请求
function fakerRequest(id){
    setTimeout(()=>{
         return '高阶组件'
    },500)
}
​
const Item = {
    prop：['src','name'],
    template:`<img :src="scr"/> <span>{{name}}<span>`    
}
​
function withAvatarURL (InnerComponent) {
  return {
    props: ['username','url'],
    inheritAttrs: false, // 2.4 only
    data () {
      return { id: null }
    },
    created () {
      fetchURL(this.id, url => {
        this.username = username
      })
    },
    render (h) {
      return h(InnerComponent, {
        attrs: this.$attrs, // 2.4 only
        props: {
          src: this.username || 'none'
        }
      })
    }
  }
}
​
const SmartAvatar = withAvatarURL(Item)
​
new Vue({
  el: '#app',
  components: { SmartAvatar }
})
​
```
如上代码中，我们用一个高阶组件函数*withAvatarURL*去接受了我们原始组件Item,其中
- Item组件只负责将接收到的url赋给img标签以及现实对应用户名称
- withAvatarURL负责加工我们的原始组件，将该类型组件的公用方法抽离出来，再赋予给原始组件

### 高阶函数和mixin的选择

在上面案例的场景中，其实用minxin也是可以实现的，但是使用高阶组件有以下优势：

1.  **重用性**。因为minxin对原组件具有侵入性，这会导致原来组件的可重用性降低，而高阶组件不会，高阶组件对原组件只是一个调用关系，并没有修改原来组件任何内容。
1.  **可测试性**。因为高阶组件只是一个嵌套关系，在组件测试的时候，可以单独的测试原始组件和高阶组件。
1.  **层级问题**。高阶组件也有他的弊端，如果你高阶组件嵌套层级太深，会导致出错的时候调试困难的问题，所以到底使用高阶组件和minxin需要看实际场景。

## 总结

运用高阶组件，能够保留原有组件的所有特性下创造一个新的组件，使得原有组件的重用性更高。