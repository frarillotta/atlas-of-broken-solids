'use client'

import dynamic from 'next/dynamic'
 
const Canvas = dynamic(() => import('~/components/Canvas').then((mod) => mod.Canvas), {
    ssr: false
})

const Scene = dynamic(() => import('~/components/Shaders/ShaderBase').then((mod) => mod.Scene), {
    ssr: false
})

export type RaymarchingProps = {
    matcap: {
        type: string,
        matcap: number
    },
    primarySdf: number,
    secondarySdf: number,
    noiseIntensity: number,
}
export const Raymarching: React.FC<RaymarchingProps> = ({
    matcap,
    noiseIntensity,
    primarySdf,
    secondarySdf
}) => {
    return <>
        <Canvas>
            <Scene 
                matcap={matcap} 
                noiseIntensity={noiseIntensity} 
                primarySdf={primarySdf}
                secondarySdf={secondarySdf} 
            />
        </Canvas>
    </>
}
