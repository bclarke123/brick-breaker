import * as THREE from "three";
import vertexShader from "../shaders/default.vert?raw";
import fragmentShader from "../shaders/default.frag?raw";

import { Game } from "./Game";

const uniforms = {
  time: { value: 0 },
  resolution: { value: new THREE.Vector2(1, 1) },
  playerPos: { value: new THREE.Vector2(0, 0) },
  playerWidth: { value: 0.1 },
  ballPos: { value: new THREE.Vector2(0, 0) },
  bricksTex: { value: null }, // DataTexture with info about bricks
  brickSize: { value: new THREE.Vector2(0.1, 0.1) },
  brickTextures: { value: null }, // Visual texture
  paddleTexture: { value: null }
};

export const gameMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});

export const updateFromGame = (game: Game) => {
  gameMaterial.uniforms.playerPos.value.set(
    game.player.position,
    game.player.yPos,
  );
  gameMaterial.uniforms.playerWidth.value = game.player.size;
  gameMaterial.uniforms.ballPos.value.set(
    game.ball.position.x,
    game.ball.position.y,
  );

  gameMaterial.uniforms.bricksTex.value = game.level.dataTexture;
  gameMaterial.uniforms.brickSize.value = game.level.brickSize;
};

export const setResolution = (width: Number, height: Number) => {
  gameMaterial.uniforms.resolution.value.set(width, height);
};

export const init = () => {
  let loader = new THREE.TextureLoader();
  let bricksTex = loader.load("/bricks.png");
  bricksTex.wrapS = THREE.RepeatWrapping;
  bricksTex.wrapT = THREE.RepeatWrapping;
  gameMaterial.uniforms.brickTextures.value = bricksTex;

  let paddleTex = loader.load("/paddle.png");
  gameMaterial.uniforms.paddleTexture.value = paddleTex;

};
