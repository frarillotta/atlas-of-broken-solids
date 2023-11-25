import { Object3DNode, extend, useFrame, useThree } from "@react-three/fiber";
import { Effects, OrbitControls, OrthographicCamera, useTexture, Stats } from "@react-three/drei";
import { } from 'framer-motion'
import {
    Texture,
    Vector2,
    ACESFilmicToneMapping
} from "three";
import { useEffect, useMemo } from "react";
import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { UnrealBloomPass, OutputPass } from "three/examples/jsm/Addons.js";
import { raymarchingShader } from "./raymarchingShader";
import { RaymarchingProps } from "./Raymarching";

type ShaderBaseProps = { fragmentShader: string, texture?: string } & Omit<RaymarchingProps, 'matcap'>

extend({ UnrealBloomPass, OutputPass })

// Add types to ThreeElements elements so primitives pick up on it
declare module '@react-three/fiber' {
    interface ThreeElements {
        unrealBloomPass: Object3DNode<UnrealBloomPass, typeof UnrealBloomPass>
        outputPass: Object3DNode<OutputPass, typeof OutputPass>
    }
}

const ShaderBaseComponent: React.FC<Omit<ShaderBaseProps, 'texture'> & { texture?: Texture }> = ({
    fragmentShader,
    texture,
    noiseIntensity,
    primarySdf,
    secondarySdf,
    dpr = 1
}) => {
    const viewport = useThree(state => state.viewport);
    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_resolution: { value: new Vector2() },
        matcap: { type: "t", value: undefined as Texture | undefined },
        u_primarySDF: { value: 0 },
        u_secondarySDF: { value: 0 },
        u_noiseIntensity: { value: 0 },
    }), []);

    const width = (Math.trunc(viewport.width * 10) / 10) * dpr;
    const height = (Math.trunc(viewport.height * 10) / 10) * dpr;
    useEffect(() => {
        uniforms.u_resolution.value = new Vector2(width, height);
        uniforms.u_primarySDF.value = primarySdf;
        uniforms.u_secondarySDF.value = secondarySdf;
        uniforms.u_noiseIntensity.value = noiseIntensity;
        uniforms.matcap.value = texture;
    }, [
        width,
        height,
        uniforms.u_resolution,
        uniforms.u_primarySDF,
        uniforms.u_secondarySDF,
        uniforms.u_noiseIntensity,
        uniforms.matcap,
        primarySdf,
        secondarySdf,
        noiseIntensity,
        texture
    ])
    useFrame(({ clock }) => {
        uniforms.u_time.value = clock.elapsedTime;
    });
    return (
        <>
            <mesh scale={[width, height, 1]}>
                <planeGeometry args={[2, 2]} />
                <shaderMaterial
                    uniforms={uniforms}
                    fragmentShader={fragmentShader}
                />
            </mesh>
        </>
    );
};


export const ShaderBase: React.FC<Required<ShaderBaseProps>> = ({
    fragmentShader,
    texture,
    noiseIntensity,
    primarySdf,
    secondarySdf,
    dpr
}) => {

    const tex = useTexture(texture);

    return (
        <ShaderBaseComponent
            dpr={dpr}
            noiseIntensity={noiseIntensity}
            primarySdf={primarySdf}
            secondarySdf={secondarySdf}
            fragmentShader={fragmentShader}
            texture={tex}
        />
    );
};

export const Scene: React.FC<RaymarchingProps> = ({
    matcap,
    noiseIntensity,
    primarySdf,
    secondarySdf,
    dpr = 1
}) => {
    const matcapTex = `/matcaps/${matcap.type}/${matcap.matcap}.png`;

    return <>

        <OrthographicCamera
            makeDefault
            // zoom={600}
            args={[
                -1, // left
                1, // right
                1, // top
                -1, // bottom
                -1, // near,
                1, // far
            ]}
        />
        <EffectComposer>
            <Bloom
                mipmapBlur
                intensity={1.85}
                radius={0.5}
                luminanceThreshold={0.6}
                luminanceSmoothing={0.5}
            />
            <ToneMapping mode={ACESFilmicToneMapping} />
        </EffectComposer>
        <ShaderBase
            dpr={dpr}
            fragmentShader={raymarchingShader}
            texture={matcapTex}
            noiseIntensity={noiseIntensity}
            primarySdf={primarySdf}
            secondarySdf={secondarySdf}
        />
    </>
}
