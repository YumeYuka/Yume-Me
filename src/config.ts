import type {ExpressiveCodeConfig, LicenseConfig, NavBarConfig, ProfileConfig, SiteConfig, UmamiConfig} from "./types/config";
import {LinkPreset} from "./types/config";

export const siteConfig: SiteConfig = {
    title: '梦璃酱',
    subtitle: 'YumeYuka Blog of Dreams',
    lang: 'zh_CN',         // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
    themeColor: {
        hue: 305,         // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
        fixed: false,     // Hide the theme color picker for visitors
    },
    banner: {
        enable: true,
        src: 'assets/images/Wallpaper2.jpg',   // Relative to the /src directory. Relative to the /public directory if
        // it starts with '/'
        position: 'top',      // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
        credit: {
            enable: true,         // Display the credit text of the banner image
            text: 'Memory Sketchbook',              // Credit text to be displayed
            url: 'https://www.pixiv.net/artworks/113845204'                // (Optional) URL link to the original artwork or artist's page
        }
    },
    toc: {
        enable: true,           // Display the table of contents on the right side of the post
        depth: 3                // Maximum heading depth to show in the table, from 1 to 3
    },
    favicon: [    // Leave this array empty to use the default favicon
        {
          src: '/favicon/yumeyuka.jpg',    // Path of the favicon, relative to the /public directory
          // theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
          // sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
        }
    ]
}

export const navBarConfig: NavBarConfig = {
    links: [
        LinkPreset.Home,
        LinkPreset.Archive,
        LinkPreset.About,
        {
            name: "友链",
            url: "/friends/", // Internal links should not include the base path, as it is automatically added
            external: false, // Show an external link icon and will open in a new tab
        },
        {
            name: "统计",
            url: "https://us.umami.is/share/QA4C7dikiZNVwva3", // Internal links should not include the base path, as it is
            // automatically added
            external: true, // Show an external link icon and will open in a new tab
        },
    ],
};

export const profileConfig: ProfileConfig = {
    avatar: 'assets/images/YumeYuka.png',  // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    name: '梦璃酱',
    bio: '一つの心臓の両面に傷を負う',
    links: [
        {
            name: 'GitHub',
            icon: 'fa6-brands:github',
            url: 'https://github.com/YumeYuka',
        },
        {
            name: 'QQ',
            icon: 'fa6-brands:qq',
            url: 'https://join.oom-wg.dev',
        },
        {
            name: 'Tg',
            icon: 'fa6-brands:telegram',
            url: 'https://t.me/YumeYuka',
        },
    ],
}

export const licenseConfig: LicenseConfig = {
    enable: true,
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
    // Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
    // Please select a dark theme, as this blog theme currently only supports dark background color
    theme: "github-dark",
};

export const umamiConfig: UmamiConfig = {
    enable: true,
    baseUrl: "https://us.umami.is",
    shareId: "QA4C7dikiZNVwva3",
    timezone: "Asia/Shanghai",
};

export const statsConfig = {
    viewsText: "浏览",
    visitsText: "访客",
    loadingText: "统计加载中...",
    unavailableText: "统计不可用。请检查是否屏蔽了Umami域名，如AdGuard和AdBlock等插件",
    getStatsText: (pageViews: number, visits: number) => `${statsConfig.viewsText} ${pageViews} · ${statsConfig.visitsText} ${visits}`,
};