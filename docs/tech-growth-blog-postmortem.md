# 技术成长博客项目复盘

> 记录范围：从项目初始化到正式域名上线的完整过程。
> 项目仓库：`https://github.com/yum82409-cmyk/tech-growth-blog`
> 正式地址：`https://blog.liuguangzhong.top`
> 最后整理：2026-09-14

## 1. 复盘目的

这个项目最初的目标不是制作一次性的作品集，而是建立一个可以持续维护的技术成长档案，用来记录：

- 学习过程中的理解和疑问；
- 嵌入式、Python 和 AI 应用项目的实现过程；
- 编译、测试、权限、部署和网络问题的排查；
- 已验证、未验证和下一步计划之间的边界。

这份文档保留了过程中遇到的失败和环境限制。以后遇到类似的静态站点、跨电脑迁移或 Cloudflare 部署任务，可以先参考这里的排查顺序。

## 2. 最终结果

截至 2026-09-13，项目已经达到可公开访问状态：

- GitHub 仓库：`yum82409-cmyk/tech-growth-blog`；
- 生产分支：`main`；
- 最新提交：`9fc557e8bbaaadd861b5aaedfd57f4a6420348f4`；
- 正式域名：`https://blog.liuguangzhong.top`；
- 托管形态：Cloudflare Workers Static Assets；
- Worker 名称：`tech-growth-blog`；
- 静态资源目录：`./dist`；
- 构建命令：`pnpm run build`；
- 部署命令：`npx wrangler deploy`；
- 本地 Astro 检查：0 errors、0 warnings、0 hints；
- 静态构建：生成 10 个页面；
- Lighthouse：首页和文章页均为 Performance 99、Accessibility 100、Best Practices 96、SEO 100；
- 正式域名的 HTTPS、DNS、RSS、sitemap、robots.txt、404、主要页面和响应式布局已经完成线上验收。

需要准确区分：最终上线使用的是 Cloudflare Workers Static Assets，不能把没有独立确认的 `*.pages.dev` 地址写成已验证的 Pages 地址。

## 3. 项目目标与技术选择

### 3.1 目标

网站需要满足以下条件：

1. 页面加载快，部署后不需要数据库和后台服务；
2. 文章以 Markdown/MDX 维护；
3. 博客和项目数据具有字段校验；
4. 支持浅色和深色模式；
5. 可以生成标准静态文件；
6. 后续只需新增内容文件即可持续更新。

### 3.2 技术栈

| 类别 | 选择 |
| --- | --- |
| 框架 | Astro 7.3.1 |
| 样式 | Tailwind CSS 4.3.3 |
| 内容 | MDX、Astro Content Collections |
| SEO | ` @astrojs/rss `、` @astrojs/sitemap `、canonical、Open Graph |
| 类型检查 | TypeScript 6.0.2、` @astrojs/check ` |
| 测试 | Playwright 1.63.0、axe-core |
| 部署 | Cloudflare Workers Static Assets |
| 包管理器 | pnpm 11.19.0 |
| 运行时约束 | Node.js `>=22.12 <25` |

选择 Astro 的原因是它适合内容型静态站点：页面和文章在构建时生成，部署结构简单，内容更新不需要引入数据库。Content Collections 负责校验 frontmatter，降低文章字段写错后才发现问题的概率。

## 4. 实现过程

### 4.1 初始化基础工程

第一版先完成工程骨架，而不是一开始加入搜索、评论、统计等附加功能。基础页面包括：

- `/` 首页；
- `/blog/` 学习记录列表；
- `/blog/[slug]/` 文章详情；
- `/projects/` 项目列表；
- `/projects/[slug]/` 项目详情；
- `/about/` 关于页；
- 自定义 404 页面。

全局布局负责导航、页脚、SEO 元数据、favicon 和主题初始化。页面内容通过内容集合读取，避免在页面组件中硬编码大量文章和项目数据。

### 4.2 内容模型

博客内容集合记录标题、描述、日期、标签、成长状态和归档字段。项目内容集合记录标题、描述、技术栈、项目状态、验证说明以及可选的 GitHub/Demo 地址。

项目状态被明确分为：

- `validated`：已有明确验证证据；
- `host-validated`：主机端或仿真验证完成，硬件仍未验证；
- `in-progress`：正在开发；
- `experiment`：学习实验。

