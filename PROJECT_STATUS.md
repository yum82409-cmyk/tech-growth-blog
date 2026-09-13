# 技术成长博客项目状态

> 最后更新：2026-09-13

## 1. 当前结论

个人技术博客第一版已经完成并正式上线：

- 正式地址：`https://blog.liuguangzhong.top`
- GitHub 仓库：`https://github.com/yum82409-cmyk/tech-growth-blog`
- 生产分支：`main`
- 托管方式：Cloudflare Workers 静态资源部署
- Cloudflare Worker：`tech-growth-blog`

旧的 Vercel CNAME 已移除，`blog.liuguangzhong.top` 已作为自定义域绑定到 Cloudflare Worker。线上响应已确认来自 Cloudflare，不再是旧 Vercel 示例站。

## 2. 已完成功能

### 页面与内容

- 首页：学习方向、最近文章、精选项目
- 关于页
- 学习记录列表与 3 篇 MDX 文章详情
- 项目列表与 2 个项目详情
- 自定义 404 页面

### 内容与状态模型

- `blog` 内容集合：标题、描述、日期、标签、成长状态、归档字段
- `project` 内容集合：标题、描述、技术栈、项目状态、验证说明、可选仓库/演示地址、归档字段
- 已归档内容不会进入首页、列表、RSS 或静态路由

### 主题与可访问性

- 浅色/深色模式切换
- `localStorage` 保存主题选择
- 页面渲染前应用主题，减少 FOUC
- 主题按钮动态 `aria-label`/`title`
- 当前导航高亮、键盘焦点样式和移动端导航适配

### SEO 与站点输出

- 正式域名 canonical
- Open Graph 与 Twitter Card
- 博客详情 `og:type=article`
- RSS：`/rss.xml`
- robots：`/robots.txt`
- sitemap：`/sitemap-index.xml` 与 `/sitemap-0.xml`
- favicon
- Cloudflare 自定义 404：不存在的路由返回 HTTP 404，并展示“页面未找到”页面

## 3. 部署配置

Cloudflare 已连接 GitHub 仓库并从 `main` 自动构建：

- Build command：`pnpm run build`
- Deploy command：`npx wrangler deploy`
- Root directory：`/`
- Node.js：24.x（满足项目 `>=22.12 <25` 约束）
- pnpm：11.19.0
- 静态资源目录：`./dist`
- 自定义 404：Wrangler `not_found_handling: "404-page"`

Astro 默认正式站点地址为 `https://blog.liuguangzhong.top`，也可以通过 `SITE_URL` 覆盖。

## 4. 线上验收记录

2026-09-13 已对正式域名执行生产验收：

- HTTPS 可用，响应头 `Server: cloudflare`
- 首页、关于页、博客列表、项目列表均返回 200
- 3 篇文章详情均返回 200
- 2 个项目详情均返回 200
- canonical 全部指向 `https://blog.liuguangzhong.top`
- RSS、robots、sitemap 均返回 200，并使用正式域名
- 线上页面、RSS 和 sitemap 未发现 `example.com`
- 随机不存在路由返回 404，并展示自定义 404 页面
- Cloudflare 控制台显示自定义域 `blog.liuguangzhong.top` 已连接到生产 Worker
- 最新生产构建成功，来源为 GitHub `main`

## 5. 真实内容与验证边界

### 学习记录

1. 从 MPU6050 原始数据到 Roll/Pitch 姿态角
2. 设计能够从噪声中恢复的 UART 数据帧解析器
3. 使用 Python 解析 KiCad 网表并检查电源电路

### 项目

1. MPU6050 姿态估计与 UART 通信模块
   - 有主机端 CMake/CTest 测试记录
   - 不据此声称已完成真实 STM32、MPU6050、I2C 或 UART 硬件集成验证
2. KiCad 网表分析 MCP 工具
   - 核心功能曾有 12 项测试记录
   - 其源码工程中的包目录配置修复与重新测试不属于博客部署本身

## 6. 当前未阻塞事项

博客第一版、正式域名切换和生产验收均已完成，目前没有阻塞上线的事项。后续工作属于持续维护或独立项目，包括：

- 新增文章与项目内容
- 完整桌面端/移动端设备回归
- Lighthouse Performance、Accessibility、Best Practices、SEO 定期检查
- MPU6050 项目的真实硬件集成验证
- KiCad 工具源码工程的包配置修复与重新测试
