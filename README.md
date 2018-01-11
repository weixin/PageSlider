# PageSlider -- 移动端滑屏组件

`PageSlider` 是一个用于移动端滑屏组件，支持上下滑动，左右滑动，禁止滑动等功能，同时支持 AMD 模块化加载方式

## 使用方法

**HTML：**
```html
<div class="page-wrap">
    <div class="page">
        <div class="title">page one</div>
        <div class="subtitle">page one subtitle</div>
        <div class="arrow"></div>
    </div>

    <div class="page">
        <div class="title">page two</div>
        <div class="subtitle">page two subtitle</div>
        <div class="arrow"></div>
    </div>
    <div class="page">
        <div class="title">page three</div>
        <div class="subtitle">page three subtitle</div>
        <div class="arrow"></div>
    </div>
    <div class="page">
        <div class="title">page four</div>
        <div class="subtitle">page four subtitle</div>
    </div>
</div>
```

**CSS**
```css
html, body, .page-wrap {
    width: 100%;
    height: 100%;
}

.page {
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
}
```
>由于实现原理的问题，故上面的样式设置是必需的。

**JavaScript**
```javascript
new PageSlider({
    pages: $('.page-wrap .page')
});
```

## 参数

```javascript
new PageSlider({
    pages: $('.page-wrap .page'),   //必需，需要切换的所有屏
    direction: 'vertical',          //可选，vertical 或 v 为上下滑动，horizontal 或 h 为左右滑动，默认为 vertical
    currentClass: 'current',        //可选, 当前屏的class (方便实现内容的进场动画)，默认值为 'current'
    gestureFollowing: 'false',      //可选，如果为 true，则开启手势跟随模式
    hasDot: 'false',                //可选，生成标识点结构，样式自己控制
    preventDefault: true,           //可选，是否阻止默认行为
    rememberLastVisited: true,      //可选，记住上一次访问结束后的索引值，可用于实现页面返回后是否回到上次访问的页面
    animationPlayOnce: false,       //可选，切换页面时，动画只执行一次
    dev: false,                     //可选，开发模式，传入具体页面索引值
    oninit: function () {},         //可选，初始化完成时的回调
    onbeforechange: function () {}, //可选，开始切换前的回调
    onchange: function () {},       //可选，每一屏切换完成时的回调
    onSwipeUp: function () {},      //可选，swipeUp 回调
    onSwipeDown: function () {},    //可选，swipeDown 回调
    onSwipeLeft: function () {},    //可选，swipeLeft 回调
    onSwipeRight: function () {}    //可选，swipeRight 回调
});
```

## 接口

- `prev()` 上一屏
- `next()` 下一屏
- `moveTo(n)` 跳转到第 n 屏，有缓动效果
- `moveTo(n, true)` 直接跳到第 n 屏，没有缓动效果

## 功能点

### 1. 支持 dom 绑定动画

通常，页面上的元素动画都是通过样式来控制，如下：
```css
.current .dom{
    -webkit-animation: slideToTop 1s 0.5s ease both;
}
```

PageSlider 支持将动画直接绑定在具体 dom 元素上，如下：
```html
<div class="title" data-animation='{"name": "slideToTop", "duration": 800, "timing-function": "ease", "fill-mode": "both"}'>
    page two
</div>
<div class="subtitle" data-animation='{"name": "slideToTop", "duration": 800, "delay": 300,  "timing-function": "ease", "fill-mode": "both"}'>
    page two subtitle
</div>
```

### 2. 手势跟随

PageSlider 最初的滑动较简单，直接判断手势进行翻屏，而有朋友喜欢在 touchmove 时能拉动页面，看到下一屏，此为朋友说的 `手势跟随`。其也 因为没有此功能而放弃使用 PageSlider，故新版做了支持，只需要如右设置即可： `gestureFollowing: true`。

### 3. 锁定禁止滑动

随着业务的发展，有时候需要锁定当前屏，不响应用户的滑动事件，需要点击某按钮或完成某些操作后再自动滑屏。本次更新提供了以下方法进行锁定：

```html
<div class="page" data-lock-next="true" data-lock-prev="true"></div>
```

`data-lock-next`： 禁止往后滑
`data-lock-prev`： 禁止往前滑

### 4. 记住页面索引

有时候，当页面跳走返回时，希望能直接返回到上次跳走的页面，而不希望重头再来，只需如右设置：`rememberLastVisited: true`，即会保存当前页面索引到 localstorage，当返回时即可方便操作，如下：

```javascript
new PageSlider({
    pages: $('.page-wrap .page'),
    rememberLastVisited: true,
    oninit: function(){
        //返回时，需告诉我们此时为返回动作而不是刷新，可以通过 hash 告诉我们
        //PageSlider 所有回调接口 this 指向 PageSlider，方便进行操作
        if(返回为 true){
            this.moveTo(this.lastVisitedIndex, true);
        }
    }
});
```

