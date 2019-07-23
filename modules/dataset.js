const fs = require('fs')

class Dataset {

  constructor () {
    this.feature = {};
    this.combinedFeatures = [];
    this.distances = [];
  }

  importFeature(type, file) {
    console.log(`Importing: ${file}`);
    let input = fs.readFileSync(file, 'utf8') // load file
      .match(/[^\r\n]+/g); // split string into an array of lines
    // loops through all lines (entities)
    for (let i = 0; i < input.length; i++) {
      input[i] = input[i]
        .match(/[^\s]+/g) // split line into an array of features
        .map(feature => Number(feature)); // convert string to number
    }
    this.feature[type] = input;
  }

  normalizeFeature (dataset) {
    console.log(`Normalizing: ${dataset}`);
    // Find minimum and maximum values in dataset (extent)
    // by looping through all entities, and all datapoints.
    let min, max;
    for (let i = 0; i < this.feature[dataset].length; i++) {
      for (let j = 0; j < this.feature[dataset][0].length; j++) {
        let current = this.feature[dataset][i][j];
        if (!min || current < min) {
          min = current;
        } else if (!max || current > max) {
          max = current;
        }
      }
    }
    // Loop through all entities and all datapoints,
    // to remap the value between 0 (min) and 1 (max).
    for (let i = 0; i < this.feature[dataset].length; i++) {
      for (let j = 0; j < this.feature[dataset][0].length; j++) {
        let value = this.feature[dataset][i][j];
        // explicitly set new value
        this.feature[dataset][i][j] = (value - min) / (max - min);
      }
    }
  }

  combineFeatures() {
    console.log(`Combining features`);
    let featureKeys = Object.keys(this.feature);
    let entityCount = this.feature[featureKeys[0]].length;
    for (let i = 0; i < entityCount; i++) {
      let features = [];
      for (let key of featureKeys) {
        features = features.concat(...this.feature[key][i]);
      }
      this.combinedFeatures.push(features);
    }
  }

  calculateDistances() {
    console.log(`Calculating distances`);
    let entityCount = this.combinedFeatures.length
    for (let entityA in this.combinedFeatures) {
      let distances = [];
      for (let entityB in this.combinedFeatures) {
        let distance = 0;
        for (let i = 0; i < this.combinedFeatures[entityA].length; i++) {
          let tmp =  this.combinedFeatures[entityA][i];
              tmp -= this.combinedFeatures[entityB][i];
              tmp *= tmp;
              distance += tmp;
        }
        distances.push(Math.sqrt(distance));
      }
      this.distances.push(distances);
    }
  }

  truncateDistances (decimals = 5) {
    console.log(`Truncating distances to ${decimals} decimals`);
    let desiredDecimals = Number(decimals);
    for (let i = 0; i < this.distances.length; i++) {
      for (let j = 0; j < this.distances[i].length; j++) {
        let value = this.distances[i][j];
        let truncated = Number(value.toFixed(desiredDecimals));
        this.distances[i][j] = truncated;
      }
    }
  }

  exportDistances(file) {
    console.log(`Saving distance matrix to ${file}`);
    fs.writeFileSync(file, JSON.stringify(this.distances, null, 0));
  }
}

module.exports = Dataset;
