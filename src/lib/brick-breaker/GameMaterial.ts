import * as THREE from "three";
import vertexShader from "./shaders/default.vert?raw";
import fragmentShader from "./shaders/default.frag?raw";

import { Game } from "./Game";

export class GameMaterial {
  uniforms: any;
  game: Game;
  material: THREE.ShaderMaterial;

  constructor(game: Game) {
    this.game = game;

    this.uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
      playerPos: { value: new THREE.Vector2(0, 0) },
      playerWidth: { value: 0.1 },
      ballPos: { value: new THREE.Vector2(0, 0) },
      bricksTex: { value: null }, // DataTexture with info about bricks
      brickTextures: { value: null }, // Visual texture
      brickCols: { value: 10 },
      paddleTexture: { value: null },
      bgTexture: { value: null },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
    });
  }

  init() {
    const loader = new THREE.TextureLoader();
    const bricksTex = loader.load("/bricks.png");
    bricksTex.wrapS = THREE.RepeatWrapping;
    bricksTex.wrapT = THREE.RepeatWrapping;
    bricksTex.magFilter = THREE.NearestFilter;
    bricksTex.minFilter = THREE.NearestFilter;
    this.material.uniforms.brickTextures.value = bricksTex;

    const paddleTex = loader.load("/paddle.png");
    paddleTex.magFilter = THREE.NearestFilter;
    paddleTex.minFilter = THREE.NearestFilter;
    this.material.uniforms.paddleTexture.value = paddleTex;

    const bgTex = loader.load("/background.jpg");
    bgTex.magFilter = THREE.NearestFilter;
    bgTex.minFilter = THREE.NearestFilter;
    this.material.uniforms.bgTexture.value = bgTex;
  }

  update() {
    const { game, material } = this;

    material.uniforms.playerWidth.value = game.player.size;

    material.uniforms.playerPos.value.set(
      game.player.position,
      game.player.yPos,
    );

    material.uniforms.ballPos.value.set(
      game.ball.position.x,
      game.ball.position.y,
    );

    material.uniforms.bricksTex.value = game.level.dataTexture;
    material.uniforms.brickCols.value = game.level.cols;
  }

  setResolution(width: Number, height: Number) {
    this.material.uniforms.resolution.value.set(width, height);
  }

  get() {
    return this.material;
  }
}
