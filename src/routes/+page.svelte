<script>
  import { navTree } from "virtual:content-tree";
  import TreeNav from "$lib/components/TreeNav.svelte";
</script>

<div class="sidebar">
  <TreeNav tree={navTree} />
</div>
