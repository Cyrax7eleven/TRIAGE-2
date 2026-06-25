# Triage — GitHub Issues Tracker

A small dashboard for browsing, filtering, and searching GitHub-style issues.
Built with plain HTML, CSS, and JavaScript (no frameworks) for Assignment-05.

## ✨ Features

- **Login page** with demo credentials and form validation
- **Session-based auth guard** — the issues page redirects back to login if no session exists
- **Navbar** with brand mark and a search bar (button-click search *and* debounced live search-as-you-type)
- **Tabs** — All / Open / Closed, with live counts and an active-state indicator
- **Summary bar** showing the current result count plus open/closed markers
- **4-column responsive card grid** (collapses to 2 columns on tablet, 1 on mobile)
- **Color-coded top border** on each card — green for open issues, purple for closed
- **Loading spinner** while data is being fetched
- **Issue detail modal** with full metadata (author, assignee, created/updated dates)
- **Empty and error states** for searches with no results or failed requests

## 🗂️ Project structure

```
triage/
├── index.html          # Login page
├── main.html            # Issues dashboard
├── css/
│   ├── styles.css       # Shared design tokens, reset, buttons
│   ├── login.css        # Login page styles
│   └── main.css         # Navbar, tabs, cards, modal styles
├── js/
│   ├── auth.js          # Login form + demo credential check
│   └── app.js           # Fetching, rendering, filtering, search, modal
└── README.md
```

## 🔌 API endpoints used

| Purpose       | Endpoint                                                              |
|---------------|------------------------------------------------------------------------|
| All issues    | `GET /api/v1/lab/issues`                                              |
| Single issue  | `GET /api/v1/lab/issue/{id}`                                          |
| Search issues | `GET /api/v1/lab/issues/search?q={searchText}`                       |

Base URL: `https://phi-lab-server.vercel.app`

## 🚀 Running locally

This is a static site — no build step or server required.

1. Download/clone the folder.
2. Open `index.html` directly in your browser, **or** serve it with any static
   server (e.g. the VS Code "Live Server" extension) so relative paths and
   `fetch` calls behave consistently.
3. Sign in with the demo credentials below.

## 🔑 Demo credentials

```
Username: admin
Password: admin123
```

Authentication here is intentionally simple: it checks the entered values
against a hardcoded constant in `js/auth.js` and stores a flag in
`sessionStorage`. There is no real backend account system — it exists only
to satisfy the login-page requirement for this assignment.

## 🧠 Concept questions

> The five questions below are part of the assignment brief, which asks
> students to answer them in their own words. Treat the answers here as a
> starting reference only — rewrite them yourself before submitting, since
> the instructions explicitly ask for original answers rather than
> AI-generated or copied ones.

**1. What is the difference between `var`, `let`, and `const`?**

`var` is function-scoped (or globally scoped if declared outside a
function) and gets hoisted with a default value of `undefined`, which can
lead to confusing bugs since it's accessible before its declaration line
runs. It can also be redeclared and reassigned freely. `let` and `const`
are both block-scoped, meaning they only exist inside the `{ }` they were
declared in (like inside an `if` or `for` block). `let` can be reassigned
later, while `const` cannot be reassigned after its initial value is set —
though if a `const` holds an object or array, the contents of that object
or array can still be changed, just not the variable binding itself.

**2. What is the spread operator (`...`)?**

The spread operator expands an iterable (like an array or string) or an
object's own enumerable properties into individual elements. It's commonly
used to copy arrays/objects (`const copy = [...original]`), merge them
(`const merged = [...arr1, ...arr2]`), or pass an array's items as separate
arguments to a function (`Math.max(...numbers)`). It avoids mutating the
original data, which fits well with patterns that prefer creating new
values instead of changing existing ones in place.

**3. What is the difference between `map()`, `filter()`, and `forEach()`?**

All three iterate over an array, but they're meant for different purposes.
`map()` transforms each element and returns a **new array** of the same
length, made up of the return values of the callback. `filter()` tests each
element with a callback that returns `true` or `false`, and returns a
**new array** containing only the elements that passed the test — so its
length is usually shorter than the original. `forEach()` simply runs a
callback for each element for its side effects (like logging or updating
the DOM) and returns `undefined` — it's not meant to build a new array.

**4. What is an arrow function?**

An arrow function is a shorter syntax for writing functions, introduced in
ES6, e.g. `const add = (a, b) => a + b;`. Besides being more concise, the
key behavioral difference is that arrow functions don't have their own
`this` — they inherit `this` from the surrounding (lexical) scope instead
of getting a new one based on how they're called. This makes them
convenient for callbacks where you want `this` to stay the same as the
outer context, but it also means they aren't suitable as object methods
that rely on their own `this`, and they can't be used as constructors with
`new`.

**5. What are template literals?**

Template literals are strings wrapped in backticks (`` ` ``) instead of
quotes. They allow embedded expressions using `${ }` syntax, so values can
be inserted directly into a string without manual concatenation — for
example `` `Hello, ${name}!` `` instead of `'Hello, ' + name + '!'`. They
also support multi-line strings without needing `\n` or string
concatenation, which makes building longer pieces of text (like HTML
snippets) much more readable.

## 📤 Submission

- GitHub Repository Link: _add your repo URL here_
- Live Site Link: _add your deployed URL here (e.g. GitHub Pages / Vercel / Netlify)_
