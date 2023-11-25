'use client';

import styles from './page.module.css'
import dynamic from 'next/dynamic'
import { sdfDefinitionsMap } from '~/shaders';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Raymarching = dynamic(() => import('~/components/Shaders/Raymarching').then((mod) => mod.Raymarching), {
  ssr: false
})

const matcaps = {
  Diamond: {
    length: 37
  },
  Iridescent: {
    length: 41
  }
}
const getRandomMatcap = () => {
  const matcapKeys = Object.keys(matcaps)
  const type = matcapKeys[Math.floor(Math.random() * matcapKeys.length)] as keyof typeof matcaps;
  const matcap = Math.ceil(Math.random() * matcaps[type].length);
  return {
    type,
    matcap
  }
}
const readMatcapFromQuery = (matcapString: string | null | undefined): {
  type: keyof typeof matcaps,
  matcap: number,
} | null => {
  if (!matcapString) return null;
  const splitString = matcapString.split('-');
  return {
    type: splitString[0] as keyof typeof matcaps,
    matcap: parseInt(splitString[1])
  }
}


const generateShaderParams = (searchParams?: ReadonlyURLSearchParams) => {
  const primarySdf = searchParams?.get('primarySdf')
    ? Number(searchParams.get('primarySdf'))
    : Math.floor(Math.random() * Object.values(sdfDefinitionsMap).length);

  const secondarySdf = searchParams?.get('secondarySdf')
    ? Number(searchParams.get('secondarySdf'))
    : Math.floor(Math.random() * Object.values(sdfDefinitionsMap).length);

  const matcap = readMatcapFromQuery(searchParams?.get('matcap')) || getRandomMatcap();
  const noiseIntensity = searchParams?.get('seed')
    ? Number(searchParams.get('seed'))
    : 1 + (Math.random() * 2.);

  return {
    matcap,
    primarySdf,
    secondarySdf,
    noiseIntensity
  }
}

export default function Home() {
  const searchParams = useSearchParams();
  const [shaderParams, setShaderParams] = useState(generateShaderParams(searchParams));

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Atlas of<br />broken<br /> solids
      </h1>
      <button onClick={() => {
        const currentPath = window.location.origin
        navigator.clipboard.writeText(`${currentPath}/?primarySdf=${shaderParams.primarySdf}&secondarySdf=${shaderParams.secondarySdf}&seed=${shaderParams.noiseIntensity}&matcap=${shaderParams.matcap.type}-${shaderParams.matcap.matcap}`)
      }}>save</button>
      <button onClick={() => {
        // remove the query string from the browser's history
        window.history.replaceState({ ...window.history.state, as: '/', url: '/' }, '', '/');

        setShaderParams(generateShaderParams())
      }}>generate a new solid</button>
      <div style={{ minHeight: '380px', minWidth: '380px', height: '50vh', width: '50vw' }}>
        <Raymarching {...shaderParams} />
      </div>
    </main>
  )
}
