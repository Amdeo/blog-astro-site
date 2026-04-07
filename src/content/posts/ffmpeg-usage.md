---
title: 'FFmpeg：音视频处理工具'
published: 2020-01-01
description: '常用命令 FFmpeg基本组成 libavutil包含用于简化编程的各种例程，包括随机数生成器，数据结构，数学例程，核心多媒体实用程序等等。 libavcodec提供了解码和编码API，以及所有受支持的编解码器。 lib…'
image: '/assets/desktop-banner/1.webp'
tags: ['音视频']
category: '音视频'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# FFmpeg：音视频处理工具

常用命令


FFmpeg基本组成

- libavutil包含用于简化编程的各种例程，包括随机数生成器，数据结构，数学例程，核心多媒体实用程序等等。
- libavcodec提供了解码和编码API，以及所有受支持的编解码器。
- libavformat提供了一个解复用和复用API，以及所有受支持的复用器和解复用器。实现了目前多媒体大多数媒体封装格式，包括封装和解封装，例如mp4,flv,ts等，例如RTSP,RTMP网络协议封装，还支持扩展的封装格式，扩展的格式要相应的第三方库
- libavdevice提供了一个接口，用于从输入设备（例如网络摄像头或输入音频）中抓取并渲染到输出设备，以及所有受支持的输入和输出设备
- libswscale 高级别的图像转换API，提供了缩放和（原始像素）格式转换API，并具有多个缩放例程的高速/汇编优化版本。
- libavfilter提供了音频，视频，字幕等滤镜处理框架
- libpostproc提供视频后处理例程
- libswresample提供了音频重采样，重矩阵化和样本格式转换API，以及许多高质量的优化例程
