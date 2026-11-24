# Product Explorer

Mini Project 3-4 (MP3-MP4) for Software Development I (CSE-2340).

A web app built with HTML, CSS and JavaScript. It loads products from the DummyJSON API and lets you search, filter, sort, view details and save favourites.

## Features

- Fetches data from `https://dummyjson.com/products` using `fetch()` and `async/await`
- Loading, error (with a "Try again" button) and empty states
- Live search by product name, category filter, and sort by price
- Product cards created with DOM methods (`createElement`, `appendChild`, `querySelector`)
- Details popup for each product
- Save / unsave favourites, stored in `localStorage` so they stay after refreshing the page
- "Show saved only" filter
- Responsive layout for phone and desktop

## How to run

Open `index.html` in a browser (an internet connection is needed for the API).

## Files

- `index.html` - page structure
- `style.css` - styling
- `script.js` - all the logic
