import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

export default ({mode}: { mode: string }) => {
  return defineConfig({
    define:{
      'process.env':{...process.env, ...loadEnv(mode, process.cwd())}
    }
  });
}