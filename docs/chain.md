

https://dev.to/sundarbadagala081/javascript-chaining-3h6g

# DIFFERENT WAYS TO ACHIEVE CHAINING IN JAVASCRIPT
## FACTORY FUNCTIONS:
```js
function main(num) {
  let i = num;
  return {
    add: function (num) {
      i += num;
      return this;
    },
    subtract: function (num) {
      i -= num;
      return this;
    },
    divide: function (num) {
      i /= num;
      return this;
    },
    multiple: function (num) {
      i *= num;
      return this;
    },
    print() {
      return i;
    },
  };
}

const x1 = main(10);
const x2 = main(10);

const value = x1.add(6).subtract(4).multiple(3).divide(2).print();
const value2 = x2.multiple(3).add(6).subtract(4).divide(2).print();
const value3 = x2.multiple(5).divide(4).print()

console.log(value);     //18
console.log(value2);    //16
console.log(value3)     //20
```
## CONSTRUCTOR FUNCTIONS:
```js
const main = function (init = 0) {
  this.i = init;
  this.add = function (i) {
    this.i += i;
    return this;
  };
 this.subtract = function (i) {
    this.i -= i;
    return this;
  };
  this.multiple = function (i) {
    this.i *= i;
    return this;
  };
 this.divide = function (i) {
    this.i /= i;
    return this;
  };
  this.print = function () {
    return this.i;
  };
};

const x1 = new main(10);
const x2 = new main(10);

const value = x1.add(6).subtract(4).multiple(3).divide(2).print();
const value2 = x2.multiple(3).add(6).subtract(4).divide(2).print();
const value3 = x2.multiple(5).divide(4).print()

console.log(value);     //18
console.log(value2);    //16
console.log(value3)     //20
```
## CLASS METHODS:
```js
class Main {
  constructor(data) {
    this.data = data;
  }
  add(num) {
    this.data += num;
    return this;
  }
  subtract(num) {
    this.data -= num;
    return this;
  }
  divide(num){
      this.data /= num;
      return this;
  }
  multiple(num) {
    this.data *= num;
    return this;
  }
  print() {
    return this.data;
  }
}

const x1 = new Main(10);
const x2 = new Main(10)

const value = x1.add(6).subtract(4).multiple(3).divide(2).print();
const value2 = x2.multiple(3).add(6).subtract(4).divide(2).print();
const value3 = x2.multiple(5).divide(4).print()

console.log(value);     //18
console.log(value2);    //16
console.log(value3)     //20
```

## OBJECT METHODS:
```js
const main = {
  data: {
    i: 0,
  },
  initiate: function (num = 0) {
    this.data.i = num;
    return this;
  },
  add: function (num) {
    this.data.i += num;
    return this;
  },
  subtract: function (num) {
    this.data.i -= num;
    return this;
  },
  multiple: function (num) {
    this.data.i *= num;
    return this;
  },
  divide: function (num) {
    this.data.i /= num;
    return this;
  },
  print: function () {
    return this.data.i;
  },
};

const value = main.initiate(10).add(6).subtract(4).divide(3).multiple(2).print();
const value2 = main.initiate(10).multiple(3).add(6).subtract(4).divide(2).print();

console.log(value);     //8
console.log(value2)     //16
```
## Using Prototype:
```js
function Dog() {}

Dog.prototype.is = null;
Dog.prototype.log = function() {
  console.log(this.is);
};
Dog.prototype.bark = function() {
  this.is = "woofing";
  this.log();
  return this;
};
Dog.prototype.walk = function() {
  this.is = "walking";
  this.log();
  return this;
};
Dog.prototype.eat = function() {
  this.is = "eating";
  this.log();
  return this;
};
const dog = new Dog();
dog
  .bark()
  .eat()
  .walk();
```