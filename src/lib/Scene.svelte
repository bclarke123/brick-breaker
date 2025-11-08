<script>
    import { useThrelte, useTask } from "@threlte/core";
    import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
    import { ShaderMaterial } from "three";
    import vertexShader from "../shaders/default.vert?raw";
    import fragmentShader from "../shaders/default.frag?raw";

    const { renderStage, renderer } = useThrelte();

    const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
    });

    const quad = new FullScreenQuad(material);

    $effect(() => {
        return () => {
            material.dispose();
            quad.dispose();
        };
    });

    useTask(
        () => {
            quad.render(renderer);
        },
        {
            stage: renderStage,
        },
    );
</script>
