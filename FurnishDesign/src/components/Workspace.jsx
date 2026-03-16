import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ROOM_SHAPE_OPTIONS,
  clamp,
  createDefaultWorkspaceDesign,
  createPlacedItemSnapshot,
  createRoomFeatureSnapshot,
  loadPendingTemplateDesign,
  loadSavedWorkspaceDesign,
  normalizeWorkspaceDesign,
  saveWorkspaceDesign,
  clearPendingTemplateDesign,
} from '../designState.js'
import { catalogAssets } from '../data/catalogData.js'
import './workspace.css'

const WorkspaceScene3D = lazy(() => import('./WorkspaceScene3D.jsx'))

const wallOptions = ['north', 'east', 'south', 'west']

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

function roomShapeClipPath(shape) {
  if (shape === 'l-shape') {
    return 'polygon(0 0, 100% 0, 100% 64%, 66% 64%, 66% 100%, 0 100%)'
  }

  return 'none'
}

function fittedZoom(roomDetails) {
  const referenceArea = 520 * 380
  const width = Math.max(Number(roomDetails.width) || 0, 1)
  const depth = Math.max(Number(roomDetails.depth) || 0, 1)
  const shapeFactor = roomDetails.shape === 'l-shape' ? 0.78 : 1
  const roomArea = width * depth * shapeFactor

  return clamp(Math.round(125 * Math.sqrt(referenceArea / roomArea)), 80, 160)
}

function roomSurfaceStyle(roomDetails, zoom) {
  const isSquare = roomDetails.shape === 'square'

  return {
    transform: `translate(-50%, -50%) scale(${zoom / 125})`,
    '--room-wall-color': roomDetails.wallColor,
    clipPath: roomShapeClipPath(roomDetails.shape),
    width: isSquare ? 'min(54%, 460px)' : 'min(72%, 760px)',
    height: isSquare ? 'min(54%, 460px)' : 'min(54%, 420px)',
  }
}

