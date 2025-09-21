<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js Random Trees Example</title>
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js"></script>

<script>
let scene, camera, renderer, clock;
let floorRadius = 100;
let trees = [];

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // sky blue

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set(0, 60, 120);

    // Renderer
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Clock
    clock = new THREE.Clock();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Floor
    const floorGeom = new THREE.CircleGeometry(floorRadius, 64);
    const floorMat = new THREE.MeshLambertMaterial({color: 0x228833});
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI/2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Materials for trees
    var greenMat = new THREE.MeshLambertMaterial({ color: 0x33aa33 });
    var brownMat = new THREE.MeshLambertMaterial({ color: 0x886633 });

    // ---- TREE CLASSES ----
    class Pine {
        constructor() {
            this.mesh = new THREE.Group();
            let trunkGeom = new THREE.CylinderGeometry(1.5, 2, 15, 6);
            let trunk = new THREE.Mesh(trunkGeom, brownMat);
            trunk.position.y = 7.5;
            trunk.castShadow = true;
            this.mesh.add(trunk);

            let coneGeom = new THREE.ConeGeometry(6, 20, 6);
            let cone = new THREE.Mesh(coneGeom, greenMat);
            cone.position.y = 25;
            cone.castShadow = true;
            this.mesh.add(cone);
        }
    }

    class Oak {
        constructor() {
            this.mesh = new THREE.Group();
            let trunkGeom = new THREE.CylinderGeometry(2, 3, 20, 6);
            let trunk = new THREE.Mesh(trunkGeom, brownMat);
            trunk.position.y = 10;
            trunk.castShadow = true;
            this.mesh.add(trunk);

            let foliageGeom = new THREE.SphereGeometry(10, 8, 8);
            let foliage = new THREE.Mesh(foliageGeom, greenMat);
            foliage.position.y = 25;
            foliage.castShadow = true;
            this.mesh.add(foliage);
        }
    }

    class Bushy {
        constructor() {
            this.mesh = new THREE.Group();
            let trunkGeom = new THREE.CylinderGeometry(1.5, 1.5, 10, 6);
            let trunk = new THREE.Mesh(trunkGeom, brownMat);
            trunk.position.y = 5;
            trunk.castShadow = true;
            this.mesh.add(trunk);

            let foliageGeom = new THREE.SphereGeometry(8, 6, 6);
            let foliage1 = new THREE.Mesh(foliageGeom, greenMat);
            foliage1.position.y = 12;
            foliage1.castShadow = true;
            this.mesh.add(foliage1);

            let foliage2 = foliage1.clone();
            foliage2.scale.set(0.8, 0.8, 0.8);
            foliage2.position.y = 18;
            this.mesh.add(foliage2);
        }
    }

    // ---- CREATE RANDOM TREES ----
    function createTrees() {
        let treeCount = 50;
        for (let i=0; i<treeCount; i++) {
            let type = Math.floor(Math.random()*3);
            let tree;
            if (type===0) tree = new Pine();
            else if (type===1) tree = new Oak();
            else tree = new Bushy();

            // Random scale
            let scale = 0.8 + Math.random()*0.6;
            tree.mesh.scale.set(scale, scale, scale);

            // Random position around floor
            let phi = Math.random()*Math.PI*2;
            let radius = 10 + Math.random()*(floorRadius-10);
            tree.mesh.position.x = Math.cos(phi)*radius;
            tree.mesh.position.z = Math.sin(phi)*radius;
            tree.mesh.position.y = 0;

            // Random rotation
            tree.mesh.rotation.y = Math.random()*Math.PI*2;

            scene.add(tree.mesh);
            trees.push(tree.mesh);
        }
    }

    createTrees();

    // Handle resize
    window.addEventListener('resize', ()=>{
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
</script>
</body>
</html>
