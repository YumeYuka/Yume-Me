import rss from "@astrojs/rss";
import {getSortedPosts} from "@utils/content-utils";
import type {APIContext} from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import {siteConfig} from "@/config";
import {getImage} from 'astro:assets';
import * as htmlParser from 'node-html-parser';

const markdownParser = new MarkdownIt();
const imagesGlob = import.meta.glob<{
    default: any
}>('/src/content/**/*.{png,jpg,jpeg,gif,webp,avif,svg}', {eager: false});

function stripInvalidXmlChars(str: string): string {
    return str.replace(
        /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
        "",
    );
}

export async function GET(context: APIContext) {
    if (!context.site) {
        throw Error('site not set');
    }

    const posts = await getSortedPosts();
    const feed = [];

    for (const post of posts) {
        const body = markdownParser.render(post.body);
        const html = htmlParser.parse(body);
        const images = html.querySelectorAll('img');

        for (const img of images) {
            const src = img.getAttribute('src');
            if (!src) continue;

            if (src.startsWith('./') || src.startsWith('../')) {
                let importPath: string | null = null;

                if (src.startsWith('./')) {
                    const prefixRemoved = src.slice(2);
                    importPath = `/src/content/posts/${prefixRemoved}`;
                } else {
                    const cleaned = src.replace(/^\.\.\//, '');
                    importPath = `/src/content/${cleaned}`;
                }

                const imageMod = await imagesGlob[importPath]?.()?.then((res) => res.default);
                if (imageMod) {
                    const optimizedImg = await getImage({src: imageMod});
                    img.setAttribute('src', new URL(optimizedImg.src, context.site).href);
                }
            } else if (src.startsWith('/')) {
                img.setAttribute('src', new URL(src, context.site).href);
            }
        }

        feed.push({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.published,
            link: `/posts/${post.slug}/`,
            content: sanitizeHtml(html.toString(), {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
        });
    }

    return rss({
        title: siteConfig.title,
        description: siteConfig.subtitle || 'No description',
        site: context.site,
        items: feed,
        customData: `<language>${siteConfig.lang}</language>`,
    });
}
