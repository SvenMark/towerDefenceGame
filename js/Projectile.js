class Projectile
{
    constructor(x,z)
    {
        this.direction = new THREE.Vector3(0, 0, 0);
        let geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
        let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        let sphere = new THREE.Mesh( geometry, material );
        this.object=sphere;
        sphere.position.x = x;
        sphere.position.y = 3; //3 So you can actually see the projectile for debug reasons.
        sphere.position.z = z;
        scene.add( sphere );
    }

    fire(beaver)
    {
        console.log(beaver);
        beaver.getHit();
        this.direction.x = beaver.position.x;
        this.direction.y = 3;
        this.direction.z = beaver.position.z;
    }

    updatelocation()
    {

    }
}