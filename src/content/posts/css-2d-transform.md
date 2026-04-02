---
title: 'css 2D转换'
published: 2020-11-24
description: 'Css 2D转换 transform 变换方法： translate() 移动 rotate() 旋转 scale() 缩放 skew() 倾斜 matrix() matrix()方法和2D变换方法合并成一个。包含旋转，…'
image: '/assets/desktop-banner/3.webp'
tags: ['前端']
category: '前端'
draft: false
pinned: false
comment: true
lang: 'zh-CN'
---

# css 2D转换

Css 2D转换 transform 变换方法： translate() 移动 rotate() 旋转 scale() 缩放 skew() 倾斜 matrix() matrix()方法和2D变换方法合并成一个。包含旋转，…


## Css 2D转换

transform

变换方法：

- translate()   移动
- rotate()        旋转
- scale()         缩放
- skew()         倾斜
- matrix()        matrix()方法和2D变换方法合并成一个。包含旋转，缩放，移动（平移）和倾斜功能。


| 函数                            | 描述                                     |
| ------------------------------- | ---------------------------------------- |
| matrix(*n*,*n*,*n*,*n*,*n*,*n*) | 定义 2D 转换，使用六个值的矩阵。         |
| translate(*x*,*y*)              | 定义 2D 转换，沿着 X 和 Y 轴移动元素。   |
| translateX(*n*)                 | 定义 2D 转换，沿着 X 轴移动元素。        |
| translateY(*n*)                 | 定义 2D 转换，沿着 Y 轴移动元素。        |
| scale(*x*,*y*)                  | 定义 2D 缩放转换，改变元素的宽度和高度。 |
| scaleX(*n*)                     | 定义 2D 缩放转换，改变元素的宽度。       |
| scaleY(*n*)                     | 定义 2D 缩放转换，改变元素的高度。       |
| rotate(*angle*)                 | 定义 2D 旋转，在参数中规定角度。         |
| skew(*x-angle*,*y-angle*)       | 定义 2D 倾斜转换，沿着 X 和 Y 轴。       |
| skewX(*angle*)                  | 定义 2D 倾斜转换，沿着 X 轴。            |
| skewY(*angle*)                  | 定义 2D 倾斜转换，沿着 Y 轴。            |


| 函数                                                         | 描述                                    |
| ------------------------------------------------------------ | --------------------------------------- |
| matrix3d(*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*) | 定义 3D 转换，使用 16 个值的 4x4 矩阵。 |
| translate3d(*x*,*y*,*z*)                                     | 3d转化                                  |
| translateX(*x*)                                              | 用于x轴的转化                           |
| translateY(*y*)                                              | 用于Y轴的转化                           |
| translateZ(*z*)                                              | 用于z轴的转化                           |
| scale3d(*x*,*y*,*z*)                                         | 3D缩放转换                              |
| scaleX(*x*)                                                  | 通过x轴进行缩放                         |
| scaleY(*y*)                                                  | 通过y轴进行缩放                         |
| scaleZ(*z*)                                                  | 通过z轴进行缩放                         |
| rotate3d(*x*,*y*,*z*,*angle*)                                | 3D旋转                                  |
| rotateX(*angle*)                                             | 沿着x轴的3D旋转                         |
| rotateY(*angle*)                                             | 沿着y轴的3D旋转                         |
| rotateZ(*angle*)                                             | 沿着z轴的3D旋转                         |
| perspective(*n*)                                             | 3D转换元素的透视视图                    |

## 角度单位

### deg

度(degress),一个圆共360度

90deg = 100grad = 0.25turn ≈ 1.570796326794897rad

### grad

梯度(Gradians), 一个圆共400梯度

### rad

弧度(Radians),一个圆共2π弧度

### turn

转、圈(Turns)，一个圆共1圈
