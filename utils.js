/**
 * mini-utils.js
 * A small, dependency-free utility library with data structures,
 * algorithms, helpers, and a built-in test runner.
 *
 * Run tests with:  node utils.js
 */

"use strict";

/* ==========================================================================
   SECTION 1: STRING UTILITIES
   ========================================================================== */

const Str = {
  /** Capitalize the first letter of a string. */
  capitalize(s) {
    if (typeof s !== "string" || s.length === 0) return "";
    return s[0].toUpperCase() + s.slice(1);
  },

  /** Capitalize every word. */
  titleCase(s) {
    return String(s)
      .split(/\s+/)
      .map((w) => Str.capitalize(w.toLowerCase()))
      .join(" ");
  },

  /** Convert to camelCase. */
  camelCase(s) {
    const words = Str.words(s);
    return words
      .map((w, i) => (i === 0 ? w.toLowerCase() : Str.capitalize(w.toLowerCase())))
      .join("");
  },

  /** Convert to snake_case. */
  snakeCase(s) {
    return Str.words(s).map((w) => w.toLowerCase()).join("_");
  },

  /** Convert to kebab-case. */
  kebabCase(s) {
    return Str.words(s).map((w) => w.toLowerCase()).join("-");
  },

  /** Split a string into words, handling camelCase, snake_case, and spaces. */
  words(s) {
    return String(s)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_\-]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  },

  /** Reverse a string (unicode-safe for basic cases). */
  reverse(s) {
    return Array.from(String(s)).reverse().join("");
  },

  /** Check whether a string is a palindrome (ignores case and punctuation). */
  isPalindrome(s) {
    const clean = String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
    return clean === Str.reverse(clean);
  },

  /** Truncate a string and add an ellipsis. */
  truncate(s, max = 20, ellipsis = "...") {
    s = String(s);
    if (s.length <= max) return s;
    return s.slice(0, Math.max(0, max - ellipsis.length)) + ellipsis;
  },

  /** Count occurrences of a substring. */
  countOccurrences(s, sub) {
    if (!sub) return 0;
    let count = 0;
    let pos = 0;
    while ((pos = s.indexOf(sub, pos)) !== -1) {
      count++;
      pos += sub.length;
    }
    return count;
  },

  /** Count vowels. */
  countVowels(s) {
    const m = String(s).match(/[aeiou]/gi);
    return m ? m.length : 0;
  },

  /** Character frequency map. */
  charFrequency(s) {
    const map = {};
    for (const ch of String(s)) map[ch] = (map[ch] || 0) + 1;
    return map;
  },

  /** Check if two strings are anagrams. */
  isAnagram(a, b) {
    const norm = (x) =>
      String(x).toLowerCase().replace(/[^a-z0-9]/g, "").split("").sort().join("");
    return norm(a) === norm(b);
  },

  /** Pad a string on both sides to center it. */
  center(s, width, fill = " ") {
    s = String(s);
    if (s.length >= width) return s;
    const total = width - s.length;
    const left = Math.floor(total / 2);
    const right = total - left;
    return fill.repeat(left) + s + fill.repeat(right);
  },

  /** Escape HTML special characters. */
  escapeHtml(s) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(s).replace(/[&<>"']/g, (c) => map[c]);
  },

  /** Unescape HTML entities. */
  unescapeHtml(s) {
    const map = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };
    return String(s).replace(/&(amp|lt|gt|quot|#39);/g, (m) => map[m]);
  },

  /** Create a URL-friendly slug. */
  slugify(s) {
    return String(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  /** Remove duplicate consecutive characters: "aaabbb" -> "ab". */
  squeeze(s) {
    return String(s).replace(/(.)\1+/g, "$1");
  },

  /** Run-length encode a string: "aaabb" -> "a3b2". */
  rleEncode(s) {
    s = String(s);
    if (!s) return "";
    let out = "";
    let count = 1;
    for (let i = 1; i <= s.length; i++) {
      if (s[i] === s[i - 1]) {
        count++;
      } else {
        out += s[i - 1] + count;
        count = 1;
      }
    }
    return out;
  },

  /** Decode a run-length encoded string. */
  rleDecode(s) {
    return String(s).replace(/(\D)(\d+)/g, (_, ch, n) => ch.repeat(Number(n)));
  },

  /** Caesar cipher. Shift can be negative. */
  caesar(s, shift) {
    const k = ((shift % 26) + 26) % 26;
    return String(s).replace(/[a-z]/gi, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + k) % 26) + base);
    });
  },

  /** Levenshtein edit distance between two strings. */
  levenshtein(a, b) {
    a = String(a);
    b = String(b);
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[a.length][b.length];
  },

  /** Longest common prefix of an array of strings. */
  longestCommonPrefix(arr) {
    if (!arr.length) return "";
    let prefix = arr[0];
    for (const s of arr) {
      while (!s.startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
        if (!prefix) return "";
      }
    }
    return prefix;
  },

  /** Check for balanced brackets. */
  isBalanced(s) {
    const pairs = { ")": "(", "]": "[", "}": "{" };
    const stack = [];
    for (const ch of String(s)) {
      if ("([{".includes(ch)) stack.push(ch);
      else if (")]}".includes(ch)) {
        if (stack.pop() !== pairs[ch]) return false;
      }
    }
    return stack.length === 0;
  },
};

/* ==========================================================================
   SECTION 2: ARRAY UTILITIES
   ========================================================================== */

