# EdUHK Lacrosse Interest Group — website

A static site for the student-led EdUHK Lacrosse Interest Group. Five pages,
three languages, no build step. Published with GitHub Pages from the `main`
branch, repository root.

**Live:** https://s1155582.github.io/EdUHK_Lacrosse/

---

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, progress towards 18 players, gallery preview, training times |
| `about.html` | Who we are, the goal, the organisers' message, what we value |
| `training.html` | Weekly schedule, arrival details, beginner sessions, activities |
| `gallery.html` | 32 photographs with a lightbox |
| `join.html` | How to join, seven FAQs, contact details |

## Structure

```
index.html  about.html  training.html  gallery.html  join.html
assets/
  css/style.css          ← the whole design system
  js/i18n.js             ← every string, in en / zh-Hant / zh-Hans
  js/main.js             ← nav, language switcher, FAQ, lightbox, reveal
  img/emblem.png
  img/gallery/01–32.jpg        full-size (16 MB total)
  img/gallery/thumbs/01–32.jpg 480px grid thumbnails (1.9 MB total)
```

---

## Editing

### Changing a nav item, the footer, or the language switcher

GitHub Pages runs a *legacy* build here, so there is no server-side include and
no templating. The header and footer are physically duplicated across all five
HTML files, which means the same edit normally has to be made five times.

They are instead generated from one source. Each page carries markers:

```html
<!--H:START--> … header … <!--H:END-->
<!--F:START--> … footer … <!--F:END-->
```

Edit the `header()` / `footer()` functions in the build script, re-run it, and
all five files update — with `aria-current="page"` set correctly per page.

### Adding or removing photographs

1. Drop the image at `assets/img/gallery/NN.jpg`.
2. Make a thumbnail: `sips -Z 480 -s format jpeg -s formatOptions 75 NN.jpg --out thumbs/NN.jpg`
3. Add one `<a class="photo-cell">` line to the grid in `gallery.html`.
4. Update the count in `i18n.js` (`gallery.count`) and the `data-i18n-n`
   attribute on the same element in `gallery.html`.

Photographs are shown at 480px in the grid and only load full-size when opened
in the lightbox, so the page stays light no matter how many are added.

### Text and translations

All visible text lives in `assets/js/i18n.js`, keyed per page:

```js
'en':      { 'home.hero.title': '…' },
'zh-hant': { 'home.hero.title': '…' },
'zh-hans': { 'home.hero.title': '…' },
```

Elements reference a key with `data-i18n="key"` (replaces the element's content)
or `data-i18n-attr="aria-label:key"` (sets an attribute). Values may contain
inline HTML — `<br>`, `<em>`, `<span>`, `<a>`.

**Keep all three languages in step.** A key present in `en` but missing from a
translation renders as an empty element — the words simply disappear.

English is always the default. The language switcher only takes effect when a
visitor clicks it, and the choice is then remembered in `localStorage`.

---

## Notes

- **No build step.** What is committed is what is served. Keep `index.html` at
  the repository root.
- **Fonts** load from Google Fonts (Fraunces for headings, Archivo for text),
  with system-font fallbacks for Chinese.
- The contact details, training times, and the Google Form link are live data —
  update them in `i18n.js`, not in the HTML.
- The site is a student-led interest group, not an official university website.
  The disclaimer in the footer must stay unless and until that changes.
