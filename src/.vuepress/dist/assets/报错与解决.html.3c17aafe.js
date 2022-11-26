import{_ as e,o as t,c as i,e as n}from"./app.457dfeaf.js";const a={},r=n(`<h3 id="fatal-could-not-read-from-remote-repository" tabindex="-1"><a class="header-anchor" href="#fatal-could-not-read-from-remote-repository" aria-hidden="true">#</a> fatal: Could not read from remote repository.</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ git push -u origin main
kex_exchange_identification: Connection closed by remote host
Connection closed by ::1 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可能的问题：</p><p>仓库路径改变（或许改了github用户名）</p><p>解决方法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ git remote set-url origin ssh地址
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,6),s=[r];function o(d,l){return t(),i("div",null,s)}const u=e(a,[["render",o],["__file","报错与解决.html.vue"]]);export{u as default};
