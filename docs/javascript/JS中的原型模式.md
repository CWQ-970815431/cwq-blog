---
slug: JS中的原型模式
title: JS中的原型模式
author: 潜心专研的小陈同学
author_title: 前端工程师 / B站UP主
author_url: https://i2.hdslb.com/bfs/face/9d7aad773fd142dc3fc75886008d41d2ecedb3f1.jpg@160w_160h_1c_1s.webp
author_image_url: https://avatars.githubusercontent.com/u/71475868?s=40&u=8e47a668961f89a6389d9775cffdabddfda76e8c&v=4
description: 请输入描述
tags: [前端, React]
# activityId: 相关动态 ID
# bvid: 相关视频 ID（与 activityId 2选一）
# oid: oid
--- 


<!-- truncate -->


> 本文产出于《JavaScript设计模式与开发实践》中的第一章第四节，感兴趣的朋友可以自行查看

从设计模式的角度讲，原型模式是用于创建对象的一种模式，如果我们想要创建一个对象，一种方法是先指定它的类型，然后通过类来创建这个对象。原型模式选择了另外一种方式，我们不再关心对象的具体类型，而是找到一个对象，然后通过克隆来创建一个一模一样的对象。

如果使用原型模式，我们只需要调用负责克隆的方法，便能完成同样的功能。
原型模式的实现关键，是语言本身是否提供了clone方法。ECMAScript 5提供了Object.create方法，可以用来克隆对象。代码如下：

```javascript
var Plane = function(){
    this.blood = 100;
　this.attackLevel = 1;
　this.defenseLevel = 1;
};
var plane = new Plane();
console.log( plane ); 
//{blood: 100, attackLevel: 1, defenseLevel: 1,[[Prototype]]: Object}
plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 7;
console.log(plane);
//{blood:500, attackLevel:10, defenseLevel:7,[[Prototype]]: Object}
var clonePlane = Object.create( plane );
console.log( clonePlane );　
//{Prototype:Plane({blood:500, attackLevel:10, defenseLevel:7,[[Prototype]]: Object})}
```

如上代码，我们通过原型模式克隆出了一个与原对象Plane一样的对象plane并能够修改属性的对象。JavaScript是一门基于原型的面向对象的语言，区别Java等静态类型语言使用工厂方法模式来创建对象，原型模式在这里通过克隆对象的形式就能够创建对象。

### 原型模式

1. 所有的数据都是对象

   JavaScript在设计的时候，模仿Java引入了两套类型机制：基本类型和对象类型。基本类型包括undefined、number、boolean、string、function、object。从现在看来，这并不是一个好的想法。按照JavaScript设计者的本意，除了undefined之外，一切都应是对象。为了实现这一目标，number、boolean、string这几种基本类型数据也可以通过“包装类”的方式变成对象类型数据来处理。
   我们不能说在JavaScript中所有的数据都是对象，但可以说绝大部分数据都是对象。那么相信在JavaScript中也一定会有一个根对象存在，这些对象追根溯源都来源于这个根对象。
   事实上，JavaScript中的根对象是Object.prototype对象。Object.prototype对象是一个空的对象。我们在JavaScript遇到的每个对象，实际上都是从Object.prototype对象克隆而来的，Object.prototype对象就是它们的原型。比如下面的obj1对象和obj2对象：
   var obj1 = new Object();
   var obj2 = {};
   可以利用ECMAScript 5提供的Object.getPrototypeOf来查看这两个对象的原型：
   console.log( Object.getPrototypeOf( obj1 ) === Object.prototype );　// 输出：true
   console.log( Object.getPrototypeOf( obj2 ) === Object.prototype );　// 输出：true

2. 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它



   ```javascript
   //在JavaScript中，我们不需要关心克隆的细节，只需要显示地调用new 方法
   var obj1 = new Object()
   //此处'Object'可以为任意对象 例如：var Test = function(){this.a = 'a'} 
   //var test = new Test()
   //或者 显示的创建一个新的对象
   var obj2 = {}
   ```

