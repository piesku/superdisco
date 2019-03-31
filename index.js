for (i in g) g[i[0] + [i[7]] + [i[13]]] = g[i];
g.cl(1, .7, 0, 1), g.e(2929), g.e(2884);
let o, e, t, n, r, c = Float32Array.of(1, 9, 1, -1, 9, 1, -1, -9, 1, 1, -9, 1, 1, 9, 1, -1, -9, 1, 1, 9, 1, 1, -9, 1, 1, -9, -1, 1, 9, -1, 1, 9, 1, 1, -9, -1, 1, 9, 1, 1, 9, -1, -1, 9, -1, -1, 9, 1, 1, 9, 1, -1, 9, -1, -1, -9, -1, -1, 9, -1, 1, 9, -1, 1, -9, -1, -1, -9, -1, 1, 9, -1, -1, -9, -1, -1, -9, 1, -1, 9, 1, -1, 9, -1, -1, -9, -1, -1, 9, 1, -1, -9, -1, 1, -9, -1, 1, -9, 1, -1, -9, 1, -1, -9, -1, 1, -9, 1),
    f = (e, a) => (o = g.ch(e), g.so(o, a), g.cS(o), o),
    s = .6,
    l = .6,
    m = g.cr(),
    d = 0,
    A = o => {
        d = o, g.clear(16640), g.uniform1f(t, o), g.uniform2f(n, s, l), g.dat(4, 0, 36, 499849), requestAnimationFrame(A)
    };
g.ah(m, f(35633, "#version 300 es\nuniform float n;uniform vec2 m;in vec3 p;out vec4 f;const mat4 P=mat4(1.299,0.,0.,0.,0.,1.732,0.,0.,0.,0.,-1.002,-1.,0.,0.,-2.002,0.);vec3 t(float id,float o){float x=-707.+mod(id,707.)*2.;float z=-707.+(id/707.)*2.;float Z=z+floor(o/2.)*2.;return vec3(x,floor(9.*sin(x/30.)*sin(Z/20.)+99.*sin(x/99.)*sin(Z/299.)+4.*fract(sin(Z)*99.)),z-mod(o,2.));}void main(){float o=n/99.;float y=9.*sin(-o/30.)+30.;float a=m.x*6.3;float b=m.y*1.6-.8;f = P * mat4(cos(a),sin(a)*sin(b),-sin(a)*cos(b),0.,0.,cos(b),sin(b),0.,sin(a),-cos(a)*sin(b),cos(a)*cos(b),0.,0.,-y,0.,1.)*vec4(p+t(float(gl_InstanceID),o),1.);gl_Position=f;}")), g.ah(m, f(35632, "#version 300 es\nprecision lowp float;in vec4 f;out vec4 c;void main(){c=mix(vec4(normalize(cross(dFdx(f).xyz,dFdy(f).xyz)),1.),vec4(1.,.7,0.,1.),clamp(length(f-vec4(0.))/999.,0.,1.));}")), g.lg(m), t = g.goa(m, "n"), n = g.goa(m, "m"), g.ur(m), g.bf(34962, g.cu()), g.ba(34962, c, 35044), g.eet(0), g.vto(0, 3, 5126, g.FALSE, 0, 0), b.onmousemove = (o => {
    s = o.x / a.width, l = o.y / a.height
}), b.onclick = (o => {
    e || (e = new AudioContext, (r = e.createScriptProcessor(2048)).onaudioprocess = (o => {
        for (i = 2048; i--;) o.outputBuffer.getChannelData(0)[i] = Math.sin(d / i) / 99 * l
    }), r.connect(e.destination))
}), A(0);
