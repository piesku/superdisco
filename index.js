g = b.appendChild(b.removeChild(a).cloneNode()).getContext("webgl2");
for (i in g) g[i[0] + [i[7]] + [i[13]]] = g[i];
g.cl(1, .7, 0, 1), g.e(2929);
let o, e, t, n = Float32Array.of(
    -1, 9, 1,
    1, 9, 1,
    -1, -9, 1,
    1, -9, 1,
    1, -9, -1,
    1, 9, 1,
    1, 9, -1,
    -1, 9, 1,
    -1, 9, -1,
    -1, -9, 1,
    -1, -9, -1,
    1, -9, -1,
    -1, 9, -1,
    1, 9, -1
),
    c = s = .6,
    f = g.cr(),
    d = o => {
        g.c(16640), g.uniform3f(e, o, c, s), g.dat(5, 0, 14, 5e5), requestAnimationFrame(d)
    };

g.ah(f, (o = g.ch(35633), g.so(o,
    `#version 300 es
uniform vec3 n;in vec3 p;out vec4 f;const mat4 v=mat4(1.3,0.,0.,0.,0.,2.,0.,0.,0.,0.,-1.,-1.,0.,0.,-2.,0.);vec3 s(float v,float s){float m=-707.+mod(v,707.)*2.,c=-707.+v/707.*2.,g=c+floor(s/2.)*2.;return vec3(m,floor(9.*sin(m/30.)*sin(g/20.)+99.*sin(m/99.)*sin(g/299.)+4.*fract(sin(g)*99.)),c-mod(s,2.));}void main(){float m=n.x/99.,c=9.*sin(-m/30.)+30.,g=n.y*.006,D=n.z*.002-.8;f=v*mat4(cos(g),sin(g)*sin(D),-sin(g)*cos(D),0.,0.,cos(D),sin(D),0.,sin(g),-cos(g)*sin(D),cos(g)*cos(D),0.,0.,-c,0.,1.)*vec4(p+s(float(gl_InstanceID),m),1.);gl_Position=f;}`
), g.cS(o), o)), g.ah(f, (o = g.ch(35632), g.so(o,
    `#version 300 es
    precision lowp float;in vec4 f;out vec4 c;void main(){c=mix(vec4(normalize(cross(dFdx(f).xyz,dFdy(f).xyz)),1.),vec4(1.,.7,0.,1.),clamp(length(f-vec4(0.))/999.,0.,1.));}`
), g.cS(o), o)), g.lg(f), e = g.goa(f, "n"), g.ur(f), g.bf(34962, g.cu()), g.ba(34962, n, 35044), g.eet(0), g.vto(0, 3, 5126, 0, 0, 0), b.onmousemove = (o => {
    c = o.x, s = o.y
}), d(0);
