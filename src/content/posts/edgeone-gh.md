---
title: 从 EdgeOne 开始的奇妙旅程——加速你的 GitHub 图床
published: 2025-09-23
description: ''
image: 'https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/2025/23-20-43.webp'
tags: [ "edgeone","github" ]
category: '知识'
draft: false
---

## 使用项目

实现开始之前，需要准备一个域名，备案最好，不备案建议使用cf 优选，不要用eo 了

::github{repo="cmliu/CF-Workers-Raw"}

这个项目一开始是在 `Cloudflare Work` 部署的后来 `Edgeone pages` 出来之后，有人开了个 issue 就支持了

- https://github.com/cmliu/CF-Workers-Raw/issues/9

![image-20250923214032532](https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/2025/23-21-40.webp)

## 延迟数据

![image-20250923214838483](https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/2025/23-21-48.webp)

EO Pages 和 cdn 节点不一样，pages 最多给分配30个节点，由于直接这样用国内的cdn节点直接去代理 GitHub 文件肯定是不行的

平时绝大多数地方直接访问大概率也是被墙的 `GFW` 发力了，想要做代理，那就需要去用到 EO 给分配的香港节点，

> [!TIP]
>
> EO 刚出来的时候确实是白月光，即使没备案直接 优选 香港节点，延迟优化很错，差不多相当于是全绿了
>
> 但是后面 8 月 初就开始砍了，现在优选 香港节点的话大概率会直接得到 `418` 状态码，这样开来还不让直接优选 cf

首先把这项目自己 Fork 一份 ，用 CF 代理也行 用 EO pages 也行,没备案建议使用 cf work 优选,

::github{repo="cmliu/CF-Workers-Raw"}

然后再 cf work 或者 eo pages 直接直接链接账户 导入 `Edgeone` 分支, cf 是默认的 `mian` 分支 ,部署之后需要绑定
自定义的域名访问，，然后有以下3种方案

| cf work + eo cdn | 体验最好 |
|:----------------:|:----:|
| cf work +　cf 优选  |  推荐  |
| eo pages +　eo 优选 |  推荐  |

以第一种为例，运行work 部署运行之后然后需要在 work 绑定自定义域名，然后在 EO 的站点添加 cdn 配置，然后解析 cname ,

> [!TIP]
>
> 如果 eo 是NS 接入的话就需要2个域名，一个在 cf work 一个用于 eo cdn 分发

![image-20250923221008843](https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/2025/23-22-10.webp)

在 SSL 证书申请选择： 建议使用 腾讯云 申请 SSL 的证书，至于为什么因为后面优选 IP 需要用到 ，优选 IP 原有的 cname 记录会失效，然后
A 记录直接解析到优选 IP ，如果选择申请免费的证书，cname 失效之后会导致 续签失败，建议直接使用 腾讯云申请的 SSL 证书，选择
DNS验证然后不用删记录，直接等它自己续费就好了

![image-20250923221632239](https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/2025/23-22-16.webp)

然后优选 IP ，直接优选 香港 IP ，具体 IP段去看其他文档或者其他人写的 blog

```apl
    43.174.150.199
    43.174.150.119
    43.174.151.16
    43.174.151.120
    43.174.151.58
    43.174.150.6
    43.174.150.123
    43.174.151.214
    43.174.151.241
    43.174.151.165
    43.174.150.111
    43.174.151.2
    43.174.151.243
    43.174.150.132
```

## Github 配置

在 `setting` 生成一个 token 然后 使用 `piclist picgo` 等其他的图床工具，配合 `Typora` 写，确实很不错的

注意 自定义域名部分, 拼接部分需要注意，相对于使用 eo pages 然后去链接 `GitHub` 储存库然后每次上传都要 build 好很多

```
https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/
```

![image-20250923222700864](https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/2025/23-22-27.webp)

### 图片示例

![](https://github.yumeyuka.plus/Keira-Yuki/picture/refs/heads/Yume/2025/23-22-30.webp)
