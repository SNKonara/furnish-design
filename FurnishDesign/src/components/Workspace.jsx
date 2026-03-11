import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import desk1 from '../assets/images/desk1.webp'
import placeholderImage from '../assets/dummy-hero-room.svg'
import './workspace.css'

const WorkspaceScene3D = lazy(() => import('./WorkspaceScene3D.jsx'))

const catalogAssets = [
  {
    id: 'sofa',
    name: 'Scandi Oak Sofa',
    category: 'Seating',
    width: 220,
    depth: 95,
    height: 83,
    price: 1249,
    image: desk1,
    accent: '#cab39a',
    tone: '#c4ad95',
  },
  {
    id: 'desk',
    name: 'Minimalist Desk',
    category: 'Work',
    width: 160,
    depth: 70,
    height: 76,
    price: 980,
    image: placeholderImage,
    accent: '#dbcdbd',
    tone: '#cfae8a',
  },
  {
    id: 'lamp',
    name: 'Arc Floor Lamp',
    category: 'Lighting',
    width: 48,
    depth: 48,
    height: 165,
    price: 340,
    image: placeholderImage,
    accent: '#efe7dc',
    tone: '#ddd6cb',
  },
  {
    id: 'armchair',
    name: 'Velvet Armchair',
    category: 'Seating',
    width: 92,
    depth: 82,
    height: 88,
    price: 710,
    image: placeholderImage,
    accent: '#7b593d',
    tone: '#8a6348',
  },
  {
    id: 'shelf',
    name: 'Floating Shelf',
    category: 'Storage',
    width: 120,
    depth: 30,
    height: 100,
    price: 410,
    image: placeholderImage,
    accent: '#ece5d8',
    tone: '#e7ddcf',
  },
  {
    id: 'credenza',
    name: 'Walnut Credenza',
    category: 'Storage',
    width: 180,
    depth: 45,
    height: 72,
    price: 1100,
    image: placeholderImage,
    accent: '#8b5d40',
    tone: '#8c5f43',
  },
]

const initialPlacedItems = [
  {
    instanceId: 'placed-sofa-1',
    assetId: 'sofa',
    x: 50,
    y: 63,
    rotation: 0,
    scale: 1,
  },
]

const initialRoomFeatures = [
  {
    id: 'window-1',
    type: 'window',
    wall: 'north',
    width: 140,
    height: 110,
    offset: 52,
    base: 92,
  },
  {
    id: 'door-1',
    type: 'door',
    wall: 'east',
    width: 92,
    height: 210,
    offset: 46,
    base: 0,
  },
]

const wallOptions = ['north', 'east', 'south', 'west']

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function createPlacedItem(asset, x = 50, y = 62) {
  return {
    instanceId: `${asset.id}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    assetId: asset.id,
    x,
    y,
    rotation: 0,
    scale: 1,
  }
}

function createRoomFeature(type) {
  return {
    id: `${type}-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    type,
    wall: type === 'window' ? 'north' : 'east',
    width: type === 'window' ? 140 : 92,
    height: type === 'window' ? 110 : 210,
    offset: 50,
    base: type === 'window' ? 90 : 0,
  }
}

function openingMarkerStyle(feature, roomDetails) {
  const horizontal = feature.wall === 'north' || feature.wall === 'south'
  const widthPercent = horizontal
    ? clamp((feature.width / Math.max(roomDetails.width, 1)) * 100, 8, 36)
    : 2.2
  const heightPercent = horizontal
    ? 2.2
    : clamp((feature.width / Math.max(roomDetails.depth, 1)) * 100, 10, 34)

  const offsetPercent = clamp(feature.offset, 8, 92)
  const baseClassName = `workspace-opening-marker is-${feature.type} wall-${feature.wall}`

  if (feature.wall === 'north') {
    return {
      className: baseClassName,
      style: { left: `${offsetPercent}%`, top: '1.5%', width: `${widthPercent}%`, height: `${heightPercent}%` },
    }
  }

  if (feature.wall === 'south') {
    return {
      className: baseClassName,
      style: { left: `${offsetPercent}%`, bottom: '1.5%', width: `${widthPercent}%`, height: `${heightPercent}%` },
    }
  }

  if (feature.wall === 'east') {
    return {
      className: baseClassName,
      style: { right: '1.5%', top: `${offsetPercent}%`, width: `${widthPercent}%`, height: `${heightPercent}%` },
    }
  }

  return {
    className: baseClassName,
    style: { left: '1.5%', top: `${offsetPercent}%`, width: `${widthPercent}%`, height: `${heightPercent}%` },
  }
}

