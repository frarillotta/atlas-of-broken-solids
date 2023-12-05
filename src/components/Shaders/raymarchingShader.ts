import { sdfDefinitions, snoise3d } from "~/shaders";

/***
 * SDF Map
 * 0 = sdSphere
 * 1 = sdBox
 * 2 = sdRoundBox
 * 3 = sdCone
 * 4 = sdHexPrism
 * 5 = sdTriPrism
 * 6 = sdCapsule
 * 7 = sdCappedCylinder
 * 8 = sdRoundedCylinder
 * 9 = sdCappedCone
 * 10 = sdCutSphere
 * 11 = sdEllipsoid
 * 12 = sdOctahedron
 * 13 = sdPyramid
 * 14 = sdVescicaSegment
 */
export const raymarchingShader =  /*glsl*/`
    #ifdef GL_ES
    precision highp float;
    #endif

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform sampler2D matcap;
    uniform float u_primarySDF;
    uniform float u_secondarySDF;
    uniform float u_noiseIntensity;
    float PI = 3.14155925;
    ${snoise3d}
    ${sdfDefinitions}
    #ifndef FNC_RATIO
    #define FNC_RATIO
    vec2 ratio(in vec2 st, in vec2 s) {
        return mix( vec2((st.x*s.x/s.y)-(s.x*.5-s.y*.5)/s.y,st.y),
                    vec2(st.x,st.y*(s.y/s.x)-(s.y*.5-s.x*.5)/s.x),
                    step(s.x,s.y));
    }
    #endif

    vec2 getmatcap(vec3 eye, vec3 normal) {
        vec3 reflected = reflect(eye, normal);
        float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
        return reflected.xy / m + 0.5;
    }

    float sdf(vec3 p) {
        vec3 distortedP = p;
        distortedP.x += (snoise(p) * u_noiseIntensity) / 15.;
        distortedP.y += (snoise(p) * u_noiseIntensity) / 15.;
        distortedP.z += (snoise(p) * u_noiseIntensity) / 15.;
        vec3 distortedP2 = p;
        distortedP2.x += (snoise(p* 4.) * (u_noiseIntensity / 2.)) / 10.;
        distortedP2.y += (snoise(p* 4.) * (u_noiseIntensity / 2.)) / 10.;
        distortedP2.z += (snoise(p* 4.) * (u_noiseIntensity / 2.)) / 10.;

        float primarySdf;
        if (u_primarySDF == 0.) {
            primarySdf = sdSphere(distortedP, 0.25);
        }

        if (u_primarySDF == 1.) {
            primarySdf = sdBox(distortedP, vec3(0.2));
        }

        if (u_primarySDF == 2.) {
            primarySdf = sdRoundBox(distortedP, vec3(0.15), .07);
        }

        if (u_primarySDF == 3.) {
            primarySdf = sdCone(distortedP, vec2(0.3, 0.6), .4);
        }

        if (u_primarySDF == 4.) {
            primarySdf = sdHexPrism(distortedP, vec2(0.2, 0.4));
        }

        if (u_primarySDF == 5.) {
            primarySdf = sdTriPrism(distortedP, vec2(0.35, 0.45));
        }

        if (u_primarySDF == 6.) {
            primarySdf = sdCapsule(distortedP, vec3(.3, .01, .2), vec3(-.1, .0, -.3), .25);
        }

        if (u_primarySDF == 7.) {
            primarySdf = sdCappedCylinder(distortedP, .6, .2);
        }

        if (u_primarySDF == 8.) {
            primarySdf = sdRoundedCylinder(distortedP, .2, .02, .15);
        }

        if (u_primarySDF == 9.) {
            primarySdf = sdCappedCone(distortedP, .6, .07, .25);
        }

        if (u_primarySDF == 10.) {
            primarySdf = sdCutSphere(distortedP, .45, -.02);
        }

        if (u_primarySDF == 11.) {
            primarySdf = sdEllipsoid(distortedP, vec3(.2, .3, .6));
        }

        if (u_primarySDF == 12.) {
            primarySdf = sdOctahedron(distortedP, .38);
        }

        if (u_primarySDF == 13.) {
            primarySdf = sdVesicaSegment(distortedP, vec3(-0.18,-0.26, 0.0), vec3( 0.18, 0.3, 0.0), 0.22);
        }

        float secondarySdf;
        if (u_secondarySDF == 0.) {
            secondarySdf = sdSphere(distortedP2, 0.25);
        }

        if (u_secondarySDF == 1.) {
            secondarySdf = sdBox(distortedP2, vec3(0.2));
        }

        if (u_secondarySDF == 2.) {
            secondarySdf = sdRoundBox(distortedP2, vec3(0.15), .075);
        }

        if (u_secondarySDF == 3.) {
            secondarySdf = sdCone(distortedP2, vec2(0.375, 0.375), 4.75);
        }

        if (u_secondarySDF == 4.) {
            secondarySdf = sdHexPrism(distortedP2, vec2(0.2, 0.5));
        }

        if (u_secondarySDF == 5.) {
            secondarySdf = sdTriPrism(distortedP2, vec2(0.2, 0.45));
        }

        if (u_secondarySDF == 6.) {
            secondarySdf = sdCapsule(distortedP2, vec3(.3, .025, .45), vec3(-.175, .0, -.375), .25);
        }

        if (u_secondarySDF == 7.) {
            secondarySdf = sdCappedCylinder(distortedP2, .5, .175);
        }

        if (u_secondarySDF == 8.) {
            secondarySdf = sdRoundedCylinder(distortedP2, .17, .05, .15);
        }

        if (u_secondarySDF == 9.) {
            secondarySdf = sdCappedCone(distortedP2, .45, .075, .25);
        }

        if (u_secondarySDF == 10.) {
            secondarySdf = sdCutSphere(distortedP2, .275, -.025);
        }

        if (u_secondarySDF == 11.) {
            secondarySdf = sdEllipsoid(distortedP2, vec3(.15, .25, .45));
        }

        if (u_secondarySDF == 12.) {
            secondarySdf = sdOctahedron(distortedP2, .375);
        }

        if (u_secondarySDF == 13.) {
            secondarySdf = sdVesicaSegment(distortedP2, vec3(-0.175,-0.26, 0.0), vec3( 0.175, 0.35, 0.0), 0.275);
        }

        return max(-secondarySdf, primarySdf);
    }

    vec3 norm(vec3 p) {
        mat3 k = mat3(p,p,p)-mat3(0.001);
        return normalize(sdf(p) - vec3(sdf(k[0]),sdf(k[1]),sdf(k[2])));
    }

    vec3 erot(vec3 p, vec3 ax, float ro) {
        return mix(dot(p,ax)*ax,p,cos(ro))+sin(ro)*cross(ax,p);
    }

    // https://iquilezles.org/articles/nvscene2008/rwwtt.pdf
    float calcAO( in vec3 pos, in vec3 nor )
    {
        float occ = 0.0;
        float sca = 1.0;
        for( int i=0; i<5; i++ )
        {
            float h = 0.01 + 0.12*float(i)/4.0;
            float d = sdf( pos + h*nor );
            occ += (h-d)*sca;
            sca *= 0.95;
            if( occ>0.35 ) break;
        }
        return clamp( 1.0 - 3.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.y);
    }


    // https://iquilezles.org/articles/rmshadows
    float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax ) {
        // bounding volume
        float tp = (0.8-ro.y)/rd.y; if( tp>0.0 ) tmax = min( tmax, tp );

        float res = 1.0;
        float t = mint;
        for( int i=0; i<24; i++ ) {
            float h = sdf( ro + rd*t );
            float s = clamp(8.0*h/t,0.0,1.0);
            res = min( res, s );
            t += clamp( h, 0.01, 0.2 );
            if( res<0.004 || t>tmax ) break;
        }
        res = clamp( res, 0.0, 1.0 );
        return res*res*(3.0-2.0*res);
    }


    void main() {
        vec2 uv = (gl_FragCoord.xy-0.5*u_resolution.xy)/u_resolution.y;

        vec3 cam = normalize(vec3(1.2,uv));
        vec3 init = vec3(-2.,0.,0.);
    
        float yrot = 0.5;
        float zrot = u_time*.6;

        vec3 bg = vec3(0.);
        vec3 color = bg;

        cam = erot(cam, vec3(0,1,0), yrot);
        init = erot(init, vec3(0,1,0), yrot);
        cam = erot(cam, vec3(0,0,1), zrot);
        init = erot(init, vec3(0,0,1), zrot);
        
        vec3 p = init;
        bool hit = false;
        for (int i = 0; i < 128 && !hit; i++) {
            float dist = sdf(p);
            hit = dist < 0.002;
            p+=dist*cam*.4;
            if (hit == true || distance(p,init)>5.) break;
        }
        if (hit == true) {
            vec3 normal = norm(p);
            
            // lighting
            float occ = calcAO( cam, normal );
            vec3  lig = normalize( vec3(-0.5, 0.4, -0.6) );
            float shadow = calcSoftshadow( cam, lig, 0.02, 2.5 );
            vec2 matcapUV = getmatcap(cam, normal);
            color = texture2D(matcap, matcapUV).rgb;
            // float dif = clamp( dot( normal, lig ), 0., 1.0 );
            float dif = 1.;
            dif *= occ;
            dif *= shadow;

            // color *= occ;
            color = color*dif*vec3(1.00,1.00,1.00);
        }

        gl_FragColor = vec4(color,1.0);
    }
`
