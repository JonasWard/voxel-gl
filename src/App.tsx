import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';

function App() {
  return (
    <div className="w-[100svw] h-[100svh]">
      <Canvas camera={{ position: [3, 3, 3] }}>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
