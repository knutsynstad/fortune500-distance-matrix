const Dataset = require('./modules/dataset.js');

// Make note of the time,
// so that we can determine the total duration
console.log('Calculating distance matrix ...');
const startTime = Date.now();

// Create a new dataset
let data = new Dataset();

// Import, normalize, and combine feature sets
data.importFeature('shape', 'features/f_conv.txt');
data.normalizeFeature('shape');
data.importFeature('color', 'features/f_color.txt');
data.normalizeFeature('color');
data.combineFeatures();

// Calculate distance matrix
data.calculateDistances();

// Truncate distance matrix to N decimals
//data.truncateDistances(5)

// Save distance matrix to 'data.json'
data.exportDistances('data.json');

// Determine how long the calculation took
const endTime = Date.now();
console.log(`Finished in ${(endTime - startTime) / 1000} seconds.`);
