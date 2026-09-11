# feat: the island background on the start and reward screens

**Branch:** `feat/island-background` → `main` · 3 commits, stacked on
`fix/ios-audio-unlock`

> **Merge `fix/ios-audio-unlock` first.** This branch is built on it, so until
> that lands this PR shows eleven commits. Afterwards it is these three.

## Read this before the numbers

**Nothing in this PR has been measured on a real phone.** Every figure below
was taken in the Browser pane, and it is worth being exact about what that
does and does not mean.

- **The contrast figures are real pixels, not tokens.** For each element the
  shipped `rimba.jpg` is decoded, laid out with the computed
  `background-size` and `background-position`, and every pixel under the
  element is sampled. The figures are computed from that image, so they do not
  depend on the pane's renderer — but a phone applying colour management to an
  untagged JPEG could shift them slightly.
- **The layout figures are the pane's layout** at the two viewports the brief
  named: 390×740 and 360×780.
- **The safe-area inset is simulated.** The pane reports it as 0; an iPhone
  with a home bar reports 34px. It was tested by substituting 34px into the same
  CSS expressions, and that test found a real bug (see *Safe area*, below).
- **Not covered at all:** Safari with its toolbars showing, which is shorter
  than 740 on a 390-wide iPhone. The reward screen will scroll there.

The designer's own measurements are quoted where they exist, labelled as
theirs.

---

## The asset

| | |
|---|---|
| Source | `rimba.png`, 941×1672, **2,065,614 B** |
| With the ten Malay recordings (513,667 B) | 2,582,623 B — over the 2 MB budget in SPEC §7.6 |
| Shipped | `public/img/latar/rimba.jpg`, JPEG quality 86, **273,962 B** |
| Against the source | PSNR 34.85 dB |
| Activity total now | 790,971 B, with room for the English recordings |

No transparency, so JPEG. Quality 86 was picked from five encodings (70–90) by
size against PSNR — returns flatten past it. Encoded with the Windows GDI+
encoder, the only one on the machine.

## The rules it runs on

- **Anchored to the bottom**, `cover`. On a portrait phone the crop falls on
  the sides: 13.2px each side at 390×740, 39.5px at 360×780.
- **Text and stars only in the sky band, y 150–230.**
- **Anything that does not fit moves onto a surface of its own.**

DESIGN §8 gains these as a section of its own — full-screen backgrounds as a
category, not an exception to the object rules — with this image as the case
record.

---

## Start screen

Name slot (44px, empty until Phase 2) and title fill the band exactly. The
kancil stands on the meadow at 210px; the Mula button stays 96px at the bottom.

**`--arang` against the real pixels under the text:**

| | 390×740 | 360×780 | designer |
|---|---|---|---|
| Title glyph box | min **6.89** · median 7.34 | min **6.76** · median 7.24 | — |
| Whole band, y 150–230 | min **6.70** · max 10.74 | min **6.62** · max 10.68 | 6.71–10.68 |
| Above the band, y 50–100 | min **1.01** | min **1.01** | 1.09 |

The designer's band holds, and so does the drop above it: the canopy takes it
to about 1:1.

**The kancil:** top at y 420 at 390×740 as briefed; y 460 at 360×780, because
it is held from the bottom like the background. All four hooves land on meadow
pixels at both sizes.

## Reward screen

The stars have the band to themselves; every word moves onto one card; the
kancil stands on the meadow above the buttons.

### Stars

72px, bottom-aligned, the middle one raised 8px, all inside y 150–230.
Outlined in **`--arang`**, filled or empty; the fill stays `--mangga`.

| Outline | 390×740 | 360×780 |
|---|---|---|
| **`--arang`** (shipped) | min **6.70**, 0% under 3:1 | min **6.64**, 0% under 3:1 |
| `--mangga-dark` (rejected) | min **2.96** · median 3.15 | min **2.94** · median 3.11 |
| `--mangga` fill, no outline | 1.00–1.53 | — |

The designer measured the `--mangga-dark` outline at "up to 4.88", which is
true of the brightest cloud. Its minimum is under the 3:1 floor for a graphical
object, so it is recorded in DESIGN §2.4 as rejected, with the reason.

### The card

Syabas!, both score lines and the gems pill, on one white card.

Text on the card face: `--arang` **12.26** for Syabas!, the star count and the
gems; `--arang-soft` **4.69** for the first-try line — over 4.5, not by much.

A white card does not separate from this picture on its own, so it carries a
2px `--arang` border. Measured in a 6px ring of background around it at
390×740:

| Border | outer-edge median | under 3:1 | inner edge vs white |
|---|---|---|---|
| none | 1.97 | **75%** | — |
| `--garis` | 1.55 | 91% | 1.28 |
| `--arang-soft` | 2.42 | 83% | 4.69 |
| `--laut-dark` | 2.66 | 56% | 5.21 |
| **`--arang`** | **6.23** | **8.7%** | **12.26** |

At 360×780 the `--arang` border's outer edge measures a median of 7.19.

### The order differs from the one agreed

The agreed preview put the card directly on top of the buttons with the kancil
above it. That preview was drawn before anything was measured, and it does not
fit this picture. The open meadow starts at **y 450** at 390×740 — above it the
pixels are blue-green trees — and the buttons begin at 564, leaving 114px of
grass. Built as previewed:

- the card filled all of the grass
- the kancil's hooves landed at **y 415, in the bushes**
- the second button was pushed **65px off the screen**

The order that fits is stars → card → kancil on the meadow → buttons. To make
it fit:

- the kancil is **150px** here, not 210 — 160 overflowed by 8.4px
- the card's padding is 8px tighter, after its border added 4
- **Seterusnya is 72, not 88** — it sat in `min-h-answer` under a comment
  calling it the same slot as the quiz screen's Next, which has been 72 since
  DESIGN §7 moved it there

## Safe area

Found while writing this PR. An iPhone with a home bar puts every bottom button
18px higher than the pane does, and neither screen accounted for it. Simulated
at an inset of 34px:

| | before the fix | after |
|---|---|---|
| Start 390×740: kancil shadow to Mula | **−8.4px** (covered) | 9.6px |
| Reward 390×740: overflow | **12px** | 0 |
| Reward 390×740: second button inside the home-bar zone | **11.7px** | 0 |

The kancil on the start screen now rises with the button —
`calc(94px + max(16px, inset))`, exactly 110px where the inset is 0. On the
reward screen the gap above the buttons gives way to the inset and only there.
Where the inset is 0 both screens are pixel-for-pixel what the tables above
measured.

## Verified at both sizes

| | 390×740 | 360×780 |
|---|---|---|
| All text inside y 150–230 | yes | yes |
| Stars inside y 150–230 | yes | yes |
| Hooves on meadow pixels | 4/4 | 4/4 |
| Button clear of the kancil | yes | yes |
| Overflow, inset 0 | none | none |
| Overflow, inset 34 (simulated) | none | none |

142 tests pass, typecheck clean, `validate:content` 0 errors, production build
succeeds and ships the 273,962 B JPEG.

## Before merging

Please look at both screens on the iPhone — ideally once added to the home
screen and once in Safari with the toolbars showing. The first should match
the tables above. The second is the case nothing here covered.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
