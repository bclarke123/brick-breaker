<script lang="ts">
    import { onMount } from "svelte";
    import { useThrelte, useTask } from "@threlte/core";
    import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
    import {
        gameMaterial,
        setResolution,
        updateFromGame,
        init
    } from "$lib/GameMaterial";
    import { Game } from "$lib/Game";

    const { renderStage, renderer } = useThrelte();
    const quad = new FullScreenQuad(gameMaterial);

    let width = $state(1);
    let height = $state(1);

    const ar = $derived(width / height);

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
    };

    resize();

    const game = new Game();
    updateFromGame(game);

    const keyEvent = (event: KeyboardEvent, down: boolean) => {
        if (event.key === "ArrowLeft") {
            game.leftDown = down;
        } else if (event.key === "ArrowRight") {
            game.rightDown = down;
        } else if (event.key === "ArrowUp") {
            game.begin();
        }
    };

    const keyDownEvent = (event: KeyboardEvent) => keyEvent(event, true);
    const keyUpEvent = (event: KeyboardEvent) => keyEvent(event, false);

    $effect(() => {
        window.addEventListener("keydown", keyDownEvent);
        window.addEventListener("keyup", keyUpEvent);

        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("keydown", keyDownEvent);
            window.removeEventListener("keyup", keyUpEvent);

            window.removeEventListener("resize", resize);

            gameMaterial.dispose();
            quad.dispose();
        };
    });

    onMount(() => {
      init();
    });

    useTask(
        (delta) => {
            game.tick(delta);
            updateFromGame(game);

            setResolution(ar, 1);

            quad.render(renderer);
        },
        {
            stage: renderStage,
        },
    );
</script>
