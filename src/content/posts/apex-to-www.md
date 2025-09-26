---
title: Pages × CDN：跳转的另一边
published: 2025-09-26
description: 'Pages酱遇到CDN君就会报418，还不听话的Apex只好靠重定向魔法解决啦～'
image: 'https://s3.yumeyuka.plus/2025/1758870738265.webp'
tags: ["EO", "域名解析", "重定向"]
category: '知识'
draft: false
---
## 前情提要

> [!TIP]
>
> **https://www.yumeyuka.plus/posts/edgeone-gh/**

## 结论：

- 如果 Pages 直接解析到 CDN 节点，会返回一个 `418`
- 如果要 Pages 再套一层 CDN 节点则不能直接 CNAME 到分配的解析记录，需要绑定一个中转的子域名， 然后由需要加速的域名的源站填写中转的域名，否则同上返回 `418`
- Apex 不适用上面方法，即不能通过子域中转，且与自定义 `NS` `DNSSEC`  冲突，同上返回 `418`
- Pages 不能进行优选，且无意义，无论国际站还是国内站，如果部署区域为非大陆，非大陆网络可正常访问，大陆网络返回 `401`
- 非大陆站点，即境外站点，例如 `GitHub Pages Vercel Netlify Cloudflare Pgaes / Work` 等，使用 CDN 加速无意义
- 重复第三条，当 Apex 和 www 子域及其它变体绑定到同一  Pages 时，无法通过 `edgeone.json` 进行重定向，此处需要满足同时使用第二条，否则无限重定向

## 那么如何解决 Apex 重定向到 www 子域呢
方法有很多，这里我通过使用分2个 Pages 项目部署，将 Apex 绑定到新的 Pages 项目，新建 `index.html`  `edgeone.json` 进行重定向，需要在 index.html中填入和需要重定向内容相同的 `head` 内容，例如 og 这种


```html title="index.html" collapse={11-43} ins={"1":8-9} ins={"2":45-48}
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>梦璃酱 - YumeYuka Blog of Dreams</title>
    
    <!-- 重定向 -->
    <meta http-equiv="refresh" content="0; url=https://www.yumeyuka.plus/">
    
    <!-- 规范链接 -->
    <link rel="canonical" href="https://www.yumeyuka.plus/">
    
    <!-- 基本SEO标签 -->
    <meta name="description" content="梦璃酱 - YumeYuka Blog of Dreams">
    <meta name="author" content="梦璃酱 - YumeYuka">
    <meta name="robots" content="noindex, nofollow">
    
    <!-- Open Graph 标签 -->
    <meta property="og:site_name" content="梦璃酱">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:url" content="https://www.yumeyuka.plus/">
    <meta property="og:title" content="一つの心臓の両面に傷を負う">
    <meta property="og:image" content="https://s3.yumeyuka.plus/2025/23-22-30.webp">
    <meta property="og:image:secure_url" content="https://s3.yumeyuka.plus/2025/23-22-30.webp">
    
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:type" content="website">
    
    <!-- Twitter 卡片标签 -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="梦璃酱">
    <meta property="twitter:url" content="https://www.yumeyuka.plus/">
    <meta name="twitter:title" content="一つの心臓の両面に傷を負う">
    <meta name="twitter:image" content="https://s3.yumeyuka.plus/2025/23-22-30.webp">
    
    <!-- Telegram 专用标签 -->
    <meta property="telegram:channel" content="@yumeyuka">
    
    <!-- 图标 -->
    <link rel="icon" href="https://s3.yumeyuka.plus/2025/Image_1758222788424.webp" type="image/webp">
    
    <!-- JavaScript重定向（备用方案） -->
    <script>
        window.location.replace("https://www.yumeyuka.plus/");
    </script>
</head>
<body></body>
</html>
```
```json title = "edgeone.json"
{
    "redirects": [
      {
        "source": "$host",
        "destination": "$wwwhost",
        "statusCode": 301
      }
    ]
}
```

## 如何解析
将以上代码 部署到 Pages 新的项目，将apex 域，或者你想重定向的域解析到这个。
将源站项目添加子域中转，CDN 加速页选择回源策略使用源站，虽然是有点沙雕，但是没办法的权宜之计  

![image-20250926163605280](https://s3.yumeyuka.plus/2025/09/caff028c6ffdf2f8739643e99854333e.webp)

![image-20250926163620315](https://s3.yumeyuka.plus/2025/09/8f8889b95224d1163028a49f25455a73.webp)

![image-20250926163644689](https://s3.yumeyuka.plus/2025/09/7d07df27da68d39948e7b374369afc65.webp)