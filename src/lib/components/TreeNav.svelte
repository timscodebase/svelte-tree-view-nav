<script>
  import { page } from "$app/stores";

  // Receive the tree data
  let { tree } = $props();

  // Helper to check if a node contains the active page (to auto-expand)
  function isActive(node) {
    if (node.href === $page.url.pathname) return true;
    if (node.children) return node.children.some(isActive);
    return false;
  }
</script>

<nav class="tree-nav">
  <div class="root-label">Blog</div>

  {#snippet node(item)}
    <li class="tree-item">
      <div class="item-content">
        {#if item.href}
          <a href={item.href} class:active={$page.url.pathname === item.href}>
            {item.label}
          </a>
        {:else}
          <span class="label">{item.label}</span>
        {/if}
      </div>

      {#if item.children && item.children.length > 0}
        <ul class="tree-group">
          {#each item.children as child}
            {@render node(child)}
          {/each}
        </ul>
      {/if}
    </li>
  {/snippet}

  <ul class="tree-root">
    {#each tree as year}
      {@render node(year)}
    {/each}
  </ul>
</nav>

<style>
  /* VARIABLES */
  :global(:root) {
    --tree-line-color: #555;
    --tree-text-color: #ccc;
    --tree-hover-color: #fff;
    --indent: 1.5rem;
  }

  .tree-nav {
    font-family: monospace;
    color: var(--tree-text-color);
    padding: 1rem;
  }

  .root-label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--tree-hover-color);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  /* THE VERTICAL LINE (The Backbone) */
  .tree-group {
    margin-left: 6px; /* Align with parent text */
    padding-left: var(--indent); /* Push children right */
    border-left: 1px solid var(--tree-line-color);
    position: relative;
  }

  .tree-item {
    position: relative;
    line-height: 1.8;
  }

  /* THE HORIZONTAL CONNECTOR (The Branch) */
  .tree-item::before {
    content: "";
    position: absolute;
    top: 0.9em; /* Vertically center on the text line */
    left: calc(var(--indent) * -1); /* Move back to the border */
    width: var(--indent);
    height: 1px;
    background-color: var(--tree-line-color);
  }

  /* REMOVE CONNECTOR FOR ROOT ITEMS IF DESIRED */
  .tree-root > .tree-item::before {
    display: none;
  }

  /* Root items specific spacing */
  .tree-root > .tree-item {
    margin-left: 0.5rem;
  }

  /* LINKS */
  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s;
  }

  a:hover {
    color: var(--tree-hover-color);
    text-decoration: underline;
  }

  a.active {
    color: #fff;
    font-weight: bold;
  }

  /* CLEANUP: The vertical line of the .tree-group goes all the way down.
       Use this trick to stop the line at the last child using a white box
       or background color to mask it, or use flex layouts.

       However, the simplest CSS-only way to replicate the "Post" line stopping:
    */

  .tree-group .tree-item:last-child > .item-content {
    position: relative;
    z-index: 1; /* Sit above the line */
  }

  /* Advanced: To strictly replicate the image where the vertical line
      stops exactly at the last 'branch', you need a background-color mask
      on the :last-child, or use SVG backgrounds.

      For this simpler CSS version, the line runs the full height of the group.
    */
</style>
