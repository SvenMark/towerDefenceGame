class Beaver extends NPC {
    constructor(texture, division, scale) {
        super(texture, division, scale);
        this.object = undefined;
        this.stats = {};
        this.stats.hp = 15;
        this.stats.hp = 15;
        this.stats.hp_100 = 15;
        this.stats.speed = 0.125;
        this.stats.currency = 1;
        this.size = {};
        this.size.x = tileSize;
        this.size.y = tileSize * 2;
        this.size.z = tileSize;
        this.position = {};
        this.position.x = 2;
        this.position.y = 4.25;
        this.position.z = 0;
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
        let geometry = new THREE.SphereGeometry(this.size.x, this.size, y, this.size.z);

        // should reference obj
        let refObject = window.beaver;
        this.object = new THREE.Mesh(refObject.geometry, material);


        this.object.position.set(this.position.x, this.position.y, this.position.z);
        this.object.scale.x = this.scale;
        this.object.scale.y = this.scale;
        this.object.scale.z = this.scale;
        this.currentStep.x = 0;
        this.currentStep.z = 0;
        this.setNodes();
    };

    setNodes() {
        if (this.nextStep.x !== undefined) {
            this.currentStep.x = this.nextStep.x;
            this.currentStep.z = this.nextStep.z;
        }

        // calculate next tile/step with a*
        Graph.nodes = nodes;
        let start = nodes[this.currentStep.x][this.currentStep.z];
        let end = nodes[this.end.x][this.end.z];
        let result = astar.search(Graph.nodes, start, end);
        if (result !== '') {
            this.nextStep.x = result[0].x;
            this.nextStep.y = result[0].z;
        }


    }

    getObject() {
        return this.object;
    }
}