export default function Workspace() {
  const location = useLocation()
  const navigate = useNavigate()
  const stageRef = useRef(null)
  const dragStateRef = useRef(null)
  const initialWorkspace = useMemo(
    () => loadSavedWorkspaceDesign() || createDefaultWorkspaceDesign(),
    [],
  )

  const [viewMode, setViewMode] = useState(initialWorkspace.viewMode)
  const [zoom, setZoom] = useState(initialWorkspace.zoom)
  const [searchText, setSearchText] = useState('')
  const [roomDetails, setRoomDetails] = useState(initialWorkspace.roomDetails)
  const [placedItems, setPlacedItems] = useState(initialWorkspace.placedItems)
  const [roomFeatures, setRoomFeatures] = useState(initialWorkspace.roomFeatures)
  const [selectedItemId, setSelectedItemId] = useState(initialWorkspace.placedItems[0]?.instanceId || '')
  const [selectedFeatureId, setSelectedFeatureId] = useState(initialWorkspace.roomFeatures[0]?.id || '')
  const [workspaceNotice, setWorkspaceNotice] = useState(
    loadSavedWorkspaceDesign() ? 'Saved design restored from this browser.' : 'Design changes stay local until you save.',
  )

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
    const workspaceSeed = location.state?.workspaceSeed || loadPendingTemplateDesign()

    if (!workspaceSeed) {
      return
    }

    const nextDesign = normalizeWorkspaceDesign(workspaceSeed)
    setRoomDetails(nextDesign.roomDetails)
    setPlacedItems(nextDesign.placedItems)
    setRoomFeatures(nextDesign.roomFeatures)
    setViewMode(nextDesign.viewMode)
    setZoom(nextDesign.zoom)
    setSelectedItemId(nextDesign.placedItems[0]?.instanceId || '')
    setSelectedFeatureId(nextDesign.roomFeatures[0]?.id || '')
    setWorkspaceNotice(`Template loaded: ${nextDesign.roomDetails.name}`)
    clearPendingTemplateDesign()
  }, [location.key, location.state])

  useEffect(() => {
    const catalogAssetId = location.state?.catalogAssetId

    if (!catalogAssetId) {
      return
    }

    const asset = assetsById[catalogAssetId]
    if (!asset) {
      return
    }

    const newItem = createPlacedItemSnapshot(asset.id)
    setPlacedItems((currentItems) => [...currentItems, newItem])
    setSelectedItemId(newItem.instanceId)
    setSelectedFeatureId('')
    setWorkspaceNotice(`${asset.name} added from the catalog.`)
  }, [assetsById, location.key, location.state])

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
    const newItem = createPlacedItemSnapshot(asset.id, { x, y })

    setPlacedItems((currentItems) => [...currentItems, newItem])
    setSelectedItemId(newItem.instanceId)
    setSelectedFeatureId('')
    setWorkspaceNotice('Furniture added. Save to keep this layout.')
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
    const newItem = createPlacedItemSnapshot(asset.id)
    setPlacedItems((currentItems) => [...currentItems, newItem])
    setSelectedItemId(newItem.instanceId)
    setSelectedFeatureId('')
    setWorkspaceNotice('Furniture added. Save to keep this layout.')
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
    setWorkspaceNotice('Selected furniture removed from the layout.')
  }

  function addRoomFeature(type) {
    const nextFeature = createRoomFeatureSnapshot(type)
    setRoomFeatures((current) => [...current, nextFeature])
    setSelectedFeatureId(nextFeature.id)
    setSelectedItemId('')
    setViewMode('2d')
    setWorkspaceNotice(`${type === 'window' ? 'Window' : 'Door'} added to the room shell.`)
  }

  function removeSelectedFeature() {
    if (!selectedFeature) {
      return
    }

    const remainingFeatures = roomFeatures.filter((feature) => feature.id !== selectedFeature.id)
    setRoomFeatures(remainingFeatures)
    setSelectedFeatureId(remainingFeatures[0] ? remainingFeatures[0].id : '')
    setWorkspaceNotice('Selected opening removed from the room shell.')
  }

  function updateRoomDetail(field, value) {
    setRoomDetails((current) => ({ ...current, [field]: value }))

    if (field === 'shape') {
      setWorkspaceNotice(`Room shape changed to ${value}.`)
    }
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
    setWorkspaceNotice('Furniture properties updated.')
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
    setWorkspaceNotice('Opening properties updated.')
  }

  function handleSaveDesign() {
    const saved = saveWorkspaceDesign({
      roomDetails,
      placedItems,
      roomFeatures,
      viewMode,
      zoom,
    })

    setWorkspaceNotice(saved ? 'Design saved to this browser.' : 'Saving failed in this browser.')
  }

  function handleLoadSavedDesign() {
    const savedDesign = loadSavedWorkspaceDesign()

    if (!savedDesign) {
      setWorkspaceNotice('No saved design found on this browser.')
      return
    }

    setRoomDetails(savedDesign.roomDetails)
    setPlacedItems(savedDesign.placedItems)
    setRoomFeatures(savedDesign.roomFeatures)
    setViewMode(savedDesign.viewMode)
    setZoom(savedDesign.zoom)
    setSelectedItemId(savedDesign.placedItems[0]?.instanceId || '')
    setSelectedFeatureId(savedDesign.roomFeatures[0]?.id || '')
    setWorkspaceNotice('Saved design loaded.')
  }

  function handleFitStage() {
    const nextZoom = fittedZoom(roomDetails)
    setZoom(nextZoom)
    setWorkspaceNotice(`Viewport fitted to the ${roomDetails.shape} room shell.`)
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
              <NavLink to="/catalog" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Catalog
              </NavLink>
              <NavLink to="/workspace" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Workspace
              </NavLink>
              <NavLink to="/templates" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Templates
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Profile
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
            <button type="button" className="workspace-logout-button" onClick={() => navigate('/')}>
              Logout
            </button>
            <Link to="/profile" className="workspace-profile-pill" aria-label="Profile">FD</Link>
          </div>
        </header>

        <div className="workspace-layout">
          <aside className="workspace-library-panel">
            <div className="workspace-panel-head">
              <strong>Asset Library</strong>
              <Link to="/catalog" className="workspace-filter-button">
                Browse Catalog
              </Link>
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
                <button type="button" onClick={handleFitStage}>Fit</button>
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

              <div className="workspace-toolbar-group workspace-save-actions">
                <button type="button" onClick={handleLoadSavedDesign}>
                  Load Saved
                </button>
                <button type="button" className="workspace-render-button" onClick={handleSaveDesign}>
                  Save Design
                </button>
              </div>
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
                  style={roomSurfaceStyle(roomDetails, zoom)}
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
              <span>Shape: {roomDetails.shape}</span>
              <span>
                Room: {roomDetails.width} x {roomDetails.depth} x {roomDetails.height} cm
              </span>
              <span>{workspaceNotice}</span>
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
                  Shape
                  <select
                    value={roomDetails.shape}
                    onChange={(event) => updateRoomDetail('shape', event.target.value)}
                  >
                    {ROOM_SHAPE_OPTIONS.map((shape) => (
                      <option key={shape} value={shape}>
                        {shape}
                      </option>
                    ))}
                  </select>
                </label>
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
