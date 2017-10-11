class Tower
{
    constructor(level)
    {
        this.level = level;

        //Perfect tower
        let towerGeomitry = new THREE.BoxGeometry(30,150,30);
        let towerMaterial = new THREE.MeshToonMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        let tower=new THREE.Mesh(towerGeomitry, towerMaterial);
        tower.position.set(-300,75,0);
        scene.add(tower);
    }

}


