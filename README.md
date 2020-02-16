# Basic PWA Page

Probably the simplest progressive web app, just to get you started.

It

1. Works offline; the assets are installe when the service worker is registered; and fetched from cache or network
2. Is installable; the manifest defines what to launch and how it should appear on the users system
3. Is just this.

-- Paul Kinlan

# Good-Nuff

- When any element on the front end changes it is reflected on the backend in Object `state`
- When any property of Object `state` changes on the back end it is reflected on the frontend elements
- Things in Object `state` are private to this cookieholder
- Things in Object `api` are shared amoung all those with the same value of `state.groupSecret`

-- Tim Hayward
