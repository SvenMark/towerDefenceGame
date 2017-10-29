class Tower
{
    constructor(level, object)
    {
        this.object = object;
        this.stats = {};
        this.stats.level = level;
        this.stats.hp = 100;

        let tower = this.object;
        //let cube = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshNormalMaterial() );
        tower.position.set(clickedobject.object.position.x, 0, clickedobject.object.position.z);
        tower.scale.multiplyScalar(0.4);
        //Tower name for debug reasons
        tower.name=("Tower #"+towercount).toString();
        scene.add(tower);

        clickedobject.connectedtower=tower;
        towers[towercount]=tower;
        towercount++;
        console.log("Tower Placed");
        clickedobject.occupied=0;
        document.getElementById("placetower").style.display = 'none';
    }

    placetower()
    {
        let tower = this.object;
        //let cube = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshNormalMaterial() );
        tower.position.set(clickedobject.object.position.x, 0, clickedobject.object.position.z);
        tower.scale.multiplyScalar(0.4);
        //Tower name for debug reasons
        tower.name=("Tower #"+towercount).toString();
        scene.add(tower);
    }

    upgradetower()
    {
        console.log(tower.name +" Upgraded");
        document.getElementById("upgradetower").style.display = 'none';
    }
}