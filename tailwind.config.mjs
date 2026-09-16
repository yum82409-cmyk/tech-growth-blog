/** @type {import("tailwindcss").Config} */
export default {
  theme: {
    extend: {
      colors: {
        // 语义前景色均按浅色或深色背景达到 WCAG AAA 对比度。
        error: {
          DEFAULT: "#9f1239",
          dark: "#fda4af",
        },
        warning: {
          DEFAULT: "#713f12",
          dark: "#fde68a",
        },
        success: {
          DEFAULT: "#14532d",
          dark: "#86efac",
        },
      },
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          '"IBM Plex Mono"',
          '"SFMono-Regular"',
          "Consolas",
          '"Liberation Mono"',
          "monospace",
        ],
      },
    },
  },
};