const Arr = {
  /** Remove duplicates, preserving order. */
  unique(arr) {
    return [...new Set(arr)];
  },

  /** Split an array into chunks of a given size. */
  chunk(arr, size) {
    if (size < 1) throw new RangeError("size must be >= 1");
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  },

  /** Flatten nested arrays to a given depth (default: fully). */
  flatten(arr, depth = Infinity) {
    return depth < 1
      ? arr.slice()
      : arr.reduce(
          (acc, v) => acc.concat(Array.isArray(v) ? Arr.flatten(v, depth - 1) : v),
          []
        );
  },

  /** Group items by a key function or property name. */
  groupBy(arr, keyFn) {
    const fn = typeof keyFn === "function" ? keyFn : (x) => x[keyFn];
    return arr.reduce((acc, item) => {
      const k = fn(item);
      (acc[k] = acc[k] || []).push(item);
      return acc;
    }, {});
  },

  /** Count items by a key function. */
  countBy(arr, keyFn) {
    const fn = typeof keyFn === "function" ? keyFn : (x) => x[keyFn];
    return arr.reduce((acc, item) => {
      const k = fn(item);
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  },

  /** Return elements in a that are not in b. */
  difference(a, b) {
    const set = new Set(b);
    return a.filter((x) => !set.has(x));
  },

  /** Return elements common to both arrays. */
  intersection(a, b) {
    const set = new Set(b);
    return Arr.unique(a.filter((x) => set.has(x)));
  },

  /** Return the union of arrays. */
  union(...arrays) {
    return Arr.unique(arrays.flat());
  },

  /** Zip multiple arrays together. */
  zip(...arrays) {
    const len = Math.min(...arrays.map((a) => a.length));
    return Array.from({ length: len }, (_, i) => arrays.map((a) => a[i]));
  },

  /** Unzip an array of tuples. */
  unzip(arr) {
    return Arr.zip(...arr);
  },

  /** Create a numeric range [start, end) with a step. */
  range(start, end, step = 1) {
    if (end === undefined) {
      end = start;
      start = 0;
    }
    if (step === 0) throw new RangeError("step cannot be 0");
    const out = [];
    if (step > 0) for (let i = start; i < end; i += step) out.push(i);
    else for (let i = start; i > end; i += step) out.push(i);
    return out;
  },

  /** Fisher-Yates shuffle (returns a new array). */
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  /** Pick a random element. */
  sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  /** Pick n random distinct elements. */
  sampleSize(arr, n) {
    return Arr.shuffle(arr).slice(0, n);
  },

  /** Sum of numbers. */
  sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
  },

  /** Average of numbers. */
  mean(arr) {
    return arr.length ? Arr.sum(arr) / arr.length : NaN;
  },

  /** Median of numbers. */
  median(arr) {
    if (!arr.length) return NaN;
    const s = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  },

  /** Most common value(s) in an array. */
  mode(arr) {
    const counts = new Map();
    let max = 0;
    for (const v of arr) {
      const c = (counts.get(v) || 0) + 1;
      counts.set(v, c);
      if (c > max) max = c;
    }
    return [...counts.entries()].filter(([, c]) => c === max).map(([v]) => v);
  },

  /** Standard deviation (population). */
  stdDev(arr) {
    const m = Arr.mean(arr);
    return Math.sqrt(Arr.mean(arr.map((x) => (x - m) ** 2)));
  },

  /** Min and max in one pass. */
  minMax(arr) {
    let min = Infinity;
    let max = -Infinity;
    for (const v of arr) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    return { min, max };
  },

  /** Sort objects by one or more keys. Prefix a key with "-" for descending. */
  sortBy(arr, ...keys) {
    return arr.slice().sort((a, b) => {
      for (const key of keys) {
        const desc = key.startsWith("-");
        const k = desc ? key.slice(1) : key;
        if (a[k] < b[k]) return desc ? 1 : -1;
        if (a[k] > b[k]) return desc ? -1 : 1;
      }
      return 0;
    });
  },

  /** Partition into [matching, nonMatching]. */
  partition(arr, pred) {
    const yes = [];
    const no = [];
    for (const x of arr) (pred(x) ? yes : no).push(x);
    return [yes, no];
  },

  /** Rotate array left by n positions (negative rotates right). */
  rotate(arr, n) {
    if (!arr.length) return [];
    const k = ((n % arr.length) + arr.length) % arr.length;
    return arr.slice(k).concat(arr.slice(0, k));
  },

  /** Move an item from one index to another. */
  move(arr, from, to) {
    const a = arr.slice();
    const [item] = a.splice(from, 1);
    a.splice(to, 0, item);
    return a;
  },

  /** Transpose a 2D matrix. */
  transpose(matrix) {
    if (!matrix.length) return [];
    return matrix[0].map((_, c) => matrix.map((row) => row[c]));
  },

  /** All permutations of an array. */
  permutations(arr) {
    if (arr.length <= 1) return [arr.slice()];
    const out = [];
    arr.forEach((item, i) => {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      for (const p of Arr.permutations(rest)) out.push([item, ...p]);
    });
    return out;
  },

  /** All combinations of size k. */
  combinations(arr, k) {
    if (k === 0) return [[]];
    if (arr.length < k) return [];
    const [first, ...rest] = arr;
    const withFirst = Arr.combinations(rest, k - 1).map((c) => [first, ...c]);
    const withoutFirst = Arr.combinations(rest, k);
    return [...withFirst, ...withoutFirst];
  },

  /** Power set (all subsets). */
  powerSet(arr) {
    return arr.reduce((subsets, v) => subsets.concat(subsets.map((s) => [...s, v])), [[]]);
  },

  /** Check whether an array is sorted ascending. */
  isSorted(arr) {
    for (let i = 1; i < arr.length; i++) if (arr[i - 1] > arr[i]) return false;
    return true;
  },

  /** Take the first n elements. */
  take(arr, n = 1) {
    return arr.slice(0, Math.max(0, n));
  },

  /** Take the last n elements. */
  takeRight(arr, n = 1) {
    return n <= 0 ? [] : arr.slice(-n);
  },

  /** Remove falsy values. */
  compact(arr) {
    return arr.filter(Boolean);
  },

  /** Find duplicates in an array. */
  duplicates(arr) {
    const seen = new Set();
    const dupes = new Set();
    for (const x of arr) (seen.has(x) ? dupes : seen).add(x);
    return [...dupes];
  },

  /** Sliding windows of a given size. */
  windows(arr, size) {
    const out = [];
    for (let i = 0; i + size <= arr.length; i++) out.push(arr.slice(i, i + size));
    return out;
  },

  /** Maximum subarray sum (Kadane's algorithm). */
  maxSubarraySum(arr) {
    let best = -Infinity;
    let cur = 0;
    for (const x of arr) {
      cur = Math.max(x, cur + x);
      best = Math.max(best, cur);
    }
    return best;
  },

  /** Two-sum: return indices of two numbers adding up to target. */
  twoSum(arr, target) {
    const seen = new Map();
    for (let i = 0; i < arr.length; i++) {
      const need = target - arr[i];
      if (seen.has(need)) return [seen.get(need), i];
      seen.set(arr[i], i);
    }
    return null;
  },
};

/* ==========================================================================
   SECTION 3: OBJECT UTILITIES
   ========================================================================== */

const Obj = {
  /** Deep clone (handles Dates, Arrays, Maps, Sets, plain objects). */
  deepClone(value) {
    if (value === null || typeof value !== "object") return value;
    if (value instanceof Date) return new Date(value.getTime());
    if (value instanceof Map) return new Map([...value].map(([k, v]) => [k, Obj.deepClone(v)]));
    if (value instanceof Set) return new Set([...value].map((v) => Obj.deepClone(v)));
    if (Array.isArray(value)) return value.map((v) => Obj.deepClone(v));
    const out = {};
    for (const key of Object.keys(value)) out[key] = Obj.deepClone(value[key]);
    return out;
  },

  /** Deep equality check. */
  deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null) return false;
    if (typeof a !== "object") return Number.isNaN(a) && Number.isNaN(b);
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && Obj.deepEqual(a[k], b[k]));
  },

  /** Deep merge objects (later sources win). */
  merge(target, ...sources) {
    const out = Obj.deepClone(target);
    for (const src of sources) {
      for (const key of Object.keys(src)) {
        const sv = src[key];
        if (sv && typeof sv === "object" && !Array.isArray(sv)) {
          out[key] = Obj.merge(out[key] && typeof out[key] === "object" ? out[key] : {}, sv);
        } else {
          out[key] = Obj.deepClone(sv);
        }
      }
    }
    return out;
  },

  /** Pick keys from an object. */
  pick(obj, keys) {
    const out = {};
    for (const k of keys) if (k in obj) out[k] = obj[k];
    return out;
  },

  /** Omit keys from an object. */
  omit(obj, keys) {
    const set = new Set(keys);
    const out = {};
    for (const k of Object.keys(obj)) if (!set.has(k)) out[k] = obj[k];
    return out;
  },

  /** Get a nested value using a path like "a.b[0].c". */
  get(obj, path, fallback) {
    const parts = String(path).replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return fallback;
      cur = cur[p];
    }
    return cur === undefined ? fallback : cur;
  },

  /** Set a nested value using a path. Mutates and returns obj. */
  set(obj, path, value) {
    const parts = String(path).replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    let cur = obj;
    parts.forEach((p, i) => {
      if (i === parts.length - 1) {
        cur[p] = value;
      } else {
        if (cur[p] == null || typeof cur[p] !== "object") {
          cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
        }
        cur = cur[p];
      }
    });
    return obj;
  },

  /** Flatten a nested object into dot-notation keys. */
  flatten(obj, prefix = "") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, Obj.flatten(v, key));
      else out[key] = v;
    }
    return out;
  },

  /** Invert keys and values. */
  invert(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[v] = k;
    return out;
  },

  /** Map over the values of an object. */
  mapValues(obj, fn) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = fn(v, k);
    return out;
  },

  /** Filter an object by predicate. */
  filter(obj, pred) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) if (pred(v, k)) out[k] = v;
    return out;
  },

  /** Check if an object is empty. */
  isEmpty(obj) {
    return obj == null || (typeof obj === "object" && Object.keys(obj).length === 0);
  },

  /** Deep freeze an object. */
  deepFreeze(obj) {
    Object.values(obj).forEach((v) => {
      if (v && typeof v === "object") Obj.deepFreeze(v);
    });
    return Object.freeze(obj);
  },
};

