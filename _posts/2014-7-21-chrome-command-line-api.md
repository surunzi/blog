---
layout: post
title: Chrome控制台常用API
---

### 非console函数

|命令|说明|
|--------|
|$_|返回上一个表达式结果|
|$$(selector)|返回符合CSS选择器的DOM元素列表，相当于**document.querySelectorAll**|
|$0 - $4|返回前面被选中过的DOM元素|
|$(selector)|返回符合CSS选择器的DOM元素，相当于**document.querySelector**|
|$x(path)|返回符合XPath表达式的DOM元素列表|
|clear()|清除控制台，相当于**console.clear**|
|copy(obj)|将元素的字符串表示拷贝到剪贴板|
|debug(function)|当该方法被调用时触发debug模式，取消用**undebug(function)**|
|dir(obj)|返回对象的详细内容，相当于**console.dir**|
|dirxml(obj)|返回对象的XML表达，相当于**console.dirxml**|
|inspect(obj/function)|在元素面板选中相应DOM元素或者在Profile面板查看Javascrip对象|
|getEventListeners(obj)|返回绑定在元素上的事件监听器|
|keys(obj)|返回对象的键名数组|
|values(obj)|返回对象的键值数组|
|monitor(function)|监控某个函数，当该函数被调用时输出带有传入参数的信息，取消用**unmonitor(function)**|
|monitorEvents(obj[, events])|当obj的指定事件触发时，输入event对象，取消用**unmonitorEvents(obj[, events])**|
|profile([name])|相当于使用Profile面板，使用profileEnd([name])结束性能分析|
|table(data[, columns])|以表格的形式输出数据|

### console函数

以下API函数在使用时需加**console**前缀

|函数|功能|
|--------|
|assert(expression, object)|如果表达式为false，控制台输出object|
|count(label)|统计执行次数|
|clear()|清除控制台|
|debug(obj [, obj, ...])|与log功能相当|
|dir(obj)|返回对象的详细内容|
|dirxml(obj)|返回对象的XML表达|
|error(obj [, obj, ...])|与log功能相当，但有stack trace信息|
|log(obj [, obj, ...])|输出信息|
|time(label)|统计执行时间，与**timeEnd(label)**相对应|

> 控制面板下可通过**Ctrl+Enter**输入多行