3. 对象会记住它的原型

   如果请求可以在一个链条中依次往后传递，那么每个节点都必须知道它的下一个节点。同理，要完成JavaScript语言中的原型链查找机制，每个对象至少应该先记住它自己的原型。

   目前我们一直在讨论“对象的原型”，就JavaScript的真正实现来说，其实并不能说对象有原型，而只能说对象的构造器有原型。对于“对象把请求委托给它自己的原型”这句话，更好的说法是对象把请求委托给它的构造器的原型。那么对象如何把请求顺利地转交给它的构造器的原型呢？

   JavaScript给对象提供了一个名为__proto__的隐藏属性，某个对象的__proto__属性默认会指向它的构造器的原型对象，即{Constructor}.prototype。在一些浏览器中，__proto__被公开出来，我们可以在Chrome或者Firefox上用这段代码来验证：

   ```javascript
   var a = new Object();
   console.log ( a.__proto__=== Object.prototype );　// 输出：true
   //实际上，__proto__就是对象跟“对象构造器的原型”联系起来的纽带。正因为对象要通过__proto__属性来记住它的构造器的原型，所以我们用上一节的objectFactory函数来模拟用new创建对象时，需要手动给obj对象设置正确的__proto__指向。
   obj.__proto__ = Constructor.prototype;
   //通过这句代码，我们让obj.__proto__ 指向Person.prototype，而不是原来的Object.prototype。
   ```

4. 如果对象无法响应某个请求，它会把这个请求委托给它的原型

   当一个对象无法响应某个请求的时候，它会顺着原型链把请求传递下去，直到遇到一个可以处理该请求的对象为止。在JavaScript中，每个对象都是从Object.prototype对象克隆而来的，即每个对象都具有他所继承原型的属性。

   [外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-xXlWUC52-1644406108482)(C:\Users\97081\AppData\Roaming\Typora\typora-user-images\image-20220209190348517.png)]

   实际上，虽然JavaScript的对象最初都是由Object.prototype对象克隆而来的，但对象构造器的原型并不仅限于Object.prototype上，而是可以动态指向其他对象。这样一来，当对象a需要借用对象b的能力时，可以有选择性地把对象a的构造器的原型指向对象b，从而达到继承的效果。下面的代码是我们最常用的原型继承方式：

   ```javascript
   var obj = { name:'sven' };
   var A = function(){};
   A.prototype = obj;
   var a = new A();
   console.log( a.name );　// 输出：sven
   ```

   我们来看看执行这段代码的时候，引擎做了哪些事情。
   ●首先，尝试遍历对象a中的所有属性，但没有找到name这个属性。
   ●查找name属性的这个请求被委托给对象a的构造器的原型，它被a.__proto__ 记录着并且指向A.prototype，而A.prototype被设置为对象obj。
   ●在对象obj中找到了name属性，并返回它的值。
   当我们期望得到一个“类”继承自另外一个“类”的效果时，往往会用下面的代码来模拟实现：

   ```javascript
   var A = function(){};
   A.prototype = { name:'sven' };
   var B = function(){};
   B.prototype = new A();
   var b = new B();
   console.log( b.name );　// 输出：sven
   ```

   再看这段代码执行的时候，引擎做了什么事情。
   ●首先，尝试遍历对象b中的所有属性，但没有找到name这个属性。
   ●查找name属性的请求被委托给对象b的构造器的原型，它被b.__proto__ 记录着并且指向B.prototype，而B.prototype被设置为一个通过new A()创建出来的对象。

   ●在该对象中依然没有找到name属性，于是请求被继续委托给这个对象构造器的原型A.prototype。
   ●在A.prototype中找到了name属性，并返回它的值。
   和把B.prototype直接指向一个字面量对象相比，通过B.prototype = new A()形成的原型链比之前多了一层。但二者之间没有本质上的区别，都是将对象构造器的原型指向另外一个对象，继承总是发生在对象和对象之间。
   最后还要留意一点，原型链并不是无限长的。现在我们尝试访问对象a的address属性。而对象b和它构造器的原型上都没有address属性，那么这个请求会被最终传递到哪里呢？
   实际上，当请求达到A.prototype，并且在A.prototype中也没有找到address属性的时候，请求会被传递给A.prototype的构造器原型Object.prototype，显然Object.prototype中也没有address属性，但Object.prototype的原型是null，说明这时候原型链的后面已经没有别的节点了。所以该次请求就到此打住，a.address返回undefined。

   ```javascript
   a.address　　// 输出：undefined
   ```



