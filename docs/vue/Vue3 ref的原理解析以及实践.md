---
slug: Vue3 ref的原理解析以及实践
title: Vue3 ref的原理解析以及实践
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

本篇作为Vue3中**ref** api的讲解，希望你拥有以下知识

- 了解Vue3中的响应式原理，可参考
    - [《**Vue3响应式原理解析以及实践（上）**》](https://juejin.cn/post/7111128446939447326/)
    - [《**Vue3响应式原理解析以及实践（下）**》](https://juejin.cn/post/7111489564052553736)
- **ref**的基本使用方法，可参考官网**[Refs](https://v3.cn.vuejs.org/api/refs-api.html)**

## 实现ref

有这么一段代码，

- 我们用一个副作用函数注入total的依赖
- 再用一个副作用函数注入salePrice的依赖

```javascript
let product = reactive({ price:5,quantity:2 })
let salePrice = 0
let total = 0

effect(()=>{
    total = product.price*product.quantity
})

effect(()=>{
    salePrice = product.price*1.1
})
```

此时我们不难发现销售总额应当为salePrice*product.quantity,于是我们定义销售总额，并注入依赖。

```javascript
let saleTotal = 0
effect(()=>{
    saleTotal = salePrice*product.quantity
})
```

但此段代码不会像我们所想的那样运行，因为salePrice并不是一个响应式变量。此时如果你熟悉Vue3Api，你应该知道这里是一个使用ref的场景。

### **ref**

ref函数接受一个值并返回一个响应式的、可变的Ref对象。Ref对象只有一个.value属性值。

第一种实现，通过reactive方法直接实现

```javascript
function ref(intialValue){
    return reactive({value:intialValue})
}
```

虽然能行，但这并不是我们以及Vue3实现所真正实现的。

### **对象访问器**

Vue3中ref使用了一个概念对象访问器，这属于JavaScript里计算属性的概念。下面我举例说明。

```javascript
let user = {
    firstName:'jack',
    lastName:'chen',
    get name(){
        return `${this.firstName} ${this.lastName}`
    },
    set name(value){
        [this.firstName,this.lastName] = value.split(' ')
    }
}
console.log(user.name)//output:jack chen
user.name = 'jony j'
console.log(user)//output {
 firstName:'jony',
 lastName:'j',
}
```

如上代码中，我们并没有给user对象设置name的属性。而是通过set 和get 与name属性名间的逻辑关系，从而使得了name具有了计算属性。在我们改变name的同时也同时改变了与她相关的firstName以及lastName属性。这个概念同样也在**ref** api内使用

### 简易ref源代码

```javascript
function ref(raw){
    const r = {
        get value(){
            track(r,'value')
            return raw
        }
        set value(newVal){
            raw = newVal
            trigger(r,'value')
        }
    }
	return r
}
```

以上代码中我们在ref函数内新建了一个对象，并运用了对象访问器，注入了与传入值相关的依赖，并在赋值时触发依赖从而达到了响应值。关于track和trigger函数的实现可参考reactive api内的实现。在Vue3中ref用于将一个普通类型的值转换为响应式，个人感觉类似于Vue2中计算属性的含义。

## End

本篇参考了源代码讲解视频，对于ref的讲解不是完全全面。实现代码为简易版。



