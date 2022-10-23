import { Parser, modifySk, wordIo } from "./common.js";

const [phonemes, phonemes2] = (function () {
    let ret1 = {}, ret2 = {};
    function set(phs) {
        for (const ph of phs.split(" ")) {
            let [p1, p2] = ph.split(",");
            ret1[p1] = p2;
            if (p1.length > 1) ret2[p1[0]] = 1;
        }
    }
    set("a,a b,b c,c ch,č d,d e,e f,f g,g h,h");
    set("i,i j,ž k,k l,l m,m n,n o,o p,p q,k qu,ku");
    set("r,r s,s sh,š t,t u,u v,v w,u x,ks y,j z,z");
    return [ret1, ret2];
})();

function normalize(ch) {
    if (!ch) return ch;
    ch = ch.toLowerCase();
    if (ch.match(/[a-z]/) || ch in phonemes) return ch;
    if (ch.match(/[éèê]/)) return "e";
    return null;
}

function isVowel(ph) {
    return "aeiou".includes(ph);
}

function syllablize(phs) {
    const p = new Parser(phs.reverse());
    let ret = [];
    let cur = [];
    let ph;
    while ((ph = p.read())) {
        cur.unshift(ph);
        if (!isVowel(ph)) continue;
        let c1 = p.peek();
        if (c1 && !isVowel(c1)) {
            p.next();
            cur.unshift(c1);
            let c2 = p.peek();
            if (c2 && !isVowel(c2)) {
                if ("lr".includes(c1) && c2 != c1) {
                    p.next();
                    cur.unshift(c2);
                } else {
                    let cc = c2 + c1;
                }
            }
        }
        ret.unshift(cur);
        cur = [];
    }
    if (cur.length) {
        if (ret.length) {
            ret[0] = cur.concat(ret[0]);
        } else {
            ret = [cur];
        }
    }
    let len = ret.length;
    if (len >= 3) {
        let l1 = ret[len - 1];
        let l2 = ret[len - 2];
        if (isVowel(l1[0]) && "iu".includes(l2[l2.length - 1])) { // diphthong
            ret.pop();
            ret[len - 2] = l2.concat(l1);
        }
    }
    return ret;
}

function subseq(syls, i, j) {
    return (
        syls[i].slice(j + 1).join("") +
        syls
            .slice(i + 1)
            .flat()
            .join("")
    );
}

function io2sk1(syls) {
    const len = syls.length;
    const lastl = len ? syls[len - 1].length : 0;
    const lastR = lastl && syls[len - 1][lastl - 1] == "r";
    const inf = lastl >= 2 && syls[len - 1][lastl - 2] == "a" && lastR;
    for (let i = 0; i < len; i++) {
        const syl = syls[i];
        let ac = inf ? i == len - 1 : len == 1 ? !lastR : i == len - 2;
        for (let j = 0; j < syl.length; j++) {
            const ph = syl[j];
            let ph2;
            if (ac && isVowel(ph)) {
                if (!/^[mn][tdkg]/.test(subseq(syls, i, j))) {
                    ph2 = "áéíóú"["aeiou".indexOf(ph)];
                }
            } else {
                ph2 = phonemes[ph];
            }
            if (ph2) syl[j] = ph2;
        }
    }
    return syls;
}

function io2skw(phs) {
    return modifySk(io2sk1(syllablize(phs)).flat().join(""));
}

export function io2sk(s) {
    let ret1 = "", ret2 = "";
    function f(s) {
        let cur = "";
        let phs = [];
        const p = new Parser(s);
        let ch;
        do {
            ch = p.read();
            let chl = normalize(ch);
            if (chl) {
                if (chl in phonemes2) {
                    let ch2 = p.peek();
                    let ch2l = ch2 ? ch2.toLowerCase() : ch2;
                    if (ch2l && chl + ch2l in phonemes) {
                        ch += p.read();
                        chl += ch2l;
                    }
                }
                cur += ch;
                phs.push(chl);
            } else if (cur && (ch == "'" || ch == "’")) {
                cur += ch;
            } else {
                if (cur.length) {
                    let s = wordIo(cur.toLowerCase()) ?? io2skw(phs);
                    ret1 += s;
                    ret2 += '<span s="' + s + '">' + cur + '</span>';
                    cur = "";
                    phs = [];
                }
                if (ch == "-" && p.peek() == "e") {
                    p.next();
                    if (p.peek() == "-") {
                        p.next();
                        ret1 += " e ";
                        ret2 += '<span s=" e ">-e-</span>'
                    } else {
                        ret1 += "-e";
                        ret2 += "-e";
                    }
                } else if (ch) {
                    ret1 += ch;
                    ret2 += ch;
                }
            }
        } while (ch);
    }
    for (let i = 0; i < s.length;) {
        let ss = s.substring(i);
        let m1 = ss.match(/(<span.*?>)(.*?)(<\/span>)/);
        if (m1) {
            f(ss.substring(0, m1.index));
            let m2 = ss.match(/<span.*? s="(.*?)"/);
            if (m2) {
                ret1 += m2[1];
                ret2 += m1[0];
            } else {
                ret2 += m1[1];
                f(m1[2]);
                ret2 += m1[3];
            }
            i += m1.index + m1[0].length;
        } else {
            f(ss);
            break;
        }
    }
    return [ret1, ret2];
}
