export class Parser {
    pos = 0;
    constructor(src) { this.src = src; }
    peek() { return this.src[this.pos]; }
    read() { return this.src[this.pos++]; }
    next() { this.pos++; }
}

export function modifySk(s) {
    return s
        .replace(/ii/g, "i-i")
        .replace(/ee/g, "e-e")
        .replace(/^í(?=.$)/, "i")
        .replace(/^espé/, "s-pé")
        .replace(/^ci(?=[eé])/, "tsi")
        .replace(/^blind/, "blinnd")
        .replace(/^ómn/, "omn")
        .replace(/^sub(?=[áéíó])/, "ssub")
        .replace(/^ce(?![aeiou])/, "tse")
        .replace(/r$/, "rr")
        .replace(/l$/, "ll")
        .replace(/k$/, "k'")
        .replace(/nso$/, "nsoo")
        .replace(/dis$/, "diss")
        .replace(/(?<=.)au$/, "aw")
        .replace(/ró$/, "ro")
        .replace(/ré$/, "re")
        .replace(/óo$/, "ó-o")
        .replace(/íno$/, "í-no")
        .replace(/([td])e$/, "-$1e")
        .replace(/so$/, "ssoo")
        .replace(/lúas$/, "lú-ass")
        .replace(/s(?=[aeiu])$/, "ss")
        .replace(/ár(?![-raeiou])/, "ar")
        .replace(/ez$/, "ezz")
        .replace(/ue$/, "u-e")
        .replace(/(?<=ž)ácas$/, "aatsas")
        .replace(/c(?=[ae]s?$)/, "ts")
        .replace(/(?<=..)í(?=[aeiou])$/, "ii")
        .replace(/nd/, "ndd")
        .replace(/ddes$/, "des")
        .replace(/ns/, "nss")
        .replace(/ds/g, "dss")
        .replace(/nš/g, "n-š")
        .replace(/ándž/, "andž")
        .replace(/éks/, "eks")
        .replace(/éns/, "ens")
        .replace(/ml/g, "m-l")
        .replace(/(?<!^u)ld/g, "l-d")
        .replace(/sc/g, "stc")
        .replace(/stcí/, "scii")
        .replace(/[eé]nc/, "ents")
        .replace(/áwg/, "awg")
        .replace(/(?<=[aeiou])c(?=[eé])/, "ts")
        .replace(/c(?=[oó])/, "ts")
        .replace(/éc/, "é-c")
        .replace(/ésm/g, "é-sm")
        .replace(/áng/, "aang")
        .replace(/ásk/, "ask")
        .replace(/ánc/, "anc")
        .replace(/émd/, "emd")
        .replace(/strí/, "striji")
        .replace(/autór/, "autoor")
        .replace(/súr/, "sur")
        .replace(/érv/, "erv")
        .replace(/írg/, "irg")
        .replace(/íca/, "ítsa")
        .replace(/faí/, "faii")
        .replace(/salvé/, "ssalvé")
        .replace(/decé/, "de-cé")
        .replace(/úrv/, "uurv")
        .replace(/ó-t/, "oo-t")
        .replace(/ksh/g, "ks-h")
        .replace(/fier/g, "fieer")
        .replace(/(?<=[ft])r(?=[éo])/g, "rr")
        .replace(/ur(?!r)/g, "urr")
        .replace(/úl(?![aeiou])/, "ul")
        .replace(/(?<!n)úl(?=[aeiou])/, "úul")
        .replace(/šám(?=[aiu])/, "ša-am")
        .replace(/(?<=..)nl/g, "nnl")
        .replace(/^és(?=[aeiou])/, "eess")
        .replace(/(?<=ré)s(?=[aeiou])/, "ss")
        .replace(/(?<!r)és(s?)(?=[aeiou])/, "éess");
}

// Esperanto and Ido
const TableEoIo = {
    la: "la",
    da: "da",
    de: "de",
    di: "di",
    do: "do",
    du: "du",
    en: "n",
    ne: "ne",
    un: "unn",
    sed: "sed",
    sep: "sep",
    dek: "dek",
    pli: "pli",
    mil: "mill",
    nun: "nun",
    amis: "ám-is",
    ho: "hoó",
    je: "je",
    ke: "kke",
    tra: "tra",
    trans: "trans",
    troa: "tro-oa",
};

// Esperanto
const TableEo = {
    jes: "jes",
    aŭ: "a-u",
    ĉi: "či",
    ĝi: "dži",
    ĝin: "džin",
    taŭgan: "táwgan",
    kun: "kun",
    strange: "stránge",
};

// Ido
const TableIo = {
    yes: "jes",
    no: "no",
    a: "a",
    ad: "adt",
    e: "e",
    ed: "ed",
    o: "o",
    od: "od",
    on: "on",
    ca: "tcá",
    ma: "ma",
    tam: "tam",
    kam: "kam",
    ka: "ka",
    ta: "ta",
    to: "to",
    se: "sse",
    dop: "dop",
    aden: "ádden",
    ante: "ante",
    ye: "je",
    co: "co",
    an: "ann",
    uldie: "uldíe",
    omnadie: "omnadíe",
};

export function wordEo(word) {
    return TableEoIo[word] ?? TableEo[word];
}

export function wordIo(word) {
    return TableEoIo[word] ?? TableIo[word];
}
