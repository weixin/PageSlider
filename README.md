# PageSide -- 移动端滑屏组件

`PageSlide` 是一个用于移动端滑屏组件，支持上下滑动，左右滑动，禁止滑动等功能，同时支持 AMD 模块化加载方式

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
    overflow: hidden;
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
new PageSlide({
    pages: $('.page-wrap .page')
});
```

## 参数

```javascript
new PageSlide({
    pages: $('.page-wrap .page'),   //必需，需要切换的所有屏
    direction: 'v',                 //可选，vertical 或 v 为上下滑动，horizontal 或 h 为左右滑动，默认为 v
    currentClass: 'current',        //可选, 当前屏的class (方便实现内容的进场动画)，默认值为 'current'
    gestureFollowing: 'false',      //可选，如果为 true，则开启手势跟随模式
    hasDot: 'false',                //可选，生成标识点结构，样式自己控制
    preventDefault: true,           //可选，是否阻止默认行为
    rememberLastVisited: true,      //可选，记住上一次访问结束后的索引值，可用于实现页面返回后是否回到上次访问的页面
    dev: false,                     //可选，开发模式，传入具体页面索引值
    oninit: function () {},         //可选，初始化完成时的回调
    onchange: function () {}        //可选，每一屏切换完成时的回调
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

pageSlide 支持将动画直接绑定在具体 dom 元素上，如下：
```html
<div class="title" data-animation='{"name": "slideToTop", "duration": 800, "timing-function": "ease", "fill-mode": "both"}'>
    page two
</div>
<div class="subtitle" data-animation='{"name": "slideToTop", "duration": 800, "delay": 300,  "timing-function": "ease", "fill-mode": "both"}'>
    page two subtitle
</div>
```

### 2. 手势跟随

pageSlide 最初的滑动较简单，直接判断手势进行翻屏，而有朋友喜欢在 touchmove 时能拉动页面，看到下一屏，此为朋友说的 `手势跟随`。其也 因为没有此功能而放弃使用 pageSlide，故新版做了支持，只需要如右设置即可： `gestureFollowing: true`。

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
new PageSlide({
    pages: $('.page-wrap .page'),
    rememberLastVisited: true,
    oninit: function(){
        //返回时，需告诉我们此时为返回动作而不是刷新，可以通过 hash 告诉我们
        //PageSlide 所有回调接口 this 指向 PageSlide，方便进行操作
        if(返回为 true){
            this.moveTo(this.lastVisitedIndex, true);
        }
    }
});
```

### 5. dev 模式
此为个人习惯，我在开发时，假设在写第二屏动画时，我会将第一屏隐藏掉，以方便每次刷新都直接在第二屏，而不需要去滑动。但当我在写第 5 屏动画时，我需要手动隐藏 n-1 屏。。。。然后此时领导过来说，XXX，来，让我看一下你做好的效果，然后我又要手动把之前隐藏的显示，十几秒后看完我继续开发又要继续隐藏。。。。。人生如此短暂，受不鸟呐。所以，只需要如下操作，即可愉快的开发：


```javascript
new PageSlide({
    pages: $('.page-wrap .page'),
    dev: 0 //0|1|2|3|...
});
```

## example

### 1. default

<a href="http://littledu.github.io/pageSlide/example/html/default.html" target="_blank"><img src="http://littledu.github.io/pageSlide/cli/default.png"></a>

### 2. 左右滑动

<a href="http://littledu.github.io/pageSlide/example/html/horizontal.html" target="_blank"><img src="http://littledu.github.io/pageSlide/cli/horizontal.png"></a>

### 3. 手势跟随

<a href="http://littledu.github.io/pageSlide/example/html/gestureFollowing.html" target="_blank"><img src="http://littledu.github.io/pageSlide/cli/gestureFollowing.png"></a>

### 4. 锁屏

<a href="http://littledu.github.io/pageSlide/example/html/lock.html" target="_blank"><img src="http://littledu.github.io/pageSlide/cli/lock.png"></a>


## TODO
看后面需求是否有必要实现如下功能：

1. scale 的动画切换方式
2. cover 的动画切换方式
3. 支持内容超出一屏先滚完再翻页

## Releases

#### 0.2.0 基于 zepto 重写，去除 预加载 等功能。
#### 0.1.0 实现基本功能。





