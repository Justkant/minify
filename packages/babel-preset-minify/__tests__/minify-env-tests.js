jest.autoMockOff();

const envPreset = require("@babel/preset-env");
const minifyPreset = require("../src/index");

const thePlugin = require("test-transform")(null, {
  plugins: [],
  minified: false,
  presets: [minifyPreset, envPreset]
});

describe("preset along with env", () => {
  thePlugin(
    "should fix issue #630",
    `
      const obj = {cat: 'dog'};
      let cat;
      ({cat} = obj);
    `,
    `
      var cat,
          obj = {
        cat: 'dog'
      },
          _obj = obj;
      cat = _obj.cat, _obj;
    `
  );

  thePlugin(
    "should fix simplify with env - issue#632",
    `
      let obj, key;
      if (1) ({k: key} = obj);
      foo();
    `,
    `
      var obj, key;
      key = obj.k, foo();
    `
  );

  thePlugin(
    "should fix issue#614",
    `
      function a() {
        var c = 1
        class B {}
        return B
      }
    `,
    `
      function _classCallCheck(a, b) { if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function"); }

      function a() {
        return function a() {
          _classCallCheck(this, a);
        };
      }
    `
  );

  thePlugin(
    "should fix issue#485",
    `
      function getSum(data) {
        let total = 0;
        for (let i = 0; i < data.length; i++) {
          total += data[i];
        }
        return total;
      }
    `,
    `
      function getSum(a) {
        for (var b = 0, c = 0; c < a.length; c++) b += a[c];

        return b;
      }
      `
  );

  thePlugin(
    "should fix issue#412",
    `
      let tabs = [1,2,3,4,5];
      let tabIdx = 0;

      for (let i = 0; i < tabs.length; i++) {
        // do something
      }

      console.log({
        tabIdx: tabIdx
      });
    `,
    `
      for (var tabs = [1, 2, 3, 4, 5], tabIdx = 0, i = 0; i < tabs.length; i++);

      console.log({
        tabIdx: tabIdx
      });
    `
  );

  thePlugin(
    "should fix issue#477",
    `
      {
        let count = 0;
        setInterval(() => {
          console.log('first tick: ', ++count);
        }, 200);
      }
      {
        let count = 0;
        setInterval(() => {
          console.log('second tick: ', ++count);
        }, 300);
      }
    `,
    `
      {
        var count = 0;
        setInterval(function () {
          console.log('first tick: ', ++count);
        }, 200);
      }
      {
        var _count = 0;
        setInterval(function () {
          console.log('second tick: ', ++_count);
        }, 300);
      }
    `
  );

  thePlugin(
    "should fix issue#720",
    `
      function test () {
        var arr = ['a', 'b', 'c'];
        var len = arr.length;
        var result = null;

        for (let i = 0; i < len; i++) {
            result = arr[i];
        }

        return result || {};
      }
    `,
    `
      function test() {
        for (var a = ['a', 'b', 'c'], b = a.length, c = null, d = 0; d < b; d++) c = a[d];

        return c || {};
      }
    `
  );
});
