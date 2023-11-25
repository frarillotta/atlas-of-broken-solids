'use client'

import { PerformanceMonitor } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useState } from 'react'

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
    dpr?: number
}
export const Raymarching: React.FC<RaymarchingProps> = ({
    matcap,
    noiseIntensity,
    primarySdf,
    secondarySdf
}) => {
    const [dpr, setDpr] = useState(Math.max(window.devicePixelRatio, 2))

    return <>
        <Canvas dpr={dpr}>
            <PerformanceMonitor bounds={() => ([20, 60])} onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
            <Scene
                dpr={dpr}
                matcap={matcap}
                noiseIntensity={noiseIntensity}
                primarySdf={primarySdf}
                secondarySdf={secondarySdf}
            />
        </Canvas>
    </>
}