### 5. dev 模式
此为个人习惯，我在开发时，假设在写第二屏动画时，我会将第一屏隐藏掉，以方便每次刷新都直接在第二屏，而不需要去滑动。但当我在写第 5 屏动画时，我需要手动隐藏 n-1 屏。。。。然后此时领导过来说，XXX，来，让我看一下你做好的效果，然后我又要手动把之前隐藏的显示，十几秒后看完我继续开发又要继续隐藏。。。。。人生如此短暂，受不鸟呐。所以，只需要如下操作，即可愉快的开发：


```javascript
new PageSlider({
    pages: $('.page-wrap .page'),
    dev: 0 //0|1|2|3|...
});
```

### 6. 翻页时，页面元素动画只执行一次
有时候，会有产品的需求希望在页面往回翻时，就不再执行进场等动画了，执行过一次就够了，只需要设置 `animationPlayOnce: true` 即可。

```javascript
new PageSlider({
    pages: $('.page-wrap .page'),
    animationPlayOnce: true
});
```

### 7. 内容超出一屏先滚完再翻页
这是一个较少见的需求，要求每一屏按固定高度设计，当在小屏幕下，滑动页面时，不是直接翻页，而是原生的滚动，当滚动到底部时，再滑动页面才触发翻页，具体效果可先扫描后面的相应二维码体验，具体示例代码如下：

```html
<div class="page" style="-webkit-overflow-scrolling: touch;">
    <div class="page__inner" style="position: relative; height: 800px;">
        <div class="title">page two</div>
        <div class="subtitle">page two subtitle</div>
        <div style="position: absolute; left: 20px; bottom: 10%">long page</div>
        <div class="arrow"></div>
    </div>
</div>
```
在 `.page` 元素上设置 `-webkit-overflow-scrolling: touch;` 可触发原生的平滑滚动，让滚动效果体验更舒服，不设置也可以，但效果相差很大; 内层需设置一个大于屏幕的高度值，才会触发此效果，如果不设置，默认是遍历直接的子元素高度和来跟屏幕高度作比较判断是否是长内容页。


### 8. 第一次向下/向上滑时不触发翻页，第二次时再翻页
有时候，会遇到这样的需求，页面有隐藏的一些内容，但需要在第一次向下滑的时候才显示出来，这时要禁止翻页，然后交互完成后再滑才是翻页，这里提供了个示例以方便用户参考，具体查看下面 example。

## example

### 1. default

<a href="http://weixin.github.io/PageSlider/example/html/default.html" target="_blank"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|0&chl=http://weixin.github.io/PageSlider/example/html/default.html" width="200" height="200"></a>

### 2. 左右滑动

<a href="http://weixin.github.io/PageSlider/example/html/horizontal.html" target="_blank"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|0&chl=http://weixin.github.io/PageSlider/example/html/horizontal.html" width="200" height="200"></a>

### 3. 手势跟随

<a href="http://weixin.github.io/PageSlider/example/html/gestureFollowing.html" target="_blank"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|0&chl=http://weixin.github.io/PageSlider/example/html/gestureFollowing.html" width="200" height="200"></a>

### 4. 锁屏

<a href="http://weixin.github.io/PageSlider/example/html/lock.html" target="_blank"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|0&chl=http://weixin.github.io/PageSlider/example/html/lock.html" width="200" height="200"></a>

### 5. 只执行一次动画

<a href="http://weixin.github.io/PageSlider/example/html/animationPlayOnce.html" target="_blank"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|0&chl=http://weixin.github.io/PageSlider/example/html/animationPlayOnce.html" width="200" height="200"></a>

### 6. 内容超出一屏先滚完再翻页

<a href="http://weixin.github.io/PageSlider/example/html/longpage.html" target="_blank"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|0&chl=http://weixin.github.io/PageSlider/example/html/longpage.html" width="200" height="200"></a>

### 7. 第一次滑屏不翻页，第二次滑屏才翻页

<a href="http://weixin.github.io/PageSlider/example/html/doubleSwipe.html" target="_blank"><img src="https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|0&chl=http://weixin.github.io/PageSlider/example/html/doubleSwipe.html" width="200" height="200"></a>

## TODO
看后面需求是否有必要实现如下功能：

1. scale 的动画切换方式
2. cover 的动画切换方式

## Releases

#### 0.2.4
  - 修复 moveTo 方法传 `字符串` bug
  - 升级 zepto 到 1.2.0

#### 0.2.3
  - 改写切换的实现方式，从动态计算屏幕宽高改为直接样式 100% 控制，切换因子也从具体的 px 改为简单的 100%
  - 上面改动后，适配也由样式控制，移除监听 resize 事件
  - 回调参数里增加 this.curPage，指向当前页面，之前版本都是通过 this.pages.eq(this.index) 实现，但实践中此参数出现频率非常高，故直接提供


#### 0.2.2 增加多一个翻页示例，增加多 4 个 onSwipeUp 等回调接口，增加 prevIndex 索引
#### 0.2.1 增加只执行一次动画，onbeforechange 回调，内容超出一屏先滚完再翻页 功能。
#### 0.2.0 基于 zepto 重写，去除 预加载 等功能。
#### 0.1.0 实现基本功能。





