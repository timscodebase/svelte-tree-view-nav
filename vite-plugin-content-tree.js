// vite-plugin-content-tree.js
import fs from "node:fs";
import path from "node:path";
import glob from "fast-glob";
import matter from "gray-matter"; // You'll need: npm i -D gray-matter fast-glob

export default function contentTreePlugin() {
  const virtualModuleId = "virtual:content-tree";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-content-tree",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const tree = buildHierarchy();
        return `export const navTree = ${JSON.stringify(tree)}`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".md")) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) server.moduleGraph.invalidateModule(mod);
      }
    },
  };
}

function buildHierarchy() {
  // 1. Get all markdown files
  const files = glob.sync("./src/posts/*.md");

  const posts = files.map((file) => {
    const raw = fs.readFileSync(file, "utf-8");
    const { data } = matter(raw);
    const slug = path.basename(file, ".md");

    return {
      title: data.title || slug,
      date: new Date(data.date), // Ensure you have a date in frontmatter
      slug: `/blog/${slug}`, // Adjust based on your routing
    };
  });

  // 2. Group by Year -> Month
  const tree = {};

  posts.sort((a, b) => b.date - a.date); // Sort new to old

  posts.forEach((post) => {
    const year = post.date.getFullYear();
    const month = post.date.toLocaleString("default", { month: "long" });

    if (!tree[year]) tree[year] = {};
    if (!tree[year][month]) tree[year][month] = [];

    tree[year][month].push(post);
  });

  // 3. Convert to Array format for Svelte
  return Object.keys(tree)
    .sort((a, b) => b - a)
    .map((year) => ({
      label: year,
      type: "year",
      children: Object.keys(tree[year]).map((month) => ({
        label: month,
        type: "month",
        children: tree[year][month].map((post) => ({
          label: post.title,
          href: post.slug,
          type: "post",
        })),
      })),
    }));
}
