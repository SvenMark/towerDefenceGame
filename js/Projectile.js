class Projectile
{
    constructor(x,z,damage)
    {
        this.x=x;
        this.z=z;
        this.damage=damage;
    }

    fire(beaver)
    {
        pewpew();
        beaver.stats.hp = beaver.stats.hp - this.damage;

        let material = new THREE.LineBasicMaterial({
            color: 0x85AEFD
        });
        let geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( this.x, 2, this.z ),
            new THREE.Vector3( beaver.position.x, beaver.position.y, beaver.position.z-1 )
        );

        let laser = new THREE.Line( geometry, material );
        scene.add( laser );
        setTimeout(function (){
            scene.remove(laser)
        }, 250);

    }
}