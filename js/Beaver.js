//Beaver == Spook
class Beaver extends NPC {
    constructor(texture, division, scale) {
        super(texture, division, scale);
        this.object = undefined;
        this.stats = {};
        this.stats.hp = 6 * game.wave;
        this.stats.speed = 0.125;
        this.stats.currency = 2;
        this.size = {};
        this.position = {};
        this.position.x = Math.floor((Math.random() * 19) + 1);
        this.position.y = 0.5;
        this.position.z = 19;
        this.scale = scale;

        // Store movement for this monster
        this.currentStep = {};
        this.nextStep = {};
        this.end = {};
        this.end.x = 10;
        this.end.z = 0;

    }

    create() {
        let texture = new THREE.ImageUtils.loadTexture(this.texture);
        let material = new THREE.MeshLambertMaterial({
            map: texture
        });

        // should reference obj
        let refObject = window.ghost;
        this.object = new THREE.Mesh(refObject.geometry, material);

        //this.object.rotation.y=-90*Math.PI / 180;
        this.object.position.set(this.position.x, this.position.y, this.position.z);
        this.object.scale.x = this.scale;
        this.object.scale.y = this.scale;
        this.object.scale.z = this.scale;
        this.currentStep.x = this.object.position.x;
        this.currentStep.z = this.object.position.z;
        this.setNodes();
    };

    remove()
    {
        scene.remove(this);
    }

    setNodes() {
        if (this.nextStep.x !== undefined) {
            this.currentStep.x = this.nextStep.x;
            this.currentStep.z = this.nextStep.z;
        }

        if (this.end.x === undefined) {
            this.end.x = 10;
            this.end.z = 0;
        }

        // calculate next tile/step with a*
        let start = graph.grid[this.currentStep.x][this.currentStep.z];
        let end = graph.grid[this.end.x][this.end.z];
        let result = astar.search(graph, start, end);
        if (result != '') {
            this.nextStep.x = result[0].x;
            this.nextStep.z = result[0].y; //astar weet niet beter
        }


    }

    getObject() {
        return this.object;
    }
}

