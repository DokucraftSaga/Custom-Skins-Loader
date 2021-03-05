import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';

;(() => {

const rendererWidth = 640;
const rendererHeight = 640;

let mixer, camera, scene, renderer, clock;

const init = () => {

  const container = document.querySelector( '#menu-preview-model' );

  camera = new THREE.PerspectiveCamera( 25, rendererWidth / rendererHeight, 1, 1000 );
  camera.position.set( -1, 18, 25 );

  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // lights

  const hemiLight = new THREE.HemisphereLight( 0xf8fcff, 0x384044, 0.7 );
  hemiLight.position.set( 0, 200, 0 );
  scene.add( hemiLight );

  const dirLight = new THREE.DirectionalLight( 0xedeeee, 0.9 );
  dirLight.position.set( 0, 20, 5 );
  scene.add( dirLight );

  const campFire = new THREE.PointLight( 0xff8000, 1, 100 );
  campFire.position.set( -9, 3, -9 );
  scene.add( campFire );

  //

  const loader = new GLTFLoader();
  const psmMap = new THREE.Texture(document.querySelector( '#mod-preview-skin' ))
  psmMap.magFilter = THREE.NearestFilter
  psmMap.flipY = false
  window.modPreviewSkinMat = new THREE.MeshLambertMaterial({
    map: psmMap,
    skinning: true,
    alphaTest: 0.333
  })
  loader.load( require('../assets/player_model.glb').default, function ( gltf ) {

    scene.add( gltf.scene );

    gltf.scene.traverse( function ( child ) {

      if (child.isMesh) {
        child.material = window.modPreviewSkinMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }

    } );

    mixer = new THREE.AnimationMixer( gltf.scene );
    mixer.clipAction( gltf.animations[ 0 ] ).play();

  } );

  //

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( rendererWidth, rendererHeight );
  container.appendChild( renderer.domElement );


  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.target.y = 5;
  controls.update();

}

const animate = () => {

  requestAnimationFrame( animate );

  if ( mixer ) mixer.update( clock.getDelta() );

  renderer.render( scene, camera );

}

init();
animate();

})()