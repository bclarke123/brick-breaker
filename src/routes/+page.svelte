<script lang="ts">
    import Scene from "$lib/Scene.svelte";
    import { Canvas } from "@threlte/core";
</script>

<div class="outer">
    <Canvas>
        <Scene />
    </Canvas>
</div>

<style>
    .outer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>
