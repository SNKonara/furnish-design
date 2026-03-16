const WORKSPACE_STORAGE_KEY = 'furnishdesign.workspace-design.v1'
const PENDING_TEMPLATE_STORAGE_KEY = 'furnishdesign.pending-template.v1'

export const ROOM_SHAPE_OPTIONS = ['rectangle', 'square', 'l-shape']

export const defaultRoomDetails = {
  name: 'Scene Living Room 01',
  shape: 'rectangle',
  width: 520,
  depth: 380,
  height: 290,
  style: 'Scandi / Oak',
  wallColor: '#f7f7f5',
  floorTone: 'Natural Oak',
}

const ROOM_SIZE_PRESETS = {
  Small: { width: 360, depth: 280, height: 270 },
  Medium: { width: 460, depth: 340, height: 280 },
  Large: { width: 560, depth: 420, height: 300 },
  'Extra Large': { width: 680, depth: 520, height: 320 },
}

const STYLE_PALETTES = {
  Modern: { wallColor: '#f2f0eb', floorTone: 'Light Ash' },
  Minimalist: { wallColor: '#f6f4ee', floorTone: 'Soft Stone' },
  Luxury: { wallColor: '#ede5db', floorTone: 'Dark Walnut' },
  Cozy: { wallColor: '#f7efe6', floorTone: 'Warm Oak' },
  Playful: { wallColor: '#f8f1dc', floorTone: 'Honey Oak' },
  Zen: { wallColor: '#edf2ea', floorTone: 'Bamboo Ash' },
  Industrial: { wallColor: '#ebe7e2', floorTone: 'Concrete Stone' },
  Classic: { wallColor: '#f4efe8', floorTone: 'Walnut' },
  Professional: { wallColor: '#edf0f3', floorTone: 'Natural Oak' },
  Urban: { wallColor: '#ece9e4', floorTone: 'Smoked Oak' },
  Inviting: { wallColor: '#f6eee5', floorTone: 'Natural Oak' },
}

function createUniqueId(prefix) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function normalizeNumber(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage failures.
  }
}

