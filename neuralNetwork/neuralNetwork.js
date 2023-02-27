import { lerp } from "../utils";

class NeuralNetwork {
    constructor(neurons) {
        this.levels = [];

        neurons.slice(0, -1).forEach((count, i) => {
            this.levels.push(new Level(count, neurons[i + 1]));
        });
    }

    static feedForward(givenInputs, network) {
        return network.levels.reduce((inputs, level) => {
            return Level.feedForward(inputs, level);
        }, givenInputs);
    }

    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            level.biases = level.biases.map(bias => {
                return lerp(bias, Math.random() * 2 - 1, amount);
            });

            level.weights = level.weights.map(row => {
                return row.map(weight => {
                    return lerp(weight, Math.random() * 2 - 1, amount);
                });
            });
        });
    }
}