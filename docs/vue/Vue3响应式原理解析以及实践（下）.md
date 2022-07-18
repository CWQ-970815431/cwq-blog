---
slug: Vue3响应式原理解析以及实践（下）
title: Vue3响应式原理解析以及实践（下）
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

> 关于上篇地址：[《Vue3响应式原理解析以及实践（上）》](https://juejin.cn/post/7111128446939447326)

上文中我们阐述了Vue3数据响应、依赖使用的方式，本篇接着讲解Proxy代理以及编写完整的响应式源码。

回顾我们上篇的需求：

-   在获取属性（get）时，使用track函数注入该属性值所拥有的effect副作用函数
-   在赋值属性（set）时，使用trigger函数遍历运行该属性值所有的effect副作用函数

我们想在get以及set时拦截下来并完成相应的依赖注入以及跟踪，在下文中我们通过ES6 Reflect 以及 ES6 Proxy去实现了它。

## Proxy

**什么是Proxy?**

Proxy 对象是ES6新出的一个特性，用于创建一个对象 的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

**为什么Proxy会取代Object.defineProperty：**

Object.defineProperty只能劫持对象的属性，不能监听数组。也不能对 es6 新产生的 Map,Set 这些数据结构做出监听。也不能监听新增和删除操作等等。 Proxy可以直接监听整个对象而非属性，可以监听数组的变化。

**使用**：

```
let p = new Proxy(target, handler);
```

其中参数 target 为包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。  其中参数 handler 为具体操作，其实就是一个对象，其属性是当执行一个操作时定义代理的行为的函数。就是说里面写各种拦截的函数。不同的拦截方法拦截的是不同的操作。

### 拦截get、set函数

```
let originObject =  { name:'youyuxi',age:'0' }
​
let proxyObject = new Proxy(originObject,{
    get(target,key,receiver){
        console.log('get key =' + key,' value =',target[key])
        return Reflect.get(target,key,receiver)
    }
    set(target,key,value,receiver){
        console.log('set key =' + key,'new value =',value)
        return Reflect.set(target,key,value,receiver)
    }
}) 
```

**注意到**，这里我们使用了Refelct去代替了直接操作对象属性。

## Refelct

Reflect对象与Proxy对象一样，也是 [ES6](https://so.csdn.net/so/search?q=ES6&spm=1001.2101.3001.7020) 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个。

0.  将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
0.  修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
0.  让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
0.  Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

## 实现"reactive"APi

我们将上述讲到了Proxy以及Refelct结合在一起，来封装下Vue3中Reactive这个方法。

```
function reactive(target){
    const handler = {
        get(target,key,receiver){
            console.log('get key =' + key,' value =',target[key])
            return Reflect.get(target,key,receiver)
        }
        set(target,key,value,receiver){
              console.log('set key =' + key,' new value =',value)
            return Reflect.set(target,key,value,receiver)
        }
    }
    return new Proxy(target,handler)
}
​
let product = reactive({price:5 , quantity:2})
product.quantity = 4 //output:set key = quantity new value = 4
console.log(product.quantity)//output:get key = quantity value = 4
```

最后结合我们在上篇讲述的track、trigger以及effect函数，完成源代码。

```
function reactive(target){
    const handler = {
        get(target,key,receiver){
            let result = Reflect.get(target,key,receiver)
            track(target,key)
            return result
        }
        set(target,key,value,receiver){
            let oldValue = target[key]
            if(oldValue !== value){
                trigger(target,key)
            }
            return Reflect.set(target,key,value,receiver)
        }
    }
    return new Proxy(target,handler)
}
​
const targetMap = new WeakMap()
•
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
•
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
let product = reactive({price:5 , quantity:2})
let total = 0 
let effect = ()=>{
    total = product.price * product.quantity
}
effect()
console.log(total)//output:10
​
product.quantity = 3
​
console.log(total)//output:15
```

不知道细心的你发现没有，以上的代码仍有问题。

```
console.log(product.quantity)
```

-   如上当我们仅获取product对象中quantity的值时，也会触发依赖注入
-   这可能会导致注入其他的依赖，重复注入依赖等等。

每次调用时都会让trick去注入依赖，这不是我们想要的。对此我们可以定义一个全局变量来定义使用trick的与否。

```
let activeEffect = null
​
•
function track(target,key){
    if(activeEffect){
        let depsMap = targetMap.get(target)
        if(!depsMap){
            targetMap.set(target,(depsMap = new Map()))
        }
        let dep = depsMap.get(key)
         if(!dep){
            depsMap.set(key,(dep = new Set()))
        }
        dep.add(activeEffect)
    }
}
​
function effect(eff){
    activeEffect = eff
    activeEffect()
    activeEffect = null
}
​
effect(()=>{
      total = product.price * product.quantity
})
```

如上代码中，我们定义了一个全局变量activeEffect来表示当前effect的使用状态；并在trick中加入运行判断；将effect改为一个接受副作用函数并调用的方法。

## 总结

Vue3响应式其实就是利用了ES6更高性能API做了对象拦截以及处理中的升级