function parseStorageValue(key) {
  const rawValue = readStorage(key)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

function templateShape(template) {
  const room = String(template?.room || '').toLowerCase()

  if (room.includes('studio') || room.includes('kitchen')) {
    return 'l-shape'
  }

  if (room.includes('dining') || room.includes('office')) {
    return 'square'
  }

  return 'rectangle'
}

function templateAssetIds(template) {
  const room = String(template?.room || '').toLowerCase()

  if (room.includes('office')) {
    return ['desk', 'lamp', 'shelf']
  }

  if (room.includes('living')) {
    return ['sofa', 'armchair', 'lamp', 'credenza']
  }

  if (room.includes('studio')) {
    return ['sofa', 'desk', 'shelf', 'lamp']
  }

  if (room.includes('bedroom')) {
    return ['armchair', 'lamp', 'credenza', 'shelf']
  }

  if (room.includes('kitchen')) {
    return ['credenza', 'shelf', 'lamp']
  }

  if (room.includes('dining')) {
    return ['credenza', 'armchair', 'lamp']
  }

  if (room.includes('bathroom')) {
    return ['shelf', 'lamp']
  }

  if (room.includes('entry')) {
    return ['shelf', 'lamp']
  }

  return ['sofa', 'lamp', 'shelf']
}

function templatePlacements(shape) {
  if (shape === 'square') {
    return [
      { x: 50, y: 56, rotation: 0, scale: 1 },
      { x: 30, y: 72, rotation: -18, scale: 0.95 },
      { x: 72, y: 38, rotation: 16, scale: 0.9 },
      { x: 68, y: 72, rotation: 0, scale: 1 },
    ]
  }

  if (shape === 'l-shape') {
    return [
      { x: 40, y: 58, rotation: 0, scale: 1 },
      { x: 68, y: 34, rotation: 10, scale: 0.96 },
      { x: 28, y: 78, rotation: 0, scale: 0.92 },
      { x: 58, y: 74, rotation: 0, scale: 0.94 },
    ]
  }

  return [
    { x: 50, y: 62, rotation: 0, scale: 1 },
    { x: 31, y: 74, rotation: -14, scale: 0.94 },
    { x: 72, y: 43, rotation: 12, scale: 0.9 },
    { x: 68, y: 76, rotation: 0, scale: 0.96 },
  ]
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function createPlacedItemSnapshot(assetId, overrides = {}) {
  return {
    instanceId: overrides.instanceId || createUniqueId(assetId),
    assetId,
    x: 50,
    y: 62,
    rotation: 0,
    scale: 1,
    ...overrides,
  }
}

export function createRoomFeatureSnapshot(type, overrides = {}) {
  return {
    id: overrides.id || createUniqueId(type),
    type,
    wall: type === 'window' ? 'north' : 'east',
    width: type === 'window' ? 140 : 92,
    height: type === 'window' ? 110 : 210,
    offset: 50,
    base: type === 'window' ? 90 : 0,
    ...overrides,
  }
}

export function createDefaultWorkspaceDesign() {
  return {
    roomDetails: { ...defaultRoomDetails },
    placedItems: [
      createPlacedItemSnapshot('sofa', {
        instanceId: 'placed-sofa-1',
        x: 50,
        y: 63,
      }),
    ],
    roomFeatures: [
      createRoomFeatureSnapshot('window', {
        id: 'window-1',
        wall: 'north',
        width: 140,
        height: 110,
        offset: 52,
        base: 92,
      }),
      createRoomFeatureSnapshot('door', {
        id: 'door-1',
        wall: 'east',
        width: 92,
        height: 210,
        offset: 46,
        base: 0,
      }),
    ],
    viewMode: '3d',
    zoom: 125,
  }
}

export function normalizeWorkspaceDesign(snapshot) {
  const fallback = createDefaultWorkspaceDesign()

  if (!snapshot || typeof snapshot !== 'object') {
    return fallback
  }

  const roomDetails = {
    ...fallback.roomDetails,
    ...(snapshot.roomDetails || {}),
  }

  roomDetails.shape = ROOM_SHAPE_OPTIONS.includes(roomDetails.shape)
    ? roomDetails.shape
    : fallback.roomDetails.shape
  roomDetails.width = normalizeNumber(roomDetails.width, fallback.roomDetails.width)
  roomDetails.depth = normalizeNumber(roomDetails.depth, fallback.roomDetails.depth)
  roomDetails.height = normalizeNumber(roomDetails.height, fallback.roomDetails.height)

  const placedItems = Array.isArray(snapshot.placedItems)
    ? snapshot.placedItems.map((item, index) =>
        createPlacedItemSnapshot(item?.assetId || 'sofa', {
          instanceId: item?.instanceId || createUniqueId(`placed-${index}`),
          x: clamp(normalizeNumber(item?.x, 50), 9, 91),
          y: clamp(normalizeNumber(item?.y, 62), 16, 88),
          rotation: normalizeNumber(item?.rotation, 0),
          scale: clamp(normalizeNumber(item?.scale, 1), 0.6, 1.8),
        }),
      )
    : fallback.placedItems

  const roomFeatures = Array.isArray(snapshot.roomFeatures)
    ? snapshot.roomFeatures.map((feature, index) =>
        createRoomFeatureSnapshot(feature?.type === 'door' ? 'door' : 'window', {
          id: feature?.id || createUniqueId(`feature-${index}`),
          wall: ['north', 'east', 'south', 'west'].includes(feature?.wall) ? feature.wall : 'north',
          width: clamp(normalizeNumber(feature?.width, 140), 40, 260),
          height: clamp(normalizeNumber(feature?.height, 110), 60, 240),
          offset: clamp(normalizeNumber(feature?.offset, 50), 8, 92),
          base: clamp(normalizeNumber(feature?.base, 90), 0, 160),
        }),
      )
    : fallback.roomFeatures

  return {
    roomDetails,
    placedItems,
    roomFeatures,
    viewMode: snapshot.viewMode === '2d' ? '2d' : '3d',
    zoom: clamp(normalizeNumber(snapshot.zoom, fallback.zoom), 80, 160),
  }
}

export function createWorkspaceDesignFromTemplate(template) {
  const shape = templateShape(template)
  const sizePreset = ROOM_SIZE_PRESETS[template?.size] || ROOM_SIZE_PRESETS.Medium
  const palette = STYLE_PALETTES[template?.style] || { wallColor: '#f3f2ed', floorTone: 'Natural Oak' }
  const assetIds = templateAssetIds(template)
  const placements = templatePlacements(shape)

  return normalizeWorkspaceDesign({
    roomDetails: {
      name: `${template?.title || 'Template'} Layout`,
      shape,
      width: sizePreset.width,
      depth: sizePreset.depth,
      height: sizePreset.height,
      style: template?.style || defaultRoomDetails.style,
      wallColor: palette.wallColor,
      floorTone: palette.floorTone,
    },
    placedItems: assetIds.map((assetId, index) =>
      createPlacedItemSnapshot(assetId, placements[index % placements.length]),
    ),
    roomFeatures: [
      createRoomFeatureSnapshot('window', {
        wall: 'north',
        width: shape === 'square' ? 120 : 150,
        height: 110,
        offset: 54,
        base: 88,
      }),
      createRoomFeatureSnapshot('door', {
        wall: shape === 'l-shape' ? 'south' : 'east',
        width: 92,
        height: 210,
        offset: shape === 'l-shape' ? 24 : 46,
        base: 0,
      }),
    ],
    viewMode: '3d',
    zoom: 125,
  })
}

export function saveWorkspaceDesign(snapshot) {
  return writeStorage(WORKSPACE_STORAGE_KEY, normalizeWorkspaceDesign(snapshot))
}

export function loadSavedWorkspaceDesign() {
  const value = parseStorageValue(WORKSPACE_STORAGE_KEY)
  return value ? normalizeWorkspaceDesign(value) : null
}

export function savePendingTemplateDesign(snapshot) {
  return writeStorage(PENDING_TEMPLATE_STORAGE_KEY, normalizeWorkspaceDesign(snapshot))
}

export function loadPendingTemplateDesign() {
  const value = parseStorageValue(PENDING_TEMPLATE_STORAGE_KEY)
  return value ? normalizeWorkspaceDesign(value) : null
}

export function clearPendingTemplateDesign() {
  removeStorage(PENDING_TEMPLATE_STORAGE_KEY)
}