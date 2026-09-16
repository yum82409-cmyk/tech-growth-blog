import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", heading: "你好，我正在学习嵌入式与 AI 应用开发。" },
  { path: "/about/", heading: "关于我" },
  { path: "/blog/", heading: "学习记录" },
  { path: "/projects/", heading: "项目" },
  { path: "/projects/mpu6050-attitude-uart/", heading: "MPU6050 姿态估计与 UART 通信模块" },
  { path: "/projects/kicad-netlist-mcp/", heading: "KiCad 网表分析 MCP 工具" },
  { path: "/projects/stm32f103-console/", heading: "STM32F103C8T6 串口命令控制台工程" },
  { path: "/projects/tech-growth-blog-site/", heading: "技术成长博客（本站）" },
  { path: "/blog/ai-gateway-mvp-notes/", heading: "自建 AI 聚合站之前的 MVP 设计笔记" },
  { path: "/blog/stm32f103-proteus-simulation/", heading: "用 CubeMX 与 Proteus 完成 STM32F103C8T6 的第一次仿真" },
  { path: "/blog/mpu6050-roll-pitch/", heading: "从 MPU6050 原始数据到 Roll/Pitch 姿态角" },
  { path: "/blog/recoverable-uart-parser/", heading: "设计能够从噪声中恢复的 UART 数据帧解析器" },
  { path: "/blog/kicad-netlist-power-check/", heading: "使用 Python 解析 KiCad 网表并检查电源电路" },
];

for (const entry of pages) {
  test(`${entry.path} renders, stays inside viewport, and has no serious accessibility violations`, async ({ page }) => {
    const errors: string[] = [];
    if (entry.path === "/projects/") {
      await page.route("https://api.liuguangzhong.top/api/projects", (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ projects: [], count: 0, generated_at: "2026-09-16T10:00:00Z" }),
        }),
      );
    }
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const url = message.location()?.url ?? "";
      // Cloudflare 自动注入的 Web Analytics 脚本（beacon.min.js）能否加载取决于客户端网络，
      // 与站点源码无关，不能作为页面回归的失败条件。
      if (url.includes("cloudflareinsights.com") || message.text().includes("cloudflareinsights.com/beacon.min.js")) return;
      errors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

    const response = await page.goto(entry.path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: entry.heading })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("#main-content")).toHaveCount(1);

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);

    const accessibility = await new AxeBuilder({ page }).analyze();
    const serious = accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("blog list is reverse chronological and only exposes canonical slugs", async ({ page }) => {
  await page.goto("/blog/");
  const links = await page.locator('main article a[href^="/blog/"]').evaluateAll((items) => items.map((item) => item.getAttribute("href")));
  expect(links).toEqual([
    "/blog/ai-gateway-mvp-notes/",
    "/blog/stm32f103-proteus-simulation/",
    "/blog/mpu6050-roll-pitch/",
    "/blog/recoverable-uart-parser/",
    "/blog/kicad-netlist-power-check/",
  ]);
  await expect(page.getByText("使用 Astro Content Collections 管理学习记录")).toHaveCount(0);
});

test("theme persists after reload and matches accessible control label", async ({ page }) => {
  await page.goto("/");
  const initialDark = await page.locator("html").evaluate((element) => element.classList.contains("dark"));
  const expectedInitialLabel = initialDark ? "切换到浅色模式" : "切换到深色模式";
  const expectedNextLabel = initialDark ? "切换到深色模式" : "切换到浅色模式";
  await expect(page.getByRole("button", { name: expectedInitialLabel })).toBeVisible();
  await page.getByRole("button", { name: expectedInitialLabel }).click();
  await expect(page.getByRole("button", { name: expectedNextLabel })).toBeVisible();
  const toggledDark = !initialDark;
  await page.reload();
  await expect.poll(() => page.locator("html").evaluate((element) => element.classList.contains("dark"))).toBe(toggledDark);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(toggledDark ? "dark" : "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", toggledDark ? "#18181b" : "#fafafa");
});

test("knowledge projects map API states to accessible badges", async ({ page }) => {
  await page.route("https://api.liuguangzhong.top/api/projects", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        projects: [
          { name: "embedded_attitude", status: "成品", updated_at: "2026-09-16", todos: [] },
          { name: "kicad_mcp", status: "半成品-活跃", updated_at: "2026-09-15", todos: [{ done: false, text: "补充硬件验证" }] },
          { name: "rlc_transient", status: "半成品-搁置", updated_at: "2026-09-14", todos: [] },
        ],
        count: 3,
        generated_at: "2026-09-16T10:00:00Z",
      }),
    }),
  );

  await page.goto("/projects/");
  await expect(page.getByRole("heading", { level: 2, name: "知识库实时项目" })).toBeVisible();
  await expect(page.getByText("🟢 成品", { exact: true })).toBeVisible();
  await expect(page.getByText("🔵 半成品-活跃", { exact: true })).toBeVisible();
  await expect(page.getByText("🟡 半成品-搁置", { exact: true })).toBeVisible();
  await expect(page.getByText("$ fetch /api/projects  [200 OK]", { exact: true })).toBeVisible();
});

test("ls keyboard easter egg appends a status line", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("l");
  await page.keyboard.press("s");
  await expect(page.locator(".ls-output")).toHaveText("$ ls  about  blog  projects  rss.xml  robots.txt");
});

test("custom 404 responds with 404", async ({ page }) => {
  const response = await page.goto("/definitely-missing/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "页面未找到" })).toBeVisible();
});

test("rss, robots, and favicon are valid endpoints", async ({ request }) => {
  const rss = await request.get("/rss.xml");
  expect(rss.status()).toBe(200);
  expect(rss.headers()["content-type"]).toContain("xml");
  const xml = await rss.text();
  expect((xml.match(/<item>/g) ?? []).length).toBe(5);
  expect(xml).toContain("/blog/mpu6050-roll-pitch/");
  expect(xml).toContain("/blog/ai-gateway-mvp-notes/");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("User-agent: *");

  const favicon = await request.get("/favicon.svg");
  expect(favicon.status()).toBe(200);
  expect(favicon.headers()["content-type"]).toContain("image/svg+xml");
});

test("all same-origin links and assets on rendered pages resolve", async ({ page, request }) => {
  const targets = new Set<string>();
  for (const entry of pages) {
    await page.goto(entry.path);
    const urls = await page.locator("a[href], link[href], script[src], img[src]").evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href") ?? element.getAttribute("src")).filter(Boolean) as string[],
    );
    for (const url of urls) {
      if (url.startsWith("/") && !url.startsWith("//")) targets.add(url.split("#")[0]);
    }
  }
  for (const target of targets) {
    const response = await request.get(target);
    expect(response.status(), `${target} did not resolve`).toBeLessThan(400);
  }
});
