let connectedtower;
class Tile {
    constructor(x,z,i) {
        this.x=x;
        this.z=z;
        this.occupied = 1;

        let colorTile;
        if(i%2===0){
            colorTile=0xC0C0C0;
        }
        else{
            colorTile=0x808080;
        }

        let planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        let planeMaterial = new THREE.MeshBasicMaterial({
            color: colorTile,
            transparent: true,
            opacity: 0.5
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(x,0,z);
        scene.add(plane);
        this.object=plane;
    }
}