/* ==========================================================================
   SECTION 4: NUMBER & MATH UTILITIES
   ========================================================================== */

const Num = {
  /** Clamp a number between min and max. */
  clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  },

  /** Random integer in [min, max] inclusive. */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** Round to a number of decimal places. */
  round(n, places = 0) {
    const f = 10 ** places;
    return Math.round((n + Number.EPSILON) * f) / f;
  },

  /** Check for a prime number. */
  isPrime(n) {
    if (n < 2 || !Number.isInteger(n)) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  },

  /** Primes up to n via the Sieve of Eratosthenes. */
  primesUpTo(n) {
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    for (let i = 2; i * i <= n; i++) {
      if (sieve[i]) for (let j = i * i; j <= n; j += i) sieve[j] = false;
    }
    return sieve.reduce((acc, isP, i) => (isP ? (acc.push(i), acc) : acc), []);
  },

  /** Prime factorization. */
  primeFactors(n) {
    const factors = [];
    for (let d = 2; d * d <= n; d++) {
      while (n % d === 0) {
        factors.push(d);
        n /= d;
      }
    }
    if (n > 1) factors.push(n);
    return factors;
  },

  /** Greatest common divisor. */
  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  },

  /** Least common multiple. */
  lcm(a, b) {
    return a && b ? Math.abs(a * b) / Num.gcd(a, b) : 0;
  },

  /** Factorial (iterative, uses BigInt for large results). */
  factorial(n) {
    if (n < 0) throw new RangeError("n must be >= 0");
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) result *= i;
    return result;
  },

  /** nth Fibonacci number (iterative). */
  fibonacci(n) {
    let a = 0n;
    let b = 1n;
    for (let i = 0; i < n; i++) [a, b] = [b, a + b];
    return a;
  },

  /** Fibonacci sequence of length n. */
  fibonacciSequence(n) {
    const out = [];
    let a = 0;
    let b = 1;
    for (let i = 0; i < n; i++) {
      out.push(a);
      [a, b] = [b, a + b];
    }
    return out;
  },

  /** Convert a number to a given base string. */
  toBase(n, base) {
    return n.toString(base);
  },

  /** Convert a number to Roman numerals (1-3999). */
  toRoman(n) {
    if (n < 1 || n > 3999) throw new RangeError("n must be 1-3999");
    const table = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
      [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];
    let out = "";
    for (const [value, sym] of table) {
      while (n >= value) {
        out += sym;
        n -= value;
      }
    }
    return out;
  },

  /** Convert Roman numerals to a number. */
  fromRoman(s) {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let total = 0;
    for (let i = 0; i < s.length; i++) {
      const cur = map[s[i]];
      const next = map[s[i + 1]];
      total += next > cur ? -cur : cur;
    }
    return total;
  },

  /** Format a number with thousands separators. */
  formatNumber(n, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(n);
  },

  /** Format a number as currency. */
  formatCurrency(n, currency = "USD", locale = "en-US") {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
  },

  /** Simple interest. */
  simpleInterest(principal, rate, years) {
    return (principal * rate * years) / 100;
  },

  /** Compound interest (returns final amount). */
  compoundInterest(principal, rate, years, timesPerYear = 1) {
    return principal * (1 + rate / 100 / timesPerYear) ** (timesPerYear * years);
  },

  /** Convert degrees to radians. */
  degToRad(deg) {
    return (deg * Math.PI) / 180;
  },

  /** Convert radians to degrees. */
  radToDeg(rad) {
    return (rad * 180) / Math.PI;
  },

  /** Linear interpolation. */
  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  /** Map a value from one range to another. */
  mapRange(v, inMin, inMax, outMin, outMax) {
    return ((v - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  },

  /** Check if a number is a perfect square. */
  isPerfectSquare(n) {
    const r = Math.sqrt(n);
    return Number.isInteger(r);
  },

  /** Sum of digits. */
  digitSum(n) {
    return String(Math.abs(n)).split("").reduce((a, d) => a + Number(d), 0);
  },

  /** Check whether a number is an Armstrong number. */
  isArmstrong(n) {
    const digits = String(n).split("");
    return digits.reduce((a, d) => a + Number(d) ** digits.length, 0) === n;
  },
};

/* ==========================================================================
   SECTION 5: DATE UTILITIES
   ========================================================================== */

const DateUtil = {
  /** Add days to a date (returns a new Date). */
  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /** Difference between two dates in whole days. */
  diffInDays(a, b) {
    const MS = 24 * 60 * 60 * 1000;
    return Math.round((new Date(a) - new Date(b)) / MS);
  },

  /** Check for a leap year. */
  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },

  /** Days in a given month (1-12). */
  daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  /** Format a date as YYYY-MM-DD. */
  toISODate(date) {
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  },

  /** Check whether a date falls on a weekend. */
  isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  },

  /** Human-friendly relative time, e.g. "3 hours ago". */
  timeAgo(date, now = new Date()) {
    const seconds = Math.floor((now - new Date(date)) / 1000);
    const units = [
      ["year", 31536000], ["month", 2592000], ["week", 604800],
      ["day", 86400], ["hour", 3600], ["minute", 60], ["second", 1],
    ];
    for (const [name, secs] of units) {
      const val = Math.floor(Math.abs(seconds) / secs);
      if (val >= 1) {
        const label = `${val} ${name}${val > 1 ? "s" : ""}`;
        return seconds >= 0 ? `${label} ago` : `in ${label}`;
      }
    }
    return "just now";
  },

  /** Calculate age from a birth date. */
  age(birth, today = new Date()) {
    const b = new Date(birth);
    let years = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) years--;
    return years;
  },

  /** Start of the day (00:00:00.000). */
  startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /** Get the day name. */
  dayName(date, locale = "en-US") {
    return new Date(date).toLocaleDateString(locale, { weekday: "long" });
  },
};

