---
title: vitepress 使用 banner
published: 2025-07-06
description: "Understanding DNS."
image: "https://pic.yumeyuka.plus/2025/7130928587_p0.png"
tags: ["VitePress", "Banner"]
category: VitePress
draft: false
---

# 记录一次 Vitepress 使用 Banner
这几天一直在写文档，想着给文档加一个全局通知类的东西，找到了一个全局公告，但是好像不是很满意效果，说实话，有一点难看。
然后后来想起来了 `vue` 文档的横幅效果，还有 原神地图文档的那个横幅，说干就干，直接翻源码
![](https://pic.yumeyuka.plus/2025/720250706211244020.png)

::github{repo="vuejs/docs"}

源码是翻到了，`vue` 组件都是在 `theme/components` 目录下面,非常好找， 在 `vitepress` 中全局组件都会在 `theme/index.ts` 内注册为全局组件。
先看 `vue` 文档的,好巧不巧，官方文档注释掉了，继续翻中文版本的
```ts {2,8}
import { h, App } from 'vue'
// import Banner from './components/Banner.vue'

export default Object.assign({}, VPTheme, {
  Layout: () => {
    // @ts-ignore
    return h(VPTheme.Layout, null, {
      // banner: () => h(Banner),
      'sidebar-top': () => h(PreferenceSwitch),
      'sidebar-bottom': () => h(SecurityUpdateBtn),
      'aside-mid': () => h(SponsorsAside)
    })
  },
  ...
}
```

::github{repo="vuejs-translations/docs-zh-cn"}
也是又找到了翻译后的副本，好在并没有注释掉，直接 `copy` 过来，`Banner.vue` 组件也有一点变化，直接copy,
```diff lang="ts" collapse={3-11, 19-44}
// import DefaultTheme from "vitepress/theme";
import DefaultTheme from "vitepress/theme-without-fonts";
import {
    defineAsyncComponent,
    defineComponent,
    inject,
    nextTick,
    onMounted,
    watch,
    h,
} from "vue";
+ import ArticleShare from "./components/ArticleShare.vue";

export default {
    extends: DefaultTheme,

    Layout() {
        return h(
            NConfigProvider,
            { abstract: true, inlineThemeDisabled: true },
            {
                default: () => [
                    // 使用自定义MyLayout
                    h(MyLayout, null, {
                        "layout-top": () => [
                            h(UnderConstructionBanner),
                            h(NolebaseHighlightTargetedHeading),
                            h(Mouse),
                        ],
                        "doc-footer-before": () => h(backtotop),
                        // 在导航栏内容后面添加增强可读性菜单
                        "nav-bar-content-after": () => [
                            h(NolebaseEnhancedReadabilitiesMenu),
                        ],
                        // 在屏幕导航内容后面添加增强可读性菜单
                        "nav-screen-content-after": () =>
                            h(NolebaseEnhancedReadabilitiesScreenMenu),
                        // 在侧边栏导航前面添加鼠标切换
                        "sidebar-nav-before": () => h(MouseToggle),
                        // 在侧边栏导航后面添加音乐播放器
                        "sidebar-nav-after": () => h(Music),
                        // 在侧边栏下方添加分享按钮（使用包装组件解决 SSR 问题）
                        // "aside-outline-after": () => h(ArticleShare),

                        // 在布局顶部添加其他组件
+                       "Banner": () => h(Banner),
                        "aside-top": () => [h(Carousel), h(ArticleShare)],
                    }),
                ],
            },
        );
    },
}

    ...
```

`copy` 是 `copy` 过来了，vitepress 开发环境也是没有报错，但是浏览器并没有渲染出来，继续找原因，又去看了一眼 vitepress 文档中的布局插槽。
欸，不对，好像文档中没有 `Banner` 这个插槽。看了一眼 `package.json` 中的版本号。此时我文档使用的是 `2.0-alpha5` 版本，可能该插槽被`弃用了`
```json {18} collapse={3-12}
{
  "license": "CC BY-NC-SA 4.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=7.4.0"
  },
  "type": "module",
  "scripts": {
    "dev": "vitepress",
    "build": "vitepress build",
    "preview": "vitepress preview",
  },
  "dependencies": {
    "@vue/repl": "^4.4.2",
    "@vue/theme": "^2.3.0",
    "dynamics.js": "^1.1.5",
    "gsap": "^3.12.5",
    "vitepress": "^1.4.3",
    "vue": "^3.5.12"
  },
  "devDependencies",
}
```

然后又去看了原神地图的文档内容，也是又翻到了,作为布局插槽插入到了 `layout-top`，组件有点难 copy ，干脆自己写一个。
::github{repo="kongying-tavern/docs"}

```vue {4} collapse={8-32}
<template>
  <Layout :class="{ [frontmatter.layout || '']: true, [frontmatter.class || '']: true }">
    <template #layout-top>
      <Banner />
      <Sonner />
    </template>

    <template #doc-after>
      <DocReaction ref="target" />
    </template>

    <template #doc-before>
      <DocHeader />
    </template>
    <!--
    <template #doc-footer-before>
      <DocInfo />
    </template> -->

    <template #aside-outline-after>
      <DocAside v-if="showAside" :show-reaction="!targetIsVisible" />
    </template>

    <template #nav-bar-content-after>
      <NavBarUserAvatar />
    </template>

    <template #layout-bottom>
      <HighlightTargetedHeading />
      <Notifications />
    </template>
  </Layout>
</template>
```

终于，Banner 也是做出来了，作为布局插槽插入到了`layout-top`，渲染好像不太正常，当组件被插入到`layout-top`时，整个 `navbar` 会被往下压，进而导致 `sidebar` 和 `aside`
往下压。`navbar` logo 部分和 `sidebar ` 部分内容直接就重叠了，可以说效果非常不好，然后又去看了一遍  原神地图的文档 ，发现 `Banner` 的每个页面都没有 `sidebar`

所以这个方案也失败了，只能说无法用到我的文档里面，于是乎，去翻了 vitepress 的 issue ，还真找到了
- [Add support of Global Notification](https://github.com/vuejs/vitepress/issues/2071#event-8765535510)

![](https://pic.yumeyuka.plus/2025/720250706222250199.png)
看完整个 issue 之后发现，官方可能支持了，但是作为实验性，后续移除了，但是这个哥们留下的链接对我确实有点用
![](https://pic.yumeyuka.plus/2025/720250706222400432.png)

于是我又去翻了 `oxc` 的文档，顶部的 `Banner` 确实有
```ts {3,18}
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { defineAsyncComponent, h } from "vue";
import Alert from "./components/Alert.vue";
import AppBadgeList from "./components/AppBadgeList.vue";
import AppBlogPostHeader from "./components/AppBlogPostHeader.vue";
import "virtual:group-icons.css";

export default {
  extends: DefaultTheme,
  async enhanceApp({ app }) {
    app.component("AppBadgeList", AppBadgeList);
    app.component("AppBlogPostHeader", AppBlogPostHeader);
    app.component("Alert", Alert);
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => h(defineAsyncComponent(() => import("./components/Banner.vue"))),
    });
  },
} satisfies Theme;
```

到这里差不多就解决了，还是使用 `layout-top` 这个插槽，但是注册方式不太一样，这里使用了 `defineAsyncComponent` 去加载这个组件，至此，加上之前 `vue` 文档获取的组件，彻底完结，
最后看看效果

![](https://pic.yumeyuka.plus/2025/720250706223009861.png)
