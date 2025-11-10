varying vec2 vUv;

uniform vec2 resolution;
uniform vec2 playerPos;
uniform float playerWidth;
uniform vec2 ballPos;
uniform float brickCols;

uniform sampler2D bgTexture;
uniform sampler2D bricksTex;
uniform sampler2D brickTextures;
uniform sampler2D paddleTexture;

// Colors
#define BG vec4(vec3(0.3), 1.0)
#define BALL vec4(0.2, 0.15, 0.37, 1.0)

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

vec4 sampleAtlas(sampler2D atlas, vec2 uv, vec2 atlasDims, float index) {
    vec2 cellPos = vec2(mod(index, atlasDims.x), floor(index / atlasDims.x));
    vec2 atlasUv = (uv + cellPos) / atlasDims;
    return texture2D(atlas, atlasUv);
}

void checkBounds(vec2 uv, vec2 bl, vec2 tr, out float mask, out vec2 localUv) {
    vec2 minCheck = step(bl, uv);
    vec2 maxCheck = step(uv, tr);
    mask = minCheck.x * minCheck.y * maxCheck.x * maxCheck.y;
    localUv = (uv - bl) / (tr - bl);
}

void main() {
    vec2 scale = resolution;
    vec2 offset = (resolution - 1.0) * 0.5;
    vec2 uv = vUv * scale - offset;

    float ball = sdCircle(translate(ballPos) - uv, 0.005);

    vec2 bgScale = vec2(1.0, 1.15);
    vec2 bgOffset = vec2(0.0, 0.0);

    // Center UVs
    vec2 centeredUv = vUv - 0.5;

    // Scale Y by bgScale.y
    float yScale = 1.0 / bgScale.y;

    // Scale X to maintain aspect ratio (accounting for viewport aspect ratio)
    float viewportAspect = resolution.x;
    float xScale = yScale * viewportAspect;

    // Apply scaling and offset
    vec2 bgUv = centeredUv * vec2(xScale, yScale) - bgOffset + 0.5;
    vec4 bg = texture2D(bgTexture, bgUv);
    // vec4 bg = mix(vec4(vec3(0.0), 1.0), bgTex, smoothstep(-0.0001, 0.0, uv.x));
    // bg = mix(vec4(vec3(0.0), 1.0), bg, smoothstep(1.0001, 1.0, uv.x));

    vec2 paddleCenter = vec2(translate(playerPos - vec2(0.0, 0.03)));
    vec2 paddleBL = paddleCenter - vec2(playerWidth * 0.5, 0.005);
    vec2 paddleTR = paddleCenter + vec2(playerWidth * 0.5, 0.005);

    float paddleMask;
    vec2 paddleUv;
    checkBounds(uv, paddleBL, paddleTR, paddleMask, paddleUv);

    // Only sample texture if we're in the paddle bounds (avoid expensive texture lookup for most pixels)
    vec4 paddlePx = paddleMask > 0.5 ? texture2D(paddleTexture, paddleUv) : vec4(0.0);

    vec4 col = mix(bg, paddlePx, step(1.0, paddleMask) * paddlePx.a);

    vec2 bricksBL = vec2(0.0, 0.5);
    vec2 bricksTR = vec2(1.0, 1.0);

    float areaMask;
    vec2 bricksUv;
    checkBounds(uv, bricksBL, bricksTR, areaMask, bricksUv);

    // Only sample brick data texture if we're in the brick area
    vec4 brickData = areaMask > 0.5 ? texture2D(bricksTex, bricksUv) : vec4(0.0);
    float brickPx = step(0.5, brickData.r);
    float brickType = floor(brickData.g * 255.0);

    vec2 brickLocalUv = fract(bricksUv * brickCols);
    // Only sample brick appearance texture if there's actually a brick
    vec4 brickCol = (areaMask > 0.5 && brickPx > 0.5) ? sampleAtlas(brickTextures, brickLocalUv, vec2(4.0, 1.0), brickType) : vec4(0.0);

    float mask = areaMask * brickPx;
    col = mix(col, brickCol, step(1.0, mask) * brickCol.a);

    col = mix(BALL, col, smoothstep(0.0, 0.001, ball));

    gl_FragColor = col;
}
