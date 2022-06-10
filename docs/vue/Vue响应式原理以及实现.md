---
slug: Vue响应式原理以及实现
title: Vue响应式原理以及实现
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

> 本文产出于学习尤大解析源码的教程之时。

## 前言

**什么是响应式？**

- View(视图) & State(数据)之间的相互响应
    - 视图中的交互事件使得数据改变时（如：input输入/鼠标点入等事件），使得视图发生变化时，State应随着View发生改变
    - State中的值发生变化时，对应涉及的视图也应该重新渲染

我们不妨来手动实现一个简易的响应式。

首先假设我们有个需求，b永远等于a的十倍，如果使用命令式编程，可以很简单实现，可以像下面这样实现，但是当我们把a设置成4时，b还是等于30

```javascript
let a = 3;
let b = a * 10；
console.log(b) // 30
a = 4
console.log(b) // 30 
```

为了让b等于a的10倍，那我们需要重新设置b的值，像下面代码

```javascript
let a = 3;
let b = a * 10；
console.log(b) // 30
a = 4;
b = a * 10; // 新增代码
console.log(b) // 40 
```

这解决了我们的需求，但是我们需要在每次给a赋值时，也得手动得让b也跟随着赋值一次。假设我们有一个神奇函数叫`onAchange`，它接收一个函数并且当a改变时自动被执行，这时候可以对b重新赋值，那上面的问题就解决了，那这个函数如何实现是问题的关键。

```javascript
onAchange(() => {
  b = a * 10
})
```

再举个更贴合web开发的例子，下面代码同样有一个神奇函数`onStateChange`，它会在`state`改变的时候自动运行，那我们只要在函数中编写dom操作的代码，就可以实现dom的自动更新了

```html
// DOM元素
<span class="cell b1"></span>

// 神奇函数，当state值改变会自动重新运行
onStateChange(() => {
  document.querySelector('.cell.b1').textContent = state.a * 10
})
```

我们再进一步抽象，把dom的操作使用渲染引擎替换，但是我们不去研究渲染引擎的实现，只是简单的认为它会自动解析模版代码与数据关联即可，那代码就会变成下面这样。

```html
// DOM元素
<span class="cell b1">
	{{ state.a * 10 }}
</span>

// 神奇函数，当state值改变会自动重新运行
onStateChange(() => {
  view = render(state)
})
```

现在解决问题的核心就是如何实现onStateChange这个方法了，看到下面代码就是它具体的实现，首先定一个外部`update`变量用于记录调用`onStateChanged`时传入的函数，如果需要改变state就必须调用`setState`方法，我们只需要在`setState`方法内部重新调用之前保存的`update`方法，即可达成自动更新。

```js
let update;
const onStateChanged = _update => {
  // 把传入的_update函数保存给外部变量
  update = _update;
}

// 用户更新数据必须调用setState函数,函数内把新的state更新并调用update方法
const setState = newState => {
  state = newState;
  update();
}
```

调用例子，如果你有react开发经验，会发现这和react修改数据调用方法是一样的

```js
onStateChanged(() => {
  view = render(state) // 这里抽象的视图渲染伪代码，可以简单的理解为在更新视图
})

setState({ a: 5 })
```

而在angular中，我们是不需要调用setState方法来更新数据，可以直接`state.a = 5`对变量赋值，即可触发视图更新。angular使用脏值检测的方式，拦截你的事件然后判断值是否改变。

```js
onStateChanged(() => {
  view = render(state) // 这里抽象的视图渲染伪代码，可以简单的理解为在更新视图
})

state.a = 5 // 在angualr中，直接赋值即可触发视图更新
```

但是在Vue中实现方法不太一样，通过`Object.defineProperty`修改对象属性的`getter`和`setter`让对象具有响应性，这种基于依赖跟踪的方式其实就是vue.js、konckout.js等框架实现的原理。

## `Object.defineProperty`

### 属性的操作

在 JavaScript 中，给对象增加一个属性是非常简单的，直接调用属性并赋值即可。

```javascript
const obj = {};
obj.name = 'Tom';
console.log(obj);
/**
 * 输出：
 * {name: 'Tom'}
 */
```

通过这种方式添加的属性，可以随意操作：

- 可修改
- 可枚举
- 可删除

**可修改：**

```diff
  // 可修改
+ obj.name = 'Jim';
+ console.log(obj.name);
  /**
  * 输出：
  * 'Jim'
  */
```

**可枚举：**

```diff
  // 可枚举
+ for (let key in obj) {
+   console.log(`${key} : ${obj[key]}`);
+ }
  /**
  * 输出：
  * name : Jim
  */
```

