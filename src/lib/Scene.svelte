<script lang="ts">
    import { onMount } from "svelte";
    import { useThrelte, useTask } from "@threlte/core";
    import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
    import { Game, GameMaterial } from "$lib/brick-breaker";

    const { renderStage, renderer } = useThrelte();

    const game = new Game();
    const gameMaterial = new GameMaterial(game);

    const quad = new FullScreenQuad(gameMaterial.get());

    let width = $state(1);
    let height = $state(1);

    const ar = $derived(width / height);

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
    };

    resize();

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

            gameMaterial.get().dispose();
            quad.dispose();
        };
    });

    onMount(() => {
        gameMaterial.init();
    });

    useTask(
        (delta) => {
            game.tick(delta);
            gameMaterial.update();
            gameMaterial.setResolution(ar, 1);

            quad.render(renderer);
        },
        {
            stage: renderStage,
        },
    );
</script>
