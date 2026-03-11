<img src={rmImg1} alt={t.title} />
<img src={rmImg1} alt={selected.title} />import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

function floorToneColor(floorTone) {
  const normalized = String(floorTone || '').toLowerCase()

  if (normalized.includes('walnut')) {
    return '#cba889'
  }

  if (normalized.includes('ash')) {
    return '#ddd7ce'
  }

  if (normalized.includes('stone')) {
    return '#d8d4ce'
  }

  return '#f4efe6'
}

function wallFeaturePosition(feature, roomWidthMeters, roomDepthMeters) {
  const wall = feature.wall

  if (wall === 'north' || wall === 'south') {
    const x = ((feature.offset - 50) / 100) * roomWidthMeters
    return {
      position: [x, feature.base / 100 + feature.height / 200, wall === 'north' ? -roomDepthMeters / 2 + 0.03 : roomDepthMeters / 2 - 0.03],
      rotation: [0, 0, 0],
      args: [feature.width / 100, feature.height / 100, feature.type === 'window' ? 0.05 : 0.08],
    }
  }

  const z = ((feature.offset - 50) / 100) * roomDepthMeters
  return {
    position: [wall === 'west' ? -roomWidthMeters / 2 + 0.03 : roomWidthMeters / 2 - 0.03, feature.base / 100 + feature.height / 200, z],
    rotation: [0, Math.PI / 2, 0],
    args: [feature.width / 100, feature.height / 100, feature.type === 'window' ? 0.05 : 0.08],
  }
}

function furniturePosition(item, roomWidthMeters, roomDepthMeters, asset) {
  const x = ((item.x - 50) / 100) * roomWidthMeters
  const z = ((item.y - 50) / 100) * roomDepthMeters
  const width = (asset.width / 100) * item.scale
  const height = (asset.height / 100) * item.scale
  const depth = (asset.depth / 100) * item.scale

  return {
    position: [x, height / 2, z],
    rotation: [0, (item.rotation * Math.PI) / 180, 0],
    args: [width, height, depth],
  }
}

export default function WorkspaceScene3D({
  roomDetails,
  roomFeatures,
  placedItems,
  assetsById,
  selectedItemId,
  selectedFeatureId,
}) {
  const roomWidthMeters = Math.max(roomDetails.width / 100, 2.4)
  const roomDepthMeters = Math.max(roomDetails.depth / 100, 2.4)
  const roomHeightMeters = Math.max(roomDetails.height / 100, 2.2)
  const wallColor = roomDetails.wallColor || '#f7f7f5'
  const floorColor = floorToneColor(roomDetails.floorTone)

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[0, roomHeightMeters * 0.8, roomDepthMeters * 1.4]} fov={42} />
      <color attach="background" args={['#ecebea']} />

      <ambientLight intensity={0.85} />
      <directionalLight
        castShadow
        position={[4, 6, 4]}
        intensity={1.1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-3, 2.8, -2]} intensity={0.4} />

      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[roomWidthMeters, roomDepthMeters]} />
          <meshStandardMaterial color={floorColor} roughness={0.92} />
        </mesh>

        <mesh position={[0, roomHeightMeters / 2, -roomDepthMeters / 2]} receiveShadow>
          <boxGeometry args={[roomWidthMeters, roomHeightMeters, 0.08]} />
          <meshStandardMaterial color={wallColor} roughness={0.95} />
        </mesh>

        <mesh position={[-roomWidthMeters / 2, roomHeightMeters / 2, 0]} receiveShadow>
          <boxGeometry args={[0.08, roomHeightMeters, roomDepthMeters]} />
          <meshStandardMaterial color={wallColor} roughness={0.94} />
        </mesh>

        <mesh position={[roomWidthMeters / 2, roomHeightMeters / 2, 0]} receiveShadow>
          <boxGeometry args={[0.08, roomHeightMeters, roomDepthMeters]} />
          <meshStandardMaterial color={wallColor} roughness={0.94} />
        </mesh>
      </group>

      {roomFeatures.map((feature) => {
        const geometry = wallFeaturePosition(feature, roomWidthMeters, roomDepthMeters)
        const isSelected = feature.id === selectedFeatureId

        return (
          <mesh
            key={feature.id}
            position={geometry.position}
            rotation={geometry.rotation}
            castShadow
          >
            <boxGeometry args={geometry.args} />
            <meshStandardMaterial
              color={feature.type === 'window' ? '#b9d7ef' : '#81624f'}
              emissive={isSelected ? '#cc6c5b' : '#000000'}
              emissiveIntensity={isSelected ? 0.25 : 0}
              transparent={feature.type === 'window'}
              opacity={feature.type === 'window' ? 0.72 : 1}
            />
          </mesh>
        )
      })}

      {placedItems.map((item) => {
        const asset = assetsById[item.assetId]
        if (!asset) {
          return null
        }

        const geometry = furniturePosition(item, roomWidthMeters, roomDepthMeters, asset)
        const isSelected = item.instanceId === selectedItemId

        return (
          <group key={item.instanceId} position={geometry.position} rotation={geometry.rotation}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={geometry.args} />
              <meshStandardMaterial
                color={asset.tone}
                roughness={0.78}
                metalness={0.04}
                emissive={isSelected ? '#b86e60' : '#000000'}
                emissiveIntensity={isSelected ? 0.22 : 0}
              />
            </mesh>
            <mesh castShadow receiveShadow position={[0, geometry.args[1] / 2 + 0.05, 0]}>
              <boxGeometry args={[geometry.args[0] * 0.9, 0.04, geometry.args[2] * 0.9]} />
              <meshStandardMaterial color="#f8f5f0" roughness={0.9} />
            </mesh>
          </group>
        )
      })}

      <gridHelper args={[Math.max(roomWidthMeters, roomDepthMeters) * 1.5, 16, '#c5beb6', '#ddd7d1']} position={[0, 0.001, 0]} />

      <OrbitControls
        makeDefault
        enablePan
        enableDamping
        dampingFactor={0.09}
        minDistance={3}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.08}
        target={[0, roomHeightMeters * 0.35, 0]}
      />
    </Canvas>
  )
}