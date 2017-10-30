let renderer, camera, controls, scene, clock, clockDelta, ground, manager, textureGhost, loader, game, intersects, clickedobject, projector, mouse = { x: 0, y: 0 };
let tiles = [];
let beavers = [];
let graph = [];
//List of stuff you can click
let targetList = [];
//List of objects you can click
let targetListObjects=[];
let towers=[], towercount=0;

//Tower costs:
let towerprice = 10;
let upgradeprice = 5;
let starterscurrency = 50;


function init() {
    clock = new THREE.Clock();

    fpsCounter();
    setCamera();
    setScene();
    setControls();
    startGame();
    // spawnBeaver();
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
            window.castle = object.children[0];
            init();
        });
    });

    loader = new THREE.FBXLoader(manager);
    loader.load('models/tower.fbx', function (object) {
        window.tower = object;
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
}

function startGame() {
    console.log('Game started!');
    game = new Game(1,1);
}

function setCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10, 20, 10);
}

function setControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = 0.49 * Math.PI; // Don't let the camera go below the ground
    document.addEventListener('keypress', onKeyPress);

    function onKeyPress()
    {
    }
}

function setScene() {
    scene = new THREE.Scene();

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
                ground[i][j] = new Tile(i, j, flag);
                flag = flag !== true;

                //Add to click targets
                targetList.push(ground[i][j]);
                //Can only raycast on object lists, so I need another list for it
                targetListObjects.push(ground[i][j].object);
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
        return new Graph(graph);
    }

    //Build a skybox
    let imagePrefix = "images/skybox-";
    let directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    let imageSuffix = ".png";
    let skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

    let materialArray = [];
    for (let i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));
    let skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    let skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add( skyBox );

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    projector = new THREE.Projector();
    window.addEventListener('resize', onWindowResize(), false);
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

let indicator = new THREE.Mesh( new THREE.CubeGeometry( 1, 0.2, 1 ), new THREE.MeshBasicMaterial({color:0xff6347, transparent:true, opacity:0.4, side: THREE.DoubleSide}) );

function onDocumentMouseDown( e ) {
    //Clicked tile indicator cube
    if(e.toElement.id==='placetower'){
        clickedobject.occupied = 0;
        graph = updateGraph(20);
        console.log("Path status: "+ isValidPath());
        if(!isValidPath()) {
            clickedobject.occupied = 1;
            graph = updateGraph(20);
            $("#errornospace").fadeIn(300).delay(3000).fadeOut(300);
            console.log("Geen plek");
        }
        else if(game.currency>=towerprice){
            //Make a new tower and place it
            towers[towercount] = new Tower(1, window.tower.clone());

            // update Graph for path finding
            graph = updateGraph(20);

            //Link tower to clicked tile
            clickedobject.connectedtower = towers[towercount];

            //Hide the placetower button
            placehide();
            scene.remove(indicator);$("#success").fadeIn(300).delay(3000).fadeOut(300);

            towercount++;
        }
        else{
            upgradehide();
            $("#error").fadeIn(300).delay(3000).fadeOut(300);
        }
    }

    else if(e.toElement.id==='upgradetower'){
        //If you click the upgradetower button
        if(game.currency>=upgradeprice){
            clickedobject.connectedtower.upgradetower();
            $("#success").fadeIn(300).delay(3000).fadeOut(300);
        }
        else{
            upgradehide();
            $("#error").fadeIn(300).delay(3000).fadeOut(300);
        }
    }
    else{
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        let vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        projector.unprojectVector( vector, camera );
        let ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
        intersects = ray.intersectObjects( targetListObjects );
        if ( intersects.length > 0 )
        {
            //Search for the object you clicked and name it clickedobject
            for(let i = 0; i < targetList.length; i++){
                if(targetList[i].object===intersects[0].object){
                    clickedobject=targetList[i];
                    break;
                }
            }
            if(clickedobject.occupied===0){
                //Show tower stats + upgrade button
                console.log("Tile is occupied by "+ clickedobject.connectedtower.name +", upgrade box triggered");
                upgradeshow();
                placehide();

            }
            else{
                //Show place tower button
                console.log("Tile is not occupied, placetower box triggered");
                placeshow();
                upgradehide();
            }
            scene.remove(indicator);
            indicator.position.set(clickedobject.object.position.x, 0.1, clickedobject.object.position.z);
            scene.add(indicator)
        }
        else{
            //Hide all if clicked on nothing
            placehide();
            upgradehide();
            scene.remove(indicator);
        }
    }
}

