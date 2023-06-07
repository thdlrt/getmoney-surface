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
        //target: "http://172.24.93.205:80",
        target: "http://172.27.134.29:5000",
        //target: "http://172.27.138.62:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
