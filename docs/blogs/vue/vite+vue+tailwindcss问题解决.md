### 通过vite脚手架搭建vue项目

[yarn create vite-app 报文件名、目录名或卷标语法不正确](https://juejin.cn/post/7045178655454003208)

使用vite-create创建vue3项目

```
yarn create vite my-vue-app --template vue
```



### 在vue中安装tailwindcss

[vite+vue+tailwindcss](https://tailwindcss.com/docs/guides/vite)

```
yarn add -D tailwindcss postcss autoprefixer
yarn tailwindcss init -p
```



tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```



index.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```



### vite动态导入图片

https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url

### 在vue文件中使用@apply爆黄

在工作区setting中忽略unknownAtRules

```
  "settings": {
		"scss.lint.unknownAtRules": "ignore",
    "css.lint.unknownAtRules": "ignore"
	}
```

