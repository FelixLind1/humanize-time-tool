let promise = new Promise(function (resolve, reject) {

  setTimeout(function () {

    resolve("Success!");

  }, 1000);

});

promise

  .then(function (result) {

    console.log(result); // "Success!"

  })

  .catch(function (error) {

    console.error(error);

  });
  function* generator() {

    yield 1;
  
    yield 2;
  
    yield 3;
  
  }
  
  let iterator = generator();
  
  console.log(iterator.next().value); // 1
  
  console.log(iterator.next().value); // 2
  
  console.log(iterator.next().value); // 3
  let map = new Map();

  map.set("key1", "value1");
  
  map.set("key2", "value2");
  
  console.log(map.get("key1")); // "value1"
  
  console.log(map.size); // 2
  
  let set = new Set();
  
  set.add("value1");
  
  set.add("value2");
  
  console.log(set.has("value1")); // true
  
  console.log(set.size); // 2