import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';

const rendererWidth = 256;
const rendererHeight = 256;

let mixer, camera, scene, renderer, clock;

init();
animate();

function init() {

  const container = document.querySelector( '#model-viewer' );

  camera = new THREE.PerspectiveCamera( 23, rendererWidth / rendererHeight, 1, 1000 );
  camera.position.set( -9, 15, 23 );

  scene = new THREE.Scene();
  //scene.background = new THREE.Color( 0x101010 );
  //scene.fog = new THREE.Fog( 0x101010, 70, 100 );

  clock = new THREE.Clock();

  // lights

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.8 );
  hemiLight.position.set( 0, 200, 0 );
  scene.add( hemiLight );

  const dirLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
  dirLight.position.set( 0, 20, 10 );
  dirLight.castShadow = false;
  scene.add( dirLight );

  //

  const loader = new GLTFLoader();
  const psmMap = new THREE.Texture(document.querySelector( '#output-skin' ))
  psmMap.magFilter = THREE.NearestFilter
  psmMap.flipY = false
  window.playerSkinMat = new THREE.MeshLambertMaterial({
    map: psmMap,
    skinning: true,
    alphaTest: 0.333
  })
  loader.load( '../assets/player_model.glb', function ( gltf ) {

    scene.add( gltf.scene );

    gltf.scene.traverse( function ( child ) {

      if (child.isMesh) {
        child.material = window.playerSkinMat;
      }

    } );

    mixer = new THREE.AnimationMixer( gltf.scene );
    // Start playing the animation 1-2.2 seconds after loading, to avoid sync with the mod preview model
    setTimeout(() => {
      mixer.clipAction( gltf.animations[ 0 ] ).play();
    }, 1000+Math.random()*1200);

  } );

  //

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( rendererWidth, rendererHeight );
  container.appendChild( renderer.domElement );

  //

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.y = 5;
  controls.update();

}

function animate() {

  requestAnimationFrame( animate );

  if ( mixer ) mixer.update( clock.getDelta() );

  render();

}

function render() {

  renderer.render( scene, camera );

}