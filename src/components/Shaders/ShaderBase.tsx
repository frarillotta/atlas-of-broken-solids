import { useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera, useTexture } from "@react-three/drei";
import { } from 'framer-motion'
import {
    Texture,
    Vector2} from "three";
import { useEffect, useMemo } from "react";
import { raymarchingShader } from "./raymarchingShader";
import { RaymarchingProps } from "./Raymarching";

type ShaderBaseProps = { fragmentShader: string, texture?: string } & Omit<RaymarchingProps, 'matcap'>

const ShaderBaseComponent: React.FC<Omit<ShaderBaseProps, 'texture'> & { texture?: Texture, dpr: number }> = ({
    fragmentShader,
    texture,
    noiseIntensity,
    primarySdf,
    secondarySdf,
    dpr
}) => {
    const viewport = useThree(state => state.viewport);
    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_resolution: { value: new Vector2() },
        matcap: { type: "t", value: undefined as Texture | undefined },
        u_primarySDF: { value: 0 },
        u_secondarySDF: { value: 0 },
        u_noiseIntensity: { value: 0 },
        u_dpr: {value: dpr},
    }), []);

    const width = (Math.trunc(viewport.width * 10) / 10) * dpr;
    const height = (Math.trunc(viewport.height * 10) / 10) * dpr;
    useEffect(() => {
        uniforms.u_resolution.value = new Vector2(width, height);
        uniforms.u_primarySDF.value = primarySdf;
        uniforms.u_secondarySDF.value = secondarySdf;
        uniforms.u_noiseIntensity.value = noiseIntensity;
        uniforms.matcap.value = texture;
        uniforms.u_dpr.value = dpr;
    }, [
        width,
        height,
        uniforms.u_resolution,
        uniforms.u_primarySDF,
        uniforms.u_secondarySDF,
        uniforms.u_noiseIntensity,
        uniforms.u_dpr,
        uniforms.matcap,
        primarySdf,
        secondarySdf,
        noiseIntensity,
        texture,
        dpr
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


export const ShaderBase: React.FC<Required<ShaderBaseProps> & {dpr: number}> = ({
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

export const Scene: React.FC<RaymarchingProps & {dpr: number}> = ({
    matcap,
    noiseIntensity,
    primarySdf,
    secondarySdf,
    dpr
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
