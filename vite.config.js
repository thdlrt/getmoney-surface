import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";
import path from "path";

export default defineConfig({
  plugins: [vue(), WindiCSS()],
  //设置别名
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  //服务器代理
  server: {
    proxy: {
      "/api": {
        //target: "http://172.24.12.121:5000",
        target: "http://172.24.101.12:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
