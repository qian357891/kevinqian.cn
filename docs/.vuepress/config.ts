import { defineUserConfig } from "vuepress";
import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";
import { copyCodePlugin } from "vuepress-plugin-copy-code2";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { getDirname, path } from "@vuepress/utils";
import { blogPlugin } from "vuepress-plugin-blog2";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  lang: "zh-CN",
  title: "Kevin Qian", // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: "Kevin Qian blog", // meta 中的描述文字，用于SEO
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
    // 注册vue组件
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, "../../src/components"),
    }),
    // 博客
    blogPlugin({
      filter: ({ filePathRelative }) => {
        // 舍弃那些不是从 Markdown 文件生成的页面
        if (!filePathRelative) return false;
        // 舍弃 `js` 文件夹的页面
        if (filePathRelative.startsWith("blogs/javascript/")) return false;

        return true;
      },

      getInfo: ({ excerpt, frontmatter, git = {} }) => {
        // 获取页面信息
        const info: Record<string, any> = {
          author: frontmatter.author ?? "",
          categories: frontmatter.categories ?? [],
          date: frontmatter.date ?? null,
          tags: frontmatter.tags ?? [],
          excerpt: excerpt ?? "",
        };

        return info;
      },
    }),
  ],
  // 默认主题
  theme: defaultTheme({
    repo: "https://github.com/qian357891/kevinqian.cn", //github仓库地址
    editLink: false,
    lastUpdatedText: "最后更新时间",
    contributorsText: "作者",
    navbar: [
      // NavbarItem
      {
        text: "前端",
        children: ["/blogs/typescript/五、泛型.md"],
      },
      // NavbarGroup
      {
        text: "后端",
        children: [],
      },
      // 字符串 - 页面文件路径
      {
        text: "算法",
        children: [],
      },
      {
        text: "软件工程学",
        children: [],
      },
    ],
  }),
});
