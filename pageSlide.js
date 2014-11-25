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
    this.bubble = config.bubble || false;
    this.preLoad = config.preLoad || false;
    this.loading = config.loading;
    this.onComplete = config.onComplete || function(){};
    this.onBefore = config.onBefore || function(){};

    this.index = 0;
    this.curPage = this.pages[this.index];
    this.wraper = this.curPage.parentNode;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.flag = null;
    this._swipe = 'up';
    this.controls = null;
    this._init();
}

PageSlide.prototype = {
    _init: function(){
        var self = this;

        //初始化CSS动画
        this.wraper.style.webkitTransition = '-webkit-transform '+ this.speed +'s ' + this.animateFn;

        for(var i = 0; i < this.length; i++){
            if(this.swipe === 'X'){
                this.pages[i].style.float = 'left';
            }
        }

        //动态创建标签
        if(this.control){
            this._control();
        }

        this.resizeSet();

        //当屏幕大小变化时,如竖屏变横屏，需重置下大小
        window.addEventListener('resize', function(){
            self.width = window.innerWidth;
            self.height = window.innerHeight;
            self.resizeSet();
        }, false);


        this.wraper.addEventListener('touchstart', function(e){
            self._startHandle(e);
        }, false);
        this.wraper.addEventListener('touchmove', function(e){
            self._moveHandle(e);
        }, false);
        this.wraper.addEventListener('touchend', function(e){
            self._endHandle(e);
        }, false);

        this.run(this.index);
    },

    _control: function(){
        var oParent = this.wraper.parentNode,
            oControl = document.createElement('div'),
            sDot = '';
        
        for(var i = 0; i < this.length; i++){
            sDot += '<span>'+ (i+1) +'</span>';
        }
        oControl.innerHTML = sDot;
        oControl.className = this.controlClass;
        oControl.style.zIndex = 9999;

        oParent.appendChild(oControl);

        this.controls = oParent.getElementsByTagName('span');
    },

    _startHandle: function(e){
        var touch = e.touches[0];

        if(this.bubble){
            e.stopPropagation();
        }

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
        var self = this,
            target;

        if(index >= this.length || index < 0){
            return;
        }

        this.onBefore && this.onBefore.call(this);

        if(this.swipe === 'X'){
            target = (-this.width * index) + 'px';
            this.wraper.style.webkitTransform = 'translate('+ target +', 0)';
        }else if(this.swipe === 'Y'){
            target = (-this.height * index) + 'px';
            this.wraper.style.webkitTransform = 'translate(0, '+ target +')';
        }

        //切换当前屏class
        this._toggleClassFn(this.pages, this.index, index);

        //切换当前屏标签
        this.control && this._toggleClassFn(this.controls, this.index, index);

        this.index = index;
        
        this.onComplete && this.onComplete.call(this);
        
        var nextPage = this.pages[this.index];
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
    },

    resizeSet: function(){
        if(this.swipe === 'X'){
            this.wraper.style.width = this.width * this.length + 'px';
            this.wraper.style.height = this.height + 'px';
        }

        if(this.swipe === 'Y'){
            this.wraper.style.width = this.width + 'px';
            this.wraper.style.height = this.height * this.length + 'px';
        }
        
        for(var i = 0; i < this.length; i++){
            this.pages[i].style.width = this.width + 'px';
            this.pages[i].style.height = this.height + 'px';
        }
        
        this.run(this.index);
    }
}

if ( typeof define === "function" && define.amd ) {
    define( "pageSlide", [], function () { return pageSlide; } );
}