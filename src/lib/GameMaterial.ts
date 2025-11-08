import * as THREE from "three";
import vertexShader from "../shaders/default.vert?raw";
import fragmentShader from "../shaders/default.frag?raw";

import { Game } from "./Game";

const uniforms = {
  time: { value: 0 },
  resolution: { value: new THREE.Vector2(1, 1) },
  playerPos: { value: 0 },
  playerWidth: { value: 0.1 },
  ballPos: { value: new THREE.Vector2(0, 0) },
};

export const gameMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});

export const updateFromGame = (game: Game) => {
  gameMaterial.uniforms.playerPos.value = game.player.position;
  gameMaterial.uniforms.playerWidth.value = game.player.size;
  gameMaterial.uniforms.ballPos.value.set(
    game.ball.position.x,
    game.ball.position.y,
  );
};

export const setResolution = (width: Number, height: Number) => {
  gameMaterial.uniforms.resolution.value.set(width, height);
};
