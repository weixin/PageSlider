# PageSide -- 移动端切屏组件

`PageSlide` 是一个用于移动端屏切的工具，支持竖切，横切，预加载等功能。

## 使用方法

**HTML：**
```html
<div class="wrap">
    <section class="screen screen1">screen1</section>
    <section class="screen screen2">screen2</section>
    <section class="screen screen3">screen3</section>
    <section class="screen screen4">screen4</section>
    <section class="screen screen5">screen5</section>
</div>
```

**CSS**
```css
html, body, .wrap{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.screen{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    background-color: #fff;
}
```
>由于实现原理的问题，故上面的 `background-color` 样式设置是必需的，可以根据实际需要什么颜色设置。

**JavaScript**
```javascript
new PageSlide({
    pages: document.querySelectorAll('.screen')
});
```

## 参数

```javascript
new PageSlide({
    pages: document.querySelectorAll('.screen'),  //必需，需要切换的所有屏
    swipe: 'Y',                                   //可选，控制切换方向['X', 'Y']，默认值为 'Y'
    toggleClass: 'current',                       //可选, 当前屏的class (方便实现内容的进场动画)，默认值为 'current'
    animateFn: 'ease-in-out',                     //可选，屏切动画，可选值为 ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']，默认值为 'ease-in-out'
    speed: 500,                                   //可选，屏切速度，建议值范围为[100-1000]，默认值为 500
    control: false,                               //可选，动态生成屏标识，默认为 false
    controlClass: 'page-control',                 //可选，依赖于 control 属性，方便用户设置标识样式，默认值为 'page-control'
    preLoad: false                                //可选，图片预加载，切换到当前屏时，预先加载下一屏的图片，默认为 false
});
```

## 接口

- `prev()` 上一屏
- `next()` 下一屏
- `run(n)` 跳转到第 n 屏

## 示例

![Alt text](https://raw.githubusercontent.com/littledu/littledu.github.io/master/demo/pageSlide/cli.jpg)

或 点击 http://littledu_test.jd-app.com/pageSlide/


### 预加载功能介绍

经常的，在微信朋友圈打开某些屏切页面，总需要等很久，因为其可能做了很酷弦的效果，用了不少图片，为了让效果体验更流畅，所以有些会加一个 loading 效果，等页面完全加载完了再显示出来。但也是依然要等。所以，PageSlide 想在需要的时候再加载这些图片，一来可以提高页面加载速度，二来用户没看完也没必要加载后面的图片。故有此功能。

**使用方法：**  

1. 用 `textarea` 将内容装起来，如：
```html
<div class="wrap">
    <section class="screen srceen1">screen1</section>
    <section class="screen srceen2"><textarea style="display:none;">srceen2</textarea></section>
    <section class="screen srceen3"><textarea style="display:none;">>srceen3</textarea></section>
</div>
```
2. `preLoad` 参数设为 `true` 即可。



