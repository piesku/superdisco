g.clearColor(1.0, 0.7, 0.0, 1.0);
g.enable(g.DEPTH_TEST);
g.enable(g.CULL_FACE);

let EDGE_COUNT = 707;

let vertices = Float32Array.from([
    1, 9, 1, -1, 9, 1, -1, -9, 1,
    1, -9, 1, 1, 9, 1, -1, -9, 1,
    1, 9, 1, 1, -9, 1, 1, -9, -1,
    1, 9, -1, 1, 9, 1, 1, -9, -1,
    1, 9, 1, 1, 9, -1, -1, 9, -1,
    -1, 9, 1, 1, 9, 1, -1, 9, -1,
    -1, -9, -1, -1, 9, -1, 1, 9, -1,
    1, -9, -1, -1, -9, -1, 1, 9, -1,
    -1, -9, -1, -1, -9, 1, -1, 9, 1,
    -1, 9, -1, -1, -9, -1, -1, 9, 1,
    -1, -9, -1, 1, -9, -1, 1, -9, 1,
    -1, -9, 1, -1, -9, -1, 1, -9, 1
]);

function compile_shader(type, source) {
    let shader = g.createShader(type);
    g.shaderSource(shader, source);
    g.compileShader(shader);

    if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) // DEBUG
        throw new Error(g.getShaderInfoLog(shader));     // DEBUG

    return shader;
}

let vert_shader = compile_shader(g.VERTEX_SHADER, `#version 300 es
    uniform float n;
    uniform vec2 m;
    // Vertex position in the mesh
    in vec3 p;
    // Vertex position in the instance
    out vec4 f;

    // The number of voxels along the edge of the world.
    const float E = ${EDGE_COUNT}.0;

    // Projection matrix
    const mat4 P = mat4(
        1.299, 0.0, 0.0, 0.0,
        0.0, 1.732, 0.0, 0.0,
        0.0, 0.0, -1.002, -1.0,
        0.0, 0.0, -2.002, 0.0);

    // Compute the translation of the instance
    vec3 t(float id, float o) {
        float x = -E + mod(id, E) * 2.0;
        float z = -E + (id / E) * 2.0;
        // Make offset discrete in increments of the cube's width.
        float Z = z + floor(o / 2.0) * 2.0;
        return vec3(x, floor(
            // y
            9.0 * sin(x / 30.0) * sin(Z / 20.0)
            // Hills and valleys
            + 99.0 * sin(x / 99.0) * sin(Z / 300.0)
            // Random noise
            + 4.0 * fract(sin(Z) * 1000.0)), z - mod(o, 2.0));
    }

    void main() {
        // The offset of the world
        float o = n / 100.0;
        // The position of the camera
        float y = 9.0 * sin(-o / 30.0) + 30.0;

        // Yaw
        float a = m.x * 6.28;
        // Pitch
        float b = m.y * 1.57 - 0.79;

        f = P * mat4(
            cos(a), sin(a) * sin(b), -sin(a) * cos(b), 0.0,
            0.0, cos(b), sin(b), 0.0,
            sin(a), -cos(a) * sin(b), cos(a) * cos(b), 0.0,
            0.0, -y, 0.0, 1.0) * vec4(p + t(float(gl_InstanceID), o), 1.0);
        gl_Position = f;
    }
`);

let frag_shader = compile_shader(g.FRAGMENT_SHADER, `#version 300 es
    precision mediump float;

    // Fragment position
    in vec4 f;
    // Fragment color
    out vec4 c;

    // Fog color
    const vec4 C = vec4(1.0, 0.7, 0.0, 1.0);
    // Fog distance
    const float D = 999.0;

    void main() {
        c = mix(
            // Normal of the fragment
            vec4(normalize(cross(dFdx(f).xyz, dFdy(f).xyz)), 1.0),
            C,
            clamp(length(f - vec4(0.0)) / D, 0.0, 1.0));
    }
`);

let mousex = 0.6;
let mousey = 0.6;
a.onmousemove = e => {
    mousex = (e.clientX - e.target.offsetLeft) / e.target.width;
    mousey = (e.clientY - e.target.offsetTop) / e.target.height;
};

{
    // Set up the GL program.
    var program = g.createProgram();
    g.attachShader(program, vert_shader);
    g.attachShader(program, frag_shader);
    g.linkProgram(program);

    if (!g.getProgramParameter(program, g.LINK_STATUS)) // DEBUG
        throw new Error(g.getProgramInfoLog(program));  // DEBUG

    var uniform_now = g.getUniformLocation(program, "n");
    var uniform_mouse = g.getUniformLocation(program, "m");

    // And make it the only active one.
    g.useProgram(program);
}

{
    // Buffer vertex data for a cube.
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, vertices, g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 3, g.FLOAT, g.FALSE, 0, 0);
}

function tick(now) {
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    g.uniform1f(uniform_now, now);
    g.uniform2f(uniform_mouse, mousex, mousey);
    g.drawArraysInstanced(g.TRIANGLES, 0, 36, EDGE_COUNT * EDGE_COUNT);

    requestAnimationFrame(tick);
}

tick(0);
