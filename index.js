g.clearColor(1.0, 0.3, 0.3, 1.0);
g.enable(g.DEPTH_TEST);
g.enable(g.CULL_FACE);
g.enable(g.CW);

let vertices = Float32Array.from([
    -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1,
    -1, 1, -1, -1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, 1, 1, 1, 1,
    -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1,
    -1, 1, -1, -1, 1, 1, 1, 1, 1
]);

let indices = Uint16Array.from([
    23, 22, 20, 22, 21, 20, 19, 18, 16, 18, 17, 16, 15, 14, 12, 14, 13, 12, 11,
    10, 8, 10, 9, 8, 7, 6, 4, 6, 5, 4, 3, 2, 0, 2, 1, 0
]);

let normals = Float32Array.from([
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
]);

function compile_shader(type, source) {
    let shader = g.createShader(type);
    g.shaderSource(shader, source);
    g.compileShader(shader);
    return shader;
}

function create_vao(vertices, indices, normals) {
    let vao = g.createVertexArray()
    g.bindVertexArray(vao);

    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, normals, g.STATIC_DRAW);
    g.enableVertexAttribArray(1);
    g.vertexAttribPointer(1, 3, g.FLOAT, g.FALSE, 0, 0);

    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, vertices, g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 3, g.FLOAT, g.FALSE, 0, 0);

    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, indices, g.STATIC_DRAW);

    g.bindVertexArray(null);
    return vao;
}

function draw(vao) {
    g.bindVertexArray(vao);
    g.drawElements(g.TRIANGLES, 36, g.UNSIGNED_SHORT, 0);
    g.bindVertexArray(null);
}

let vert_shader = compile_shader(g.VERTEX_SHADER, `#version 300 es
    layout(location = 0) in vec3 position;
    layout(location = 1) in vec3 normal;
    out vec4 vert_color;

    const mat4 pv = mat4(
        0.5596334934234619, 0.0, 0.0, 0.0,
        0, 1.8304877281188965, 0.0, 0.0,
        0.0, 0.0, -1.0020020008087158, -1.0,
        0.0, 0.0, 9.819819450378418, 10.0);

    const vec4 color = vec4(1.0, 1.0, 0.3, 1.0);
    const mat4 model = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        2.0, -2.0, 0.0, 1.0);

    void main() {
        gl_Position = pv * model * vec4(position, 1.0);
        vert_color = color;
    }
`);

let frag_shader = compile_shader(g.FRAGMENT_SHADER, `#version 300 es
    precision mediump float;

    in vec4 vert_color;
    out vec4 frag_color;

    void main() {
        frag_color = vert_color;
    }
`);

let program = g.createProgram();
g.attachShader(program, vert_shader);
g.attachShader(program, frag_shader);
g.linkProgram(program);
g.useProgram(program);

let vao = create_vao(vertices, indices, normals);

g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
draw(vao);
