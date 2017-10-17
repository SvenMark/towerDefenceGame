class Projectile
{
    constructor()
    {
        this.direction = new THREE.Vector3(0, 0, 0);
        var geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.y = 2;
        scene.add( sphere );
    }

    fire(target)
    {
        console.log("FIRE");
        this.direction.x = target.position.x;
        this.direction.y = target.position.y;
        this.direction.z = target.position.z;
    }
}