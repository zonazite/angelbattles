//function delay() {
//    return new Promise(resolve => setTimeout(resolve, 300));
//}

//async function delayedLog(item) {
//    await delay();
//    console.log(item);
//}

//async function processArray(array) {
//    const promises = array.map(delayedLog);
//    await Promise.all(promises);
//    console.log('Done!');
//}

//function Go() {
//    processArray([1, 2, 3]);
//}