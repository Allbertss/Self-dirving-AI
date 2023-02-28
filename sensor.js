class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 30;
        this.rayLength = 150;
        this.raySpread = Math.PI * 2;

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#castRays();

        this.readings = [];
        this.readings = this.rays.map(ray => this.#getReading(ray, roadBorders, traffic));
    }

    draw(ctx) {
        this.rays.forEach(([start, end], i) => {
            let endPos = end;
            if (this.readings[i]) {
                endPos = this.readings[i];
            }

            ctx.lineWidth = 2;

            ctx.strokeStyle = 'yellow';
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.stroke();

            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.stroke();
        });
    }

    #castRays() {
        this.rays = Array.from({
            length: this.rayCount
        }, (_, i) => {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount === 1 ? .5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = {
                x: this.car.x,
                y: this.car.y
            };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }

            return [start, end];
        });
    }

    #getReading(ray, roadBorders, traffic) {
        const touches = [];

        roadBorders.forEach(border => {
            const touch = getIntersection(ray[0], ray[1], border[0], border[1]);

            if (touch) {
                touches.push(touch);
            }
        });

        traffic.forEach(car => {
            car.polygon.forEach((point, index) => {
                const value = getIntersection(ray[0], ray[1], point, car.polygon[(index + 1) % car.polygon.length]);

                if (value) {
                    touches.push(value);
                }
            });
        });

        if (touches.length === 0) {
            return null;
        }

        const offsets = touches.map(element => element.offset);
        const minOffset = Math.min(...offsets);

        return touches.find(element => element.offset === minOffset);
    }
}