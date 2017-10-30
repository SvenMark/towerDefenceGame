class Tower
{
    constructor(level)
    {
        this.material = new THREE.MeshLambertMaterial( {
            color: 0xFFD700
        });
        this.object = new THREE.Mesh(window.tower.geometry, this.material);
        this.stats = {};
        this.stats.level = level;
        this.stats.speed = 10;
        this.stats.damage = 3;
        this.lastshot = Date.now();

        //Set tower position and scale
        this.object.position.set(clickedobject.object.position.x, 0, clickedobject.object.position.z);
        this.object.scale.multiplyScalar(0.4);

        //Tower name for debug reasons
        this.name=("Tower #"+towercount).toString();

        //Add the tower to the scene
        scene.add(this.object);
        //this.updatecolor();

        console.log("Tower #"+ towercount +" Placed");
        console.log("Towerposx " + this.object.position.x + " Towerposz " + this.object.position.z );

        //Remove money
        game.currency=game.currency-towerprice;
        document.getElementById("currency").innerHTML="€"+game.currency+",-";


        //Tell the tile it is now occupied
        clickedobject.occupied=0;
    }

    shoot(beaver)
    {
        let projectile = new Projectile(this.object.position.x,this.object.position.z,this.stats.damage);
        projectile.fire(beaver);
    }

    upgradetower()
    {
        if(this.stats.level<3){
            //Remove money
            game.currency=game.currency-upgradeprice;
            document.getElementById("currency").innerHTML="€"+game.currency+",-";

            this.stats.level++;
            this.stats.speed=this.stats.speed-4;
            this.stats.damage=this.stats.damage+0.5;

            this.updatecolor();
            console.log(this.name +" Upgraded to level "+this.stats.level);
            $("#success").fadeIn(300).delay(1000).fadeOut(300);
        }
        else{
            $("#errorhighlvl").fadeIn(300).delay(1000).fadeOut(300);
        }
        upgradehide();
        scene.remove(indicator);
    }

    updatecolor(){
        switch(this.stats.level){
            case 1:
                this.object.material.color.setHex(0xFFD700);
                break;
            case 2:
                this.object.material.color.setHex(0xff9933);
                break;
            case 3:
                this.object.material.color.setHex(0xff6347);
                break;
            default:
                alert("Invalid lvl occured");
                break;
        }

    }
}