# 技术成长档案

一个以内容为核心的个人技术博客与成长档案，记录嵌入式、Python 和 AI 应用方向的学习实践、项目实现、问题排查与阶段性复盘。界面保持极简、留白和技术感，并支持浅色/深色主题。

## 技术栈

- Astro 7（静态输出）
- Tailwind CSS 4 与 `@tailwindcss/typography`
- MDX 与 Astro Content Collections
- `@astrojs/rss` 与条件启用的 `@astrojs/sitemap`
- TypeScript、pnpm

## 环境要求

- Node.js `>=22.12 <25`
- pnpm `>=11 <12`（项目声明版本：`11.19.0`）

## 安装与运行

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

生产构建与本地预览：

```powershell
pnpm build
pnpm preview
```

默认开发地址通常为 `http://localhost:4321`，构建结果位于 `dist/`。

## 站点 URL 与 SEO

复制 `.env.example` 为 `.env`，在获得正式地址后填写：

```env
SITE_URL=https://你的正式域名
```

不填写时仍可本地构建和预览，但不会生成 sitemap，也不会输出线上 canonical URL。不要使用临时或虚构域名作为正式配置。

## 内容维护

### 新增学习记录

在 `src/content/blog/` 创建 `.mdx`：

```mdx
---
title: "文章标题"
description: "文章简介"
pubDate: 2026-09-08
tags: ["STM32", "Embedded C"]
status: seedling
---

正文内容。
```

`status` 可取 `seedling`、`budding`、`evergreen`。如需保留文件但不公开，在 frontmatter 中加入 `archived: true`。

### 新增项目

在 `src/content/project/` 创建 `.mdx`：

```mdx
---
title: "项目名称"
description: "项目简介"
techStack: ["Python", "Pydantic"]
projectStatus: in-progress
validationNote: "准确描述已验证与未验证的边界。"
---

项目补充说明。
```

`projectStatus` 可取：`validated`、`host-validated`、`in-progress`、`experiment`。`githubUrl` 与 `demoUrl` 为可选字段，没有真实地址时不要填写。

## Cloudflare Pages

推荐配置：

- Framework preset：`Astro`
- Build command：`pnpm build`
- Build output directory：`dist`
- Root directory：仓库根目录
- 环境变量：`SITE_URL`（可选；默认正式域名为 `https://blog.liuguangzhong.top`，预览部署可用此变量覆盖）
- Node.js：使用符合 `package.json` engines 的 22.x 版本
- 包管理器：pnpm（锁文件和 `packageManager` 已提交准备）

项目已连接 GitHub 仓库 `https://github.com/yum82409-cmyk/tech-growth-blog`。Cloudflare Pages 应从 `main` 分支自动构建；正式域名配置为 `https://blog.liuguangzhong.top`。首次配置其他远程时可参考：

```powershell
git init
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
```

提交与推送前应先核对个人信息、远程地址和公开内容。

## 验证边界

站点中的项目说明会区分主机端测试、硬件验证、正在开发和学习实验。当前 MPU6050 项目不能据此认定已通过真实 STM32/I2C/UART 硬件验证；STM32 命令控制台工程目前只有编译与 Proteus 仿真记录，上板行为未验证；KiCad 工具的包安装配置也仍待在其源码工作区修复和重新验证。

## 项目复盘

完整记录项目从初始化、内容替换、跨电脑权限排查、GitHub 推送、Cloudflare 部署到线上验收的过程：

- [技术成长博客项目复盘](./docs/tech-growth-blog-postmortem.md)
