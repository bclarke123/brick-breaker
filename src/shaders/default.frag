varying vec2 vUv;

uniform vec2 resolution;
uniform vec2 playerPos;
uniform float playerWidth;
uniform vec2 ballPos;

uniform sampler2D bricksTex;
uniform vec2 brickSize;

uniform sampler2D brickTextures;

// Colors
#define BG vec4(vec3(0.3), 1.0)
#define PLAYER vec4(1.0, 0.0, 0.0, 1.0)
#define BALL vec4(1.0, 1.0, 0.0, 1.0)
#define BRICK vec4(0.0, 1.0, 0.0, 1.0)

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

    float player = sdBox(translate(playerPos - vec2(0.0, 0.03)) - uv, vec2(playerWidth * 0.5, 0.01));
    float ball = sdCircle(translate(ballPos) - uv, 0.005);

    vec4 bg = mix(vec4(vec3(0.0), 1.0), BG, smoothstep(-0.0001, 0.0, uv.x));
    bg = mix(vec4(vec3(0.0), 1.0), bg, smoothstep(1.0001, 1.0, uv.x));
    vec4 col = mix(PLAYER, bg, smoothstep(0.0, 0.001, player));

    vec2 bricksBL = vec2(0.0, 0.5);
    vec2 bricksTR = vec2(1.0, 1.0);

    vec2 minCheck = step(bricksBL, uv);
    vec2 maxCheck = step(uv, bricksTR);

    vec2 bricksUv = (uv - bricksBL) / (bricksTR - bricksBL);
    float brickPx = step(0.5, texture2D(bricksTex, bricksUv).r);

    float typeID = 0.0;
    vec2 bOffset = vec2(mod(typeID, 4.0), floor(typeID / 1.0)); // for a 4x1 atlas
    vec2 atlas_uv = (bricksUv + bOffset) / vec2(4.0, 1.0) * vec2(20.0); // scale down to one cell
    vec4 brickCol = texture2D(brickTextures, atlas_uv);

    float mask = minCheck.x * minCheck.y * maxCheck.x * maxCheck.y * brickPx;
    col = mix(col, brickCol, step(1.0, mask));

    col = mix(BALL, col, smoothstep(0.0, 0.001, ball));

    gl_FragColor = col;
}