/* ==========================================================================
   SECTION 6: VALIDATION
   ========================================================================== */

const Validate = {
  isEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s));
  },

  isURL(s) {
    try {
      const u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  },

  isHexColor(s) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(s));
  },

  isIPv4(s) {
    const parts = String(s).split(".");
    return (
      parts.length === 4 &&
      parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255 && String(Number(p)) === p)
    );
  },

  /** Password strength: returns score 0-4 and feedback. */
  passwordStrength(pw) {
    let score = 0;
    const feedback = [];
    if (pw.length >= 8) score++;
    else feedback.push("Use at least 8 characters");
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    else feedback.push("Mix upper and lower case letters");
    if (/\d/.test(pw)) score++;
    else feedback.push("Add a number");
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    else feedback.push("Add a symbol");
    return { score, feedback };
  },

  /** Luhn check for card numbers. */
  isLuhnValid(num) {
    const digits = String(num).replace(/\D/g, "");
    if (digits.length < 2) return false;
    let sum = 0;
    let alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = Number(digits[i]);
      if (alt) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
      alt = !alt;
    }
    return sum % 10 === 0;
  },
};

/* ==========================================================================
   SECTION 7: FUNCTIONAL HELPERS
   ========================================================================== */

const Fn = {
  /** Debounce: delay execution until calls stop for `wait` ms. */
  debounce(fn, wait = 200) {
    let timer;
    const debounced = (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
  },

  /** Throttle: run at most once per `wait` ms. */
  throttle(fn, wait = 200) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        return fn.apply(this, args);
      }
    };
  },

  /** Memoize a function using a JSON key. */
  memoize(fn) {
    const cache = new Map();
    const memoized = (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
    memoized.cache = cache;
    return memoized;
  },

  /** Run a function only once. */
  once(fn) {
    let called = false;
    let result;
    return (...args) => {
      if (!called) {
        called = true;
        result = fn(...args);
      }
      return result;
    };
  },

  /** Curry a function. */
  curry(fn) {
    const curried = (...args) =>
      args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more);
    return curried;
  },

  /** Compose functions right-to-left. */
  compose(...fns) {
    return (x) => fns.reduceRight((acc, f) => f(acc), x);
  },

  /** Pipe functions left-to-right. */
  pipe(...fns) {
    return (x) => fns.reduce((acc, f) => f(acc), x);
  },

  /** Partially apply arguments. */
  partial(fn, ...preset) {
    return (...later) => fn(...preset, ...later);
  },

  /** Retry an async function with exponential backoff. */
  async retry(fn, { retries = 3, delay = 100 } = {}) {
    let lastErr;
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn(i);
      } catch (err) {
        lastErr = err;
        if (i < retries) await Fn.sleep(delay * 2 ** i);
      }
    }
    throw lastErr;
  },

  /** Promise-based sleep. */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /** Reject a promise if it takes too long. */
  timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
    ]);
  },
};

/* ==========================================================================
   SECTION 8: DATA STRUCTURES
   ========================================================================== */

