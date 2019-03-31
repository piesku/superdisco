for (i in g) g[i[0] + [i[7]] + [i[13]]] = g[i];
g.cl(1, .7, 0, 1), g.e(2929), g.e(2884), g.fc(2304);
let o, a, e, t, n = Float32Array.of(
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
    r = (a, e) => (o = g.ch(a), g.so(o, e), g.cS(o), o),
    c = .6,
    s = .6,
    f = g.cr(),
    l = 0,
    d = o => {
        l = o, g.c(16640), g.u3(e, Float32Array.of(o, c, s)), g.dat(5, 0, 14, 499849), requestAnimationFrame(d)
    };
g.ah(f, r(35633, "#version 300 es\nuniform ivec3 n;in vec3 p;out vec4 f;const mat4 P=mat4(1.299,0.,0.,0.,0.,1.732,0.,0.,0.,0.,-1.002,-1.,0.,0.,-2.002,0.);vec3 t(float id,float o){float x=-707.+mod(id,707.)*2.;float z=-707.+(id/707.)*2.;float Z=z+floor(o/2.)*2.;return vec3(x,floor(9.*sin(x/30.)*sin(Z/20.)+99.*sin(x/99.)*sin(Z/299.)+4.*fract(sin(Z)*99.)),z-mod(o,2.));}void main(){float o=float(n.x)/99.;float y=9.*sin(-o/30.)+30.;float a=float(n.y)*0.0063;float b=float(n.z)*0.0016-.8;f = P * mat4(cos(a),sin(a)*sin(b),-sin(a)*cos(b),0.,0.,cos(b),sin(b),0.,sin(a),-cos(a)*sin(b),cos(a)*cos(b),0.,0.,-y,0.,1.)*vec4(p+t(float(gl_InstanceID),o),1.);gl_Position=f;}")), g.ah(f, r(35632, "#version 300 es\nprecision lowp float;in vec4 f;out vec4 c;void main(){c=mix(vec4(normalize(cross(dFdx(f).xyz,dFdy(f).xyz)),1.),vec4(1.,.7,0.,1.),clamp(length(f-vec4(0.))/999.,0.,1.));}")), g.lg(f), e = g.goa(f, "n"), g.ur(f), g.bf(34962, g.cu()), g.ba(34962, n, 35044), g.eet(0), g.vto(0, 3, 5126, g.FALSE, 0, 0), b.onmousemove = (o => {
    c = o.x, s = o.y
}), b.onclick = (o => {
    a || (a = new AudioContext, (t = a.createScriptProcessor(2048)).onaudioprocess = (o => {
        for (i = 2048; i--;) o.outputBuffer.getChannelData(0)[i] = Math.sin(l / i) / 99 * s
    }), t.connect(a.destination))
}), d(0);
