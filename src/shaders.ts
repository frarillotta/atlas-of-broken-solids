export const perlinNoise3d = /* glsl */`#define M_PI 3.14159265358979323846

float rand(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}
float rand (vec2 co, float l) {return rand(vec2(rand(co), l));}
float rand (vec2 co, float l, float t) {return rand(vec2(rand(co, l), t));}

float perlin(vec2 p, float dim, float time) {
	vec2 pos = floor(p * dim);
	vec2 posx = pos + vec2(1.0, 0.0);
	vec2 posy = pos + vec2(0.0, 1.0);
	vec2 posxy = pos + vec2(1.0);
	
	float c = rand(pos, dim, time);
	float cx = rand(posx, dim, time);
	float cy = rand(posy, dim, time);
	float cxy = rand(posxy, dim, time);
	
	vec2 d = fract(p * dim);
	d = -0.5 * cos(d * M_PI) + 0.5;
	
	float ccx = mix(c, cx, d.x);
	float cycxy = mix(cy, cxy, d.x);
	float center = mix(ccx, cycxy, d.y);
	
	return center * 2.0 - 1.0;
}

// p must be normalized!
float perlin(vec2 p, float dim) {
	
	/*vec2 pos = floor(p * dim);
	vec2 posx = pos + vec2(1.0, 0.0);
	vec2 posy = pos + vec2(0.0, 1.0);
	vec2 posxy = pos + vec2(1.0);
	
	// For exclusively black/white noise
	/*float c = step(rand(pos, dim), 0.5);
	float cx = step(rand(posx, dim), 0.5);
	float cy = step(rand(posy, dim), 0.5);
	float cxy = step(rand(posxy, dim), 0.5);*/
	
	/*float c = rand(pos, dim);
	float cx = rand(posx, dim);
	float cy = rand(posy, dim);
	float cxy = rand(posxy, dim);
	
	vec2 d = fract(p * dim);
	d = -0.5 * cos(d * M_PI) + 0.5;
	
	float ccx = mix(c, cx, d.x);
	float cycxy = mix(cy, cxy, d.x);
	float center = mix(ccx, cycxy, d.y);
	
	return center * 2.0 - 1.0;*/
	return perlin(p, dim, 0.0);
}`

export const snoise3d = /* glsl */`

//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`

