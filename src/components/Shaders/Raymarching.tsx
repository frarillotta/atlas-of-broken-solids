'use client'

import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { ACESFilmicToneMapping } from 'three'

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
    const [dpr, setDpr] = useState(window.devicePixelRatio)

    return <Canvas dpr={dpr}>
        <PerformanceMonitor ms={500} bounds={() => ([20, 60])} onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
        {dpr > 1 && <EffectComposer >
            <Bloom
                mipmapBlur
                intensity={1.85}
                radius={0.5}
                luminanceThreshold={0.6}
                luminanceSmoothing={0.5}
            />
            <ToneMapping mode={ACESFilmicToneMapping} />
        </EffectComposer>}
        <Scene
            dpr={dpr}
            matcap={matcap}
            noiseIntensity={noiseIntensity}
            primarySdf={primarySdf}
            secondarySdf={secondarySdf}
        />
    </Canvas>
}
