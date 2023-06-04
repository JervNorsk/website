uniform float uTime;
uniform vec3  uSpeed;
uniform vec3  uScale;

varying vec2 vUV;
varying vec3 vPosition;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.681);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
    (c - a)* u.y * (1. - u.x) +
    (d - b) * u.x * u.y;
}

vec3 texture(vec3 tCoord) {
    return vec3(
        noise(tCoord.xy)
    );
}

void main() {
    vec3 tICoord = vec3(vUV, 0.);

    vec3 t1 = texture(
        vec3(
            (tICoord.x * uScale.x) + (uSpeed.x * uTime * 0.2) + 0.0 + vPosition.x,
            (tICoord.y * uScale.y) - (uSpeed.y * uTime * 2.0) + 0.0,
            0.0
        )
    );
    vec3 t2 = texture(
        vec3(
            (tICoord.x * uScale.x) - (uSpeed.x * uTime * 0.2) + 0.0 - vPosition.x,
            (tICoord.y * uScale.y) - (uSpeed.y * uTime * 1.5) + 0.0,
            0.0
        )
    );
    vec3 t3 = texture(
        vec3(
            (tICoord.x * uScale.x) + (uSpeed.x * uTime * 0.7) + 0.0 + vPosition.x,
            (tICoord.y * uScale.y) + (uSpeed.y * uTime * 0.2) + 0.0,
            0.0
        )
    );

    vec3 t0 = t1 * t2 * t3 * 1.0;

    vec3 m1 = vec3(tICoord.x - 0.0);
    vec3 m2 = vec3(tICoord.x - 1.0) * -1.0;
    vec3 m3 = vec3(tICoord.y - 0.2);
    vec3 m4 = vec3(tICoord.y - 1.0) * -1.0;
    vec3 m5 = vec3(
        length(
            vec3(
                tICoord.x - 0.5,
                tICoord.y - 0.4,
                0.0
            )
        )
        - 0.6
    )
    * -1.0;

    // vec3 m0 = m1 * m2 * m3 * m4;
    vec3 m0 = m1 * m2 * m3 * m5 * m4;

    m0 *= 10.0;

    vec4 baseColor = vec4(
        mix(
            vec3(0.0, 1.0, 0.0),
            vec3(0.0, 1.0, 1.0),
            tICoord.y + 0.2
        ),
        t0 * m0 * 10.0
    );
    // baseColor = vec4(m0, 1.0);

    gl_FragColor = vec4(baseColor.rgb, baseColor.a);
    //gl_FragColor = vec4(vPosition, 1.0);
}
