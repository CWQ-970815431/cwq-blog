---
slug: Vue渲染函数原理以及实践
title: Vue渲染函数原理以及实践
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
> 本文产出于学习Vue源码的教程之时。

## 前言

**Vue是如何渲染页面的**



[![X23ATx.png](https://s1.ax1x.com/2022/06/12/X23ATx.png)](https://imgtu.com/i/X23ATx)

**Vue编译第一阶段：**

在Vue中，渲染系统是组成响应系统的另外一半，如果使用Vue CLI构建项目，会用到webpack和vue-loader，实际上vue-loader会在构建阶段实现预编译，把模版代码编译为浏览器可直接解析的DOM代码。另外，Vue还提供了用于编译的渲染函数，它类似angular的ALT编译模式，那应用就可以运行未编译版本。

两种编译模式，一种会把编译器打包进去，一个直接把代码预先编译，包含编译器版本经过gzip压缩大概30KB，不包含编译器版本大概20KB，所以预先编译会更好。

所以Vue的templates实际上是通过渲染函数渲染出来的，参照上图的第一步骤，vue把模板编译成渲染函数。但如果你把模版直接传入Vue实例那Vue会执行完整的编译，把传入的template编译为浏览器可运行的DOM。

**Vue编译第二阶段：**

经过第一阶段编译为render函数后，render函数实际上是返回虚拟DOM，接着Vue基于虚拟DOM生成真实DOM。

**Vue编译第三阶段：**

再将生成的虚拟结点渲染/更新到真实结点（DOM）中。

**虚拟DOM更新机制**：

回顾之前讲的

[`autorun`]: https://juejin.cn/post/7107445451556651015

函数，其实我们可以把生成虚拟DOM的代码放在`autorun`函数里面，因为渲染函数与所有data属性有依赖关系，当属性发生变化那就触发`autorun`函数然后重新生成新的虚拟DOM，新的虚拟DOM和旧的虚拟DOM进行比较，更新差异的节点再生成真实DOM完成视图更新。

## Render函数

**Render 函数**即渲染函数，它是个函数，接受一个参数为createElement的函数，返回值为VNode（即：虚拟节点），也就是我们要渲染的节点。

**createElement**

1.  createElement 是 render 函数 的参数，它本身也是个函数，并且有三个参数。

2.  createElement 函数的返回值是 VNode（即：虚拟节点）。
3.  createElement 函数的参数（三个）
    1. 一个类型为：{String | Object | Function}的必须参数。可以为 HTML 标签字符串，组件选项对象，或者解析上述任何一种的一个 async 异步函数。
    2. 一个类型为：{Object}的可选参数。具体为一个包含模板相关属性的数据对象你可以在 template 中使用这些特性。
    3. 一个类型为：{String | Array}的可选参数。子虚拟节点 (VNodes)，由 createElement() 构建而成，也可以使用字符串来生成“文本虚拟节点”。

```javascript
 /**
  * render: 渲染函数
  * 参数: createElement
  * 参数类型: Function
 */
 render: function (createElement) {
   let _this = this['$options'].parent	// 我这个是在 .vue 文件的 components 中写的，这样写才能访问this
   let _header = _this.$slots.header   	// $slots: vue中所有分发插槽，不具名的都在default里
 
   /**
    * createElement 本身也是一个函数，它有三个参数
    * 返回值: VNode，即虚拟节点
    * 1. 一个 HTML 标签字符串，组件选项对象，或者解析上述任何一种的一个 async 异步函数。必需参数。{String | Object | Function} - 就是你要渲染的最外层标签
    * 2. 一个包含模板相关属性的数据对象你可以在 template 中使用这些特性。可选参数。{Object} - 1中的标签的属性
    * 3. 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，也可以使用字符串来生成“文本虚拟节点”。可选参数。{String | Array} - 1的子节点，可以用 createElement() 创建，文本节点直接写就可以
    */
   return createElement(       
     // 1. 要渲染的标签名称：第一个参数【必需】      
     'div',   
     // 2. 1中渲染的标签的属性，详情查看文档：第二个参数【可选】
     {
       style: {
         color: '#333',
         border: '1px solid #ccc'
       }
     },
     // 3. 1中渲染的标签的子元素数组：第三个参数【可选】
     [
       'text',   // 文本节点直接写就可以
       _this.$slots.default,  // 所有不具名插槽，是个数组
       createElement('div', _header)   // createElement()创建的VNodes
     ]
   )
 }
```

## 虚拟DOM

[![X234BR.png](https://s1.ax1x.com/2022/06/12/X234BR.png)](https://imgtu.com/i/X234BR)

虚拟DOM，顾名思义他是一个非真实DOM节点的JavaScript对象。

在Vue中的虚拟DOM会在每个实例通过this.$createElement返回一个虚拟节点，这个虚拟节点也表示一个div但他是一个纯javascript对象，他和真实DOM差异是非常大的。看到上图虚拟DOM它除了包含当前节点名字和属性，还有children表示节点的子元素，这就构成了一个虚拟DOM树。

**虚拟DOM和真实的DOM的差异**：

1、 资源消耗问题

使用javascript操作真实DOM是非常消耗资源的，虽然很多浏览器做了优化但是效果不大。你看到虚拟DOM是一个纯javascript对象。假设你有1000个节点，那会相应创建1000个节点，那也是非常节省资源的，但是如果创建1000个DOM节点就不同了。

2、执行效率问题

如果你要修改一个真实DOM，一般调用`innerHTML`方法，那浏览器会把旧的节点移除再添加新的节点，但是在虚拟DOM中，只需要修改一个对象的属性，再把虚拟DOM渲染到真实DOM上。很多人会误解虚拟DOM比真实DOM速度快，其实虚拟DOM只是把DOM变更的逻辑提取出来，使用javascript计算差异，减少了操作真实DOM的次数，只在最后一次才操作真实DOM，所以如果你的应用有复杂的DOM变更操作，虚拟DOM会比较快。

3、虚拟DOM还有其他好处

其实虚拟DOM还可以应用在其他地方，因为他们只是抽象节点，可以把它编译成其他平台，例如android、ios。市面上利用形同架构模式的应用有React Native，Weeks，Native script，就是利用虚拟DOM的特点实现的。

## template和jsx对比

俩者的本质都是用来声明DOM与状态的关系。

**模版的优势**：模版是一种更静态更具有约束的表现形态，它可以避免发明新语法，任何可以解析HTML的引擎都可以使用它，迁移成本更低；另外最重要的是静态模版可以在编译进行比较多的优化，而动态语言就没法实现了。

**jsx的优势**：更灵活，任何的js代码都可以放在jsx中执行实现你想要的效果，但是也由于他的灵活性导致在编译阶段优化比较困难，只能通过开发者自己优化。

Vue吸收了两者的优点，提供了两种渲染模式，Vue把template作为默认的编译模式，如果你需要构建更灵活的应用，完全可以使用render function实现。

##  Render Function API

```javascript
export deafult {
    render(h){
        return h('div',{},[...])
    }
}
```

`render`函数接收一个参数`h`， `h`只是一种约定的简写表示超脚本（HyperScript），他没有什么特殊意义，只是就像超文本我们叫HTML一样，只是方便书写的表示形式而已。

`h`函数接受三个参数，第一个是元素类型；第二是参数对象例如表示元素的attr属性，DOM属性之类的；第三个属性表示一些子节点，你可以调用h函数生成更多子节点。

```javascript
h('div','only text')
h('div',{class:'foo'},'some text')
h('div',{...},[
         'only text',
         h('span','bar')
         ])
```

如上，h函数中的第二个参数是可以省略的，第三参数很灵活可以是数组或者单纯的文本。

例一表示创建一个只包含`some text`文本的div；例二表示创建一个具有`class=foo`的div；例三表示包含一个子节点span。

## 动态渲染标签

我需要编写一个组件，组件根据`tags`属性在页面上输入相应的HTML标签，如果使用模板技术实现，会让代码变得臃肿，需要通过`if`语句判断不同标签。所以这里可以利用渲染函数来实现，下面是具体实现代码。

```html
<div id="demo_4_5">
    <example :tags="['h1', 'h2', 'h3']"></example>
</div>
Vue.component('example', {
    props: ['tags'],
    render(h) {
		// 第二参数是可选参数，可接受vnodes类型的数组，数组可以是数字和字符串
        return h('div', this.tags.map((tag, i) => h(tag, i)))
    }
})
new Vue({ el: '#demo_4_5' })
```

#### 函数组件和状态组件

函数组件就是不包含state和props的组件，就像它的名字一样，你可以理解为他就是一个函数，在Vue中声明一个函数组件代码如下：

```js
const foo = {
	functional: true,
    render: h => h('div', 'foo')
}
```

函数组件特点：

1. 组件不支持实例化。
2. 优化更优，因为在Vue中它的渲染函数比父级组件更早被调用，但是他并不会占用很多资源，因为它没有保存数据和属性，所以它常用于优化一个有很多节点的组件。
3. 容易扩展，如果你的组件只是用来接收 prop然后显示数据，或者一个没有状态的按钮，建议使用函数组件。
4. 函数组件没有this，获取prop可以通过render函数的第二参数得到`render(h, context)`

**使用函数组件渲染标签**：

```js
    Vue.component('example', {
        functional: true, // 声明是函数组件
        // 因为函数组件没有this,可以通过render第二参数获取相关信息
        render(h, { props: { tags } }) {
            // context.slots() 通过slots方法获取子节点
            // context.children 获取子组件
            // context.parent 父组件，因为函数组件实挂载到根节点上，也就是<div id="app"></div>
            // context.props 组件属性，这里得到tags属性
            // return h('div', this.tags.map((tag, i) => h(tag, i)))
            // 通过函数组件实现标签动态渲染
            return h('div', tags.map((tag, i) => h(tag, i)))
        }
    })
```

## 动态渲染组件

渲染函数除了可以渲染普通标签外，还可以渲染组件，下面代码有`Foo`和`Bar`组件，点击`toggle`按钮的时候，切换两组件的显示状态。

```html
<div id="demo_4_6">
    <example :ok="ok"></example>
    <button @click="ok = !ok">toggle</button>
</div>
const Foo = {
    render(h) {
        return h('div', 'foo')
    }
}

const Bar = {
    render(h) {
        return h('div', 'bar')
    }
}
Vue.component('example', {
    props: ['ok'],
    render(h) {
        return h(this.ok ? Foo : Bar)
    }
})
new Vue({ el: '#demo_4_6', data: { ok: true } })
```

## 整合渲染函数和响应系统

[![X2I7Is.png](https://s1.ax1x.com/2022/06/13/X2I7Is.png)](https://imgtu.com/i/X2I7Is)

上图是Vue的响应性系统和渲染系统的运行流程，可以看到每个组件有自己的渲染函数，这个渲染函数实际上是运行在我们之前封装的`autorun`函数中的，组件开始渲染时会把属性收集到依赖项中，当调用属性的setter方法，会触发`watcher`执行重新渲染，因为渲染函数放在`autorun`函数中，所以每当data数据发生变化，就会重新渲染。

每个组件都有自己独立的循环渲染系统，组件只负责自己的依赖项，这一特性对于你拥有大型组件树时是一个优势，你的数据可以在任何地方改变，因为系统知道数据与组件的对应关系，不会造成过度渲染问题，这一架构优势可以让我们摆脱一些优化工作。

## 总结

- Vue渲染页面步骤
    - 将模板传递给渲染函数
    - 渲染函数返回虚拟DOM
    - 根据虚拟DOM生成/更新真实DOM
- Vue中也可以使用无状态组件，在只做单一功能的组件时可考虑使用