**可删除：**

```diff
  // 可删除
+ delete obj.name;
+ console.log(obj);
  /**
  * 输出：
  * {}
  */
```

如果想通过 `Object.defineProperty` 实现上面的功能，可以使用下面的代码：

```diff
- obj.name = 'Tom';
+ Object.defineProperty(obj, 'name', {
+   value: 'Tom',
+   writable: true,
+   enumerable: true,
+   configurable: true,
+ });
```

### 函数签名

在对 `Object.defineProperty` 深入学习之前，先对这个方法签名有一个认识：

```javascript
Object.defineProperty(obj, prop, descriptor);
```

从函数签名中可以看出，`defineProperty` 是 `Object` 上的一个静态方法，可以传递三个参数：

- `obj` 要定义属性的对象
- `prop` 要定义或修改的属性名称
- `descriptor` 要定义或修改属性的描述符

返回值是被传递给函数的对象，也就是第一个参数 `obj`。

描述符可以有以下几个可选值：

- `configurable`
- `enumerable`
- `value`
- `writable`
- `get`
- `set`

### 描述符

通过 `Object.defineProperty` 来为对象定义一个属性。

```javascript
const obj = {};
Object.defineProperty(obj, 'name', {});
console.log(obj);
/**
 * 输出：
 * {name: undefined}
 */
```

从输出的结果可以看出，在对象 `obj` 上增加一个属性 `name`，但是它的值是 `undefined`。

**value**

如果想给属性赋值，可以使用描述符中的 `value` 属性。

```diff
- Object.defineProperty(obj, 'name', {});
+ Object.defineProperty(obj, 'name', {
+   value: 'Tom',
+ });
  /**
  * 输出：
  * {name: 'Tom'}
  */
```

**writable**

一般情况下，修改一个对象中的属性值，可以使用 `obj.name = 'Jim'` 的形式。

```diff
+ obj.name = 'Jim';
+ console.log(obj);
  /**
  * 输出：
  * {name: 'Tom'}
  */
```

从输出结果可以看出，并没有修改成功。如果想修改属性值，可以把描述符中的 `writable` 设置为 `true`。

```diff
  Object.defineProperty(obj, 'name', {
    value: 'Tom',
+   writable: true,
  });
```

**enumerable**

枚举对象的属性，可以使用 `for...in`。

```diff
+ for (let key in obj) {
+   console.log(`${key} : ${obj[key]}`);
+ }
```

比较奇怪的是，执行上面的代码没有输出任何信息。

如果想正常枚举对象的属性，可以将描述符中的 `enumerable` 值设置为 `true`。

```diff
  Object.defineProperty(obj, 'name', {
    value: 'Tom',
    writable: true,
+   enumerable: true,
  });
```

**configurable**

当这个属性不需要时，可以通过 `delete` 来删除。

```diff
+ delete obj.name;
+ console.log(obj);
  /**
  * 输出：
  * {name: 'Jim'}
  */
```

从输出结果可以看出，并没有达到预期的效果。如果想从对象上正常删除属性，可以将描述符中的 `configurable` 设置为 `true`。

```diff
  Object.defineProperty(obj, 'name', {
    value: 'Tom',
    writable: true,
    enumerable: true,
+   configurable: true,
  });
```

**get**

如果需要获取对象的值，可以使用描述符中的 `get`。

```javascript
const obj = {};
let _tmpName = 'Tom';
Object.defineProperty(obj, 'name', {
  get() {
    return _tmpName;
  },
});
console.log(obj.name);
/**
 * 输出：
 * {name: 'Tom'}
 */
```

**set**

如果需要设置对象的值，可以使用描述符中的 `set`，它需要传递一个参数，就是修改后的值。

```diff
  Object.defineProperty(obj, 'name', {
    get() {
      return _tmpName;
    },
+   set(newVal) {
+     _tmpName = newVal;
+   },
  });

+ obj.name = 'Jim';
+ console.log(obj.name);
  /**
  * 输出：
  * {name: 'Jim'}
  */
```

### 注意事项

在操作符对象中，如果存在了 `value` 或 `writable` 中的任意一个或多个，就不能存在 `get` 或 `set` 了。

```javascript
const obj = {};
Object.defineProperty(obj, 'name', {
  value: 1,
  get() {
    return 2;
  },
});
```

报错信息如下：

```crmsh
Uncaught TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute
```

为了方便后期查阅，总结一下互斥的情况：

- `value` 和 `get` 互斥
- `value` 和 `set` 互斥
- `value` 和 `set` + `get` 互斥
- `writable` 和 `get` 互斥
- `writable` 和 `set` 互斥
- `writable` 和 `set` + `get` 互斥

