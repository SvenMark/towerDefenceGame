class Tile {
    constructor(x,z,i) {
        this.x=x;
        this.z=z;

        let colorTile;
        if(i%2===0){
            colorTile=0x006633;
        }
        else{
            colorTile=0xFFFFFF;
        }

        let planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        let planeMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/soil.jpg'),
            //color: colorTile,
            side: THREE.DoubleSide
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(x,0,z);
        scene.add(plane);
    }
}
