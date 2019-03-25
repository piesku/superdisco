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
    uniform float now;
    uniform vec2 mouse;
    in vec3 position;
    out vec4 vert_position;

    const float edge_count = ${EDGE_COUNT}.0;

    const mat4 projection = mat4(
        1.299, 0.0, 0.0, 0.0,
        0.0, 1.732, 0.0, 0.0,
        0.0, 0.0, -1.002, -1.0,
        0.0, 0.0, -2.002, 0.0);

    float rand(float x) {
        return fract(sin(x) * 1000.0);
    }

    vec3 translate(float id, float offset) {
        float x = -edge_count + mod(id, edge_count) * 2.0;
        float z = -edge_count + (id / edge_count) * 2.0;
        /// Make offset discrete in increments of the cube's width.
        float move = z + floor(offset / 2.0) * 2.0;
        float y = 9.0 * sin(x / 30.0) * sin(move / 20.0);
        float hills = 99.0 * sin(x / 99.0) * sin(move / 300.0);
        float noise = 4.0 * rand(move);
        return vec3(x, floor(hills + y + noise), z - mod(offset, 2.0));
    }

    void main() {
        float offset = now / 100.0;
        float y = 9.0 * sin(-offset / 10.0) + 30.0;

        float rotx = mouse.x * 6.28;
        float roty = mouse.y * 1.57 - 0.79;
        mat4 model = mat4(
            cos(rotx), sin(rotx) * sin(roty), -sin(rotx) * cos(roty), 0.0,
            0.0, cos(roty), sin(roty), 0.0,
            sin(rotx), -cos(rotx) * sin(roty), cos(rotx) * cos(roty), 0.0,
            0.0, -y, 0.0, 1.0);

        vec3 translation = translate(float(gl_InstanceID), offset);
        gl_Position = projection * model * vec4(position + translation, 1.0);
        vert_position = gl_Position;
    }
`);

let frag_shader = compile_shader(g.FRAGMENT_SHADER, `#version 300 es
    precision mediump float;

    in vec4 vert_position;
    out vec4 frag_color;

    const vec4 fog_color = vec4(1.0, 0.7, 0.0, 1.0);
    const float fog_max = 999.0;

    void main() {
        vec4 normal = vec4(normalize(cross(dFdx(vert_position).xyz, dFdy(vert_position).xyz)), 1.0);
        float distance = length(vert_position - vec4(0.0));
        frag_color = mix(normal, fog_color, clamp(distance / fog_max, 0.0, 1.0));
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

    var uniform_now = g.getUniformLocation(program, "now");
    var uniform_mouse = g.getUniformLocation(program, "mouse");

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