这种状态区分对个人技术档案很重要。能编译、能通过主机测试、能在 Proteus 仿真和真实硬件上运行，是不同层级的证据，不能混写。

### 4.3 真实内容替换示例内容

第一版使用示例文章和示例项目验证路由、排序、MDX 和排版。后续替换为真实学习材料：

学习记录：

1. 自建 AI 聚合站之前的 MVP 设计笔记；
2. 用 CubeMX 与 Proteus 完成 STM32F103C8T6 的第一次仿真；
3. 从 MPU6050 原始数据到 Roll/Pitch 姿态角；
4. 设计能够从噪声中恢复的 UART 数据帧解析器；
5. 使用 Python 解析 KiCad 网表并检查电源电路。

项目：

1. 技术成长博客；
2. STM32F103C8T6 串口命令控制台工程；
3. MPU6050 姿态估计与 UART 通信模块；
4. KiCad 网表分析 MCP 工具。

其中 MPU6050 项目只声明主机端 CMake/CTest 验证，不把它写成真实 STM32、I2C 或 UART 硬件验证。KiCad 工具只记录核心功能测试和包配置限制，不隐藏可编辑安装问题。

## 5. 关键工程实现

### 5.1 主题切换

主题逻辑在页面渲染前读取本地存储，并在没有用户选择时跟随系统偏好。主题按钮同步更新图标、`aria-label` 和 `title`。这样处理可以减少刷新时先显示错误主题再切换的闪烁。

### 5.2 内容筛选和归档

归档内容不会进入首页、列表、RSS 或静态路由。首页优先展示已验证项目，避免把正在开发或仅有实验性质的内容误认为成熟成果。

### 5.3 SEO 和静态输出

正式站点地址由 Astro 的 `site` 配置提供，也允许 `SITE_URL` 环境变量覆盖：

~~~
const site = process.env.SITE_URL ?? "https://blog.liuguangzhong.top";
~~~

该值会影响 canonical、sitemap、RSS 和 Open Graph 地址。正式地址确定之前不应使用虚构域名，否则构建产物会包含错误的公开链接。

### 5.4 部署配置

最终部署配置位于 `wrangler.jsonc`：

