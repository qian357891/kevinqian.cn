import{_ as i,r as l,o as p,c as o,a as n,b as s,d as a,e as t}from"./app.783f91eb.js";const c={},r=n("h3",{id:"通过vite脚手架搭建vue项目",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#通过vite脚手架搭建vue项目","aria-hidden":"true"},"#"),s(" 通过vite脚手架搭建vue项目")],-1),d={href:"https://juejin.cn/post/7045178655454003208",target:"_blank",rel:"noopener noreferrer"},u=t(`<p>使用vite-create创建vue3项目</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yarn create vite my-vue-app --template vue
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="在vue中安装tailwindcss" tabindex="-1"><a class="header-anchor" href="#在vue中安装tailwindcss" aria-hidden="true">#</a> 在vue中安装tailwindcss</h3>`,3),v={href:"https://tailwindcss.com/docs/guides/vite",target:"_blank",rel:"noopener noreferrer"},m=t(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yarn add -D tailwindcss postcss autoprefixer
yarn tailwindcss init -p
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>tailwind.config.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/** <span class="token keyword">@type</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;tailwindcss&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Config<span class="token punctuation">}</span></span> */</span> 
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;./index.html&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;./src/**/*.{vue,js,ts,jsx,tsx}&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">theme</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">extend</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>index.css</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@tailwind base;
@tailwind components;
@tailwind utilities;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vite动态导入图片" tabindex="-1"><a class="header-anchor" href="#vite动态导入图片" aria-hidden="true">#</a> vite动态导入图片</h3><p>https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url</p><h3 id="在vue文件中使用-apply爆黄" tabindex="-1"><a class="header-anchor" href="#在vue文件中使用-apply爆黄" aria-hidden="true">#</a> 在vue文件中使用@apply爆黄</h3><p>在工作区setting中忽略unknownAtRules</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  &quot;settings&quot;: {
		&quot;scss.lint.unknownAtRules&quot;: &quot;ignore&quot;,
    &quot;css.lint.unknownAtRules&quot;: &quot;ignore&quot;
	}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10);function k(h,b){const e=l("ExternalLinkIcon");return p(),o("div",null,[r,n("p",null,[n("a",d,[s("yarn create vite-app 报文件名、目录名或卷标语法不正确"),a(e)])]),u,n("p",null,[n("a",v,[s("vite+vue+tailwindcss"),a(e)])]),m])}const x=i(c,[["render",k],["__file","vite+vue+tailwindcss问题解决.html.vue"]]);export{x as default};
