
require('./FileSaver.min.js')
require('./mod_preview_model.js')
require('./player_model.js')

previewSkins = [
  require('../assets/skins/0.png').default,
  require('../assets/skins/1.png').default,
  require('../assets/skins/2.png').default
]
currentPreviewSkin = null

const canvas = document.querySelector('#output-skin')
const ctx = canvas.getContext('2d')
const pcanvas = document.querySelector('#portrait-preview')
const pctx = pcanvas.getContext('2d')
const inputSkin = document.querySelector('#input-skin')
const skinFormat = document.querySelector('#skin-format')
const includeAnimatedFace = document.querySelector('#include-animated-face')
const downloadSkinButton = document.querySelector('#download-skin-button')

const translations = {
  face: [
    // Animated Face
    [7, 5, 7, 5],
    [6, 6, 7, 7],

    // Portrait Face
    [6, 6, 7, 6, 57, 24],
    [6, 6, 7, 6, 61, 24],
    [7, 5, 7, 5, 58, 24],
    [7, 5, 7, 5, 61, 24],
    [6, 7, 7, 7, 59, 26]
  ],
  common: [
    // Portrait
    [8, 8, 15, 15, 56, 20],
    'face',
    [40, 8, 47, 15, 56, 20],

    // Head
    [8, 0, 15, 7],
    [16, 7, 23, 0, 16, 0],
    [0, 8, 23, 15],
    [31, 8, 24, 15, 24, 8],

    // Head Overlay
    [40, 0, 47, 7],
    [48, 7, 55, 0, 48, 0],
    [32, 8, 55, 15],
    [63, 8, 56, 15, 56, 8],

    // Torso
    [20, 16, 27, 19],
    [28, 19, 35, 16, 28, 16],
    [16, 20, 39, 31],

    // Right Leg
    [8, 16, 11, 19, 20, 48],
    [4, 19, 7, 16, 24, 48],
    [11, 20, 8, 31, 16, 52],
    [7, 20, 4, 31, 20, 52],
    [3, 20, 0, 31, 24, 52],
    [15, 20, 12, 31, 28, 52]
  ],
  modern: [
    'common',

    // Left Leg
    [24, 48, 27, 51, 4, 16],
    [23, 48, 20, 51, 8, 16],
    [27, 52, 24, 63, 0, 20],
    [23, 52, 20, 63, 4, 20],
    [19, 52, 16, 63, 8, 20],
    [31, 52, 28, 63, 12, 20],

    // Right Leg Overlay
    [7, 35, 4, 32, 4, 32],
    [8, 32, 11, 35],
    [0, 36, 15, 47],

    // Torso Overlay
    [20, 32, 27, 35],
    [35, 32, 28, 35, 28, 32],
    [16, 36, 39, 47],

    // Left Leg Overlay
    [4, 48, 7, 51],
    [11, 51, 8, 48, 8, 48],
    [0, 52, 15, 63]
  ],
  classic: [
    'modern',

    // Right Arm
    [44, 16, 46, 19],
    [48, 19, 50, 16, 47, 16],
    [40, 20, 43, 31],
    [45, 20, 47, 31, 44, 20],
    [48, 20, 51, 31, 47, 20],
    [53, 20, 55, 31, 51, 20],

    // Right Arm Overlay
    [44, 32, 46, 35],
    //[49, 32, 47, 35, 47, 32], This part of the UV is just bugged on the player model. Waiting for a fix.
    [40, 36, 44, 47],
    [45, 36, 51, 47, 44, 36],
    [53, 36, 55, 47, 51, 36],

    // Left Arm
    [36, 48, 38, 51],
    [41, 48, 43, 51, 39, 48],
    [32, 52, 35, 63],
    [37, 52, 39, 63, 36, 52],
    [40, 52, 46, 63, 39, 52],

    // Left Arm Overlay
    [52, 48, 54, 51],
    //[57, 48, 59, 51, 55, 48], This part of the UV is just bugged on the player model. Waiting for a fix.
    [48, 52, 51, 63],
    [53, 52, 62, 63, 52, 52]
  ],
  slim: [
    'modern',

    // Right Arm
    [44, 16, 46, 19],
    [47, 19, 49, 16, 47, 16],
    [40, 20, 53, 31],

    // Right Arm Overlay
    [44, 32, 46, 35],
    // [Underside], This part of the UV is just bugged on the player model. Waiting for a fix.
    [40, 36, 53, 47],

    // Left Arm
    [36, 48, 41, 51],
    [32, 52, 45, 63],

    // Left Arm Overlay
    [52, 48, 54, 51],
    //[57, 48, 59, 51, 55, 48], This part of the UV is just bugged on the player model. Waiting for a fix.
    [48, 52, 61, 63]
  ],
  legacy: [
    'common',

    // Left Leg
    [8, 16, 11, 19, 4, 16],
    [4, 16, 7, 19, 8, 16],
    [0, 20, 3, 31, 0, 20],
    [4, 20, 7, 31, 4, 20],
    [8, 20, 11, 31, 8, 20],
    [12, 20, 15, 31, 12, 20],

    // Right Arm
    [44, 16, 46, 19],
    [48, 19, 50, 16, 47, 16],
    [40, 20, 43, 31],
    [45, 20, 47, 31, 44, 20],
    [48, 20, 51, 31, 47, 20],
    [53, 20, 55, 31, 51, 20],

    // Left Arm
    [44, 16, 46, 19, 36, 48],
    [50, 19, 48, 16, 39, 48],
    [51, 20, 48, 31, 32, 52],
    [47, 20, 45, 31, 36, 52],
    [43, 20, 40, 31, 39, 52],
    [55, 20, 53, 31, 43, 52]
  ]
}

