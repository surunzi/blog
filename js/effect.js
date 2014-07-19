// 简单函数库
(function (global) {

var proto = $.prototype;

// 遍历
function forin(obj, handler) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            handler.call(this, i);
        }
    }
}

// 构造函数
function $(selector) {
    // 如果是function，则设置为加载文档后运行
    if (typeof selector === 'function') {
        window.addEventListener('load', selector, false);
        return;
    }

    if (this === window) {
        return new $(selector);
    }

    switch (selector) {
    case 'window':
        this[0] = window;
        break;
    default: 
        this[0] = document.querySelector(selector);
        break;
    }
}

// 获取设置css
proto.css = function (name, value) {
    var self = this;
    if (value === undefined) {
        if (typeof name === 'object') {
            forin(name, function (i) {
                self[0].style[i] = name[i];
            });
        } else {
            console.dir(self[0]);
            return self[0].style[name];
        }
    } else {
        self[0].style[name] = value;
    }
}

// 获取元素高度
proto.height = function () {
    return this[0].clientHeight;
}

// 绑定事件
proto.on = function (event, handler) {
    var self = this;
    if (self[0].addEventListener) {
        self[0].addEventListener(event, handler, false);
    } else {
        self[0]['on' + event] = handler;
    }
}

global.$ = $;

})(window);

// 实际程序
$(function () {

// 设置container最小高度
(function () {
    var $container = $('#container'),
        windowHeight = window.innerHeight,
        padding = 50;
    if ($container.height() < windowHeight) {
        $container.css('height', (windowHeight - padding * 2)+ 'px');
    }
})();

});