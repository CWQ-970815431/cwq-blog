---
slug: JavaScript中this的四种指向情况
title: JavaScript中this的四种指向情况
author: 坚持学习的小陈同学
author_title: 前端工程师 / B站UP主
author_url: https://i2.hdslb.com/bfs/face/9d7aad773fd142dc3fc75886008d41d2ecedb3f1.jpg@160w_160h_1c_1s.webp
author_image_url: https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4
description: 请输入描述
tags: [前端, JavaScript]
# activityId: 相关动态 ID
# bvid: 相关视频 ID（与 activityId 2选一）
# oid: oid
---


<!-- truncate -->

> 本文出自《JavaScript设计模式与开发实践》第二章

跟别的语言大相径庭的是，JavaScript的this总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。
除去不常用的with和eval的情况，具体到实际应用中，this的指向大致可以分为以下四种

- 作为对象的方法调用
-  作为普通函数调用
- 构造器调用
- Function.prototype.call / Funtion.prototype.apply
1. 作为对象的方法调用
   当函数作为对象的方法被调用时，this指向该对象。

```javascript
let obj = {
    a:1,
    getA:function(){
        alert(this === obj ); //输出:true
        alert(this.a) //输出：1   
    }
}
obj.getA();
```


2. 作为普通函数调用
   当函数不作为对象的属性被调用时，也就是我们常说的普通函数方式，此时的this总是指向全局对象。在浏览器的JavaScript里，这个全局对象是window对象。

```javascript
window.name =  'globalName'
let getName =function(){
    return this.name;
}
console.log(getName());// 输出:globalName
let myObject = {
    name:'sven',
    getName:function(){
        return this.name;    
    }
}
var getName = myObject.getName;
console.log(getName())//输出：globalName
```

3. 构造器调用
   当用new运算符调用函数时，该函数总会返回一个对象，通常情况下，构造器里的this就指向返回的这个对象。

```javascript
let MyClass = function(){
    this.name = 'shintaro'
}
let obj = new MyClass();
console.log(obj.name) // output:'shintaro'
```

如上obj复制了MyClass的原型也获得了其中的name属性，但当构造器函数显示的返回了一个object类型的对象时，那么使用new调用构造器后获得的this环境就是这个对象，如下：

```javascript
let MyClass = function(){
    this.name = 'shintaro'
    return {
        name:'Faker'    
    }
}
let obj = new MyClass();
console.log(obj.name) //output:'Faker'
```

如果返回的是一个非object类型的值则不会造成这种情况

```javascript
let MyClass = function(){
    this.name = 'shintaro'
    return 'Faker'    
}
let obj = new MyClass();
console.log(obj.name) //output:'shintaro'
```

4. call/apply
   call/apply函数接受一个参数从而能够动态的改变传入函数运行时的this:

```javascript
var obj1 = {
    name:'sven',
    getName:function(){
        return this.name;    
    }
}

	var obj2 = {
	    name:'anne'
	}
	console.log(obj1.getName()) // output:sven
	console.log(obj1.getName.call(obj2))// output:anne
```
基本上通用的this情况就到此结束了，后续若有补充会继续更新。

> 创作不易，有帮助的朋友们麻烦点赞支持下