for (let f of Object.keys(translations)) for (let a of translations[f]) {
  if (a.length == 4) {
    a[4] = a[0]
    a[5] = a[1]
  }
  a[6] = a[2] - a[0]
  a[7] = a[3] - a[1]
}

function processSkin(img, m, face, format) {
  for (let a of translations[format]) {
    if (typeof a == 'string') {
      if (face || a != 'face') {
        processSkin(img, m, face, a)
      }
      continue
    }
    const sH = Math.sign(a[2]-a[0]) || 1
    const sV = Math.sign(a[3]-a[1]) || 1
    ctx.save()
    ctx.translate(sH < 0 ? img.naturalWidth : 0, sV < 0 ? img.naturalWidth : 0)
    ctx.scale(sH, sV)
    ctx.drawImage(
      img,
      (a[0]+(sH<0?1:0))*m,
      (a[1]+(sV<0?1:0))*m,
      (a[2]-a[0]+sH)*m,
      (a[3]-a[1]+sV)*m,
      (sH>0?a[4]:64-a[4])*m,
      (sV>0?a[5]:64-a[5])*m,
      (a[6]+sH)*m,
      (a[7]+sV)*m
    );
    ctx.restore()
  }
}

function updatePortrait(m) {
  const s = 8*m
  pcanvas.width = s
  pcanvas.height = s
  pctx.clearRect(0, 0, s, s)
  pctx.drawImage(canvas, 56*m, 20*m, s, s, 0, 0, s, s)
}

function convertSkin() {
  const m = inputSkin.naturalWidth / 64
  canvas.width = inputSkin.naturalWidth
  canvas.height = inputSkin.naturalWidth

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  processSkin(inputSkin, m, includeAnimatedFace.checked, skinFormat.value)
  updatePortrait(m)

  window.playerSkinMat.map.needsUpdate = true
  window.playerSkinMat.needsUpdate = true

  downloadSkinButton.disabled = false
}

function drawNextModPreviewSkin() {
  const skin = new Image
  skin.onload = evt => {
    const mpcanvas = document.querySelector('#mod-preview-skin')
    const mpctx = mpcanvas.getContext('2d')

    mpctx.clearRect(0, 0, mpcanvas.width, mpcanvas.height)
    mpctx.drawImage(skin, 0, 0)

    window.modPreviewSkinMat.map.needsUpdate = true
    window.modPreviewSkinMat.needsUpdate = true

    setTimeout(drawNextModPreviewSkin, 5000)
  }
  currentPreviewSkin = previewSkins.filter(e => e != currentPreviewSkin)[Math.floor(Math.random()*(previewSkins.length-1))]
  skin.src = currentPreviewSkin
}
drawNextModPreviewSkin()

inputSkin.addEventListener('load', evt => {
  inputSkin.classList.remove('hidden')

  // Automatically set format for legacy skins
  if (inputSkin.naturalHeight != inputSkin.naturalWidth) {
    skinFormat.disabled = true
    skinFormat.value = 'legacy'
  } else {
    skinFormat.disabled = false
    if (skinFormat.value == 'legacy') {
      skinFormat.value = 'classic'
    }
  }

  convertSkin()
})

document.body.addEventListener('drop', evt => {
  evt.preventDefault()

  if (evt.dataTransfer.items[0].kind === 'file') {
    const file = evt.dataTransfer.items[0].getAsFile()
    inputSkin.src = URL.createObjectURL(file)
  }
})
document.body.addEventListener('dragover', evt => {
  evt.preventDefault()
})

skinFormat.addEventListener('change', evt => {
  if (inputSkin.src != '') {
    convertSkin()
  }
})
includeAnimatedFace.addEventListener('change', evt => {
  if (inputSkin.src != '') {
    convertSkin()
  }
})

document.querySelector('#file-input').addEventListener('change', evt => {
  inputSkin.src = URL.createObjectURL(evt.target.files[0])
  evt.target.value = null
})

downloadSkinButton.addEventListener('click', evt => {
  canvas.toBlob(blob => { saveAs(blob, 'skin.png') })
})

document.querySelector('#upload-button').addEventListener('click', evt => {
  document.querySelector('#file-input').click()
})
document.querySelector('#upload-icon').addEventListener('click', evt => {
  document.querySelector('#file-input').click()
})
