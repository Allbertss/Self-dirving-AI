class Road {
    constructor(x, width, laneCount) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        const infinity = 9999999;

        this.left = x - width / 2;
        this.rigth = x + width / 2;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft = {
            x: this.left,
            y: this.top
        };
        const topRight = {
            x: this.rigth,
            y: this.top
        };
        const bottomLeft = {
            x: this.left,
            y: this.bottom
        };
        const bottomRigth = {
            x: this.rigth,
            y: this.bottom
        };

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRigth]
        ];
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';

        Array.from({ length: this.laneCount - 1 }, (_, i) => {
            const x = lerp(this.left, this.rigth, (i + 1) / this.laneCount);

            ctx.setLineDash([20, 20]);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        });

        ctx.setLineDash([]);

        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;

        return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }
}