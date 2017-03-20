/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';
(function(Y) {
    function C(b, a, c) {
        var g = 0,
            d = [],
            n = 0,
            h, l, e, f, m, q, u, r, I = !1,
            v = [],
            w = [],
            t, y = !1,
            A = !1,
            x = -1;
        c = c || {};
        h = c.encoding || "UTF8";
        t = c.numRounds || 1;
        if (t !== parseInt(t, 10) || 1 > t) throw Error("numRounds must a integer >= 1");
        if ("SHA-1" === b) m = 512, q = K, u = Z, f = 160, r = function(a) {
            return a.slice()
        };
        else if (0 === b.lastIndexOf("SHA-", 0))
            if (q = function(a, c) {
                    return L(a, c, b)
                }, u = function(a, c, g, d) {
                    var k, f;
                    if ("SHA-224" === b || "SHA-256" === b) k = (c + 65 >>> 9 << 4) + 15, f = 16;
                    else if ("SHA-384" === b || "SHA-512" === b) k = (c + 129 >>> 10 <<
                        5) + 31, f = 32;
                    else throw Error("Unexpected error in SHA-2 implementation");
                    for (; a.length <= k;) a.push(0);
                    a[c >>> 5] |= 128 << 24 - c % 32;
                    c = c + g;
                    a[k] = c & 4294967295;
                    a[k - 1] = c / 4294967296 | 0;
                    g = a.length;
                    for (c = 0; c < g; c += f) d = L(a.slice(c, c + f), d, b);
                    if ("SHA-224" === b) a = [d[0], d[1], d[2], d[3], d[4], d[5], d[6]];
                    else if ("SHA-256" === b) a = d;
                    else if ("SHA-384" === b) a = [d[0].a, d[0].b, d[1].a, d[1].b, d[2].a, d[2].b, d[3].a, d[3].b, d[4].a, d[4].b, d[5].a, d[5].b];
                    else if ("SHA-512" === b) a = [d[0].a, d[0].b, d[1].a, d[1].b, d[2].a, d[2].b, d[3].a, d[3].b, d[4].a,
                        d[4].b, d[5].a, d[5].b, d[6].a, d[6].b, d[7].a, d[7].b
                    ];
                    else throw Error("Unexpected error in SHA-2 implementation");
                    return a
                }, r = function(a) {
                    return a.slice()
                }, "SHA-224" === b) m = 512, f = 224;
            else if ("SHA-256" === b) m = 512, f = 256;
        else if ("SHA-384" === b) m = 1024, f = 384;
        else if ("SHA-512" === b) m = 1024, f = 512;
        else throw Error("Chosen SHA variant is not supported");
        else if (0 === b.lastIndexOf("SHA3-", 0) || 0 === b.lastIndexOf("SHAKE", 0)) {
            var F = 6;
            q = D;
            r = function(a) {
                var b = [],
                    d;
                for (d = 0; 5 > d; d += 1) b[d] = a[d].slice();
                return b
            };
            x = 1;
            if ("SHA3-224" ===
                b) m = 1152, f = 224;
            else if ("SHA3-256" === b) m = 1088, f = 256;
            else if ("SHA3-384" === b) m = 832, f = 384;
            else if ("SHA3-512" === b) m = 576, f = 512;
            else if ("SHAKE128" === b) m = 1344, f = -1, F = 31, A = !0;
            else if ("SHAKE256" === b) m = 1088, f = -1, F = 31, A = !0;
            else throw Error("Chosen SHA variant is not supported");
            u = function(a, b, d, c, g) {
                d = m;
                var k = F,
                    f, h = [],
                    n = d >>> 5,
                    l = 0,
                    e = b >>> 5;
                for (f = 0; f < e && b >= d; f += n) c = D(a.slice(f, f + n), c), b -= d;
                a = a.slice(f);
                for (b %= d; a.length < n;) a.push(0);
                f = b >>> 3;
                a[f >> 2] ^= k << f % 4 * 8;
                a[n - 1] ^= 2147483648;
                for (c = D(a, c); 32 * h.length < g;) {
                    a = c[l %
                        5][l / 5 | 0];
                    h.push(a.b);
                    if (32 * h.length >= g) break;
                    h.push(a.a);
                    l += 1;
                    0 === 64 * l % d && D(null, c)
                }
                return h
            }
        } else throw Error("Chosen SHA variant is not supported");
        e = M(a, h, x);
        l = B(b);
        this.setHMACKey = function(a, d, c) {
            var k;
            if (!0 === I) throw Error("HMAC key already set");
            if (!0 === y) throw Error("Cannot set HMAC key after calling update");
            if (!0 === A) throw Error("SHAKE is not supported for HMAC");
            h = (c || {}).encoding || "UTF8";
            d = M(d, h, x)(a);
            a = d.binLen;
            d = d.value;
            k = m >>> 3;
            c = k / 4 - 1;
            if (k < a / 8) {
                for (d = u(d, a, 0, B(b), f); d.length <= c;) d.push(0);
                d[c] &= 4294967040
            } else if (k > a / 8) {
                for (; d.length <= c;) d.push(0);
                d[c] &= 4294967040
            }
            for (a = 0; a <= c; a += 1) v[a] = d[a] ^ 909522486, w[a] = d[a] ^ 1549556828;
            l = q(v, l);
            g = m;
            I = !0
        };
        this.update = function(a) {
            var b, c, k, f = 0,
                h = m >>> 5;
            b = e(a, d, n);
            a = b.binLen;
            c = b.value;
            b = a >>> 5;
            for (k = 0; k < b; k += h) f + m <= a && (l = q(c.slice(k, k + h), l), f += m);
            g += f;
            d = c.slice(f >>> 5);
            n = a % m;
            y = !0
        };
        this.getHash = function(a, c) {
            var k, h, e, m;
            if (!0 === I) throw Error("Cannot call getHash after setting HMAC key");
            e = N(c);
            if (!0 === A) {
                if (-1 === e.shakeLen) throw Error("shakeLen must be specified in options");
                f = e.shakeLen
            }
            switch (a) {
                case "HEX":
                    k = function(a) {
                        return O(a, f, x, e)
                    };
                    break;
                case "B64":
                    k = function(a) {
                        return P(a, f, x, e)
                    };
                    break;
                case "BYTES":
                    k = function(a) {
                        return Q(a, f, x)
                    };
                    break;
                case "ARRAYBUFFER":
                    try {
                        h = new ArrayBuffer(0)
                    } catch (p) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    k = function(a) {
                        return R(a, f, x)
                    };
                    break;
                default:
                    throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            m = u(d.slice(), n, g, r(l), f);
            for (h = 1; h < t; h += 1) !0 === A && 0 !== f % 32 && (m[m.length - 1] &= 16777215 >>> 24 - f % 32), m = u(m, f,
                0, B(b), f);
            return k(m)
        };
        this.getHMAC = function(a, c) {
            var k, h, e, p;
            if (!1 === I) throw Error("Cannot call getHMAC without first setting HMAC key");
            e = N(c);
            switch (a) {
                case "HEX":
                    k = function(a) {
                        return O(a, f, x, e)
                    };
                    break;
                case "B64":
                    k = function(a) {
                        return P(a, f, x, e)
                    };
                    break;
                case "BYTES":
                    k = function(a) {
                        return Q(a, f, x)
                    };
                    break;
                case "ARRAYBUFFER":
                    try {
                        k = new ArrayBuffer(0)
                    } catch (v) {
                        throw Error("ARRAYBUFFER not supported by this environment");
                    }
                    k = function(a) {
                        return R(a, f, x)
                    };
                    break;
                default:
                    throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
            }
            h = u(d.slice(), n, g, r(l), f);
            p = q(w, B(b));
            p = u(h, f, m, p, f);
            return k(p)
        }
    }

    function c(b, a) {
        this.a = b;
        this.b = a
    }

    function O(b, a, c, g) {
        var d = "";
        a /= 8;
        var n, h, e;
        e = -1 === c ? 3 : 0;
        for (n = 0; n < a; n += 1) h = b[n >>> 2] >>> 8 * (e + n % 4 * c), d += "0123456789abcdef".charAt(h >>> 4 & 15) + "0123456789abcdef".charAt(h & 15);
        return g.outputUpper ? d.toUpperCase() : d
    }

    function P(b, a, c, g) {
        var d = "",
            n = a / 8,
            h, e, p, f;
        f = -1 === c ? 3 : 0;
        for (h = 0; h < n; h += 3)
            for (e = h + 1 < n ? b[h + 1 >>> 2] : 0, p = h + 2 < n ? b[h + 2 >>> 2] : 0, p = (b[h >>> 2] >>> 8 * (f + h % 4 * c) & 255) << 16 | (e >>> 8 * (f + (h + 1) % 4 * c) & 255) << 8 | p >>> 8 * (f +
                    (h + 2) % 4 * c) & 255, e = 0; 4 > e; e += 1) 8 * h + 6 * e <= a ? d += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(p >>> 6 * (3 - e) & 63) : d += g.b64Pad;
        return d
    }

    function Q(b, a, c) {
        var g = "";
        a /= 8;
        var d, e, h;
        h = -1 === c ? 3 : 0;
        for (d = 0; d < a; d += 1) e = b[d >>> 2] >>> 8 * (h + d % 4 * c) & 255, g += String.fromCharCode(e);
        return g
    }

    function R(b, a, c) {
        a /= 8;
        var g, d = new ArrayBuffer(a),
            e;
        e = -1 === c ? 3 : 0;
        for (g = 0; g < a; g += 1) d[g] = b[g >>> 2] >>> 8 * (e + g % 4 * c) & 255;
        return d
    }

    function N(b) {
        var a = {
            outputUpper: !1,
            b64Pad: "=",
            shakeLen: -1
        };
        b = b || {};
        a.outputUpper = b.outputUpper ||
            !1;
        !0 === b.hasOwnProperty("b64Pad") && (a.b64Pad = b.b64Pad);
        if (!0 === b.hasOwnProperty("shakeLen")) {
            if (0 !== b.shakeLen % 8) throw Error("shakeLen must be a multiple of 8");
            a.shakeLen = b.shakeLen
        }
        if ("boolean" !== typeof a.outputUpper) throw Error("Invalid outputUpper formatting option");
        if ("string" !== typeof a.b64Pad) throw Error("Invalid b64Pad formatting option");
        return a
    }

    function M(b, a, c) {
        switch (a) {
            case "UTF8":
            case "UTF16BE":
            case "UTF16LE":
                break;
            default:
                throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
        }
        switch (b) {
            case "HEX":
                b = function(a, b, e) {
                    var h = a.length,
                        l, p, f, m, q, u;
                    if (0 !== h % 2) throw Error("String of HEX type must be in byte increments");
                    b = b || [0];
                    e = e || 0;
                    q = e >>> 3;
                    u = -1 === c ? 3 : 0;
                    for (l = 0; l < h; l += 2) {
                        p = parseInt(a.substr(l, 2), 16);
                        if (isNaN(p)) throw Error("String of HEX type contains invalid characters");
                        m = (l >>> 1) + q;
                        for (f = m >>> 2; b.length <= f;) b.push(0);
                        b[f] |= p << 8 * (u + m % 4 * c)
                    }
                    return {
                        value: b,
                        binLen: 4 * h + e
                    }
                };
                break;
            case "TEXT":
                b = function(b, d, e) {
                    var h, l, p = 0,
                        f, m, q, u, r, t;
                    d = d || [0];
                    e = e || 0;
                    q = e >>> 3;
                    if ("UTF8" === a)
                        for (t = -1 ===
                            c ? 3 : 0, f = 0; f < b.length; f += 1)
                            for (h = b.charCodeAt(f), l = [], 128 > h ? l.push(h) : 2048 > h ? (l.push(192 | h >>> 6), l.push(128 | h & 63)) : 55296 > h || 57344 <= h ? l.push(224 | h >>> 12, 128 | h >>> 6 & 63, 128 | h & 63) : (f += 1, h = 65536 + ((h & 1023) << 10 | b.charCodeAt(f) & 1023), l.push(240 | h >>> 18, 128 | h >>> 12 & 63, 128 | h >>> 6 & 63, 128 | h & 63)), m = 0; m < l.length; m += 1) {
                                r = p + q;
                                for (u = r >>> 2; d.length <= u;) d.push(0);
                                d[u] |= l[m] << 8 * (t + r % 4 * c);
                                p += 1
                            } else if ("UTF16BE" === a || "UTF16LE" === a)
                                for (t = -1 === c ? 2 : 0, f = 0; f < b.length; f += 1) {
                                    h = b.charCodeAt(f);
                                    "UTF16LE" === a && (m = h & 255, h = m << 8 | h >>> 8);
                                    r =
                                        p + q;
                                    for (u = r >>> 2; d.length <= u;) d.push(0);
                                    d[u] |= h << 8 * (t + r % 4 * c);
                                    p += 2
                                }
                    return {
                        value: d,
                        binLen: 8 * p + e
                    }
                };
                break;
            case "B64":
                b = function(a, b, e) {
                    var h = 0,
                        l, p, f, m, q, u, r, t;
                    if (-1 === a.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string");
                    p = a.indexOf("=");
                    a = a.replace(/\=/g, "");
                    if (-1 !== p && p < a.length) throw Error("Invalid '=' found in base-64 string");
                    b = b || [0];
                    e = e || 0;
                    u = e >>> 3;
                    t = -1 === c ? 3 : 0;
                    for (p = 0; p < a.length; p += 4) {
                        q = a.substr(p, 4);
                        for (f = m = 0; f < q.length; f += 1) l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(q[f]),
                            m |= l << 18 - 6 * f;
                        for (f = 0; f < q.length - 1; f += 1) {
                            r = h + u;
                            for (l = r >>> 2; b.length <= l;) b.push(0);
                            b[l] |= (m >>> 16 - 8 * f & 255) << 8 * (t + r % 4 * c);
                            h += 1
                        }
                    }
                    return {
                        value: b,
                        binLen: 8 * h + e
                    }
                };
                break;
            case "BYTES":
                b = function(a, b, e) {
                    var h, l, p, f, m, q;
                    b = b || [0];
                    e = e || 0;
                    p = e >>> 3;
                    q = -1 === c ? 3 : 0;
                    for (l = 0; l < a.length; l += 1) h = a.charCodeAt(l), m = l + p, f = m >>> 2, b.length <= f && b.push(0), b[f] |= h << 8 * (q + m % 4 * c);
                    return {
                        value: b,
                        binLen: 8 * a.length + e
                    }
                };
                break;
            case "ARRAYBUFFER":
                try {
                    b = new ArrayBuffer(0)
                } catch (g) {
                    throw Error("ARRAYBUFFER not supported by this environment");
                }
                b =
                    function(a, b, e) {
                        var h, l, p, f, m;
                        b = b || [0];
                        e = e || 0;
                        l = e >>> 3;
                        m = -1 === c ? 3 : 0;
                        for (h = 0; h < a.byteLength; h += 1) f = h + l, p = f >>> 2, b.length <= p && b.push(0), b[p] |= a[h] << 8 * (m + f % 4 * c);
                        return {
                            value: b,
                            binLen: 8 * a.byteLength + e
                        }
                    };
                break;
            default:
                throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
        }
        return b
    }

    function y(b, a) {
        return b << a | b >>> 32 - a
    }

    function S(b, a) {
        return 32 < a ? (a -= 32, new c(b.b << a | b.a >>> 32 - a, b.a << a | b.b >>> 32 - a)) : 0 !== a ? new c(b.a << a | b.b >>> 32 - a, b.b << a | b.a >>> 32 - a) : b
    }

    function w(b, a) {
        return b >>> a | b << 32 - a
    }

    function t(b,
        a) {
        var k = null,
            k = new c(b.a, b.b);
        return k = 32 >= a ? new c(k.a >>> a | k.b << 32 - a & 4294967295, k.b >>> a | k.a << 32 - a & 4294967295) : new c(k.b >>> a - 32 | k.a << 64 - a & 4294967295, k.a >>> a - 32 | k.b << 64 - a & 4294967295)
    }

    function T(b, a) {
        var k = null;
        return k = 32 >= a ? new c(b.a >>> a, b.b >>> a | b.a << 32 - a & 4294967295) : new c(0, b.a >>> a - 32)
    }

    function aa(b, a, c) {
        return b & a ^ ~b & c
    }

    function ba(b, a, k) {
        return new c(b.a & a.a ^ ~b.a & k.a, b.b & a.b ^ ~b.b & k.b)
    }

    function U(b, a, c) {
        return b & a ^ b & c ^ a & c
    }

    function ca(b, a, k) {
        return new c(b.a & a.a ^ b.a & k.a ^ a.a & k.a, b.b & a.b ^ b.b & k.b ^ a.b &
            k.b)
    }

    function da(b) {
        return w(b, 2) ^ w(b, 13) ^ w(b, 22)
    }

    function ea(b) {
        var a = t(b, 28),
            k = t(b, 34);
        b = t(b, 39);
        return new c(a.a ^ k.a ^ b.a, a.b ^ k.b ^ b.b)
    }

    function fa(b) {
        return w(b, 6) ^ w(b, 11) ^ w(b, 25)
    }

    function ga(b) {
        var a = t(b, 14),
            k = t(b, 18);
        b = t(b, 41);
        return new c(a.a ^ k.a ^ b.a, a.b ^ k.b ^ b.b)
    }

    function ha(b) {
        return w(b, 7) ^ w(b, 18) ^ b >>> 3
    }

    function ia(b) {
        var a = t(b, 1),
            k = t(b, 8);
        b = T(b, 7);
        return new c(a.a ^ k.a ^ b.a, a.b ^ k.b ^ b.b)
    }

    function ja(b) {
        return w(b, 17) ^ w(b, 19) ^ b >>> 10
    }

    function ka(b) {
        var a = t(b, 19),
            k = t(b, 61);
        b = T(b, 6);
        return new c(a.a ^
            k.a ^ b.a, a.b ^ k.b ^ b.b)
    }

    function G(b, a) {
        var c = (b & 65535) + (a & 65535);
        return ((b >>> 16) + (a >>> 16) + (c >>> 16) & 65535) << 16 | c & 65535
    }

    function la(b, a, c, g) {
        var d = (b & 65535) + (a & 65535) + (c & 65535) + (g & 65535);
        return ((b >>> 16) + (a >>> 16) + (c >>> 16) + (g >>> 16) + (d >>> 16) & 65535) << 16 | d & 65535
    }

    function H(b, a, c, g, d) {
        var e = (b & 65535) + (a & 65535) + (c & 65535) + (g & 65535) + (d & 65535);
        return ((b >>> 16) + (a >>> 16) + (c >>> 16) + (g >>> 16) + (d >>> 16) + (e >>> 16) & 65535) << 16 | e & 65535
    }

    function ma(b, a) {
        var e, g, d;
        e = (b.b & 65535) + (a.b & 65535);
        g = (b.b >>> 16) + (a.b >>> 16) + (e >>> 16);
        d = (g &
            65535) << 16 | e & 65535;
        e = (b.a & 65535) + (a.a & 65535) + (g >>> 16);
        g = (b.a >>> 16) + (a.a >>> 16) + (e >>> 16);
        return new c((g & 65535) << 16 | e & 65535, d)
    }

    function na(b, a, e, g) {
        var d, n, h;
        d = (b.b & 65535) + (a.b & 65535) + (e.b & 65535) + (g.b & 65535);
        n = (b.b >>> 16) + (a.b >>> 16) + (e.b >>> 16) + (g.b >>> 16) + (d >>> 16);
        h = (n & 65535) << 16 | d & 65535;
        d = (b.a & 65535) + (a.a & 65535) + (e.a & 65535) + (g.a & 65535) + (n >>> 16);
        n = (b.a >>> 16) + (a.a >>> 16) + (e.a >>> 16) + (g.a >>> 16) + (d >>> 16);
        return new c((n & 65535) << 16 | d & 65535, h)
    }

    function oa(b, a, e, g, d) {
        var n, h, l;
        n = (b.b & 65535) + (a.b & 65535) + (e.b &
            65535) + (g.b & 65535) + (d.b & 65535);
        h = (b.b >>> 16) + (a.b >>> 16) + (e.b >>> 16) + (g.b >>> 16) + (d.b >>> 16) + (n >>> 16);
        l = (h & 65535) << 16 | n & 65535;
        n = (b.a & 65535) + (a.a & 65535) + (e.a & 65535) + (g.a & 65535) + (d.a & 65535) + (h >>> 16);
        h = (b.a >>> 16) + (a.a >>> 16) + (e.a >>> 16) + (g.a >>> 16) + (d.a >>> 16) + (n >>> 16);
        return new c((h & 65535) << 16 | n & 65535, l)
    }

    function z(b) {
        var a = 0,
            e = 0,
            g;
        for (g = 0; g < arguments.length; g += 1) a ^= arguments[g].b, e ^= arguments[g].a;
        return new c(e, a)
    }

    function B(b) {
        var a = [],
            e;
        if ("SHA-1" === b) a = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
        else if (0 === b.lastIndexOf("SHA-", 0)) switch (a = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], e = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], b) {
                case "SHA-224":
                    break;
                case "SHA-256":
                    a = e;
                    break;
                case "SHA-384":
                    a = [new c(3418070365, a[0]), new c(1654270250, a[1]), new c(2438529370, a[2]), new c(355462360, a[3]), new c(1731405415, a[4]), new c(41048885895, a[5]), new c(3675008525, a[6]), new c(1203062813, a[7])];
                    break;
                case "SHA-512":
                    a = [new c(e[0],
                        4089235720), new c(e[1], 2227873595), new c(e[2], 4271175723), new c(e[3], 1595750129), new c(e[4], 2917565137), new c(e[5], 725511199), new c(e[6], 4215389547), new c(e[7], 327033209)];
                    break;
                default:
                    throw Error("Unknown SHA variant");
            } else if (0 === b.lastIndexOf("SHA3-", 0) || 0 === b.lastIndexOf("SHAKE", 0))
                for (b = 0; 5 > b; b += 1) a[b] = [new c(0, 0), new c(0, 0), new c(0, 0), new c(0, 0), new c(0, 0)];
            else throw Error("No SHA variants supported");
        return a
    }

    function K(b, a) {
        var c = [],
            e, d, n, h, l, p, f;
        e = a[0];
        d = a[1];
        n = a[2];
        h = a[3];
        l = a[4];
        for (f =
            0; 80 > f; f += 1) c[f] = 16 > f ? b[f] : y(c[f - 3] ^ c[f - 8] ^ c[f - 14] ^ c[f - 16], 1), p = 20 > f ? H(y(e, 5), d & n ^ ~d & h, l, 1518500249, c[f]) : 40 > f ? H(y(e, 5), d ^ n ^ h, l, 1859775393, c[f]) : 60 > f ? H(y(e, 5), U(d, n, h), l, 2400959708, c[f]) : H(y(e, 5), d ^ n ^ h, l, 3395469782, c[f]), l = h, h = n, n = y(d, 30), d = e, e = p;
        a[0] = G(e, a[0]);
        a[1] = G(d, a[1]);
        a[2] = G(n, a[2]);
        a[3] = G(h, a[3]);
        a[4] = G(l, a[4]);
        return a
    }

    function Z(b, a, c, e) {
        var d;
        for (d = (a + 65 >>> 9 << 4) + 15; b.length <= d;) b.push(0);
        b[a >>> 5] |= 128 << 24 - a % 32;
        a += c;
        b[d] = a & 4294967295;
        b[d - 1] = a / 4294967296 | 0;
        a = b.length;
        for (d = 0; d < a; d += 16) e =
            K(b.slice(d, d + 16), e);
        return e
    }

    function L(b, a, k) {
        var g, d, n, h, l, p, f, m, q, u, r, t, v, w, y, z, A, x, F, B, C, D, E = [],
            J;
        if ("SHA-224" === k || "SHA-256" === k) u = 64, t = 1, D = Number, v = G, w = la, y = H, z = ha, A = ja, x = da, F = fa, C = U, B = aa, J = e;
        else if ("SHA-384" === k || "SHA-512" === k) u = 80, t = 2, D = c, v = ma, w = na, y = oa, z = ia, A = ka, x = ea, F = ga, C = ca, B = ba, J = V;
        else throw Error("Unexpected error in SHA-2 implementation");
        k = a[0];
        g = a[1];
        d = a[2];
        n = a[3];
        h = a[4];
        l = a[5];
        p = a[6];
        f = a[7];
        for (r = 0; r < u; r += 1) 16 > r ? (q = r * t, m = b.length <= q ? 0 : b[q], q = b.length <= q + 1 ? 0 : b[q + 1], E[r] = new D(m,
            q)) : E[r] = w(A(E[r - 2]), E[r - 7], z(E[r - 15]), E[r - 16]), m = y(f, F(h), B(h, l, p), J[r], E[r]), q = v(x(k), C(k, g, d)), f = p, p = l, l = h, h = v(n, m), n = d, d = g, g = k, k = v(m, q);
        a[0] = v(k, a[0]);
        a[1] = v(g, a[1]);
        a[2] = v(d, a[2]);
        a[3] = v(n, a[3]);
        a[4] = v(h, a[4]);
        a[5] = v(l, a[5]);
        a[6] = v(p, a[6]);
        a[7] = v(f, a[7]);
        return a
    }

    function D(b, a) {
        var e, g, d, n, h = [],
            l = [];
        if (null !== b)
            for (g = 0; g < b.length; g += 2) a[(g >>> 1) % 5][(g >>> 1) / 5 | 0] = z(a[(g >>> 1) % 5][(g >>> 1) / 5 | 0], new c(b[g + 1], b[g]));
        for (e = 0; 24 > e; e += 1) {
            n = B("SHA3-");
            for (g = 0; 5 > g; g += 1) h[g] = z(a[g][0], a[g][1], a[g][2], a[g][3],
                a[g][4]);
            for (g = 0; 5 > g; g += 1) l[g] = z(h[(g + 4) % 5], S(h[(g + 1) % 5], 1));
            for (g = 0; 5 > g; g += 1)
                for (d = 0; 5 > d; d += 1) a[g][d] = z(a[g][d], l[g]);
            for (g = 0; 5 > g; g += 1)
                for (d = 0; 5 > d; d += 1) n[d][(2 * g + 3 * d) % 5] = S(a[g][d], W[g][d]);
            for (g = 0; 5 > g; g += 1)
                for (d = 0; 5 > d; d += 1) a[g][d] = z(n[g][d], new c(~n[(g + 1) % 5][d].a & n[(g + 2) % 5][d].a, ~n[(g + 1) % 5][d].b & n[(g + 2) % 5][d].b));
            a[0][0] = z(a[0][0], X[e])
        }
        return a
    }
    var e, V, W, X;
    e = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388,
        2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
        2428436474, 2756734187, 3204031479, 3329325298
    ];
    V = [new c(e[0], 3609767458), new c(e[1], 602891725), new c(e[2], 3964484399), new c(e[3], 2173295548), new c(e[4], 4081628472), new c(e[5], 3053834265), new c(e[6], 2937671579), new c(e[7], 3664609560), new c(e[8], 2734883394), new c(e[9], 1164996542), new c(e[10], 1323610764), new c(e[11], 3590304994), new c(e[12], 4068182383), new c(e[13], 991336113), new c(e[14], 633803317), new c(e[15], 3479774868), new c(e[16], 2666613458), new c(e[17], 944711139), new c(e[18], 2341262773), new c(e[19],
            2007800933), new c(e[20], 1495990901), new c(e[21], 1856431235), new c(e[22], 3175218132), new c(e[23], 2198950837), new c(e[24], 3999719339), new c(e[25], 766784016), new c(e[26], 2566594879), new c(e[27], 3203337956), new c(e[28], 1034457026), new c(e[29], 2466948901), new c(e[30], 3758326383), new c(e[31], 168717936), new c(e[32], 1188179964), new c(e[33], 1546045734), new c(e[34], 1522805485), new c(e[35], 2643833823), new c(e[36], 2343527390), new c(e[37], 1014477480), new c(e[38], 1206759142), new c(e[39], 344077627), new c(e[40],
            1290863460), new c(e[41], 3158454273), new c(e[42], 3505952657), new c(e[43], 106217008), new c(e[44], 3606008344), new c(e[45], 1432725776), new c(e[46], 1467031594), new c(e[47], 851169720), new c(e[48], 3100823752), new c(e[49], 1363258195), new c(e[50], 3750685593), new c(e[51], 3785050280), new c(e[52], 3318307427), new c(e[53], 3812723403), new c(e[54], 2003034995), new c(e[55], 3602036899), new c(e[56], 1575990012), new c(e[57], 1125592928), new c(e[58], 2716904306), new c(e[59], 442776044), new c(e[60], 593698344), new c(e[61], 3733110249),
        new c(e[62], 2999351573), new c(e[63], 3815920427), new c(3391569614, 3928383900), new c(3515267271, 566280711), new c(3940187606, 3454069534), new c(4118630271, 4000239992), new c(116418474, 1914138554), new c(174292421, 2731055270), new c(289380356, 3203993006), new c(460393269, 320620315), new c(685471733, 587496836), new c(852142971, 1086792851), new c(1017036298, 365543100), new c(1126000580, 2618297676), new c(1288033470, 3409855158), new c(1501505948, 4234509866), new c(1607167915, 987167468), new c(1816402316, 1246189591)
    ];
    X = [new c(0, 1), new c(0, 32898), new c(2147483648, 32906), new c(2147483648, 2147516416), new c(0, 32907), new c(0, 2147483649), new c(2147483648, 2147516545), new c(2147483648, 32777), new c(0, 138), new c(0, 136), new c(0, 2147516425), new c(0, 2147483658), new c(0, 2147516555), new c(2147483648, 139), new c(2147483648, 32905), new c(2147483648, 32771), new c(2147483648, 32770), new c(2147483648, 128), new c(0, 32778), new c(2147483648, 2147483658), new c(2147483648, 2147516545), new c(2147483648, 32896), new c(0, 2147483649), new c(2147483648,
        2147516424)];
    W = [
        [0, 36, 3, 41, 18],
        [1, 44, 10, 45, 2],
        [62, 6, 43, 15, 61],
        [28, 55, 25, 21, 56],
        [27, 20, 39, 8, 14]
    ];
    "function" === typeof define && define.amd ? define(function() {
        return C
    }) : "undefined" !== typeof exports ? ("undefined" !== typeof module && module.exports && (module.exports = C), exports = C) : Y.jsSHA = C
})(this);