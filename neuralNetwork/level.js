class Level {
    constructor(inputCount, outputCount) {
        this.inputs = Array.from({ length: inputCount });
        this.outputs = Array.from({ length: outputCount });
        this.biases = new Array(outputCount).fill(0);

        this.weights = Array.from({ length: inputCount }, () =>
            new Array(outputCount)
        );

        Level.#randomize(this);
    }

    static #randomize(level) {
        level.weights = level.weights.map(row => {
            return row.map(() => Math.random() * 2 - 1);
        });

        level.biases = level.biases.map(() => Math.random() * 2 - 1);
    }

    static feedForward(givenInputs, level) {
        level.inputs = givenInputs;

        level.outputs = level.weights[0].map((_, i) => {
            const sum = level.inputs.reduce((acc, input, j) => {
                return acc + input * level.weights[j][i];
            }, 0);

            return sum > level.biases[i] ? 1 : 0;
        });

        return level.outputs;
    }
}