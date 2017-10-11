let renderer, camera, controls, scene, clock, clockDelta;

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

}

function setCamera()
{
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 200, 800);
}

function setControls()
{
    controls = new THREE.OrbitControls(camera, renderer.domElement);
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

    //Temp platform
    let planeGeometry = new THREE.PlaneGeometry(800, 450, 10, 10);
    let planeMaterial = new THREE.MeshToonMaterial({
        color: 0x006633,
        side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

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
    //controls.update();
    renderer.render(scene, camera);
}