~~~
{
  "name": "tech-growth-blog",
  "compatibility_date": "2026-09-10",
  "assets": {
    "directory": "./dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
~~~

`not_found_handling: "404-page"` 让不存在的路由返回自定义 404 页面，而不是把错误路由当成首页处理。

## 6. 部署过程中的问题与处理

### 6.1 另一台电脑的项目目录只读

最初的项目路径位于 Codex 的输出目录：

~~~
C:\Users\LENOVO\Documents\Codex\2026-09-08\new-chat\outputs\tech-growth-blog
~~~

该目录可以读取，但 Agent 无法写入 `.astro/` 和 `.git/`，因此出现：

~~~
EPERM: operation not permitted
Permission denied: .git
~~~

直接反复执行 `pnpm build` 或 `git init` 没有意义，因为两者都需要写文件。解决方法是把项目复制到 Agent 被授权且可写的工作区：

~~~
C:\Users\LENOVO\Documents\Codex\2026-09-08\new-chat\tech-growth-blog
~~~

复制后先做写入测试，再执行安装、构建和 Git 操作。这个顺序可以快速区分项目错误和环境权限错误。

### 6.2 普通 PowerShell 找不到 pnpm

Agent 环境能使用 pnpm，不代表普通 PowerShell 的 PATH 已经配置。普通终端出现：

~~~
pnpm : 无法将“pnpm”项识别为 cmdlet、函数、脚本文件或可运行程序
~~~

修复方法：

~~~
node --version
npm --version
npm install --global pnpm@11.19.0
~~~

安装完成后需要关闭并重新打开 PowerShell，使新的 PATH 生效。之后用 `pnpm --version` 验证，不要仅凭安装命令没有报错就继续。

### 6.3 GitHub CLI 和凭据环境不同

本机 GitHub CLI 已登录，但另一台电脑没有 `gh`。因此本机先创建了空仓库：

~~~
https://github.com/yum82409-cmyk/tech-growth-blog
~~~

另一台电脑使用 Git Credential Manager 完成浏览器认证，再执行普通 Git 推送。整个过程中不需要传递 Token、密码、Cookie 或私钥。

推送是否成功以远程分支证据为准：

~~~
git ls-remote --heads origin main
~~~

当返回 `refs/heads/main` 及提交哈希时，才可以确认远程推送完成。工作区干净和本地提交存在都不能证明 GitHub 已收到提交。

### 6.4 Codex 浏览器阻止 Cloudflare 控制台

另一台电脑的 Agent 已登录 Cloudflare，但 Codex 内置浏览器对以下域名保存了拒绝策略：

~~~
https://dash.cloudflare.com
~~~

尝试只输入 `dash.cloudflare.com` 也不符合网站权限输入格式，正确的来源格式应是完整 URL。但即便添加完整 URL，当前浏览器会话仍可能需要重启或重新加载权限。

处理原则：

1. 在 Codex 浏览器网站权限中允许 `https://dash.cloudflare.com`；
2. 关闭并重新打开任务或 Codex，让权限重新加载；
3. 确认 Codex 内置浏览器能实际打开控制台；
4. 如果仍被策略阻止，就使用普通浏览器手动完成 Cloudflare 操作；
5. Agent 只能报告阻塞，不能通过其他接口绕过安全策略。

这次最终通过已登录的 Cloudflare 控制台完成了 Worker 静态资源部署和域名绑定，但复盘时仍应保留这条失败路径，因为它说明了浏览器权限和网站账号登录是两个独立条件。

### 6.5 Cloudflare Pages 与 Workers Static Assets 的形态差异

最初计划使用 Cloudflare Pages，配置目标是 Astro、`pnpm build` 和 `dist`。最终仓库配置和部署记录显示实际托管形态为 Cloudflare Workers Static Assets：

~~~
Build command: pnpm run build
Deploy command: npx wrangler deploy
Assets directory: ./dist
Worker: tech-growth-blog
~~~

因此最终报告改用准确表述：网站通过 Cloudflare Workers Static Assets 部署，并绑定 `blog.liuguangzhong.top`。没有验证成功的 `tech-growth-blog.pages.dev` 地址不应写入项目结论。

### 6.6 Cloudflare Beacon 导致严格测试失败

生产环境 Playwright 有 10 项通过、18 项失败。18 项失败来自同一个外部资源：

~~~
https://static.cloudflareinsights.com/beacon.min.js/...
Failed to load resource: net::ERR_CONNECTION_CLOSED
~~~

这是 Cloudflare 自动注入的 Web Analytics Beacon，不是仓库中的静态资源。它不影响页面、CSS、主题、SEO、RSS、sitemap、HTTPS 或导航，但会让“控制台不允许任何错误”的测试断言失败，也使 Lighthouse Best Practices 得分为 96。

后续测试中将该已知外部资源从控制台错误断言中过滤，避免把第三方网络条件误判为站点回归。测试报告必须保留这个背景，不能笼统写成 28 项全部通过。

## 7. 验证过程

### 7.1 本地验证

常用命令：

~~~
pnpm install --frozen-lockfile
pnpm build
pnpm test
~~~

构建成功的证据包括：

- Astro check 为 0 errors、0 warnings、0 hints；
- `dist/` 生成；
- 首页、博客、项目、关于页、文章详情、RSS、robots 和 404 被生成或可访问。

生产预览使用：

~~~
pnpm preview
~~~

Astro 7 的 preview 使用锁文件防止重复服务。Playwright 配置使用 `--ignore-lock` 和 `reuseExistingServer: true`，处理残留预览进程或已有 4321 端口服务的情况。这里的风险是运行状态冲突，不是 `--ignore-lock` 参数不存在。

### 7.2 线上验证

正式域名上检查了：

~~~
/
/about/
/blog/
/projects/
/rss.xml
/robots.txt
/sitemap-index.xml
~~~

同时检查了三篇文章详情、两个项目详情、自定义 404、页面标题、description、canonical、favicon、浅色/深色模式、刷新后的主题状态、桌面端和移动端布局。

线上验证的关键边界：

- HTTP 200 只能证明某个请求成功，不能单独证明所有链接正确；
- HTTPS 可访问不等于 DNS 配置没有其他冲突；
- Lighthouse 分数受外部脚本、网络和运行环境影响；
- Playwright 失败需要区分站内代码断言失败与第三方资源连接失败。

### 7.3 Lighthouse 结果

正式域名检测结果：

| 页面 | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| 首页 | 99 | 100 | 96 | 100 |
| KiCad 文章页 | 99 | 100 | 96 | 100 |

检测环境记录为 Windows 10 x64、Lighthouse 13.4.1、HeadlessChrome 152。Best Practices 的扣分来自 Cloudflare Beacon 外部连接关闭，不代表站点核心功能不可用。

## 8. Git 操作和可复用命令

### 8.1 恢复现场

~~~
Set-Location -LiteralPath 'C:\Users\LENOVO\Documents\Codex\2026-09-08\new-chat\tech-growth-blog'
git -c safe.directory='*' status --short
git -c safe.directory='*' log -1 --oneline
git -c safe.directory='*' remote -v
git -c safe.directory='*' ls-remote --heads origin main
~~~

先确认远程状态，再决定是否需要提交。已经一致时不要重复初始化、提交或推送。

### 8.2 安全提交

~~~
git diff --check
git status --short
git add README.md PROJECT_STATUS.md docs
git diff --cached --check
git diff --cached --stat
git commit -m "docs: add project postmortem"
git push origin main
~~~

不要使用上级混合目录中的 `git add .`。博客仓库只应包含博客源码、内容、配置、测试和文档。

### 8.3 内容更新后的验证

~~~
pnpm install --frozen-lockfile
pnpm build
pnpm test
git diff --check
git status --short
~~~

如果只修改文章，仍然需要构建，因为 frontmatter schema、静态路由、RSS 和 sitemap 都可能受到影响。

## 9. 目前还没有完成的事情

这些事项不阻塞第一版网站使用：

- MPU6050 模块的真实 STM32、MPU6050、I2C 和 UART 上板验证；
- KiCad MCP 源码工程的 Python 包目录配置修复与重新安装测试；
- 更完整的桌面端和移动端设备矩阵回归；
- 定期更新文章和项目内容；
- 是否增加站内搜索、标签筛选、文章目录和阅读时长。

评论、后台管理、数据库和多语言不应因为技术博客第一版而提前引入。先保证内容持续更新，再根据真实访问需求决定是否扩展。

## 10. 可复用经验

### 环境问题先于代码问题排查

当 `pnpm build` 报 `EPERM` 时，先检查当前目录是否可写；当 `git init` 报 `.git Permission denied` 时，先检查工作区挂载和权限。不要先修改 Astro 或 Git 配置。

### 认证状态不能跨电脑假设

本机 GitHub CLI 已登录，不代表另一台电脑有 GitHub CLI 或 Git Credential Manager 会话。Cloudflare 普通浏览器已登录，也不代表 Codex 内置浏览器允许访问 Cloudflare 控制台。

### 结果必须对应证据

- 本地构建通过：只能说明本地构建通过；
- Git 提交存在：只能说明本地有提交；
- `git ls-remote` 返回分支：才能证明远程推送成功；
- Cloudflare 页面显示成功并且正式 URL 可访问：才能证明上线；
- Lighthouse 数值：必须附页面、时间和运行环境；
- 测试失败：需要说明失败是否来自站内代码。

### 公开项目应记录验证边界

对嵌入式项目尤其要区分主机端测试、仿真、下载运行和实际硬件联调。对部署项目也要区分源码配置、构建成功、部署成功、域名生效和线上页面验收。

## 11. 下一阶段建议

博客现在最值得做的是持续写真实复盘，而不是继续增加功能。建议按照以下顺序更新：

1. 记录一次真实 STM32 上板验证，补充接线、时序、现象和修复过程；
2. 修复 KiCad MCP 的包安装布局问题，并记录从失败到修复的对比；
3. 每完成一个小模块就新增一篇短记录；
4. 每月执行一次生产站点构建和线上链接检查；
5. 只有出现明确需求时再加入搜索、标签筛选或统计。

## 12. 一句话总结

这个项目的主要成果不只是一个可以访问的网站，还建立了一套从内容建模、工程实现、权限排查、Git 协作、部署配置到线上验收的可重复流程。以后复盘时，重点查看每一步的证据和验证边界，而不是只看最终页面是否打开。
