class Beaver extends NPC {
    constructor(texture, division, scale) {
        super(texture, division, scale);
        this.object = undefined;
        this.stats = {};
        this.stats.hp = 15;
        this.stats.hp = 15;
        this.stats.hp_100 = 15;
        this.stats.speed = 0.05;
        this.stats.currency = 1;
        this.size = {};
        this.size.x = tileSize;
        this.size.y = tileSize * 2;
        this.size.z = tileSize;
        this.position = {};
        this.position.x = 2;
        this.position.y = 0;
        this.position.z = 5;
        this.scale = scale;

        // Store movement for this monster
        this.currentStep = {};
        this.nextStep = {};
        this.end = {};
        this.end.x = 5;
        this.end.z = 5;

    }

    create() {
        let texture = new THREE.ImageUtils.loadTexture(this.texture);
        let material = new THREE.MeshLambertMaterial({
            map: texture
        });
        let geometry = new THREE.SphereGeometry(this.size.x, this.size.y, this.size.z);

        // should reference obj
        let refObject = window.ghost;
        this.object = new THREE.Mesh(refObject.geometry, material);


        this.object.position.set(this.position.x, this.position.y, this.position.z);
        this.object.scale.x = this.scale;
        this.object.scale.y = this.scale;
        this.object.scale.z = this.scale;
        this.currentStep.x = this.object.position.x;
        this.currentStep.z = this.object.position.z;
        this.setNodes();
    };

    setNodes() {
        if (this.nextStep.x !== undefined) {
            this.currentStep.x = this.nextStep.x;
            this.currentStep.z = this.nextStep.z;
        }

        if (this.end.x === undefined) {
            this.end.x = 5;
            this.end.z = 5;
        }

        // calculate next tile/step with a*
        let start = graph.grid[this.currentStep.x][this.currentStep.z];
        let end = graph.grid[this.end.x][this.end.z];
        let result = astar.search(graph, start, end);
        console.log(result);
        if (result != '') {
            this.nextStep.x = result[0].x;
            this.nextStep.z = result[0].y; //astar weet niet beter
        }


    }

    getObject() {
        return this.object;
    }
}

