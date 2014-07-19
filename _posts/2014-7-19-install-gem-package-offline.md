---
layout: post
title: 离线安装gem包
---

### 1 安装bundle

    gem install bundle

### 2 新建目录初始化

    bundle init

### 3 打开生成的**Gemfile**填写离线安装的包

    gem "包名"

### 4 下载包及其依赖

    bundle package

### 5 拷贝整个目录到目标机上再安装

    bundle install --local

> 在目标机上安装前需要先安装**bundle**，直接在[官网](http://rubygems.org/)上下一个拷贝过去本地安装即可，因为bundle不依赖于其它任何包