import { Parser, normalize, modifySk, workEo } from "./common.js";

const phonemes = (function () {
    let ret = {};
    function set(phs) {
        for (const ph of phs.split(" ")) {
            let [p1, p2] = ph.split(",");
            ret[p1] = p2;
        }
    }
    set("a,a b,b c,c ĉ,č d,d e,e f,f g,g ĝ,dž h,h");
    set("ĥ,ch i,i j,j ĵ,ž k,k l,l m,m n,n o,o p,p");
    set("r,r s,s ŝ,š t,t u,u ŭ,u v,v z,z");
    return ret;
})();

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
                    if (["kv", "gv", "dz"].includes(cc)) {
                        p.next();
                        cur.unshift(c2);
                    }
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

function eo2sk1(syls) {
    const len = syls.length;
    const lastl = len ? syls[len - 1].length : 0;
    const lastR = lastl && syls[len - 1][lastl - 1] == "r";
    for (let i = 0; i < len; i++) {
        const syl = syls[i];
        let ac = len == 1 ? !lastR : i == len - 2;
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

function eo2skw(phs) {
    return modifySk(eo2sk1(syllablize(phs)).flat().join(""));
}

export function eo2sk(s) {
    s = s
        .replace(/cx/g, "ĉ")
        .replace(/gx/g, "ĝ")
        .replace(/hx/g, "ĥ")
        .replace(/jx/g, "ĵ")
        .replace(/sx/g, "ŝ")
        .replace(/ux/g, "ŭ")
        .replace(/C[xX]/g, "Ĉ")
        .replace(/G[xX]/g, "Ĝ")
        .replace(/H[xX]/g, "Ĥ")
        .replace(/J[xX]/g, "Ĵ")
        .replace(/S[xX]/g, "Ŝ")
        .replace(/U[xX]/g, "Ŭ");
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
                cur += ch;
                phs.push(chl);
            } else if (cur && (ch == "'" || ch == "’")) {
                cur += ch;
            } else {
                if (cur.length) {
                    let s = wordEo(cur.toLowerCase()) ?? eo2skw(phs);
                    ret1 += s;
                    ret2 += '<span s="' + s + '">' + cur + '</span>';
                    cur = "";
                    phs = [];
                }
                if (ch) {
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
