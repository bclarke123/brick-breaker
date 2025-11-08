varying vec2 vUv;

uniform vec2 resolution;
uniform float playerPos;
uniform float playerWidth;
uniform vec2 ballPos;

float sdBox(in vec2 p, in vec2 b)
{
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdCircle(vec2 p, float r)
{
    return length(p) - r;
}

void main() {
    vec2 uv = vUv * resolution;

    float player = sdBox(vec2(playerPos * 0.5 + 0.5, 0.05) - uv, vec2(playerWidth, 0.01));
    float ball = sdCircle((ballPos * 0.5 + 0.5) - uv, 0.005);

    vec3 col = mix(vec3(1.0, 0.0, 0.0), vec3(0.0), smoothstep(0.0, 0.001, player));
    col = mix(vec3(1.0, 1.0, 0.0), col, smoothstep(0.0, 0.001, ball));

    gl_FragColor = vec4(col, 1.0);
}
