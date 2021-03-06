let renderer, camera, controls, scene, clock, clockDelta, ground, manager, loader, game, intersects, clickedobject, projector, mouse = { x: 0, y: 0 };
let tiles = [];
let beavers = [];
let graph = [];
//Create the indicator tile
let indicator = new THREE.Mesh( new THREE.CubeGeometry( 1, 0.2, 1 ), new THREE.MeshBasicMaterial({color:0xff6347, transparent:true, opacity:0.4, side: THREE.DoubleSide}) );
//List of stuff you can click
let targetList = [];
//List of objects you can click
let targetListObjects=[];
let towers=[], towercount=0;

//Tower costs:
let towerprice = 10;
let upgradeprice = 5;

let starterscurrency = 20;

function init() {
    clock = new THREE.Clock();

    //fpsCounter();
    setCamera();
    setScene();
    setControls();
    startGame();
    render();
}

//This function loads all objects used in the scene
function preLoader() {
    manager = new THREE.LoadingManager(init);

    loader = new THREE.MTLLoader();
    loader.load( 'models/Building/Ghostbusters Building.mtl', function( materials ) {
        materials.preload();

        loader = new THREE.OBJLoader();
        loader.setMaterials( materials );
        loader.load( 'models/Building/Ghostbusters Building.obj', function ( object ) {
            window.castle = object.children[0];
        });
    });

    loader = new THREE.MTLLoader();
    loader.load( 'models/City/city.mtl', function( materials ) {
        materials.preload();

        loader = new THREE.OBJLoader();
        loader.setMaterials( materials );
        loader.load( 'models/City/city.obj', function ( object ) {
            window.city = object.children[0];
        });
    });

    loader = new THREE.OBJLoader(manager);
    loader.load('models/Towers/tower.obj', function (object) {
        window.tower = object.children[0];
    });

    loader = new THREE.OBJLoader(manager);
    loader.load('models/slimer/slimer.obj', function (object) {
        window.ghost = object.children[0];
    });
}

//Creates a new entity of game
function startGame() {
    console.log('Game started!');
    game = new Game(1,1);
}

function setCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(10,20,30);
    camera.rotation.x = -Math.PI / 2;
}

function setControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = 0.39 * Math.PI; // Don't let the camera go below the ground
    controls.maxDistance = 40;
    controls.minDistance = 10;
}

function setScene() {
    scene = new THREE.Scene();

    //Adds the city to the scene
    let city = window.city;
    city.scale.multiplyScalar(0.1);
    city.position.y = -4.2;
    city.position.x = -2;
    city.position.z = -116.5;
    city.rotation.y=-180*Math.PI / 180;
    scene.add(city);

    //Adds the light to the scene
    let pointLight = new THREE.PointLight(0xffffff, 0.4, 0, 2);
    pointLight.position.set(0,800,0);
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

//Check if a tile is clicked, if so check if you can place a tower or upgrade
function onDocumentMouseDown( e ) {
    //Clicked tile indicator cube
    if(e.toElement.id==='placetower'){
        clickedobject.occupied = 0;
        graph = updateGraph(20);
        console.log("Path status: "+ isValidPath());
        if(!isValidPath()) {
            clickedobject.occupied = 1;
            graph = updateGraph(20);
            $("#errornospace").fadeIn(300).delay(1000).fadeOut(300);
            console.log("Geen plek");
        }
        else if (clickedobject.object.position.z === 19) {
            clickedobject.occupied = 1;
            $("#errorbeaverspawn").fadeIn(300).delay(1000).fadeOut(300);

        }
        else if(game.currency>=towerprice){
            //Make a new tower and place it
            towers[towercount] = new Tower(1);

            // update Graph for path finding
            graph = updateGraph(20);

            //Link tower to clicked tile
            clickedobject.connectedtower = towers[towercount];

            //Hide the placetower button
            placehide();
            scene.remove(indicator);
            $("#success").fadeIn(300).delay(1000).fadeOut(300);

            towercount++;
        }
        else{
            clickedobject.occupied = 1;
            upgradehide();
            $("#error").fadeIn(300).delay(1000).fadeOut(300);
        }
    }

    else if(e.toElement.id==='upgradetower'){
        //If you click the upgradetower button
        if(game.currency>=upgradeprice){
            clickedobject.connectedtower.upgradetower();
        }
        else{
            upgradehide();
            $("#error").fadeIn(300).delay(1000).fadeOut(300);
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
                upgradeshow();
                placehide();

            }
            else{
                //Show place tower button
                placeshow();
                upgradehide();
            }
            scene.remove(indicator);
            indicator.position.set(clickedobject.object.position.x, 0, clickedobject.object.position.z);
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

//Update the grid
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

//Check if a path is viable
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

//Fpscounter for debugging purposes
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
                //Calculate the tower position
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

                        //Check which beaver is closest
                        if(distancetobeaver < closestdistance)
                        {
                            closestdistance = distancetobeaver;
                            closestbeaver = beavers[j];
                        }
                    }
                }

                //Check if beaver is close enough for shot
                if(closestdistance < 4 && ((Date.now() - towers[i].lastshot) / 100 > towers[i].stats.speed))
                {
                    towers[i].shoot(closestbeaver);
                    console.log(Date.now() - towers[i].lastshot);
                    towers[i].lastshot = Date.now();
                }
            }
        }
    }

    //If all beavers are dead, end the wave.
    if(game.livingBeaver === 0 && game.inWave === true)
    {
        game.endWave();
    }

    //Loop for pathfinding and direction beaver is facing
    beavers.forEach(function(beaver, i) {
        let nextX = beavers[i].nextStep.x;
        let nextZ = beavers[i].nextStep.z;
        if (nextX > beavers[i].position.x) {
            beavers[i].rotation.y=-90*Math.PI / 180;
            beavers[i].position.x += (beavers[i].stats.speed);
            // healthBars[i].position.x += beavers[i].stats.speed;
        }
        else if (nextX < beavers[i].position.x) {
            beavers[i].rotation.y=90*Math.PI / 180;
            beavers[i].position.x -= (beavers[i].stats.speed);
            // healthBars[i].position.x -= beaver[i].stats.speed;
        }
        else if (nextZ > beavers[i].position.z) {
            beavers[i].rotation.y=0;
            beavers[i].position.z += (beavers[i].stats.speed);
            // healthBars[i].position.z += beavers[i].stats.speed;
        }
        else if (nextZ < beavers[i].position.z) {
            beavers[i].rotation.y=0;
            beavers[i].position.z -= (beavers[i].stats.speed);
            // healthBars[i].position.z -= beavers[i].stats.speed;
        }

        //check position
        if (nextX === beavers[i].position.x && nextZ === beavers[i].position.z) {
            // Calculate nextStep
            beavers[i].setNodes();
        }

        if(beavers[i].stats.hp <= 0)
        {
            game.deleteMonster(i, false);
            return;
        }

        if (beavers[i].currentStep.x === beavers[i].end.x && beavers[i].currentStep.z === beavers[i].end.z) {
            //beavers[i].die();
            //delete beavers[i];
            game.deleteMonster(i, true);
            return;
        }
    });
    renderer.setClearColor(0xBDCEB6);
    renderer.render(scene, camera);
}




