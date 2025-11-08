varying vec2 vUv;

uniform vec2 resolution;
uniform float playerPos;
uniform float playerWidth;
uniform vec2 ballPos;

// Colors
#define BG vec3(0.0)
#define PLAYER vec3(1.0, 0.0, 0.0)
#define BALL vec3 (1.0, 1.0, 0.0)

// Define a translate macro for float / vec2 so 0,0 is the center
#define x(TYPE)\
TYPE translate(TYPE v) { \
    return v * 0.5 + 0.5; \
}
x(float)
x(vec2)

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
    vec2 scale = resolution;
    vec2 offset = (resolution - 1.0) * 0.5;
    vec2 uv = vUv * scale - offset;

    float player = sdBox(vec2(translate(playerPos), 0.05) - uv, vec2(playerWidth * 0.5, 0.01));
    float ball = sdCircle(translate(ballPos) - uv, 0.005);

    vec3 col = mix(PLAYER, BG, smoothstep(0.0, 0.001, player));
    col = mix(BALL, col, smoothstep(0.0, 0.001, ball));

    gl_FragColor = vec4(col, 1.0);
}
