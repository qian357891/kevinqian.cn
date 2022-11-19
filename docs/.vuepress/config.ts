import { defineUserConfig } from "vuepress";
import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";
import { copyCodePlugin } from "vuepress-plugin-copy-code2";

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
  ],
  // 默认主题
  theme: defaultTheme({
    navbar: [
      // NavbarItem
      {
        text: "前端",
        children: [],
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