export default function Workspace() {
  const stageRef = useRef(null)
  const dragStateRef = useRef(null)

  const [viewMode, setViewMode] = useState('3d')
  const [zoom, setZoom] = useState(125)
  const [searchText, setSearchText] = useState('')
  const [roomDetails, setRoomDetails] = useState({
    name: 'Scene Living Room 01',
    width: 520,
    depth: 380,
    height: 290,
    style: 'Scandi / Oak',
    wallColor: '#f7f7f5',
    floorTone: 'Natural Oak',
  })
  const [placedItems, setPlacedItems] = useState(initialPlacedItems)
  const [roomFeatures, setRoomFeatures] = useState(initialRoomFeatures)
  const [selectedItemId, setSelectedItemId] = useState(initialPlacedItems[0].instanceId)
  const [selectedFeatureId, setSelectedFeatureId] = useState(initialRoomFeatures[0].id)

  const assetsById = useMemo(
    () => Object.fromEntries(catalogAssets.map((asset) => [asset.id, asset])),
    [],
  )

  const filteredAssets = useMemo(() => {
    const term = searchText.trim().toLowerCase()
    if (!term) {
      return catalogAssets
    }

    return catalogAssets.filter(
      (asset) => asset.name.toLowerCase().includes(term) || asset.category.toLowerCase().includes(term),
    )
  }, [searchText])

  const selectedPlacedItem = placedItems.find((item) => item.instanceId === selectedItemId)
  const selectedAsset = selectedPlacedItem ? assetsById[selectedPlacedItem.assetId] : null
  const selectedFeature = roomFeatures.find((feature) => feature.id === selectedFeatureId)

  const totalEstimatedCost = placedItems.reduce((sum, item) => {
    const asset = assetsById[item.assetId]
    return sum + (asset ? asset.price : 0)
  }, 0)

  useEffect(() => {
    function handlePointerMove(event) {
      const dragState = dragStateRef.current
      const stage = stageRef.current

      if (!dragState || !stage) {
        return
      }

      const rect = stage.getBoundingClientRect()
      const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 9, 91)
      const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 16, 88)

      setPlacedItems((currentItems) =>
        currentItems.map((item) =>
          item.instanceId === dragState.instanceId ? { ...item, x, y } : item,
        ),
      )
    }

    function handlePointerUp() {
      dragStateRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  function handleDropOnStage(event) {
    event.preventDefault()

    const assetId = event.dataTransfer.getData('application/x-furnish-asset')
    if (!assetId || !stageRef.current) {
      return
    }

    const asset = assetsById[assetId]
    if (!asset) {
      return
    }

    const rect = stageRef.current.getBoundingClientRect()
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 9, 91)
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 16, 88)
    const newItem = createPlacedItem(asset, x, y)

    setPlacedItems((currentItems) => [...currentItems, newItem])
    setSelectedItemId(newItem.instanceId)
    setSelectedFeatureId('')
  }

  function handleStageDragOver(event) {
    event.preventDefault()
  }

  function startDraggingPlacedItem(instanceId, event) {
    event.preventDefault()
    dragStateRef.current = { instanceId }
    setSelectedItemId(instanceId)
    setSelectedFeatureId('')
  }

  function addAssetToScene(asset) {
    const newItem = createPlacedItem(asset)
    setPlacedItems((currentItems) => [...currentItems, newItem])
    setSelectedItemId(newItem.instanceId)
    setSelectedFeatureId('')
  }

  function removeSelectedItem() {
    if (!selectedPlacedItem) {
      return
    }

    const remainingItems = placedItems.filter(
      (item) => item.instanceId !== selectedPlacedItem.instanceId,
    )
    setPlacedItems(remainingItems)
    setSelectedItemId(remainingItems[0] ? remainingItems[0].instanceId : '')
  }

  function addRoomFeature(type) {
    const nextFeature = createRoomFeature(type)
    setRoomFeatures((current) => [...current, nextFeature])
    setSelectedFeatureId(nextFeature.id)
    setSelectedItemId('')
    setViewMode('2d')
  }

  function removeSelectedFeature() {
    if (!selectedFeature) {
      return
    }

    const remainingFeatures = roomFeatures.filter((feature) => feature.id !== selectedFeature.id)
    setRoomFeatures(remainingFeatures)
    setSelectedFeatureId(remainingFeatures[0] ? remainingFeatures[0].id : '')
  }

  function updateRoomDetail(field, value) {
    setRoomDetails((current) => ({ ...current, [field]: value }))
  }

  function updateSelectedItem(field, value) {
    if (!selectedPlacedItem) {
      return
    }

    const normalizedValue = field === 'scale' ? clamp(value, 0.6, 1.8) : value
    setPlacedItems((currentItems) =>
      currentItems.map((item) =>
        item.instanceId === selectedPlacedItem.instanceId ? { ...item, [field]: normalizedValue } : item,
      ),
    )
  }

  function updateSelectedFeature(field, value) {
    if (!selectedFeature) {
      return
    }

    setRoomFeatures((currentFeatures) =>
      currentFeatures.map((feature) =>
        feature.id === selectedFeature.id ? { ...feature, [field]: value } : feature,
      ),
    )
  }

  function renderStageItem(item) {
    const asset = assetsById[item.assetId]
    if (!asset) {
      return null
    }

    const isSelected = item.instanceId === selectedItemId
    const widthPercent = clamp((asset.width / Math.max(roomDetails.width, 1)) * 100 * item.scale, 8, 28)
    const depthPercent = clamp((asset.depth / Math.max(roomDetails.depth, 1)) * 100 * item.scale, 8, 24)

    return (
      <button
        key={item.instanceId}
        type="button"
        className={`workspace-stage-item is-2d ${isSelected ? 'is-selected' : ''}`}
        style={{
          left: `${item.x}%`,
          top: `${item.y}%`,
          width: `${widthPercent}%`,
          height: `${depthPercent}%`,
          transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
          background: asset.accent,
        }}
        onPointerDown={(event) => startDraggingPlacedItem(item.instanceId, event)}
        onClick={() => {
          setSelectedItemId(item.instanceId)
          setSelectedFeatureId('')
        }}
      >
        <strong>{asset.name}</strong>
        <span>{asset.category}</span>
      </button>
    )
  }

  function renderOpeningMarker(feature) {
    const marker = openingMarkerStyle(feature, roomDetails)
    return (
      <button
        key={feature.id}
        type="button"
        className={`${marker.className} ${feature.id === selectedFeatureId ? 'is-selected' : ''}`}
        style={marker.style}
        onClick={() => {
          setSelectedFeatureId(feature.id)
          setSelectedItemId('')
        }}
      >
        <span>{feature.type}</span>
      </button>
    )
  }

  return (
    <main className="workspace-page">
      <div className="workspace-shell">
        <header className="workspace-topbar">
          <div className="workspace-brand-side">
            <div className="workspace-brand-mark" aria-hidden="true" />
            <Link to="/dashboard" className="workspace-brand-name">
              FurnishDesign Studio
            </Link>
            <nav className="workspace-nav" aria-label="Primary navigation">
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Dashboard
              </NavLink>
              <a href="#">Collections</a>
              <NavLink to="/workspace" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Workspace
              </NavLink>
            </nav>
          </div>

          <div className="workspace-topbar-tools">
            <label className="workspace-global-search" htmlFor="workspace-search-input">
              <span aria-hidden="true">o</span>
              <input
                id="workspace-search-input"
                type="search"
                placeholder="Search assets..."
              />
            </label>
            <button type="button" className="workspace-icon-button" aria-label="Alerts">
              o
            </button>
            <div className="workspace-profile-pill">FD</div>
          </div>
        </header>

        <div className="workspace-layout">
          <aside className="workspace-library-panel">
            <div className="workspace-panel-head">
              <strong>Asset Library</strong>
              <button type="button" className="workspace-filter-button">
                Filter
              </button>
            </div>

            <label className="workspace-library-search" htmlFor="library-search-input">
              <span aria-hidden="true">o</span>
              <input
                id="library-search-input"
                type="search"
                placeholder="Search furniture..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </label>

            <div className="workspace-library-list">
              {filteredAssets.map((asset) => (
                <article key={asset.id} className="workspace-asset-card">
                  {/* TODO: Replace with your real furniture thumbnail */}
                  <img
                    src={asset.image}
                    alt={asset.name}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/x-furnish-asset', asset.id)
                    }}
                  />
                  <div className="workspace-asset-meta">
                    <div>
                      <strong>{asset.name}</strong>
                      <span>{asset.category}</span>
                    </div>
                    <button type="button" onClick={() => addAssetToScene(asset)}>
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="workspace-layer-panel">
              <strong>Scene Layers</strong>
              <div>
                <span>Furniture</span>
                <span>{placedItems.length}</span>
              </div>
              <div>
                <span>Windows</span>
                <span>{roomFeatures.filter((feature) => feature.type === 'window').length}</span>
              </div>
              <div>
                <span>Doors</span>
                <span>{roomFeatures.filter((feature) => feature.type === 'door').length}</span>
              </div>
              <div>
                <span>Architecture</span>
                <span>{roomFeatures.length + 2}</span>
              </div>
            </div>
          </aside>

          <section className="workspace-stage-panel">
            <div className="workspace-toolbar">
              <div className="workspace-toolbar-group">
                <button type="button">Fit</button>
                <button type="button" onClick={() => setZoom((current) => clamp(current - 10, 80, 160))}>
                  -
                </button>
                <span>{zoom}%</span>
                <button type="button" onClick={() => setZoom((current) => clamp(current + 10, 80, 160))}>
                  +
                </button>
              </div>

              <div className="workspace-toolbar-group workspace-view-switcher">
                <button
                  type="button"
                  className={viewMode === '2d' ? 'is-active' : ''}
                  onClick={() => setViewMode('2d')}
                >
                  2D View
                </button>
                <button
                  type="button"
                  className={viewMode === '3d' ? 'is-active' : ''}
                  onClick={() => setViewMode('3d')}
                >
                  3D Perspective
                </button>
              </div>

              <button type="button" className="workspace-render-button">
                Export Render
              </button>
            </div>

            <div
              ref={stageRef}
              className={`workspace-stage ${viewMode === '3d' ? 'is-3d' : 'is-2d'}`}
              onDrop={handleDropOnStage}
              onDragOver={handleStageDragOver}
            >
              <div className="workspace-stage-hint">
                Drag furniture from the library, then edit walls, windows, and doors from the right panel.
              </div>

              {viewMode === '2d' ? (
                <div
                  className="workspace-stage-room"
                  style={{
                    transform: `translate(-50%, -50%) scale(${zoom / 125})`,
                    '--room-wall-color': roomDetails.wallColor,
                  }}
                >
                  <div className="workspace-room-back-wall" />
                  <div className="workspace-room-floor" />
                  <div className="workspace-room-outline" />
                  {roomFeatures.map(renderOpeningMarker)}
                  {placedItems.map(renderStageItem)}
                </div>
              ) : (
                <div className="workspace-stage-canvas">
                  <Suspense fallback={<div className="workspace-scene-loading">Loading 3D scene...</div>}>
                    <WorkspaceScene3D
                      roomDetails={roomDetails}
                      roomFeatures={roomFeatures}
                      placedItems={placedItems}
                      assetsById={assetsById}
                      selectedItemId={selectedItemId}
                      selectedFeatureId={selectedFeatureId}
                    />
                  </Suspense>
                </div>
              )}
            </div>

            <div className="workspace-stage-footer">
              <span>{roomDetails.name}</span>
              <span>Assets: {placedItems.length} total</span>
              <span>View: {viewMode.toUpperCase()}</span>
              <span>
                Room: {roomDetails.width} x {roomDetails.depth} x {roomDetails.height} cm
              </span>
            </div>
          </section>

          <aside className="workspace-details-panel">
            <section className="workspace-side-card">
              <div className="workspace-side-head">
                <strong>Room Details</strong>
                <span>Editable</span>
              </div>

              <label>
                Room Name
                <input
                  type="text"
                  value={roomDetails.name}
                  onChange={(event) => updateRoomDetail('name', event.target.value)}
                />
              </label>

              <div className="workspace-input-grid">
                <label>
                  Width
                  <input
                    type="number"
                    value={roomDetails.width}
                    onChange={(event) => updateRoomDetail('width', Number(event.target.value) || 0)}
                  />
                </label>
                <label>
                  Depth
                  <input
                    type="number"
                    value={roomDetails.depth}
                    onChange={(event) => updateRoomDetail('depth', Number(event.target.value) || 0)}
                  />
                </label>
                <label>
                  Height
                  <input
                    type="number"
                    value={roomDetails.height}
                    onChange={(event) => updateRoomDetail('height', Number(event.target.value) || 0)}
                  />
                </label>
                <label>
                  Style
                  <input
                    type="text"
                    value={roomDetails.style}
                    onChange={(event) => updateRoomDetail('style', event.target.value)}
                  />
                </label>
                <label>
                  Wall Color
                  <input
                    type="text"
                    value={roomDetails.wallColor}
                    onChange={(event) => updateRoomDetail('wallColor', event.target.value)}
                  />
                </label>
                <label>
                  Floor Tone
                  <input
                    type="text"
                    value={roomDetails.floorTone}
                    onChange={(event) => updateRoomDetail('floorTone', event.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="workspace-side-card">
              <div className="workspace-side-head">
                <strong>Walls, Windows & Doors</strong>
                <span>{roomFeatures.length} elements</span>
              </div>

              <div className="workspace-add-buttons">
                <button type="button" onClick={() => addRoomFeature('window')}>
                  Add Window
                </button>
                <button type="button" onClick={() => addRoomFeature('door')}>
                  Add Door
                </button>
              </div>

              <div className="workspace-feature-list">
                {roomFeatures.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    className={`workspace-feature-row ${feature.id === selectedFeatureId ? 'is-selected' : ''}`}
                    onClick={() => {
                      setSelectedFeatureId(feature.id)
                      setSelectedItemId('')
                    }}
                  >
                    <div>
                      <strong>{feature.type === 'window' ? 'Window' : 'Door'}</strong>
                      <span>
                        {feature.wall} wall · {feature.width} cm
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedFeature ? (
                <div className="workspace-input-grid">
                  <label>
                    Wall
                    <select
                      value={selectedFeature.wall}
                      onChange={(event) => updateSelectedFeature('wall', event.target.value)}
                    >
                      {wallOptions.map((wall) => (
                        <option key={wall} value={wall}>
                          {wall}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Offset %
                    <input
                      type="number"
                      value={selectedFeature.offset}
                      onChange={(event) =>
                        updateSelectedFeature('offset', clamp(Number(event.target.value) || 0, 8, 92))
                      }
                    />
                  </label>
                  <label>
                    Width
                    <input
                      type="number"
                      value={selectedFeature.width}
                      onChange={(event) =>
                        updateSelectedFeature('width', clamp(Number(event.target.value) || 0, 40, 260))
                      }
                    />
                  </label>
                  <label>
                    Height
                    <input
                      type="number"
                      value={selectedFeature.height}
                      onChange={(event) =>
                        updateSelectedFeature('height', clamp(Number(event.target.value) || 0, 60, 240))
                      }
                    />
                  </label>
                  <label>
                    Base Height
                    <input
                      type="number"
                      value={selectedFeature.base}
                      onChange={(event) =>
                        updateSelectedFeature('base', clamp(Number(event.target.value) || 0, 0, 160))
                      }
                    />
                  </label>
                </div>
              ) : (
                <p className="workspace-empty-note">Select a window or door to edit it.</p>
              )}

              <button type="button" className="workspace-danger-button" onClick={removeSelectedFeature}>
                Remove Selected Opening
              </button>
            </section>

            <section className="workspace-side-card">
              <div className="workspace-side-head">
                <strong>Item Statistics</strong>
                <span>ID #{selectedPlacedItem ? selectedPlacedItem.instanceId.slice(-5) : '00000'}</span>
              </div>

              {selectedAsset ? (
                <>
                  <div className="workspace-selected-summary">
                    <img src={selectedAsset.image} alt={selectedAsset.name} />
                    <div>
                      <strong>{selectedAsset.name}</strong>
                      <span>{selectedAsset.category}</span>
                      <b>${selectedAsset.price.toLocaleString()}</b>
                    </div>
                  </div>

                  <div className="workspace-stat-list">
                    <div>
                      <span>Width</span>
                      <strong>{selectedAsset.width} cm</strong>
                    </div>
                    <div>
                      <span>Depth</span>
                      <strong>{selectedAsset.depth} cm</strong>
                    </div>
                    <div>
                      <span>Height</span>
                      <strong>{selectedAsset.height} cm</strong>
                    </div>
                  </div>

                  <div className="workspace-input-grid is-compact">
                    <label>
                      Rotation
                      <input
                        type="number"
                        value={selectedPlacedItem.rotation}
                        onChange={(event) =>
                          updateSelectedItem('rotation', Number(event.target.value) || 0)
                        }
                      />
                    </label>
                    <label>
                      Scale
                      <input
                        type="number"
                        step="0.1"
                        min="0.6"
                        max="1.8"
                        value={selectedPlacedItem.scale}
                        onChange={(event) =>
                          updateSelectedItem('scale', Number(event.target.value) || 1)
                        }
                      />
                    </label>
                  </div>

                  <button type="button" className="workspace-danger-button" onClick={removeSelectedItem}>
                    Remove from Room
                  </button>
                </>
              ) : (
                <p className="workspace-empty-note">Select or drop an item to edit its details.</p>
              )}
            </section>

            <section className="workspace-side-card">
              <div className="workspace-side-head">
                <strong>Placed Items</strong>
                <span>{placedItems.length} active · ${totalEstimatedCost.toLocaleString()}</span>
              </div>

              <div className="workspace-placed-list">
                {placedItems.map((item) => {
                  const asset = assetsById[item.assetId]
                  if (!asset) {
                    return null
                  }

                  return (
                    <button
                      key={item.instanceId}
                      type="button"
                      className={`workspace-placed-row ${item.instanceId === selectedItemId ? 'is-selected' : ''}`}
                      onClick={() => {
                        setSelectedItemId(item.instanceId)
                        setSelectedFeatureId('')
                      }}
                    >
                      <img src={asset.image} alt={asset.name} />
                      <div>
                        <strong>{asset.name}</strong>
                        <span>
                          {Math.round(item.x)}%, {Math.round(item.y)}%
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}