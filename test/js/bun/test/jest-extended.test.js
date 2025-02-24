"use strict";

/** This file is meant to be runnable in both Jest and Bun.
 *  `bunx jest jest-extended.test.js`
 */

const isBun = typeof Bun !== "undefined";
if (!isBun) {
  const extended = require("jest-extended");
  expect.extend(extended);
  test.todo = test;
}

const inspect = isBun ? Bun.inspect : require("util").inspect;

// https://jest-extended.jestcommunity.dev/docs/matchers/
describe("jest-extended", () => {
  test.todo("pass()", () => {
    expect(typeof expect().pass).toBe("function");
    expect(() => expect().not.pass()).toThrow();
    expect().pass();
    expect().pass("message ignored");
  });

  test.todo("fail()", () => {
    expect(typeof expect().fail).toBe("function");
    expect(() => expect("ignored value").fail("message here")).toThrow("message here");
    expect().not.fail();
  });

  describe("toBeEmpty()", () => {
    const values = [
      "",
      [],
      {},
      new Set(),
      new Map(),
      new String(),
      new Array(),
      new Uint8Array(),
      new Object(),
      Buffer.from(""),
      ...(isBun ? [Bun.file("/tmp/empty.txt")] : []),
      new Headers(),
      new URLSearchParams(),
      new FormData(),
      (function* () {})(),
    ];
    for (const value of values) {
      test(label(value), () => {
        if (value && typeof value === "object" && value instanceof Blob) {
          require("fs").writeFileSync("/tmp/empty.txt", "");
        }

        expect(value).toBeEmpty();
      });
    }
  });

  describe("not.toBeEmpty()", () => {
    const values = [
      " ",
      [""],
      [undefined],
      { "": "" },
      new Set([""]),
      new Map([["", ""]]),
      new String(" "),
      new Array(1),
      new Uint8Array(1),
      Buffer.from(" "),
      ...(isBun ? [Bun.file(__filename)] : []),
      new Headers({
        a: "b",
        c: "d",
      }),
      new URL("https://example.com?d=e&f=g").searchParams,
      (() => {
        var a = new FormData();
        a.append("a", "b");
        a.append("c", "d");
        return a;
      })(),
      (function* () {
        yield "123";
      })(),
    ];
    for (const value of values) {
      test(label(value), () => {
        expect(value).not.toBeEmpty();
      });
    }
  });

  // toBeOneOf('toSatisfy()')

  test("toBeNil()", () => {
    expect(null).toBeNil();
    expect(undefined).toBeNil();
    expect(false).not.toBeNil();
    expect(0).not.toBeNil();
    expect("").not.toBeNil();
    expect([]).not.toBeNil();
    expect(true).not.toBeNil();
    expect({}).not.toBeNil();
  });

  // test('toSatisfy()')

  // Array

  // test('toBeArray()')
  // test('toBeArrayOfSize()')
  // test('toIncludeAllMembers()')
  // test('toIncludeAllPartialMembers()')
  // test('toIncludeAnyMembers()')
  // test('toIncludeSameMembers()')
  // test('toPartiallyContain()')
  // test('toSatisfyAll()')
  // test('toSatisfyAny()')
  // test('toBeInRange()')

  // Boolean

  test("toBeBoolean()", () => {
    expect(true).toBeBoolean();
    expect(false).toBeBoolean();
    expect(0).not.toBeBoolean();
    expect(1).not.toBeBoolean();
    expect("").not.toBeBoolean();
    expect({}).not.toBeBoolean();
  });

  test("toBeTrue()", () => {
    expect(true).toBeTrue();
    expect(false).not.toBeTrue();
    expect(0).not.toBeTrue();
    expect(1).not.toBeTrue();
    expect("").not.toBeTrue();
    expect({}).not.toBeTrue();
  });

  test("toBeFalse()", () => {
    expect(false).toBeFalse();
    expect(true).not.toBeFalse();
    expect(0).not.toBeFalse();
    expect(1).not.toBeFalse();
    expect("").not.toBeFalse();
    expect({}).not.toBeFalse();
  });

  // Date

  test("toBeDate()", () => {
    expect(new Date()).toBeDate();
    expect(new Date(0)).toBeDate();
    expect(new Date("2021-01-01")).toBeDate();
    expect("2021-01-01").not.toBeDate();
    expect({}).not.toBeDate();
    expect(null).not.toBeDate();
  });

  test.todo("toBeValidDate()", () => {
    expect(new Date()).toBeValidDate();
    expect(new Date(-1)).toBeValidDate();
    expect("2021-01-01").not.toBeValidDate();
    expect({}).not.toBeValidDate();
    expect(null).not.toBeValidDate();
  });

  // expect("toBeAfter()")
  // expect("toBeBefore()")
  // expect("toBeAfterOrEqualTo()")
  // expect("toBeBeforeOrEqualTo()")
  // expect("toBeBetween()")

  // Function

  test("toBeFunction()", () => {
    expect(() => {}).toBeFunction();
    expect(function () {}).toBeFunction();
    expect(async function () {}).toBeFunction();
    expect(async () => {}).toBeFunction();
    expect(function* () {}).toBeFunction();
    expect(async function* () {}).toBeFunction();
    expect("").not.toBeFunction();
    expect({}).not.toBeFunction();
    expect(null).not.toBeFunction();
  });

  // expect('toThrowWithMessage()')

  // Mock

  // Number
  test("toBeNumber()", () => {
    expect(0).toBeNumber();
    expect(1).toBeNumber();
    expect(1.23).toBeNumber();
    expect(Infinity).toBeNumber();
    expect(-Infinity).toBeNumber();
    expect(NaN).toBeNumber();
    expect("").not.toBeNumber();
    expect({}).not.toBeNumber();
  });

  test("toBeFinite()", () => {
    expect(0).toBeFinite();
    expect(1).toBeFinite();
    expect(1.23).toBeFinite();
    expect(Infinity).not.toBeFinite();
    expect(-Infinity).not.toBeFinite();
    expect(NaN).not.toBeFinite();
    expect("").not.toBeFinite();
    expect({}).not.toBeFinite();
  });

  test("toBePositive()", () => {
    expect(1).toBePositive();
    expect(1.23).toBePositive();
    expect(Infinity).not.toBePositive();
    expect(0).not.toBePositive();
    expect(-Infinity).not.toBePositive();
    expect(NaN).not.toBePositive();
    expect("").not.toBePositive();
    expect({}).not.toBePositive();
  });

  test("toBeNegative()", () => {
    expect(-1).toBeNegative();
    expect(-1.23).toBeNegative();
    expect(-Infinity).not.toBeNegative();
    expect(0).not.toBeNegative();
    expect(Infinity).not.toBeNegative();
    expect(NaN).not.toBeNegative();
    expect("").not.toBeNegative();
    expect({}).not.toBeNegative();
  });

  test("toBeWithin()", () => {
    expect(0).toBeWithin(0, 1);
    expect(3.14).toBeWithin(3, 3.141);
    expect(-25).toBeWithin(-100, 0);
    expect(0).not.toBeWithin(1, 2);
    expect(3.14).not.toBeWithin(3.1, 3.14);
    expect(99).not.toBeWithin(99, 99);
    expect(100).not.toBeWithin(99, 100);
    expect(NaN).not.toBeWithin(0, 1);
    // expect("").not.toBeWithin(0, 1);
    expect({}).not.toBeWithin(0, 1);
    expect(Infinity).not.toBeWithin(-Infinity, Infinity);
  });

  test("toBeEven()", () => {
    expect(1).not.toBeEven();
    expect(2).toBeEven();
    expect(3).not.toBeEven();
    expect(3.1).not.toBeEven();
    expect(2.1).not.toBeEven();
    expect(4).toBeEven();
    expect(5).not.toBeEven();
    expect(6).toBeEven();
    expect(0).toBeEven();
    expect(-8).toBeEven();
    expect(-0).toBeEven();
    expect(NaN).not.toBeEven();
    expect([]).not.toBeEven();
    expect([1, 2]).not.toBeEven();
    expect({}).not.toBeEven();
    expect(() => {}).not.toBeEven();
    expect("").not.toBeEven();
    expect("string").not.toBeEven();
    expect(undefined).not.toBeEven();
    expect(Math.floor(Date.now() / 1000) * 2).toBeEven(); // Slight fuzz by using timestamp times 2
    expect(Math.floor(Date.now() / 1000) * 4 - 1).not.toBeEven();
    expect(4.0e1).toBeEven();
    expect(6.2e1).toBeEven();
    expect(6.3e1).not.toBeEven();
    expect(6.33e1).not.toBeEven();
    expect(3.3e-1).not.toBeEven(); //throw
    expect(0.3).not.toBeEven(); //throw
    expect(0.4).not.toBeEven();
    expect(1).not.toBeEven();
    expect(0).toBeEven();
    expect(2.0).toBeEven();
    expect(NaN).not.toBeEven();
    expect(2n).toBeEven(); // BigInt at this time not supported in jest-extended
    expect(3n).not.toBeEven();
    expect(9007199254740990).toBeEven(); // manual typical max safe -1 // not int?
    if (isBun) expect(9007199254740990n).toBeEven(); // manual typical max safe -1 as bigint
    expect(Number.MAX_SAFE_INTEGER - 1).toBeEven(); // not int?
    expect(Number.MAX_SAFE_INTEGER).not.toBeEven();
    if (isBun) {
      expect(BigInt(Number.MAX_SAFE_INTEGER) - 1n).toBeEven();
      expect(BigInt(Number.MIN_SAFE_INTEGER) + 1n).toBeEven();
    }
    expect(BigInt(Number.MAX_SAFE_INTEGER)).not.toBeEven();
    expect(BigInt(Number.MAX_VALUE - 1)).toBeEven();
    expect(Number.MIN_SAFE_INTEGER + 1).toBeEven(); // not int?
    expect(Number.MIN_SAFE_INTEGER).not.toBeEven();
    expect(BigInt(Number.MIN_SAFE_INTEGER)).not.toBeEven();
    expect(4 / Number.NEGATIVE_INFINITY).toBeEven(); // as in IEEE-754: + / -inf => neg zero
    expect(5 / Number.NEGATIVE_INFINITY).toBeEven();
    expect(-7 / Number.NEGATIVE_INFINITY).toBeEven(); // as in IEEE-754: - / -inf => zero
    expect(-8 / Number.NEGATIVE_INFINITY).toBeEven();
    expect(new WebAssembly.Global({ value: "i32", mutable: false }, 4).value).toBeEven();
    expect(new WebAssembly.Global({ value: "i32", mutable: false }, 3).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "i32", mutable: true }, 2).value).toBeEven();
    expect(new WebAssembly.Global({ value: "i32", mutable: true }, 1).value).not.toBeEven();
    if (isBun) {
      expect(new WebAssembly.Global({ value: "i64", mutable: true }, -9223372036854775808n).value).toBeEven();
      expect(new WebAssembly.Global({ value: "i64", mutable: false }, -9223372036854775808n).value).toBeEven();
      expect(new WebAssembly.Global({ value: "i64", mutable: true }, 9223372036854775807n).value).not.toBeEven();
      expect(new WebAssembly.Global({ value: "i64", mutable: false }, 9223372036854775807n).value).not.toBeEven();
    }
    expect(new WebAssembly.Global({ value: "f32", mutable: true }, 42.0).value).toBeEven();
    expect(new WebAssembly.Global({ value: "f32", mutable: false }, 42.0).value).toBeEven();
    expect(new WebAssembly.Global({ value: "f64", mutable: true }, 42.0).value).toBeEven();
    expect(new WebAssembly.Global({ value: "f64", mutable: false }, 42.0).value).toBeEven();
    expect(new WebAssembly.Global({ value: "f32", mutable: true }, 43.0).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "f32", mutable: false }, 43.0).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "f64", mutable: true }, 43.0).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "f64", mutable: false }, 43.0).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "f32", mutable: true }, 4.3).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "f32", mutable: false }, 4.3).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "f64", mutable: true }, 4.3).value).not.toBeEven();
    expect(new WebAssembly.Global({ value: "f64", mutable: false }, 4.3).value).not.toBeEven();
    // did not seem to support SIMD v128 type yet (which is not in W3C specs for JS but is a valid global type)
    // FUTURE: expect(new WebAssembly.Global({value:'v128', mutable:false}, -170141183460469231731687303715884105728n).value).toBeEven();
    // FUTURE: expect(new WebAssembly.Global({value:'v128', mutable:true}, -170141183460469231731687303715884105728n).value).toBeEven();
    // FUTURE: expect(new WebAssembly.Global({value:'v128', mutable:true}, 170141183460469231731687303715884105727n).value).not.toBeEven();
    // FUTURE: expect(new WebAssembly.Global({value:'v128', mutable:false}, 170141183460469231731687303715884105727n).value).not.toBeEven();
    // FUTURE: with uintv128: expect(new WebAssembly.Global({value:'v128', mutable:false}, 340282366920938463463374607431768211456n).value).toThrow();
  });

  test("toBeOdd()", () => {
    expect(1).toBeOdd();
    expect(2).not.toBeOdd();
    expect(3).toBeOdd();
    expect(3.1).not.toBeOdd();
    expect(2.1).not.toBeOdd();
    expect(4).not.toBeOdd();
    expect(5).toBeOdd();
    expect(6).not.toBeOdd();
    expect(0).not.toBeOdd();
    expect(-8).not.toBeOdd();
    expect(-0).not.toBeOdd();
    expect(NaN).not.toBeOdd();
    expect([]).not.toBeOdd();
    // SHOULD FAIL: expect([]).toBeOdd();
    expect([1, 2]).not.toBeOdd();
    expect({}).not.toBeOdd();
    expect(() => {}).not.toBeOdd();
    expect("").not.toBeOdd();
    expect("string").not.toBeOdd();
    expect(undefined).not.toBeOdd();
    expect(Math.floor(Date.now() / 1000) * 2 - 1).toBeOdd(); // Slight fuzz by using timestamp times 2
    expect(Math.floor(Date.now() / 1000) * 4 - 1).toBeOdd();
    expect(4.0e1).not.toBeOdd();
    expect(6.2e1).not.toBeOdd();
    expect(6.3e1).toBeOdd();
    expect(6.33e1).not.toBeOdd();
    expect(3.2e-3).not.toBeOdd();
    expect(0.3).not.toBeOdd();
    expect(0.4).not.toBeOdd();
    expect(1).toBeOdd();
    expect(0).not.toBeOdd();
    expect(2.0).not.toBeOdd();
    expect(NaN).not.toBeOdd();
    if (isBun) expect(2n).not.toBeOdd(); // BigInt at this time not supported in jest-extended
    if (isBun) expect(3n).toBeOdd();
    expect(9007199254740990).not.toBeOdd(); // manual typical max safe -1
    expect(9007199254740991).toBeOdd();
    if (isBun) expect(9007199254740990n).not.toBeOdd(); // manual typical max safe -1 as bigint
    if (isBun) expect(9007199254740991n).toBeOdd();
    expect(Number.MAX_SAFE_INTEGER - 1).not.toBeOdd();
    expect(Number.MAX_SAFE_INTEGER).toBeOdd();
    expect(BigInt(Number.MAX_SAFE_INTEGER) - 1n).not.toBeOdd();
    expect(BigInt(Number.MAX_SAFE_INTEGER)).toBeOdd();
    expect(Number.MIN_SAFE_INTEGER + 1).not.toBeOdd();
    expect(Number.MIN_SAFE_INTEGER).toBeOdd();
    expect(BigInt(Number.MIN_SAFE_INTEGER) + 1n).not.toBeOdd();
    expect(BigInt(Number.MIN_SAFE_INTEGER)).toBeOdd();
    expect(4 / Number.NEGATIVE_INFINITY).not.toBeOdd(); // in IEEE-754: + / -inf => neg zero
    expect(5 / Number.NEGATIVE_INFINITY).not.toBeOdd();
    expect(-7 / Number.NEGATIVE_INFINITY).not.toBeOdd(); // in IEEE-754: - / -inf => zero
    expect(-8 / Number.NEGATIVE_INFINITY).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "i32", mutable: false }, 4).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "i32", mutable: false }, 3).value).toBeOdd();
    expect(new WebAssembly.Global({ value: "i32", mutable: true }, 2).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "i32", mutable: true }, 1).value).toBeOdd();
    if (isBun) {
      expect(new WebAssembly.Global({ value: "i64", mutable: true }, -9223372036854775808n).value).not.toBeOdd();
      expect(new WebAssembly.Global({ value: "i64", mutable: false }, -9223372036854775808n).value).not.toBeOdd();
      expect(new WebAssembly.Global({ value: "i64", mutable: true }, 9223372036854775807n).value).toBeOdd();
      expect(new WebAssembly.Global({ value: "i64", mutable: false }, 9223372036854775807n).value).toBeOdd();
    }
    expect(new WebAssembly.Global({ value: "f32", mutable: true }, 42.0).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "f32", mutable: false }, 42.0).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "f64", mutable: true }, 42.0).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "f64", mutable: false }, 42.0).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "f32", mutable: true }, 43.0).value).toBeOdd();
    expect(new WebAssembly.Global({ value: "f32", mutable: false }, 43.0).value).toBeOdd();
    expect(new WebAssembly.Global({ value: "f64", mutable: true }, 43.0).value).toBeOdd();
    expect(new WebAssembly.Global({ value: "f64", mutable: false }, 43.0).value).toBeOdd();
    expect(new WebAssembly.Global({ value: "f32", mutable: true }, 4.3).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "f32", mutable: false }, 4.3).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "f64", mutable: true }, 4.3).value).not.toBeOdd();
    expect(new WebAssembly.Global({ value: "f64", mutable: false }, 4.3).value).not.toBeOdd();
    // did not seem to support SIMD v128 type yet
    // FUTURE: expect(new WebAssembly.Global({value:'v128', mutable:false}, 42).value).not.toBeOdd();
    // FUTURE: expect(new WebAssembly.Global({value:'v128', mutable:true}, 42).value).not.toBeOdd();
    // FUTURE: expect(new WebAssembly.Global({value:'v128', mutable:true}, 43).value).toBeOdd();
  });

  test("toBeInteger()", () => {
    expect(0).toBeInteger();
    expect(1).toBeInteger();
    expect(1.23).not.toBeInteger();
    expect(Infinity).not.toBeInteger();
    expect(-Infinity).not.toBeInteger();
    expect(NaN).not.toBeInteger();
    expect("").not.toBeInteger();
    expect({}).not.toBeInteger();
  });

  // Object

  // test("toBeObject()")
  // test("toBeEmptyObject()")
  // test("toContainKey()")
  // test("toContainKeys()")
  // test("toContainAllKeys()")
  // test("toContainAnyKeys()")
  // test("toContainValue()")
  // test("toContainValues()")
  // test("toContainAllValues()")
  // test("toContainAnyValues()")
  // test("toContainEntry()")
  // test("toContainEntries()")
  // test("toContainAllEntries()")
  // test("toContainAnyEntries()")
  // test("toBeExtensible()")
  // test("toBeFrozen()")
  // test("toBeSealed()")

  // String

  test("toBeString()", () => {
    expect("").toBeString();
    expect("123").toBeString();
    expect(new String()).toBeString();
    expect(new String("123")).toBeString();
    expect(123).not.toBeString();
    expect({}).not.toBeString();
  });
  // test("toBeHexadecimal()")
  // test("toBeDateString()")
  // test("toEqualCaseInsensitive()")

  test("toStartWith()", () => {
    expect("123").toStartWith("1");
    expect("abc").toStartWith("abc");
    expect(" 123 ").toStartWith(" ");
    expect(" ").toStartWith("");
    expect("").toStartWith("");
    expect("bob").not.toStartWith("alice");
  });

  test("toEndWith()", () => {
    expect("123").toEndWith("3");
    expect("abc").toEndWith("abc");
    expect(" 123 ").toEndWith(" ");
    expect(" ").toEndWith("");
    expect("").toEndWith("");
    expect("bob").not.toEndWith("alice");
  });

  test("toInclude()", () => {
    expect("123").toInclude("1");
    expect("abc").toInclude("abc");
    expect(" 123 ").toInclude(" ");
    expect("").toInclude("");
    expect("bob").not.toInclude("alice");
  });

  // test("toIncludeRepeated()")
  // test("toIncludeMultiple()")
  // test("toEqualIgnoringWhitespace()")

  // Symbol

  test("toBeSymbol()", () => {
    expect(Symbol()).toBeSymbol();
    expect(Symbol("")).toBeSymbol();
    expect(Symbol.iterator).toBeSymbol();
    expect("").not.toBeSymbol();
    expect({}).not.toBeSymbol();
  });
});

/**
 * @param {string} value
 * @returns {string}
 */
function label(value) {
  switch (typeof value) {
    case "object":
      const string = inspect(value).replace(/\n/g, "");
      return string || '""';
    case "undefined":
      return "undefined";
    default:
      return JSON.stringify(value);
  }
}
