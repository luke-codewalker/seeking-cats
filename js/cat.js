class Cat {
    constructor(canvas, color) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.color = color;
        this.position = new Vector(random(canvas.width), random(canvas.height));
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.size = random(8, 12);
        this.maxSpeed = this.size / 2;
        this.maxSteering = random(0.5, 1);
    }

    show() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.ellipse(this.position.x, this.position.y,
            this.size, this.size,
            0, 0, 2 * Math.PI)
        this.ctx.fill();
    }

    applyForce(force) {
        this.acceleration = Vector.add(this.acceleration, force);
    }

    update() {
        this.velocity = Vector.add(this.velocity, this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position = Vector.add(this.position, this.velocity);
        this.acceleration.mult(0);
    }

    seek(target) {
        const desired = Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed);
        const steering = Vector.sub(desired, this.velocity);
        return steering.limit(this.maxSteering);
    }

    separate(targets) {
        let sum = new Vector(0, 0);
        let count = 0;
        for (const otherCat of targets) {
            const distance = Vector.dist(this.position, otherCat.position);
            // bigger cats are more frightening
            let desiredSeparation = otherCat.size * 10;
            if (distance > 0 && distance < desiredSeparation) {
                // get the vector pointing away from the other cat
                let difference = Vector.sub(this.position, otherCat.position);
                // weight it by the distance to that cat (the closer the stronger the repulsion)
                difference.norm();
                difference.mult(1 / distance);

                sum = Vector.add(sum, difference);
                count++;
            }
        }

        if (count > 0) {
            // if we have accumulated some distances we apply steering based on their average
            const desired = Vector.mult(sum, 1 / count);
            desired.setMag(this.maxSpeed);
            const steering = Vector.sub(desired, this.velocity);
            return steering.limit(this.maxSteering);
        } else {
            // if not the desired separation is nothing
            return new Vector(0, 0);
        }
    }
}