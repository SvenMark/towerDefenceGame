let renderer, camera, controls, scene, clock, clockDelta, ground;
let tiles, nodes;
let beavers = [];

function init()
{
    clock = new THREE.Clock();
    clockDelta = clock.getDelta();

    fpsCounter();
    setCamera();
    setScene();
    setControls();
    render();
}

function startGame(game)
{
    beavers[0] = new Beaver('inserttexturehere', 'melee', 0.420);
}

function setCamera()
{
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 8, 16);
}

function setControls()
{
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = 0.49 * Math.PI; // Don't let the camera go below the ground
}

function setScene()
{
    scene = new THREE.Scene();

    // light
    let pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(0, 250, 0);
    scene.add(pointLight);
    let ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    tiles = setTiles(20);

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


    let tower = new Tower(1);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    window.addEventListener( 'resize', onWindowResize(), false );
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();
}

function fpsCounter()
{
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

function render()
{
    requestAnimationFrame(render);
    // controls.update();
    renderer.render(scene, camera);
}




