import { lerp } from "../utils";
import { getRGBA } from "../utils";

class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const { canvas: { width, height } } = ctx;
        const left = margin;
        const top = margin;
        const levelHeight = height / network.levels.length;

        const levelOptions = (level) => {
            const arrows = level === network.levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : [];
            const dashed = level === network.levels.length - 1 ? [7, 3] : [];

            return { arrows, dashed };
        };

        range(network.levels.length - 1, -1, -1).forEach((level) => {
            const levelTop = top + lerp(height - levelHeight, 0, network.levels.length === 1 ? 0.5 : level / (network.levels.length - 1));
            const { arrows, dashed } = levelOptions(level);

            ctx.setLineDash(dashed);

            Visualizer.drawLevel(ctx, network.levels[level], left, levelTop, width, levelHeight, arrows);
        });
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        const drawConnection = (i, j) => {
            ctx.beginPath();
            ctx.moveTo(
                Visualizer.#getNode(inputs, i, left, right),
                bottom
            );
            ctx.lineTo(
                Visualizer.#getNode(outputs, j, left, right),
                top
            );
            ctx.lineWidth = 2;
            ctx.strokeStyle = getRGBA(weights[i][j]);
            ctx.stroke();
        };

        inputs.forEach((_, i) => {
            outputs.forEach((_, j) => {
                drawConnection(i, j);
            });
        });

        const nodeRadius = 18;

        inputs.forEach((value, i) => {
            const x = Visualizer.#getNode(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(value);
            ctx.fill();
        });

        outputs.forEach((value, i) => {
            const node = Visualizer.#getNode(outputs, i, left, right);

            ctx.beginPath();
            ctx.arc(node, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(node, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(value);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(node, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'white';
                ctx.font = nodeRadius * 1.5 + 'px Arial';
                ctx.fillText(outputLabels[i], node, top + nodeRadius * 0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], node, top + nodeRadius * 0.1);
            }
        });
    }

    static #getNode(nodes, index, left, right) {
        const position = nodes.length === 1 ? 0.5 : index / (nodes.length - 1);

        return lerp(left, right, position);
    }
}