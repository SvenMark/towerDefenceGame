let renderer, camera, controls, scene, clock, clockDelta, ground, manager, textureGhost, loader, tower, tree;
let tiles = [];
let beavers = [];
let graph = new Graph([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]);


function init() {
    clock = new THREE.Clock();
    clockDelta = clock.getDelta();

    fpsCounter();
    setCamera();
    setScene();
    setControls();
    startGame();
    spawnBeaver();
    render();
}
function preLoader() {
    manager = new THREE.LoadingManager();
    textureGhost = new THREE.Texture();
    loader = new THREE.ImageLoader(manager);
    loader.load('models/ghost.png', function (image) {
        textureGhost.image = image;
        textureGhost.needsUpdate = true;
    });

    loader = new THREE.MTLLoader();
    loader.load( 'models/stmedardUobj.mtl', function( materials ) {
        materials.preload();

        loader = new THREE.OBJLoader();
        loader.setMaterials( materials );
        loader.load( 'models/stmedardUobj.obj', function ( object ) {
            window.tower = object.children[0];
        });
    });

    loader = new THREE.OBJLoader(manager);
    loader.load('models/ghost.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = textureGhost;
            }
        });
        window.ghost = object.children[0];
    });

    loader = new THREE.FBXLoader(manager);
    loader.load('models/Tree.fbx', function (object) {
        tree = object;
        init();
    });
}

function startGame() {
    console.log('Game started!');
}

function setCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 8, 16);
}

function setControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = 0.49 * Math.PI; // Don't let the camera go below the ground
}

function setScene() {
    scene = new THREE.Scene();

    //Adds the tree
    for(let i = 0; i < 20; i++)
    {
        let newtree =tree.clone();
        newtree.position.set(i,0,19);
    scene.add(newtree);
    }

    //Add the castle
    tower = new Tower(1, window.tower);

    //Adds the ghost
    // let refObject = window.ghost;
    // let material = new THREE.MeshLambertMaterial();
    // let ghost = new THREE.Mesh(refObject.geometry, material);
    // ghost.position.set(4,0,4);
    // ghost.scale.multiplyScalar(0.3);
    // scene.add(ghost);

    // light
    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 250, 0);
    scene.add(pointLight);
    let ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    tiles = setTiles(20);
    graph = buildGraph(20);

    //Function to create grid for astar
    function setTiles(gridSize) {
        ground = []; // Initialize array
        let flag = false;
        for (let i = 0; i < gridSize; i++) {
            ground[i] = []; // Initialize inner array
            flag = flag !== true;
            for (let j = 0; j < gridSize; j++) {
                ground[i][j] = new Tile(j, i, flag);
                flag = flag !== true;
            }
        }
        return ground;
    }

    //Build Graph
    function buildGraph(gridSize) {
        graph = [];
        for (let i = 0; i < gridSize; i++) {
            graph[i] = [];
            for (let j = 0; j < gridSize; j++) {
                graph[i][j] = tiles[i][j].occupied;
            }
        }

        return new Graph([graph])
    }

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize(), false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function fpsCounter() {
    let script = document.createElement('script');
    script.onload = function () {
        let stats = new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };
    script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(script);
}

function spawnBeaver() {
    console.log('Spawning Beaver!');
    let beaver = new Beaver('models/ghost.png', 'melee', 0.420);
    beaver.create();
    let beaverObject = beaver.getObject();
    beaverObject.currentStep = beaver.currentStep;
    beaverObject.nextStep = beaver.nextStep;
    beaverObject.setNodes = beaver.setNodes;
    beaverObject.stats = beaver.stats;
    beaverObject.end = beaver.end;
    console.log(beaverObject.currentStep);
    console.log(beaverObject.nextStep);
    beavers.push(beaverObject);
    scene.add(beaverObject);
}

function deleteMonster(index, removeLife) {
    if (removeLife) {
        //removelife duh
        console.log('Leven -1')
    }
    else {
        //kapoet add monezz
        console.log('Dood door turret')
    }
    scene.remove(beavers[index]);
    delete beavers[index];
}

function render() {
    requestAnimationFrame(render);
    // controls.update();
    beavers.forEach(function(beaver, i) {
        let nextX = beavers[i].nextStep.x;
        let nextZ = beavers[i].nextStep.z;
        if (nextX > beavers[i].position.x) {
            beavers[i].position.x += beavers[i].stats.speed;
            // healthBars[i].position.x += beavers[i].stats.speed;
        }
        else if (nextX < beavers[i].position.x) {
            beavers[i].position.x -= beavers[i].stats.speed;
            // healthBars[i].position.x -= beaver[i].stats.speed;
        }
        else if (nextZ > beavers[i].position.z) {
            beavers[i].position.z += beavers[i].stats.speed;
            // healthBars[i].position.z += beavers[i].stats.speed;
        }
        else if (nextZ < beavers[i].position.z) {
            beavers[i].position.z -= beavers[i].stats.speed;
            // healthBars[i].position.z -= beavers[i].stats.speed;
        }

        //check position
        if (nextX === beavers[i].position.x && nextZ === beavers[i].position.z) {
            // Calculate nextStep
            beavers[i].setNodes();
        }

        console.log('Bever current', beavers[i].currentStep);

        if (beavers[i].currentStep.x === beavers[i].end.x && beavers[i].currentStep.z === beavers[i].end.z) {
            console.log('Delete monster');
            deleteMonster(i, true);
        }
    });
    renderer.setClearColor(0xBDCEB6);
    renderer.render(scene, camera);
}