### 使用场景

`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。该方法允许精确地添加或修改对象的属性。

这个方法是 JavaScript 的一个比较底层的方法，主要用于在对象上添加或修改对象的属性。

## 重写getter&setter

我们试着去重写下Object.defineProperty中的get 和set方法，**实现一个函数cover，接收一个对象，使对象中的值在赋值和取值的时候都打印其值**

***example***

```javascript
const obj = { foo: 123 }
convert(obj) 
obj.foo // 需要打印: 'getting key "foo": 123'
obj.foo = 234 // 需要打印: 'setting key "foo" to 234'
obj.foo // 需要打印: 'getting key "foo": 234'
```

***covert***

```javascript
function isObject(obj){
  return typeof obj === 'object' &&
      !Array.isArray(obj) &&
      obj !== undefined &&
      obj !== null
}

function covert(obj){
  if(!isObject(obj)){
      throw new Error('参数不为对象')
  }
  Object.keys(obj).forEach((key)=>{
    let tempValue = obj[key]
    Object.defineProperties(obj,key,{
      get(){
        console.log(`获取属性${key}，值为${tempValue}`);
        return tempValue
      },
      set(newValue){
        tempValue = newValue
        console.log(`设置属性${key}，值为${tempValue}`);
      }
    })
  })
}
```

显然上面的**cover**函数达到了我们对重写的需求，但依旧没实现响应式。想一想我们还差什么才能达成响应式？

1. 在创建属性时设置一个与属性相关的依赖监听
2. 在赋值属性时调动这个依赖，并在页面上重新渲染

以上的条件我们可抽分为**依赖跟踪（订阅发布模式）**

## 依赖跟踪（订阅发布模式）

需要实现一个依赖跟踪类`Dep`，类里有一个叫`depend`方法，该方法用于收集依赖项；另外还有一个`notify`方法，该方法用于触发依赖项的执行，也就是说只要在之前使用`dep`方法收集的依赖项，当调用`notfiy`方法时会被触发执行。

下面是`Dep`类期望达到的效果，调用`dep.depend`方法收集收集依赖，当调用`dep.notify`方法，控制台会再次输出`updated`语句

```js
const dep = new Dep()

autorun(() => {
  dep.depend()
  console.log('updated')
})
// 打印: "updated"

dep.notify()
// 打印: "updated"
```

`autorun`函数是接收一个函数，这个函数帮助我们创建一个响应区，当代码放在这个响应区内，就可以通过dep.depend方法注册依赖项

最终实现的Dep类代码如下：

```js
window.Dep = class Dep {
  constructor () {
    // 订阅任务队列，方式有相同的任务，用Set数据结构简单处理
    this.subscribers = new Set()
  }
	// 用于注册依赖项
  depend () {
    if (activeUpdate) {
      this.subscribers.add(activeUpdate)
    }
  }
	// 用于发布消息，触发依赖项重新执行
  notify () {
    this.subscribers.forEach(sub => sub())
  }
}

let activeUpdate = null

function autorun (update) {
  const wrappedUpdate = () => {
    activeUpdate = wrappedUpdate
    update()
    activeUpdate = null
  }
  wrappedUpdate()
}
```

## 实现迷你观察者

结合前面的重写getter&setter以及依赖跟踪我们就能得到一个完整的观察者模式了

```
function isObject (obj) {
    return typeof obj === 'object'
      && !Array.isArray(obj)
      && obj !== null
      && obj !== undefined
}

function observe (obj) {
  if (!isObject(obj)) {
    throw new TypeError()
  }

  Object.keys(obj).forEach(key => {
    let internalValue = obj[key]
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      get () {
        dep.depend()
        return internalValue
      },
      set (newValue) {
        const isChanged = internalValue !== newValue
        if (isChanged) {
          internalValue = newValue
          dep.notify()
        }
      }
    })
  })
}

window.Dep = class Dep {
  constructor () {
    this.subscribers = new Set()
  }

  depend () {
    if (activeUpdate) {
      // register the current active update as a subscriber
      this.subscribers.add(activeUpdate)
    }
  }

  notify () {
    // run all subscriber functions
    this.subscribers.forEach(subscriber => subscriber())
  }
}

let activeUpdate

function autorun (update) {
  function wrappedUpdate () {
    activeUpdate = wrappedUpdate
    update()
    activeUpdate = null
  }
  wrappedUpdate()
}
```

## 总结

Vue中的响应式是通过重写Object.defineProperty中的set和get方法。在get中注入依赖，set中提醒依赖更新。

