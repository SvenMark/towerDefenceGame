class Tower
{
    constructor(level)
    {
        this.level = level;

        //Perfect tower
        let towerGeomitry = new THREE.BoxGeometry(1,5,1);
        let towerMaterial = new THREE.MeshToonMaterial({
            color: 0xFF69B4,
            side: THREE.DoubleSide
        });
        let tower=new THREE.Mesh(towerGeomitry, towerMaterial);
        tower.position.set(0,2.5,0);
        scene.add(tower);
        console.log(tower.position);
    }

}


