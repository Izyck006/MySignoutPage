import React, { useState, useEffect } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, useTexture, Html, useProgress } from '@react-three/drei';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import * as THREE from 'three';
import { DecalGeometry, GLTFExporter } from 'three-stdlib';
interface Message {
  id: string;
  senderName: string;
  content: string;
  imageData?: string;
  position: [number, number, number];
  normal?: [number, number, number];
  tilt?: number;
}
interface ShirtModelProps {
  messages: Message[];
  onShirtClick?: (position: [number, number, number], normal: [number, number, number]) => void;
  readOnly?: boolean;
  isExporting?: boolean;
  onExportComplete?: () => void;
  ownerName?: string;
}
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 min-w-[200px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <div className="text-primary font-bold text-lg whitespace-nowrap">Loading Shirt...</div>
        <div className="text-gray-500 font-medium text-sm mt-1">{progress.toFixed(0)}%</div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4 overflow-hidden">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </Html>
  );
}
function SignatureDecal({ msg, mesh, scene }: { msg: Message; mesh: THREE.Mesh; scene: THREE.Object3D }) {
  const texture = useTexture(msg.imageData!);
  const geometry = React.useMemo(() => {
    const aspect = (texture.image as any).width / (texture.image as any).height;
    const planeWidth = 0.15; 
    const planeHeight = planeWidth / aspect;
    scene.updateMatrixWorld(true);
    const sceneLocalPos = new THREE.Vector3(...msg.position);
    const worldPos = scene.localToWorld(sceneLocalPos.clone());
    const meshLocalPos = mesh.worldToLocal(worldPos.clone());
    const sceneLocalNormal = new THREE.Vector3(...(msg.normal || [0, 0, 1])).normalize();
    const worldNormalPoint = scene.localToWorld(sceneLocalPos.clone().add(sceneLocalNormal));
    const meshLocalNormalPoint = mesh.worldToLocal(worldNormalPoint);
    const meshLocalNormal = meshLocalNormalPoint.sub(meshLocalPos).normalize();
    const dummy = new THREE.Object3D();
    dummy.position.copy(meshLocalPos);
    dummy.lookAt(meshLocalPos.clone().add(meshLocalNormal));
    if (msg.tilt) {
      dummy.rotateZ(msg.tilt);
    }
    const matrixWorld = mesh.matrixWorld.clone();
    mesh.matrixWorld.identity();
    const geo = new DecalGeometry(mesh, meshLocalPos, dummy.rotation, new THREE.Vector3(planeWidth, planeHeight, 0.05));
    mesh.matrixWorld = matrixWorld;
    return geo;
  }, [msg, mesh, scene, texture]);
  return createPortal(
    <mesh geometry={geometry}>
      <meshBasicMaterial
        map={texture}
        transparent={true}
        depthTest={true}
        polygonOffset={true}
        polygonOffsetFactor={-10}
      />
    </mesh>,
    mesh
  );
}
function OwnerNameDecal({ name, mesh, scene }: { name: string; mesh: THREE.Mesh; scene: THREE.Object3D }) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    if (!name) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let fontSize = 160;
      ctx.font = `bold ${fontSize}px sans-serif`;
      while (ctx.measureText(name).width > 900 && fontSize > 20) {
        fontSize -= 10;
        ctx.font = `bold ${fontSize}px sans-serif`;
      }
      ctx.fillStyle = "#111827"; 
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 16;
      setTexture(tex);
    }
  }, [name]);
  const geometry = React.useMemo(() => {
    if (!texture) return null;
    const position = new THREE.Vector3(0, 0.15, -0.05); 
    const normal = new THREE.Vector3(0, 0, -1);
    const size = new THREE.Vector3(0.25, 0.08, 0.1); 
    scene.updateMatrixWorld(true);
    const worldPos = scene.localToWorld(position.clone());
    const meshLocalPos = mesh.worldToLocal(worldPos.clone());
    const worldNormalPoint = scene.localToWorld(position.clone().add(normal));
    const meshLocalNormalPoint = mesh.worldToLocal(worldNormalPoint);
    const meshLocalNormal = meshLocalNormalPoint.sub(meshLocalPos).normalize();
    const dummy = new THREE.Object3D();
    dummy.position.copy(meshLocalPos);
    dummy.lookAt(meshLocalPos.clone().add(meshLocalNormal));
    const matrixWorld = mesh.matrixWorld.clone();
    mesh.matrixWorld.identity();
    const geo = new DecalGeometry(mesh, meshLocalPos, dummy.rotation, size);
    mesh.matrixWorld = matrixWorld;
    return geo;
  }, [mesh, scene, texture]);
  if (!geometry || !texture) return null;
  return createPortal(
    <mesh geometry={geometry}>
      <meshBasicMaterial
        map={texture}
        transparent={true}
        depthTest={true}
        polygonOffset={true}
        polygonOffsetFactor={-10}
      />
    </mesh>,
    mesh
  );
}
function ShirtMesh({ messages, onShirtClick, readOnly, ownerName, isExporting, onExportComplete }: ShirtModelProps) {
  const { scene } = useGLTF('/shirt.glb');
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);
  const material = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 1,
    metalness: 0.1,
    side: THREE.DoubleSide
  }), []);
  useEffect(() => {
    const m: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = material;
        m.push(child as THREE.Mesh);
      }
    });
    setMeshes(m);
  }, [scene, material]);
  useEffect(() => {
    if (isExporting) {
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = 'MySignout-Shirt.glb';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          if (onExportComplete) onExportComplete();
        },
        (error) => {
          console.error('An error happened during export:', error);
          if (onExportComplete) onExportComplete();
        },
        { binary: true } // Export as .glb
      );
    }
  }, [isExporting, scene, onExportComplete]);
  const handleClick = (e: any) => {
    if (readOnly || !onShirtClick) return;
    e.stopPropagation();
    const { point, face, object } = e;
    const localPoint = scene.worldToLocal(point.clone());
    let worldNormal = new THREE.Vector3(0, 0, 1);
    if (face) {
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(object.matrixWorld);
      worldNormal = face.normal.clone().applyMatrix3(normalMatrix).normalize();
    }
    const worldNormalPoint = point.clone().add(worldNormal);
    const localNormalPoint = scene.worldToLocal(worldNormalPoint);
    const localNormal = localNormalPoint.sub(localPoint).normalize();
    onShirtClick([localPoint.x, localPoint.y, localPoint.z], [localNormal.x, localNormal.y, localNormal.z]);
  };
  return (
    <group>
      <group position={[0, -5.5, 0]}>
        <primitive 
          object={scene} 
          scale={5}
          onClick={handleClick}
          onPointerOver={() => {
            if (!readOnly) document.body.style.cursor = 'crosshair';
          }}
          onPointerOut={() => {
            if (!readOnly) document.body.style.cursor = 'auto';
          }}
        >
          {messages.map((msg) =>
            meshes.map((mesh, index) => (
              <SignatureDecal msg={msg} mesh={mesh} scene={scene} key={`${msg.id}-${index}`} />
            ))
          )}
          {ownerName && meshes.map((mesh, index) => (
            <OwnerNameDecal name={ownerName} mesh={mesh} scene={scene} key={`owner-${index}`} />
          ))}
        </primitive>
      </group>
    </group>
  );
}
useGLTF.preload('/shirt.glb');
export default function ShirtModelContainer({ messages, onShirtClick, readOnly = false, isExporting, onExportComplete, ownerName }: ShirtModelProps) {
  const { width, height } = useWindowSize();
  return (
    <div className="w-full h-[450px] md:h-[600px] relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200 cursor-grab active:cursor-grabbing"
         style={{
           background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(245,243,248,1) 50%, rgba(228,217,235,1) 100%)'
         }}>
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Confetti
          width={width || 800}
          height={height || 600}
          recycle={true}
          numberOfPieces={40}
          gravity={0.02}
          colors={['#D4AF37', '#C0C0C0', '#FDF5E6', '#222222']}
        />
      </div>
      {!readOnly && (
        <div className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none">
          <div className="inline-block bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
            Rotate to explore. Click anywhere on the shirt to sign it!
          </div>
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
        <Environment preset="city" />
        <React.Suspense fallback={<Loader />}>
          <ShirtMesh 
            messages={messages} 
            onShirtClick={onShirtClick} 
            readOnly={readOnly} 
            ownerName={ownerName} 
            isExporting={isExporting} 
            onExportComplete={onExportComplete} 
          />
        </React.Suspense>
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="#1a1a1a" />
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={15}
          minPolarAngle={Math.PI / 4} // Restrict camera so you can't look under the shirt easily
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
