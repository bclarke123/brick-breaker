<script lang="ts">
    import { T } from "@threlte/core";

    import vertexShader from "../shaders/default.vert?raw";
    import fragmentShader from "../shaders/default.frag?raw";

</script>

<T.OrthographicCamera
    makeDefault
    left={-0.5}
    right={0.5}
    top={0.5}
    bottom={-0.5}
    position={[0, 0, 1]}
    near={0.1}
    far={100}
    manual={true}
/>

<T.Mesh>
    <T.PlaneGeometry args={[1, 1]}/>
    <T.ShaderMaterial {vertexShader} {fragmentShader} />
</T.Mesh>
