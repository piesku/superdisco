g.clearColor(1.0, 0.7, 0.0, 1.0);
g.enable(g.DEPTH_TEST);
g.enable(g.CULL_FACE);
g.frontFace(g.CW);

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

    if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) // DEBUG
        throw new Error(g.getShaderInfoLog(shader));     // DEBUG

    return shader;
}

let vert_shader = compile_shader(g.VERTEX_SHADER, `#version 300 es
    uniform float now;
    layout(location = 5) in vec3 position;
    layout(location = 6) in vec3 normal;
    out vec4 vert_color;

    // XXX When optimizing for size, pre-calculate the product of these three
    // matrices into a single pvm matrix.
    const mat4 projection = mat4(
        0.75, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, -1.0, -1.0,
        0.0, 0.0, -2.0, 0.0);
    const mat4 view = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 0.83, 0.56, 0.0,
        0.0, -0.56, 0.83, 0.0,
        0.0, -1.89, -9.72, 1.0);


    float rand(float x) {
        return fract(sin(x) * 1000.0);
    }

    float rand2d (in vec2 st) {
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))* 43758.5453123);
    }

    vec3 translate(int id) {
        float width = 2.0;// + sin(now / 1000.0);
        float start_x = -50.0;
        float start_y = -30.0;
        float max_in_row = 50.0;
        float x = start_x + mod(float(id), max_in_row) * width;
        float y = start_y + (floor(float(id) / max_in_row) * width);
        return vec3(x, rand(float(id)), y);
    }

    void main() {
        float rotation = now / 5000.0;
        mat4 model = mat4(
            cos(rotation), 0.0, -sin(rotation), 0.0,
            0.0, 1.0, 0.0, 0.0,
            sin(rotation), 0.0, cos(rotation), 0.0,
            0.0, 0.0, 0.0, 1.0);

        vec3 translation = translate(gl_InstanceID);
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
    g.drawElementsInstanced(g.TRIANGLES, 36, g.UNSIGNED_SHORT, 0, 100000);

    requestAnimationFrame(tick);
}

tick(0);