export const sdfDefinitions = /* glsl */`
    float dot2( in vec2 v ) { return dot(v,v); }
    float dot2( in vec3 v ) { return dot(v,v); }
    float ndot( in vec2 a, in vec2 b ) { return a.x*b.x - a.y*b.y; }


    float sdSphere(vec3 p, float r) {
        return length(p)-r;
    }

    float sdBox( vec3 p, vec3 b ) {
        vec3 q = abs(p) - b;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }
    float sdRoundBox( vec3 p, vec3 b, float r ) {
      vec3 q = abs(p) - b;
      return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
    }

    float sdCone( vec3 p, vec2 c, float h ) {
      // c is the sin/cos of the angle, h is height
      // Alternatively pass q instead of (c,h),
      // which is the point at the base in 2D
      vec2 q = h*vec2(c.x/c.y,-1.0);
        
      vec2 w = vec2( length(p.xz), p.y );
      vec2 a = w - q*clamp( dot(w,q)/dot(q,q), 0.0, 1.0 );
      vec2 b = w - q*vec2( clamp( w.x/q.x, 0.0, 1.0 ), 1.0 );
      float k = sign( q.y );
      float d = min(dot( a, a ),dot(b, b));
      float s = max( k*(w.x*q.y-w.y*q.x),k*(w.y-q.y)  );
      return sqrt(d)*sign(s);
    }

    float sdHexPrism( vec3 p, vec2 h ) {
      const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
      p = abs(p);
      p.xy -= 2.0*min(dot(k.xy, p.xy), 0.0)*k.xy;
      vec2 d = vec2(
          length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x), h.x))*sign(p.y-h.x),
          p.z-h.y );
      return min(max(d.x,d.y),0.0) + length(max(d,0.0));
    }

    float sdTriPrism( vec3 p, vec2 h ) {
      vec3 q = abs(p);
      return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
    }

    float sdCapsule( vec3 p, vec3 a, vec3 b, float r ) {
      vec3 pa = p - a, ba = b - a;
      float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
      return length( pa - ba*h ) - r;
    }

    float sdCappedCylinder( vec3 p, float h, float r ) {
      vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
      return min(max(d.x,d.y),0.0) + length(max(d,0.0));
    }

    float sdRoundedCylinder( vec3 p, float ra, float rb, float h ) {
      vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
      return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
    }

    float sdCappedCone( vec3 p, float h, float r1, float r2 ) {
      vec2 q = vec2( length(p.xz), p.y );
      vec2 k1 = vec2(r2,h);
      vec2 k2 = vec2(r2-r1,2.0*h);
      vec2 ca = vec2(q.x-min(q.x,(q.y<0.0)?r1:r2), abs(q.y)-h);
      vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot2(k2), 0.0, 1.0 );
      float s = (cb.x<0.0 && ca.y<0.0) ? -1.0 : 1.0;
      return s*sqrt( min(dot2(ca),dot2(cb)) );
    }

    float sdCutSphere( vec3 p, float r, float h ) {
      // sampling independent computations (only depend on shape)
      float w = sqrt(r*r-h*h);

      // sampling dependant computations
      vec2 q = vec2( length(p.xz), p.y );
      float s = max( (h-r)*q.x*q.x+w*w*(h+r-2.0*q.y), h*q.x-w*q.y );
      return (s<0.0) ? length(q)-r :
            (q.x<w) ? h - q.y     :
                      length(q-vec2(w,h));
    }

    float sdEllipsoid( vec3 p, vec3 r ) {
      float k0 = length(p/r);
      float k1 = length(p/(r*r));
      return k0*(k0-1.0)/k1;
    }

    float sdOctahedron( vec3 p, float s ) {
      p = abs(p);
      float m = p.x+p.y+p.z-s;
      vec3 q;
          if( 3.0*p.x < m ) q = p.xyz;
      else if( 3.0*p.y < m ) q = p.yzx;
      else if( 3.0*p.z < m ) q = p.zxy;
      else return m*0.57735027;
        
      float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
      return length(vec3(q.x,q.y-s+k,q.z-k)); 
    }

    float sdPyramid( vec3 p, float h ) {
      float m2 = h*h + 0.25;
        
      p.xz = abs(p.xz);
      p.xz = (p.z>p.x) ? p.zx : p.xz;
      p.xz -= 0.5;

      vec3 q = vec3( p.z, h*p.y - 0.5*p.x, h*p.x + 0.5*p.y);
      
      float s = max(-q.x,0.0);
      float t = clamp( (q.y-0.5*p.z)/(m2+0.25), 0.0, 1.0 );
        
      float a = m2*(q.x+s)*(q.x+s) + q.y*q.y;
      float b = m2*(q.x+0.5*t)*(q.x+0.5*t) + (q.y-m2*t)*(q.y-m2*t);
        
      float d2 = min(q.y,-q.x*m2-q.y*0.5) > 0.0 ? 0.0 : min(a,b);
        
      return sqrt( (d2+q.z*q.z)/m2 ) * sign(max(q.z,-p.y));
    }

    float sdVesicaSegment( in vec3 p, in vec3 a, in vec3 b, in float w ) {
        vec3  c = (a+b)*0.5;
        float l = length(b-a);
        vec3  v = (b-a)/l;
        float y = dot(p-c,v);
        vec2  q = vec2(length(p-c-y*v),abs(y));
        
        float r = 0.5*l;
        float d = 0.5*(r*r-w*w)/w;
        vec3  h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    
        return length(q-h.xy) - h.z;
    }
`;

export const sdfDefinitionsMap = {
  'sdSphere': 0,
  'sdBox': 1,
  'sdRoundBox': 2,
  'sdCone': 3,
  'sdHexPrism': 4,
  'sdTriPrism': 5,
  'sdCapsule': 6,
  'sdCappedCylinder': 7,
  'sdRoundedCylinder': 8,
  'sdCappedCone': 9,
  'sdCutSphere': 10,
  'sdEllipsoid': 11,
  'sdOctahedron': 12,
  'sdVescicaSegment': 13
};
