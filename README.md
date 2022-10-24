# conlang-tts

Convert spellings to speak constructed languages with TTS

# Usage

```javascript
$ deno
Deno 1.26.1
exit using ctrl+d, ctrl+c, or close()
> import { eo2sk } from "https://cdn.jsdelivr.net/gh/7shi/conlang-tts@0.0/eo.min.js";
undefined
> eo2sk("Patro nia, kiu estas en la cxielo,")[0]
"pátrro nía, kíu éstas n la čiélo,"
> import { io2sk } from "https://cdn.jsdelivr.net/gh/7shi/conlang-tts@0.0/io.min.js";
undefined
> io2sk("Patro nia, qua esas en la cielo")[0]
"pátrro nía, kuá eessas n la tsiélo"
```

# Demo

These do not reference this repository, but are based on the same code base.

* [Speak Esperanto (Convert)](https://codepen.io/7shi/pen/gOeGGXg)
* [Speak Ido (Convert)](https://codepen.io/7shi/pen/JjvVyBM)