class Stack {
  #items = [];
  push(x) { this.#items.push(x); return this; }
  pop() { return this.#items.pop(); }
  peek() { return this.#items[this.#items.length - 1]; }
  get size() { return this.#items.length; }
  isEmpty() { return this.#items.length === 0; }
  clear() { this.#items = []; }
  toArray() { return this.#items.slice(); }
}

class Queue {
  #items = [];
  #head = 0;
  enqueue(x) { this.#items.push(x); return this; }
  dequeue() {
    if (this.isEmpty()) return undefined;
    const v = this.#items[this.#head++];
    if (this.#head > 50 && this.#head * 2 > this.#items.length) {
      this.#items = this.#items.slice(this.#head);
      this.#head = 0;
    }
    return v;
  }
  peek() { return this.#items[this.#head]; }
  get size() { return this.#items.length - this.#head; }
  isEmpty() { return this.size === 0; }
  toArray() { return this.#items.slice(this.#head); }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  append(value) {
    const node = { value, next: null };
    if (!this.head) this.head = node;
    else {
      let cur = this.head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    this.length++;
    return this;
  }

  prepend(value) {
    this.head = { value, next: this.head };
    this.length++;
    return this;
  }

  remove(value) {
    if (!this.head) return false;
    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return true;
    }
    let cur = this.head;
    while (cur.next && cur.next.value !== value) cur = cur.next;
    if (!cur.next) return false;
    cur.next = cur.next.next;
    this.length--;
    return true;
  }

  find(value) {
    let cur = this.head;
    while (cur) {
      if (cur.value === value) return cur;
      cur = cur.next;
    }
    return null;
  }

  reverse() {
    let prev = null;
    let cur = this.head;
    while (cur) {
      [cur.next, prev, cur] = [prev, cur, cur.next];
    }
    this.head = prev;
    return this;
  }

  *[Symbol.iterator]() {
    let cur = this.head;
    while (cur) {
      yield cur.value;
      cur = cur.next;
    }
  }

  toArray() {
    return [...this];
  }
}

class LRUCache {
  #cap;
  #map = new Map();

  constructor(capacity = 5) {
    this.#cap = capacity;
  }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const v = this.#map.get(key);
    this.#map.delete(key);
    this.#map.set(key, v);
    return v;
  }

  set(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    else if (this.#map.size >= this.#cap) {
      this.#map.delete(this.#map.keys().next().value);
    }
    this.#map.set(key, value);
    return this;
  }

  has(key) { return this.#map.has(key); }
  get size() { return this.#map.size; }
  keys() { return [...this.#map.keys()]; }
}

class MinHeap {
  #heap = [];
  #cmp;

  constructor(compare = (a, b) => a - b) {
    this.#cmp = compare;
  }

  get size() { return this.#heap.length; }
  peek() { return this.#heap[0]; }

  push(value) {
    this.#heap.push(value);
    this.#siftUp(this.#heap.length - 1);
    return this;
  }

  pop() {
    if (!this.#heap.length) return undefined;
    const top = this.#heap[0];
    const last = this.#heap.pop();
    if (this.#heap.length) {
      this.#heap[0] = last;
      this.#siftDown(0);
    }
    return top;
  }

  #siftUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.#cmp(this.#heap[i], this.#heap[p]) >= 0) break;
      [this.#heap[i], this.#heap[p]] = [this.#heap[p], this.#heap[i]];
      i = p;
    }
  }

  #siftDown(i) {
    const n = this.#heap.length;
    for (;;) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.#cmp(this.#heap[l], this.#heap[smallest]) < 0) smallest = l;
      if (r < n && this.#cmp(this.#heap[r], this.#heap[smallest]) < 0) smallest = r;
      if (smallest === i) break;
      [this.#heap[i], this.#heap[smallest]] = [this.#heap[smallest], this.#heap[i]];
      i = smallest;
    }
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  insert(value) {
    const node = { value, left: null, right: null };
    this.size++;
    if (!this.root) {
      this.root = node;
      return this;
    }
    let cur = this.root;
    for (;;) {
      if (value < cur.value) {
        if (!cur.left) { cur.left = node; break; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; break; }
        cur = cur.right;
      }
    }
    return this;
  }

  contains(value) {
    let cur = this.root;
    while (cur) {
      if (value === cur.value) return true;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return false;
  }

  inOrder(node = this.root, out = []) {
    if (node) {
      this.inOrder(node.left, out);
      out.push(node.value);
      this.inOrder(node.right, out);
    }
    return out;
  }

  height(node = this.root) {
    return node ? 1 + Math.max(this.height(node.left), this.height(node.right)) : 0;
  }

  min() {
    let cur = this.root;
    while (cur && cur.left) cur = cur.left;
    return cur ? cur.value : undefined;
  }

  max() {
    let cur = this.root;
    while (cur && cur.right) cur = cur.right;
    return cur ? cur.value : undefined;
  }

  levelOrder() {
    const out = [];
    const q = this.root ? [this.root] : [];
    while (q.length) {
      const level = [];
      for (let i = q.length; i > 0; i--) {
        const n = q.shift();
        level.push(n.value);
        if (n.left) q.push(n.left);
        if (n.right) q.push(n.right);
      }
      out.push(level);
    }
    return out;
  }
}

class Graph {
  constructor(directed = false) {
    this.directed = directed;
    this.adj = new Map();
  }

  addVertex(v) {
    if (!this.adj.has(v)) this.adj.set(v, new Set());
    return this;
  }

  addEdge(a, b) {
    this.addVertex(a).addVertex(b);
    this.adj.get(a).add(b);
    if (!this.directed) this.adj.get(b).add(a);
    return this;
  }

  bfs(start) {
    const seen = new Set([start]);
    const order = [];
    const queue = [start];
    while (queue.length) {
      const v = queue.shift();
      order.push(v);
      for (const n of this.adj.get(v) || []) {
        if (!seen.has(n)) {
          seen.add(n);
          queue.push(n);
        }
      }
    }
    return order;
  }

  dfs(start, seen = new Set(), order = []) {
    seen.add(start);
    order.push(start);
    for (const n of this.adj.get(start) || []) {
      if (!seen.has(n)) this.dfs(n, seen, order);
    }
    return order;
  }

  /** Shortest path (unweighted) using BFS. */
  shortestPath(from, to) {
    const prev = new Map([[from, null]]);
    const queue = [from];
    while (queue.length) {
      const v = queue.shift();
      if (v === to) {
        const path = [];
        for (let c = to; c !== null; c = prev.get(c)) path.unshift(c);
        return path;
      }
      for (const n of this.adj.get(v) || []) {
        if (!prev.has(n)) {
          prev.set(n, v);
          queue.push(n);
        }
      }
    }
    return null;
  }

  hasPath(from, to) {
    return this.shortestPath(from, to) !== null;
  }
}

class EventEmitter {
  #handlers = new Map();

  on(event, fn) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, new Set());
    this.#handlers.get(event).add(fn);
    return () => this.off(event, fn);
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    return this.on(event, wrapper);
  }

  off(event, fn) {
    this.#handlers.get(event)?.delete(fn);
    return this;
  }

  emit(event, ...args) {
    const set = this.#handlers.get(event);
    if (!set) return false;
    [...set].forEach((fn) => fn(...args));
    return set.size > 0;
  }

  listenerCount(event) {
    return this.#handlers.get(event)?.size ?? 0;
  }
}

/* ==========================================================================
   SECTION 9: SORTING & SEARCHING ALGORITHMS
   ========================================================================== */

const Algo = {
  bubbleSort(arr) {
    const a = arr.slice();
    for (let i = 0; i < a.length; i++) {
      let swapped = false;
      for (let j = 0; j < a.length - i - 1; j++) {
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    return a;
  },

  selectionSort(arr) {
    const a = arr.slice();
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
      if (min !== i) [a[i], a[min]] = [a[min], a[i]];
    }
    return a;
  },

  insertionSort(arr) {
    const a = arr.slice();
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = key;
    }
    return a;
  },

  mergeSort(arr) {
    if (arr.length <= 1) return arr.slice();
    const mid = arr.length >> 1;
    const left = Algo.mergeSort(arr.slice(0, mid));
    const right = Algo.mergeSort(arr.slice(mid));
    const out = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      out.push(left[i] <= right[j] ? left[i++] : right[j++]);
    }
    return out.concat(left.slice(i), right.slice(j));
  },

  quickSort(arr) {
    if (arr.length <= 1) return arr.slice();
    const pivot = arr[arr.length >> 1];
    const less = arr.filter((x) => x < pivot);
    const equal = arr.filter((x) => x === pivot);
    const greater = arr.filter((x) => x > pivot);
    return [...Algo.quickSort(less), ...equal, ...Algo.quickSort(greater)];
  },

  heapSort(arr) {
    const heap = new MinHeap();
    arr.forEach((x) => heap.push(x));
    const out = [];
    while (heap.size) out.push(heap.pop());
    return out;
  },

  countingSort(arr) {
    if (!arr.length) return [];
    const { min, max } = Arr.minMax(arr);
    const counts = new Array(max - min + 1).fill(0);
    arr.forEach((x) => counts[x - min]++);
    const out = [];
    counts.forEach((c, i) => {
      for (let k = 0; k < c; k++) out.push(i + min);
    });
    return out;
  },

  binarySearch(sorted, target) {
    let lo = 0;
    let hi = sorted.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] === target) return mid;
      if (sorted[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  },

  linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i;
    return -1;
  },

  /** Longest common subsequence length. */
  lcs(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[a.length][b.length];
  },

  /** Minimum coins needed to make an amount (dynamic programming). */
  coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let a = 1; a <= amount; a++) {
      for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
  },

  /** 0/1 knapsack maximum value. */
  knapsack(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    for (let i = 0; i < weights.length; i++) {
      for (let w = capacity; w >= weights[i]; w--) {
        dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
      }
    }
    return dp[capacity];
  },

  /** Tower of Hanoi: returns the list of moves. */
  hanoi(n, from = "A", to = "C", via = "B", moves = []) {
    if (n === 0) return moves;
    Algo.hanoi(n - 1, from, via, to, moves);
    moves.push([from, to]);
    Algo.hanoi(n - 1, via, to, from, moves);
    return moves;
  },

  /** Solve N-Queens: returns the number of solutions. */
  nQueens(n) {
    let count = 0;
    const cols = new Set();
    const d1 = new Set();
    const d2 = new Set();
    const place = (row) => {
      if (row === n) return count++;
      for (let c = 0; c < n; c++) {
        if (cols.has(c) || d1.has(row - c) || d2.has(row + c)) continue;
        cols.add(c); d1.add(row - c); d2.add(row + c);
        place(row + 1);
        cols.delete(c); d1.delete(row - c); d2.delete(row + c);
      }
    };
    place(0);
    return count;
  },

  /** FizzBuzz as an array. */
  fizzBuzz(n) {
    return Array.from({ length: n }, (_, i) => {
      const x = i + 1;
      return x % 15 === 0 ? "FizzBuzz" : x % 3 === 0 ? "Fizz" : x % 5 === 0 ? "Buzz" : String(x);
    });
  },

  /** Collatz sequence from n down to 1. */
  collatz(n) {
    const seq = [n];
    while (n !== 1) {
      n = n % 2 === 0 ? n / 2 : 3 * n + 1;
      seq.push(n);
    }
    return seq;
  },
};

/* ==========================================================================
   SECTION 10: MINI TEST RUNNER
   ========================================================================== */

const tests = [];
const test = (name, fn) => tests.push({ name, fn });
const assert = (cond, msg = "Assertion failed") => {
  if (!cond) throw new Error(msg);
};
const show = (v) => JSON.stringify(v, (_, x) => (typeof x === "bigint" ? `${x}n` : x));
const eq = (actual, expected) => {
  if (!Obj.deepEqual(actual, expected)) {
    throw new Error(`Expected ${show(expected)}, got ${show(actual)}`);
  }
};

/* ---- String tests ---- */
test("Str.capitalize", () => eq(Str.capitalize("hello"), "Hello"));
test("Str.titleCase", () => eq(Str.titleCase("hello big world"), "Hello Big World"));
test("Str.camelCase", () => eq(Str.camelCase("hello_big-world"), "helloBigWorld"));
test("Str.snakeCase", () => eq(Str.snakeCase("helloBigWorld"), "hello_big_world"));
test("Str.kebabCase", () => eq(Str.kebabCase("Hello Big World"), "hello-big-world"));
test("Str.reverse", () => eq(Str.reverse("abc"), "cba"));
test("Str.isPalindrome", () => assert(Str.isPalindrome("A man, a plan, a canal: Panama")));
test("Str.truncate", () => eq(Str.truncate("Hello world, again", 10), "Hello w..."));
test("Str.countVowels", () => eq(Str.countVowels("Education"), 5));
test("Str.isAnagram", () => assert(Str.isAnagram("Listen", "Silent")));
test("Str.slugify", () => eq(Str.slugify("Héllo Wörld! 2026"), "hello-world-2026"));
test("Str.rle", () => {
  eq(Str.rleEncode("aaabbc"), "a3b2c1");
  eq(Str.rleDecode("a3b2c1"), "aaabbc");
});
test("Str.caesar", () => eq(Str.caesar(Str.caesar("Hello, World!", 3), -3), "Hello, World!"));
test("Str.levenshtein", () => eq(Str.levenshtein("kitten", "sitting"), 3));
test("Str.longestCommonPrefix", () => eq(Str.longestCommonPrefix(["flower", "flow", "flight"]), "fl"));
test("Str.isBalanced", () => {
  assert(Str.isBalanced("{[()]}"));
  assert(!Str.isBalanced("{[(])}"));
});
test("Str.escapeHtml", () => eq(Str.unescapeHtml(Str.escapeHtml("<a href='x'>&</a>")), "<a href='x'>&</a>"));

/* ---- Array tests ---- */
test("Arr.unique", () => eq(Arr.unique([1, 2, 2, 3, 1]), [1, 2, 3]));
test("Arr.chunk", () => eq(Arr.chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]));
test("Arr.flatten", () => eq(Arr.flatten([1, [2, [3, [4]]]]), [1, 2, 3, 4]));
test("Arr.groupBy", () => eq(Arr.groupBy([1, 2, 3, 4], (x) => (x % 2 ? "odd" : "even")), { odd: [1, 3], even: [2, 4] }));
test("Arr.difference", () => eq(Arr.difference([1, 2, 3], [2]), [1, 3]));
test("Arr.intersection", () => eq(Arr.intersection([1, 2, 3], [2, 3, 4]), [2, 3]));
test("Arr.zip", () => eq(Arr.zip([1, 2], ["a", "b"]), [[1, "a"], [2, "b"]]));
test("Arr.range", () => {
  eq(Arr.range(5), [0, 1, 2, 3, 4]);
  eq(Arr.range(10, 0, -3), [10, 7, 4, 1]);
});
test("Arr.shuffle keeps elements", () => eq(Arr.shuffle([1, 2, 3, 4]).sort(), [1, 2, 3, 4]));
test("Arr.stats", () => {
  eq(Arr.mean([1, 2, 3, 4]), 2.5);
  eq(Arr.median([3, 1, 2]), 2);
  eq(Arr.mode([1, 2, 2, 3]), [2]);
  eq(Num.round(Arr.stdDev([2, 4, 4, 4, 5, 5, 7, 9]), 2), 2);
});
test("Arr.sortBy", () => {
  const people = [{ n: "B", a: 20 }, { n: "A", a: 30 }, { n: "C", a: 20 }];
  eq(Arr.sortBy(people, "a", "-n").map((p) => p.n), ["C", "B", "A"]);
});
test("Arr.rotate", () => eq(Arr.rotate([1, 2, 3, 4], 1), [2, 3, 4, 1]));
test("Arr.transpose", () => eq(Arr.transpose([[1, 2], [3, 4]]), [[1, 3], [2, 4]]));
test("Arr.permutations", () => eq(Arr.permutations([1, 2, 3]).length, 6));
test("Arr.combinations", () => eq(Arr.combinations([1, 2, 3, 4], 2).length, 6));
test("Arr.powerSet", () => eq(Arr.powerSet([1, 2, 3]).length, 8));
test("Arr.maxSubarraySum", () => eq(Arr.maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6));
test("Arr.twoSum", () => eq(Arr.twoSum([2, 7, 11, 15], 9), [0, 1]));
test("Arr.windows", () => eq(Arr.windows([1, 2, 3, 4], 2), [[1, 2], [2, 3], [3, 4]]));

/* ---- Object tests ---- */
test("Obj.deepClone", () => {
  const o = { a: { b: [1, 2, { c: 3 }] } };
  const c = Obj.deepClone(o);
  c.a.b[2].c = 99;
  eq(o.a.b[2].c, 3);
});
test("Obj.deepEqual", () => {
  assert(Obj.deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }));
  assert(!Obj.deepEqual({ a: 1 }, { a: 2 }));
});
test("Obj.merge", () => eq(Obj.merge({ a: { b: 1, c: 2 } }, { a: { c: 3 }, d: 4 }), { a: { b: 1, c: 3 }, d: 4 }));
test("Obj.pick/omit", () => {
  eq(Obj.pick({ a: 1, b: 2, c: 3 }, ["a", "c"]), { a: 1, c: 3 });
  eq(Obj.omit({ a: 1, b: 2, c: 3 }, ["b"]), { a: 1, c: 3 });
});
test("Obj.get/set", () => {
  const o = { a: { b: [{ c: 5 }] } };
  eq(Obj.get(o, "a.b[0].c"), 5);
  eq(Obj.get(o, "a.x.y", "none"), "none");
  Obj.set(o, "a.b[1].d", 7);
  eq(o.a.b[1].d, 7);
});
test("Obj.flatten", () => eq(Obj.flatten({ a: { b: 1, c: { d: 2 } } }), { "a.b": 1, "a.c.d": 2 }));
test("Obj.invert", () => eq(Obj.invert({ a: "x", b: "y" }), { x: "a", y: "b" }));

/* ---- Number tests ---- */
test("Num.clamp", () => eq(Num.clamp(15, 0, 10), 10));
test("Num.isPrime", () => {
  assert(Num.isPrime(97));
  assert(!Num.isPrime(91));
});
test("Num.primesUpTo", () => eq(Num.primesUpTo(20), [2, 3, 5, 7, 11, 13, 17, 19]));
test("Num.primeFactors", () => eq(Num.primeFactors(84), [2, 2, 3, 7]));
test("Num.gcd/lcm", () => {
  eq(Num.gcd(48, 18), 6);
  eq(Num.lcm(4, 6), 12);
});
test("Num.factorial", () => eq(Num.factorial(10), 3628800n));
test("Num.fibonacci", () => {
  eq(Num.fibonacci(10), 55n);
  eq(Num.fibonacciSequence(8), [0, 1, 1, 2, 3, 5, 8, 13]);
});
test("Num.roman", () => {
  eq(Num.toRoman(1994), "MCMXCIV");
  eq(Num.fromRoman("MCMXCIV"), 1994);
});
test("Num.interest", () => {
  eq(Num.simpleInterest(1000, 5, 2), 100);
  eq(Num.round(Num.compoundInterest(1000, 5, 2), 2), 1102.5);
});
test("Num.isArmstrong", () => {
  assert(Num.isArmstrong(153));
  assert(!Num.isArmstrong(154));
});
test("Num.mapRange", () => eq(Num.mapRange(5, 0, 10, 0, 100), 50));

/* ---- Date tests ---- */
test("DateUtil.isLeapYear", () => {
  assert(DateUtil.isLeapYear(2024));
  assert(!DateUtil.isLeapYear(1900));
});
test("DateUtil.daysInMonth", () => eq(DateUtil.daysInMonth(2024, 2), 29));
test("DateUtil.diffInDays", () => eq(DateUtil.diffInDays("2026-11-17", "2026-11-10"), 7));
test("DateUtil.timeAgo", () => {
  const now = new Date("2026-11-17T12:00:00Z");
  eq(DateUtil.timeAgo("2026-11-17T09:00:00Z", now), "3 hours ago");
});
test("DateUtil.age", () => eq(DateUtil.age("2004-06-30", new Date("2026-11-17")), 22));

/* ---- Validation tests ---- */
test("Validate.isEmail", () => {
  assert(Validate.isEmail("a@b.com"));
  assert(!Validate.isEmail("not-an-email"));
});
test("Validate.isURL", () => {
  assert(Validate.isURL("https://github.com"));
  assert(!Validate.isURL("github"));
});
test("Validate.isIPv4", () => {
  assert(Validate.isIPv4("192.168.1.1"));
  assert(!Validate.isIPv4("256.1.1.1"));
});
test("Validate.passwordStrength", () => eq(Validate.passwordStrength("Abcdef12!").score, 4));
test("Validate.isLuhnValid", () => assert(Validate.isLuhnValid("4539578763621486")));

/* ---- Functional tests ---- */
test("Fn.memoize", () => {
  let calls = 0;
  const sq = Fn.memoize((x) => (calls++, x * x));
  sq(4); sq(4); sq(5);
  eq(calls, 2);
});
test("Fn.once", () => {
  let n = 0;
  const f = Fn.once(() => ++n);
  f(); f();
  eq(n, 1);
});
test("Fn.curry", () => eq(Fn.curry((a, b, c) => a + b + c)(1)(2)(3), 6));
test("Fn.compose/pipe", () => {
  const add1 = (x) => x + 1;
  const dbl = (x) => x * 2;
  eq(Fn.compose(add1, dbl)(5), 11);
  eq(Fn.pipe(add1, dbl)(5), 12);
});
test("Fn.retry", async () => {
  let attempts = 0;
  const result = await Fn.retry(
    () => {
      if (++attempts < 3) throw new Error("fail");
      return "ok";
    },
    { retries: 3, delay: 1 }
  );
  eq(result, "ok");
});

/* ---- Data structure tests ---- */
test("Stack", () => {
  const s = new Stack().push(1).push(2).push(3);
  eq(s.pop(), 3);
  eq(s.peek(), 2);
  eq(s.size, 2);
});
test("Queue", () => {
  const q = new Queue().enqueue("a").enqueue("b");
  eq(q.dequeue(), "a");
  eq(q.size, 1);
});
test("LinkedList", () => {
  const l = new LinkedList().append(1).append(2).append(3).prepend(0);
  eq(l.toArray(), [0, 1, 2, 3]);
  l.reverse();
  eq(l.toArray(), [3, 2, 1, 0]);
  l.remove(2);
  eq(l.toArray(), [3, 1, 0]);
});
test("LRUCache", () => {
  const c = new LRUCache(2);
  c.set("a", 1).set("b", 2);
  c.get("a");
  c.set("c", 3);
  assert(!c.has("b"));
  assert(c.has("a") && c.has("c"));
});
test("MinHeap", () => {
  const h = new MinHeap();
  [5, 3, 8, 1, 9, 2].forEach((x) => h.push(x));
  const out = [];
  while (h.size) out.push(h.pop());
  eq(out, [1, 2, 3, 5, 8, 9]);
});
test("BinarySearchTree", () => {
  const t = new BinarySearchTree();
  [8, 3, 10, 1, 6, 14].forEach((x) => t.insert(x));
  eq(t.inOrder(), [1, 3, 6, 8, 10, 14]);
  eq(t.height(), 3);
  eq(t.min(), 1);
  eq(t.max(), 14);
  assert(t.contains(6) && !t.contains(7));
  eq(t.levelOrder(), [[8], [3, 10], [1, 6, 14]]);
});
test("Graph", () => {
  const g = new Graph();
  g.addEdge("A", "B").addEdge("A", "C").addEdge("B", "D").addEdge("C", "D").addEdge("D", "E");
  eq(g.bfs("A"), ["A", "B", "C", "D", "E"]);
  eq(g.shortestPath("A", "E").length, 4);
  assert(g.hasPath("A", "E"));
});
test("EventEmitter", () => {
  const em = new EventEmitter();
  const got = [];
  em.on("x", (v) => got.push(v));
  em.once("x", (v) => got.push(v * 10));
  em.emit("x", 1);
  em.emit("x", 2);
  eq(got, [1, 10, 2]);
});

/* ---- Algorithm tests ---- */
const sample = [34, 7, 23, 32, 5, 62, 32, 7, -4, 0];
const sortedSample = sample.slice().sort((a, b) => a - b);
["bubbleSort", "selectionSort", "insertionSort", "mergeSort", "quickSort", "heapSort", "countingSort"].forEach(
  (name) => test(`Algo.${name}`, () => eq(Algo[name](sample), sortedSample))
);
test("Algo.binarySearch", () => eq(Algo.binarySearch([1, 3, 5, 7, 9], 7), 3));
test("Algo.lcs", () => eq(Algo.lcs("ABCBDAB", "BDCABA"), 4));
test("Algo.coinChange", () => eq(Algo.coinChange([1, 5, 10, 25], 63), 6));
test("Algo.knapsack", () => eq(Algo.knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7), 9));
test("Algo.hanoi", () => eq(Algo.hanoi(4).length, 15));
test("Algo.nQueens", () => eq(Algo.nQueens(6), 4));
test("Algo.fizzBuzz", () => eq(Algo.fizzBuzz(15)[14], "FizzBuzz"));
test("Algo.collatz", () => eq(Algo.collatz(6), [6, 3, 10, 5, 16, 8, 4, 2, 1]));

/* ---- Runner ---- */
async function runTests() {
  let passed = 0;
  let failed = 0;
  console.log(`\nRunning ${tests.length} tests...\n`);
  for (const { name, fn } of tests) {
    try {
      await fn();
      passed++;
      console.log(`  PASS  ${name}`);
    } catch (err) {
      failed++;
      console.log(`  FAIL  ${name}\n        ${err.message}`);
    }
  }
  console.log(`\n${passed} passed, ${failed} failed, ${tests.length} total\n`);
  if (failed) process.exitCode = 1;
}

/* ==========================================================================
   EXPORTS
   ========================================================================== */

const MiniUtils = {
  Str, Arr, Obj, Num, DateUtil, Validate, Fn, Algo,
  Stack, Queue, LinkedList, LRUCache, MinHeap, BinarySearchTree, Graph, EventEmitter,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = MiniUtils;
  if (require.main === module) runTests();
} else if (typeof window !== "undefined") {
  window.MiniUtils = MiniUtils;
}
