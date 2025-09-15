---
title: vitepress 使用 banner
published: 2025-07-06
description: "Understanding DNS."
image: "./1751824446577.webp"
tags: ["VitePress", "Banner"]
category: VitePress
draft: false
---

# 记录一次 Vitepress 使用 Banner
这几天，一直在埋头撰写文档，想着为文档添加一个全局通知类组件，寻觅良久，最终找到了一个全局公告，然而效果却令人不尽如人意，说实话，看着实在有点儿“辣眼睛”。
后来，想起了 Vue 文档那炫酷的横幅效果，还有那款`风靡全球的原神`游戏地图文档中美轮美奂的横幅设计，心动不如行动，当即决定深入源码一探究竟！

![](https://pic.yumeyuka.plus/2025/720250706211244020.png)

::github{repo="vuejs/docs"}

源码是翻到了，`vue` 组件，都在 `theme/components` 目录下，井然有序，一目了然， 非常容易找到；在 `vitepress` 中，全局组件，都会在 `theme/index.ts` 文件内优雅地注册为全局组件。
先看看 `vue` 文档，好巧不巧，官方文档注释掉了，继续翻阅中文版本，希望能找到答案！

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
也是又找到了翻译后的副本，好在并没有注释掉，直接 `copy` 过来，`Banner.vue` 组件也有一点变化，直接`copy`，完美！

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

复制 (`copy`) 确实是复制过来了，VitePress 开发环境也没有报错，但浏览器却并没有渲染出来，继续苦苦寻找原因，又仔仔细细地翻阅了 VitePress 文档中的布局插槽部分。
欸，不对劲，文档里竟然没有 `Banner` 这个插槽！我赶紧瞥了一眼 `package.json` 中的版本号。天呐，我竟然还在使用 `2.0-alpha5` 版本，原来这个 `Banner` 插槽可能已经被弃用了！

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

然后又去看了原神地图的文档内容，也是又翻到了，作为布局插槽插入到了 `layout-top`，组件有点难复制，干脆自己写一个。

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

终于，Banner 组件也终于做出来了，作为布局插槽，优雅地插入到了 `layout-top`，渲染效果却出乎意料，当组件被插入到 `layout-top` 时，整个 `navbar` 就像被无形的力量向下压迫，进而导致 `sidebar` 和 `aside` 也跟着向下坍塌。`navbar` 的 logo 部分和 `sidebar` 的内容直接重叠，画面令人窒息，视觉效果糟糕透顶！然后，我再次仔细研读了《原神地图》的文档，惊讶地发现，`Banner` 组件在所有页面中都没有与 `sidebar` 进行任何交互，页面布局的设计完全不依赖 `sidebar`。

所以，这个方案也宣告失败，看来无法应用到我的文档中，无奈之下，我翻阅了 VitePress 的 issue 列表，竟然真的找到了相关的讨论！

- [Add support of Global Notification](https://github.com/vuejs/vitepress/issues/2071#event-8765535510)

![](https://pic.yumeyuka.plus/2025/720250706222250199.png)
阅毕洋洋洒洒的整个议题之后，方才恍然大悟，原来官方或许曾涉足此道，给予过支持，然则终究是昙花一现，作为一项实验性的功能，在日后的版本更迭中被无情地移除了。尽管如此，这位仁兄所留下的链接，于我而言，确如醍醐灌顶，颇具启发之用，实乃雪中送炭。

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

焕然一新，近乎完美！只需妙用 `layout-top` 插槽，然注册之法却别出心裁。此番我们祭出 `defineAsyncComponent` 大法，异步加载组件，画龙点睛。至此，再辅以先前从 `Vue` 官方文档觅得之组件，可谓珠联璧合，大功告成！最后，让我们一同拭目以待，欣赏这令人惊艳的最终效果吧！


![](https://pic.yumeyuka.plus/2025/720250706223009861.png)
