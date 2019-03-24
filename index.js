g.clearColor(1.0, 0.7, 0.0, 1.0);
g.enable(g.DEPTH_TEST);
g.enable(g.CULL_FACE);
g.frontFace(g.CW);

let EDGE_COUNT = 300;

let vertices = Float32Array.from([
    -1, -9, 1, -1, 9, 1, -1, 9, -1, -1, -9, -1, -1, -9, -1, -1, 9, -1, 1, 9,
    -1, 1, -9, -1, 1, -9, -1, 1, 9, -1, 1, 9, 1, 1, -9, 1, 1, -9, 1, 1, 9, 1,
    -1, 9, 1, -1, -9, 1, -1, -9, -1, 1, -9, -1, 1, -9, 1, -1, -9, 1, 1, 9,
    -1, -1, 9, -1, -1, 9, 1, 1, 9, 1
]);

let indices = Uint16Array.from([
    23, 22, 20, 22, 21, 20, 19, 18, 16, 18, 17, 16, 15, 14, 12, 14, 13, 12,
    11, 10, 8, 10, 9, 8, 7, 6, 4, 6, 5, 4, 3, 2, 0, 2, 1, 0
]);

let normals = Float32Array.from([
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 1, 0
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
    layout(location = 5) in vec3 position;
    layout(location = 6) in vec3 normal;
    out vec4 vert_color;

    const float edge_count = ${EDGE_COUNT}.0;

    // XXX When optimizing for size, pre-calculate the product of these three
    // matrices into a single pvm matrix.
    const mat4 projection = mat4(
        1.3, 0.0, 0.0, 0.0,
        0.0, 1.73, 0.0, 0.0,
        0.0, 0.0, -1.0, -1.0,
        0.0, 0.0, -2.0, 0.0);
    const mat4 view = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 0.96, 0.29, 0.0,
        0.0, -0.29, 0.96, 0.0,
        0.0, -19.0, -13.0, 1.0);


    float rand(float x) {
        return fract(sin(x) * 1000.0);
    }

    float discrete(float offset) {
        return floor(offset / 2.0) * 2.0;
    }

    vec3 translate(int id, float offset) {
        float x = -edge_count + mod(float(id), edge_count) * 2.0;
        float z = -edge_count + (float(id) / edge_count) * 2.0;
        float move = z - discrete(offset);
        float y = 10.0 * sin(x / 10.0) * sin(move / 10.0);
        float noise = 4.0 * rand(move);
        float hills = 100.0 * sin(x / 100.0) * sin(move / 100.0);
        return vec3(x, hills + y + noise, z + mod(offset, 2.0));
    }

    void main() {
        float offset = now / 100.0;
        float y = 5.0 * sin(-offset / 10.0) + 10.0;

        float rotation = now / 5000.0;
        mat4 model = mat4(
            cos(rotation), 0.0, -sin(rotation), 0.0,
            0.0, 1.0, 0.0, 0.0,
            sin(rotation), 0.0, cos(rotation), 0.0,
            0.0, -y, 0.0, 1.0);

        vec3 translation = translate(gl_InstanceID, offset);
        gl_Position = projection * view * model * vec4(position + translation, 1.0);
        vert_color = vec4(normal, 1.0);
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

{
    // Set up the GL program.
    var program = g.createProgram();
    g.attachShader(program, vert_shader);
    g.attachShader(program, frag_shader);
    g.linkProgram(program);

    if (!g.getProgramParameter(program, g.LINK_STATUS)) // DEBUG
        throw new Error(g.getProgramInfoLog(program));  // DEBUG

    var uniform_now = g.getUniformLocation(program, "now");

    // And make it the only active one.
    g.useProgram(program);
}

{
    // Buffer vertex data for a cube.
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, vertices, g.STATIC_DRAW);
    g.enableVertexAttribArray(5);
    g.vertexAttribPointer(5, 3, g.FLOAT, g.FALSE, 0, 0);

    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ARRAY_BUFFER, normals, g.STATIC_DRAW);
    g.enableVertexAttribArray(6);
    g.vertexAttribPointer(6, 3, g.FLOAT, g.FALSE, 0, 0);

    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer());
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, indices, g.STATIC_DRAW);
}

function tick(now) {
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    g.uniform1f(uniform_now, now);
    g.drawElementsInstanced(g.TRIANGLES, 36, g.UNSIGNED_SHORT, 0, EDGE_COUNT * EDGE_COUNT);

    requestAnimationFrame(tick);
}

tick(0);
