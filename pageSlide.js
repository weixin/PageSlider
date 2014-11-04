var Tool = {
    addClass: function(element,className){
        var regClassName = new RegExp('(^| )'+className+'( |$)');
        if(!regClassName.test(element.className)){
            element.className = element.className.split(/\s+/).concat(className).join(' ');
        }
    },
    removeClass: function(element,className){
        var regClassName = new RegExp('(^|\\s)'+className+'(\\s|$)','g');
        element.className = element.className.replace(regClassName,'');
    }
}

function PageSlide(config){
    this.pages = config.pages;
    this.length = this.pages.length;

    if(this.length <= 1) return;

    this.toggleClass = config.toggleClass || 'current';
    this.swipe = config.swipe ? config.swipe.toUpperCase() : 'Y';
    this.animateFn = config.animateFn || 'ease-in-out';
    this.speed = config.speed ? config.speed/1000 : 0.5;
    this.control = config.control || false;
    this.controlClass = config.controlClass || 'page-control';
    this.preLoad = config.preLoad || false;
    this.loading = config.loading;

    this.index = 0;
    this.curPage = this.pages[this.index];

    this.width = this.curPage.clientWidth;
    this.height = this.curPage.clientHeight;

    this.flag = null;
    this.controls = null;

    this._init();
}

PageSlide.prototype = {
    _init: function(){
        var self = this;

        //初始化层级
        for(var i = 0, k = this.length; i < this.length; i++){
            this.pages[i].style.zIndex = 100 * k;
            this.pages[i].style.webkitTransition = '-webkit-transform '+ this.speed +'s ' + this.animateFn;
            k--;
        }

        //动态创建标签
        if(this.control){
            this._control();
        }

        //页面加载完成前的“加载中”效果
        if(typeof this.loading === 'function'){
            this._loadingFn();
        }

        //当屏幕大小变化时,如竖屏变横屏，需重置下大小
        window.addEventListener('resize', function(){
            self.width = self.curPage.clientWidth;
            self.height = self.curPage.clientHeight;
        }, false);


        document.addEventListener('touchstart', function(e){
            self._startHandle(e);
        }, false);
        document.addEventListener('touchmove', function(e){
            self._moveHandle(e);
        }, false);
        document.addEventListener('touchend', function(e){
            self._endHandle(e);
        }, false);

        this.run(this.index);
    },

    _control: function(){
        var pageParent = this.curPage.parentNode,
            oControl = document.createElement('div'),
            sDot = '';
        
        for(var i = 0; i < this.length; i++){
            sDot += '<span>'+ (i+1) +'</span>';
        }
        oControl.innerHTML = sDot;
        oControl.className = this.controlClass;
        oControl.style.zIndex = 9999;

        pageParent.appendChild(oControl);

        this.controls = pageParent.getElementsByTagName('span');
    },

    _loadingFn: function(){
        var imgs = this.curPage.parentNode.getElementsByTagName('img'),
            length = imgs.length,
            self = this,
            count = 0;

        //监听图片，当所有图片加载完成认为页面已加载完成
        for(var i = 0; i < length; i++){
            var img = new Image();
            img.onload = img.onerror = img.onabort = function(){
                count++;
                if(count <= length){
                    self.loading.call(self, Math.floor(count*100)/length);
                }
            };
            img.src = imgs[i].src;
        }
    },

    _startHandle: function(e){
        var touch = e.touches[0];

        this.startX = touch.clientX;
        this.startY = touch.clientY;
    },

    _moveHandle: function(e){
        e.preventDefault();
    },

    _endHandle: function(e){
        var touch = e.changedTouches[0],
            distanceX = touch.clientX - this.startX,
            distanceY = touch.clientY - this.startY;

        this.flag = Math.abs(distanceX) > Math.abs(distanceY) ? 'X' : 'Y';

        //触摸判断
        if(this.flag === this.swipe){
            if(this.swipe === 'X'){
                if(distanceX > 20){
                    this.prev();
                }else if(distanceX < -20){
                    this.next();
                }
            }else if(this.swipe === 'Y'){
                if(distanceY > 20){
                    this.prev();
                }else if(distanceY < -20){
                    this.next();
                }
            }
        }

    },

    prev: function(){
        this.run(this.index-1);
    },

    next: function(){
        this.run(this.index+1);
    },

    run: function(index){
        var prevPage = this.pages[index - 1],
            curPage = this.pages[index],
            nextPage = this.pages[index + 1];

        if(index >= this.length || index < 0){
            return;
        }

        curPage.style.webkitTransform = 'translate3d(0,0,0)';
        curPage.style.visibility = 'visible';

        if(this.swipe === 'X'){
            prevPage && (prevPage.style.webkitTransform = 'translate3d('+ -this.width +'px,0,0)');
            nextPage && (nextPage.style.webkitTransform = 'translate3d('+ this.width +'px,0,0)');
        }else if(this.swipe === 'Y'){
            prevPage && (prevPage.style.webkitTransform = 'translate3d(0,'+ -this.height +'px,0)');
            nextPage && (nextPage.style.webkitTransform = 'translate3d(0,'+ this.height +'px,0)');
        }

        //切换当前屏class
        this._toggleClassFn(this.pages, this.index, index);

        //切换当前屏标签
        this.control && this._toggleClassFn(this.controls, this.index, index);

        this.index = index;

        //预加载功能
        if(this.preLoad && nextPage && !nextPage.parsed){
            this._preLoadFn(nextPage);
        }
    },

    _toggleClassFn: function(els, prev, cur){
        var prevEl = els[prev],
            curEl = els[cur],
            self = this;

        setTimeout(function(){
            prevEl && Tool.removeClass(prevEl, self.toggleClass);
            curEl && Tool.addClass(curEl, self.toggleClass);
        }, 500);
    },

    _preLoadFn: function(ele){
        var textarea = ele.getElementsByTagName('textarea')[0];

        if(textarea){
            ele.innerHTML = textarea.value;
            ele.parsed = true;
        }
    }
}

