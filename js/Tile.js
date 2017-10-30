let connectedtower;
class Tile {
    constructor(x,z,i) {
        this.x=x;
        this.z=z;
        this.occupied = 1;

        let colorTile;
        if(i%2===0){
            colorTile=0x7fb740;
        }
        else{
            colorTile=0x8cb769;
        }

        let planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        let planeMaterial = new THREE.MeshBasicMaterial({
            color: colorTile,
            transparent: true,
            opacity: 0.7
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.set(-490 + (x * 10),-19,-850 + (z * 10));
        console.log(plane.position);
        scene.add(plane);
        this.object=plane;
    }
}
