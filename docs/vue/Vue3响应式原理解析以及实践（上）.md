---
slug: Vue3响应式原理解析以及实践（上）
title: Vue3响应式原理解析以及实践（上）
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

> 如果你想了解Vue3前的响应式，可以参考[Vue响应式原理以及实现](https://juejin.cn/post/7107445451556651015)

Vue3重写了Vue2中的响应式原理，通过代理代替Object.defineProperty提升了性能，并解决了对象和数组值更改时无法正确响应的问题。

## 从零开始的响应式开发

首先，我想先介绍响应式中所需用到的函数对象。

### 响应流程函数

在Vue3中，我们将变量间存在依赖关系的通过effect函数表达，通过track函数注入依赖，通过trigger函数触发effect跟踪依赖

#### Effect函数

effect函数：我们将一个值依赖于另外一个值的关系通过函数结果返回。

```
let price = 5
let quantity = 2
let total = 0 
​
let effect = function(){
    total = price * quantity
}
```

在以上代码中我们将其中的函数称为price 和 quantity的副作用函数，当price 或 quantity发生改变时都会影响到函数的结果。

#### track函数

track函数：将effect函数添加到依赖中，用于追踪变化。

```
let price = 5
let quantity = 2
let total = 0 
​
let dep = new Set()//通过set结构使每个effect都是唯一的
​
let effect = function(){
    total = price * quantity
}
​
function track(){
    dep.add(effect)
}
```

#### trigger函数

trigger函数：遍历执行dep依赖对象中所存放的effect函数

```
let price = 5
let quantity = 2
let total = 0 
​
let dep = new Set()//通过set结构使每个effect都是唯一的
​
let effect = function(){
    total = price * quantity
}
​
function track(){
    dep.add(effect)
}
​
function trigger(){
    dep.forEach(effect = > effect())
}
​
track()
trigger()
```

### **对象属性包装**

如上我们结合effect函数表达变量依赖，track函数添加依赖，trigger函数更新依赖，达到了响应式的“效果”。不过以上的依赖对象都为基本类型值，在实际开发中我们会遇到很多对象形式的值，因此我们对track、trigger以及dep依赖表做出调整。

```
const depsMap = new Map()
​
function track(key){
    let dep = depsMap.get(key)
    if(!dep){
        depsMap.set(key,(dep = new Set()))
    }
    dep.add(effect)
}
​
funtcion trigger(key){
    let dep = depsMap.get(key)
    if(dep){
        dep.forEach(effect =>{
            effect()
        })
    }
    //else{}没有则表示没有依赖的副作用函数
}
```

### 全局包装

如上代码我们完成了对象类型的依赖注入 以及trigger调用。不过以上的depsMap只能包含单个对象的依赖注入，在实际开发中我们会遇到不止一个对象值，因此我们对track、trigger以及dep依赖表做出调整。实际关系如下图：

[![XjVt4e.jpg](https://img-blog.csdnimg.cn/img_convert/72cdb96a48797e0122c60a567b615d0b.png)](https://imgtu.com/i/XjVt4e)

**weakMap**

-   `WeakMap` 仅接受对象作为键和值
-   键名所引用的对象是弱引用，不可遍历（可能在任何时刻被垃圾回收器回收）利用这一特征，在对数据量很大的时候就可做一部分的优化

**为什么在定义全局对象时使用weakMap？**

Vue3在 检测到哪些数据发生了变化时候用了weakMap。所以当我们需要关联对象和数据，比如在不修改原有对象的情况下储存某些属性或者根据对象储存一些计算的值等，但是又不想管理这些数据的死活，因此使用 了WeakMap来做数据优化。

```
const targetMap = new WeakMap()
​
function track(target,key){
    let depsMap = targetMap.get(target)
    if(!depsMap){
        targetMap.set(target,(depsMap = new Map()))
    }
    let dep = depsMap.get(key)
     if(!dep){
        depsMap.set(key,(dep = new Set()))
    }
    dep.add(effect)
}
​
funtcion trigger(target,key){
    let depsMap = targetMap.get(target)
    if(!depsMap){
        return //没有则表示该对象没有依赖的副作用函数
    }
    let dep = depsMap.get(key)
    if(dep){
        dep.forEach(effect =>{
            effect()
        })
    }
    //else{}没有则表示没有依赖的副作用函数
}
​
//实例运行代码
let product = { price:5,quantity:2}
let total = 0
let effect = ()=>{ total = product.price * product*quantity }
track(product,'quantity')
effect()
console.log(total,product.quantity)//output: 10 2
product.quantity = 3 
console.log(total,product.quantity)//output: 10 3
trigger(product,'quantity')
console.log(total,product.quantity)//output: 15 3
```

如上代码中我们实现了各对象的effect收集，但还没做到让我们的effect的函数自动重新运行，每次都得手动调用trigger触发。那么如何实现呢？这部分理念和vue2中相似

-   在获取属性（get）时，使用track函数注入该属性值所拥有的effect副作用函数
-   在赋值属性（set）时，使用trigger函数遍历运行该属性值所有的effect副作用函数
    那么如何实现拦截get以及set呢？我将其以及完整的实现源码代码放在下期阐述，欢迎同学跟进学习。

## 下文

关于Proxy的使用、Vue3的源码实现我放在下期阐述。

\