import { defineUserConfig } from "@vuepress/cli";
import defaultTheme from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";
import { copyCodePlugin } from "vuepress-plugin-copy-code2";
import { blogPlugin } from "vuepress-plugin-blog2";
import { commentPlugin } from "vuepress-plugin-comment2";

const base = <"/" | `/${string}/`>process.env.BASE || "/";

export default defineUserConfig({
  base,
  title: "KevinQian",
  description: "KevinQian's blogs",
  theme: defaultTheme({
    repo: "https://github.com/qian357891/kevinqian.cn",
    editLink: false,
    lastUpdatedText: "最后更新时间",
    contributorsText: "作者",
    navbar: [
      "/",
      {
        text: "Category",
        link: "/category/",
      },
      {
        text: "Tag",
        link: "/tag/",
      },
      {
        text: "Timeline",
        link: "/timeline/",
      },
    ],
  }),

  plugins: [
    // 搜索插件
    searchPlugin({
      hotKeys: ["ctrl", "k"], //聚焦热键为ctrl+k
    }),
    // 复制代码插件
    copyCodePlugin({
      showInMobile: true, //是否显示在移动端
      pure: true, //复制按钮在代码块右上角
    }),
    // 博客插件
    blogPlugin({
      // only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith("posts/") : false,

      // getting article info
      getInfo: ({ frontmatter, title }) => ({
        title,
        author: frontmatter.author || "",
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
      }),

      category: [
        {
          key: "category",
          getter: (page) => <string[]>page.frontmatter.category || [],
          layout: "Category",
          itemLayout: "Category",
          frontmatter: () => ({ title: "Categories", sidebar: false }),
          itemFrontmatter: (name) => ({
            title: `Category ${name}`,
            sidebar: false,
          }),
        },
        {
          key: "tag",
          getter: (page) => <string[]>page.frontmatter.tag || [],
          layout: "Tag",
          itemLayout: "Tag",
          frontmatter: () => ({ title: "Tags", sidebar: false }),
          itemFrontmatter: (name) => ({
            title: `Tag ${name}`,
            sidebar: false,
          }),
        },
      ],

      type: [
        // {
        //   key: "article",
        //   // remove archive articles
        //   filter: (page) => !page.frontmatter.archive,
        //   path: "/article/",
        //   layout: "Article",
        //   frontmatter: () => ({ title: "Articles", sidebar: false }),
        //   // sort pages with time and sticky
        //   sorter: (pageA, pageB) => {
        //     if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
        //       return (
        //         (pageB.frontmatter.sticky as unknown as number) -
        //         (pageA.frontmatter.sticky as unknown as number)
        //       );

        //     if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
        //       return -1;

        //     if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1;

        //     if (!pageB.frontmatter.date) return 1;
        //     if (!pageA.frontmatter.date) return -1;

        //     return (
        //       new Date(pageB.frontmatter.date).getTime() -
        //       new Date(pageA.frontmatter.date).getTime()
        //     );
        //   },
        // },
        {
          key: "timeline",
          // only article with date should be added to timeline
          filter: (page) => page.frontmatter.date instanceof Date,
          // sort pages with time
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date as Date).getTime() -
            new Date(pageA.frontmatter.date as Date).getTime(),
          path: "/timeline/",
          layout: "Timeline",
          frontmatter: () => ({ title: "Timeline", sidebar: false }),
        },
      ],
      hotReload: true,
    }),
    // 评论插件
    commentPlugin({
      provider: "Giscus",
      repo: "qian357891/kevinqian.cn-comment",
      repoId: "R_kgDOIgdZog",
      category: "General",
      categoryId: "DIC_kwDOIgdZos4CSxT2",
    }),
  ],
});
