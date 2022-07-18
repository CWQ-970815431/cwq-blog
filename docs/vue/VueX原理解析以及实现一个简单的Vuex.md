---
slug: VueX原理解析以及实现一个简单的Vuex
title: VueX原理解析以及实现一个简单的Vuex
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

前端以前是没有状态管理的，直到Fackbook提出一个叫Flux的概念，才有了状态管理。

以前前端是通过MVC模式管理代码，但后来我们使用例如Vue、React、Angular这类通过声明式开发的框架，发现状态很难管理，容易出现状态被任意修改。当应用越来越大，这种不确定性会导致系统不稳定，而且定位bug也变得困难。

## 单向数据流

Flux，VueX都是一种关于单向数据流的思想开发的状态管理模式，这个模式下包含以下几个部分：

- **状态**，驱动应用的数据源；
- **视图**，以声明方式将**状态**映射到视图；
- **操作**，响应在**视图**上的用户输入导致的状态变化。

以下是一个表示“单向数据流”理念的简单示意：

[![XoZwy4.png](https://img-blog.csdnimg.cn/img_convert/ef08d32773a87f9ab5bb961376ce0b0c.png)](https://imgtu.com/i/XoZwy4)

在这个单向数据流模型中，使用一个上传数据流和一个下传数据流进行双向数据通信，两个数据流之间相互独立。单向数据流指只能从一个方向来修改状态，比如当State发生改变时，会推动View显示改变；而View改变时，会推动事件Action从而使得State也得到更新。

## VueX

VueX是一个基于单向数据流、专门为Vue.js设计的一个全局状态管理库，如下图模型一样每个部分的职能明确，

- State:负责存放数据，供Vue组件获取。
- Mutations:负责生成状态快照，修改State中的属性。
- Action:负责异步事件，处理完毕后递交给Mutations生成状态快照。

[![Xo8yW9.png](https://img-blog.csdnimg.cn/img_convert/92cd8cb6ab4f4824014bd9f2cee7ef1f.png)](https://imgtu.com/i/Xo8yW9)

### 实现一个VueX

实现一个案例：显示一个按钮以及一个数字，记录并显示点击按钮的次数。

#### 对象共享

```html
<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <counter></counter>
  <counter></counter>
  <counter></counter>
  <button @click="inc">increment</button>
</div>

<script>
// create a counter component (that doesn't take any props)
// all instances of it should share the same count state
// and a button that increments all counters at the same time

const state = {
  count: 0
}

const Counter = {
  // Convert state into reactive object
  data () {
    return state
  },
  render (h) {
    // Proxy the object
    return h('div', this.count)
  }
}

new Vue({
  el: '#app',
  components: {
    Counter
  },
  methods: {
    inc () {
      state.count++
    }
  }
})
</script>

```

如上代码中，

1. 我们创建了一个State对象，在子组件Counter以及跟组件app中都引入并使用了它。
2. 我们在子组件中通过data函数返回这个State，使得Vue会调用观察对象转换它使它得到响应性能力。
3. 我们在子组件中都返回的是一个对象，State。这虽然有驳子组件中data应用函数返回一个新的对象的理论，但在这里我们需要的是公用一个对象。

#### 实例共享

可以看出来以上我们通过共用同一个对象达到了VueX部分的效果，但这并不是VueX实现的方式，接下来我们将通过实例分享的方式完成这部分同样的功能。

```html
<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <counter></counter>
  <counter></counter>
  <counter></counter>
  <button @click="inc">increment</button>
</div>

<script>
// copy and modify the first exercise to use a Vue instance as
// a shared store instead.
const state = new Vue({
  data: {
    count: 0
  },
  methods: {
    inc () {
      this.count++
    }
  }
})

const Counter = {
  render: h => h('div', state.count)
}

new Vue({
  el: '#app',
  components: {
    Counter
  },
  methods: {
    inc () {
      state.inc()
    }
  }
})
</script>

```

如上代码中，

1. 我们通过创建一个实例化Vue对象并将他赋名为State。
    1. 这个State由于是一个Vue实例化对象，他所具备的data里的属性也都具备了响应式功能。
    2. 这个State具有一个方法，来改变State中的值，这就类似于我们的Mutations。
2. 同样在子组件和父组件中都引用了这个State对象，并运用了其中的属性。

通过实例共享，我们将改变State中属性的方法也写在了State对象中，这使得它看上去更接近VueX了。

### 最终实现

```html
<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <counter></counter>
  <counter></counter>
  <counter></counter>
  <button @click="inc">increment</button>
</div>

<script>
function createStore ({ state, mutations }) {
  return new Vue({
    data: {
      state
    },
    methods: {
      commit (mutation) {
        if (!mutations.hasOwnProperty(mutation)) {
          throw new Error('Unknown mutation')
        }
        mutations[mutation](state)
      }
    }
  })
}

const store = createStore({
  state: { count: 0 },
  mutations: {
    inc (state) {
      state.count++
    }
  }
})

const Counter = {
  render (h) {
    return h('div', store.state.count)
  }
}

new Vue({
  el: '#app',
  components: { Counter },
  methods: {
    inc () {
      store.commit('inc')
    }
  }
})
</script>

```

如上代码中，

1. 我们创建了一个类似VueX中的createStore 方法
    1. 接受一个对象，属性为我们所需用的State和Mutations
    2. 返回值为一个Vue对象实例，提供了state和commit俩个属性供使用
2. 我们调用了这个createStore方法，并创建了我们所需的State以及Mutations
3. 引入各组件完成了状态管理。

## 总结

- VueX的本质是运用了Vue实例中返回属性具有响应式的特点
- 待补充