function updateGraph(gridSize) {
    graph = [];
    for (let i = 0; i < gridSize; i++) {
        graph[i] = [];
        for (let j = 0; j < gridSize; j++) {
            graph[i][j] = tiles[i][j].occupied;
        }
    }
    return new Graph(graph);
}

function isValidPath() {
    let start = graph.grid[19][19];
    let end = graph.grid[10][0];
    let result = astar.search(graph, start, end);
    if (result == '') {
        return false;
    }
    return true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    //render();
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

function render() {
    requestAnimationFrame(render);
    clockDelta = clock.getDelta() * 120;

    //When game is in a wave check if beavers are close to towers, if so shoot.
    if(game.inWave === true)
    {
        for(let i=0; i < towers.length; i++)
        {
            //Only run when there are active beavers
            if(beavers.length > 0)
            {
                let towerpos=new THREE.Vector3(towers[i].object.position.x,towers[i].object.position.y,towers[i].object.position.z);
                let closestdistance = 4;
                let closestbeaver;

                //Check distance from tower for every beaver
                for(let j=0; j<beavers.length; j++)
                {
                    if(beavers[j] !== undefined)
                    {
                        let target = new THREE.Vector3(beavers[j].position.x,beavers[j].position.y,beavers[j].position.z);
                        let distancetobeaver = towerpos.distanceTo(target);

                        //console.log("Tower #"+ i + " to beaver #"+ j + " = " + distancetobeaver);

                        if(distancetobeaver < closestdistance)
                        {
                            closestdistance = distancetobeaver;
                            closestbeaver = beavers[j];
                        }
                    }
                }
                //console.log("The closest beaver to Tower #"+i+" = Beaver #"+closestbeaverid + "afstand" + closestdistance);

                if(closestdistance < 4)
                {
                    towers[i].shoot(closestbeaver, towers[i].object.position.x, towers[i].object.position.z);
                }
            }
        }
    }



    if(game.livingBeaver === 0 && game.inWave === true)
    {
        game.endWave();
    }

    beavers.forEach(function(beaver, i) {
        let nextX = beavers[i].nextStep.x;
        let nextZ = beavers[i].nextStep.z;
        if (nextX > beavers[i].position.x) {
            beavers[i].position.x += (beavers[i].stats.speed);
            // healthBars[i].position.x += beavers[i].stats.speed;
        }
        else if (nextX < beavers[i].position.x) {
            beavers[i].position.x -= (beavers[i].stats.speed);
            // healthBars[i].position.x -= beaver[i].stats.speed;
        }
        else if (nextZ > beavers[i].position.z) {
            beavers[i].position.z += (beavers[i].stats.speed);
            // healthBars[i].position.z += beavers[i].stats.speed;
        }
        else if (nextZ < beavers[i].position.z) {
            beavers[i].position.z -= (beavers[i].stats.speed);
            // healthBars[i].position.z -= beavers[i].stats.speed;
        }

        //check position
        if (nextX === beavers[i].position.x && nextZ === beavers[i].position.z) {
            // Calculate nextStep
            beavers[i].setNodes();
        }

        if (beavers[i].currentStep.x === beavers[i].end.x && beavers[i].currentStep.z === beavers[i].end.z) {
            //beavers[i].die();
            //delete beavers[i];
            game.deleteMonster(i, true);
        }

        if(beavers[i].stats.hp <= 0)
        {
            game.deleteMonster(i, false)
        }
    });
    renderer.setClearColor(0xBDCEB6);
    renderer.render(scene, camera);
}




