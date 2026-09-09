# 技术成长博客项目状态

> 最后更新：2026-09-08

## 1. 当前结论

个人技术博客的第一版本地工程已经完成，并具备静态部署条件。网站已包含 3 篇真实主题学习记录、2 个项目、深色模式、基础 SEO、RSS、robots.txt、自定义 404，以及在提供正式 `SITE_URL` 后生成 sitemap 的配置。

当前**尚未创建 Git 仓库、尚未连接远程、尚未部署到 Cloudflare Pages 或 GitHub Pages**。没有正式域名、公开仓库或演示地址，因此站点中未加入虚假链接。

## 2. 项目信息

- 项目目录：当前工作区中的 `tech-growth-blog` 工程目录
- 输出模式：Astro 静态站点（`output: "static"`）
- 包管理器：pnpm 11.19.0
- Node.js 约束：`>=22.12 <25`
- Git 状态：当前目录不是 Git 仓库，无分支、提交记录和远程地址

## 3. 已完成功能

### 页面与内容

- 首页：当前学习方向、最近 3 篇文章、精选项目
- 学习记录列表：按发布日期倒序
- 博客详情：MDX、状态、标签、`prose`/`dark:prose-invert`
- 项目列表：项目状态、技术栈和验证边界
- 关于页：STM32、Embedded C、Python、LangChain、RAG 学习方向
- 自定义 404 页面

### 内容集合

- `blog`：标题、描述、日期、标签、成长状态、归档字段
- `project`：标题、描述、技术栈、项目状态、验证说明、可选仓库/演示地址、归档字段
- 旧的重复 slug 已标记 `archived: true`，不会进入列表、首页、RSS 或静态博客路由

### 主题与可访问性

- 浅色/深色模式切换
- `localStorage` 保存用户选择
- `<head>` 内联脚本在页面渲染前应用主题，减少 FOUC
- 主题按钮动态 `aria-label`/`title`
- 当前导航高亮、键盘焦点样式、移动端可横向容纳导航

### SEO 与上线准备

- description、canonical（仅正式 `SITE_URL` 存在时）、Open Graph、Twitter Card
- 博客详情使用 `og:type=article`
- RSS：`/rss.xml`
- robots：`/robots.txt`
- sitemap：仅设置 `SITE_URL` 后通过 `@astrojs/sitemap` 生成
- `.gitignore` 排除依赖、产物、环境变量、日志和编辑器文件
- `.env.example` 不含虚假正式域名
- 未发现常见格式的密钥或令牌

## 4. 真实内容

### 学习记录

1. 从 MPU6050 原始数据到 Roll/Pitch 姿态角
2. 设计能够从噪声中恢复的 UART 数据帧解析器
3. 使用 Python 解析 KiCad 网表并检查电源电路

### 项目

1. MPU6050 姿态估计与 UART 通信模块
   - 已有主机端 CMake/CTest 测试记录
   - 未声称已完成真实 STM32、MPU6050、I2C 或 UART 硬件集成验证
2. KiCad 网表分析 MCP 工具
   - 核心功能曾有 12 项测试记录
   - `pyproject.toml` 包目录配置问题尚未在当前博客工作区修复或重新验证

## 5. 验证记录

### 已执行

```powershell
pnpm install --frozen-lockfile
pnpm build
```

依赖安装成功。最终构建与生产预览验证结果应以本文件末尾的“最终验证”记录为准。

### 验证边界

- 构建通过只证明类型检查、内容校验和静态页面生成成功，不代表线上部署成功。
- 浏览器检查仅覆盖网站 UI 与静态资源，不构成嵌入式硬件验证。
- Lighthouse 若未实际执行，会明确记录为未执行，不以构建结果替代。

## 6. Cloudflare Pages 配置

- Framework preset：Astro
- Build command：`pnpm build`
- Build output directory：`dist`
- Package manager：pnpm
- Node.js：22.x（满足 package.json engines）
- Environment variable：`SITE_URL=https://正式地址`

## 7. 待用户提供或确认

- 网站显示名称或网名（当前使用中性名称“技术成长档案”）
- GitHub 个人主页地址
- GitHub 仓库地址
- Cloudflare Pages 地址或正式域名
- 是否公开当前两项项目及其验证说明

## 8. 未完成事项

- 创建 Git 仓库、提交、推送和远程部署
- 使用真实 `SITE_URL` 进行一次部署配置构建并确认 sitemap
- 线上域名、canonical、RSS 和 robots 最终检查
- 真实桌面端/移动端设备回归测试
- Lighthouse Performance、Accessibility、Best Practices、SEO 检查
- MPU6050 项目的硬件集成验证
- KiCad 工具源码中的包目录配置修复与重新测试

## 9. 下一步建议

1. 提供显示名称、仓库地址和正式站点地址。
2. 在提交前复核公开文章和项目验证边界。
3. 初始化 Git 并推送到用户确认的远程仓库。
4. 在 Cloudflare Pages 按 README 配置部署。
5. 部署后执行移动端、桌面端和 Lighthouse 线上验收。

## 10. 最终验证

- `pnpm install --frozen-lockfile`：成功，锁文件无需更新。
- `pnpm build`：成功；Astro check 为 0 errors / 0 warnings / 0 hints；生成日志报告 8 page(s)，另包含 2 个静态 API 端点，共检查到首页、关于、博客列表、3 篇详情、项目页、404、RSS、robots。
- 无 `SITE_URL`：构建成功，不生成 sitemap，符合预期。
- 临时使用保留测试域名执行配置验证：`sitemap-index.xml` 与 `sitemap-0.xml` 成功生成；该地址未写入项目配置或产物。
- `pnpm preview`：已在 `http://127.0.0.1:4321` 启动新版构建。
- HTTP 检查：首页、关于、博客列表、3 篇文章、项目、RSS、robots、favicon 均返回 200；不存在路由返回 404 并显示自定义页面。
- 浏览器结构检查：首页、关于、博客列表、项目、文章详情和 404 均加载新版内容；旧重复 slug 未出现在列表或静态路由中；MDX 标题、列表和代码块正常呈现。
- 主题检查：切换按钮标签随主题更新，刷新后偏好保持。
- 当前应用内浏览器视口约 639×513，页面 `scrollWidth` 未超过可视内容宽度；专门的 375px 移动端视口未执行，因此不能视为完整移动端验收。
- 预览日志未发现运行错误；RSS 通过 HTTP 和静态内容检查，包含 3 篇文章。
- Lighthouse：未执行，当前环境未提供现成 Lighthouse 验证流程。
