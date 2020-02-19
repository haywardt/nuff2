# Did you come to Help?!

Use the area below as a chat window. Most recent comments at the top.
The broken stuff is in a file called `broken.js` so you don't have to read
the rest of my code unless you want to.

---

you:  
Tim: Thanks for offering to help!

---

# To Do


- ~~write an api that resets client state from server~~
- ~~update innerText rather than innerHTML on content objects.~~
- ~~<div,p,> dont support `name` property. Use `data-name` instead~~
- ignore proxy calls when changes dont occur
- ignore `blur` when content doesn't change.
- deal with buttons and anchors
- ~~decide if we should work with `contenteditable` since it doesn't fire a `change` event. Could use `input`~~
  - ~~add `blur` to all content editable at startup and to cloned `template` elements~~
- ~~figure out repeating elements~~
- create a state.get that retrieves arraylike keys into an array
- ~~figure out where `state` and `api` are glued together.~~
- ~~write an Object diff function so duplicate property/value pairs are not sent~~
- build a style sheet
- build an "includer" that makes the index.html look very simple.
- figure out why manifest.json sometimes creates a new cookie

# Good-Nuff

### the client nuff.js

- When any element on the front end changes it is reflected on the backend in Object `state`
- When any property of Object `state` changes on the back end it is reflected on the frontend elements
- Things in Object `state` are private to this cookieholder unless glued to the api in the server

### The server.js

**- The server is express**

**- requests for files are served from the application root**

**- requests to /api/ are as follows:**

- the client sends the state object in the fetch to the server
  - A random long term cookie is created for any client that doesn't present one.
- The state object is stored in in a file named `cookie.value`
- `api` properties are split into their separate file when arriving at the server,
- The `api` Object is stored in a file named with the value of `state.groupSecret`
- `api` and `state` merged together when responding overwriting any state objects with the api objects
- any property/value pair that is the same as the one in the incoming request is removed.
- the next time the client responds with any changes to his state object
- and so on.

**Warning**: array objects in `state` are not really arrays, but are top level properties written
in the form of an array(ie:`state["cart[0].qty"]` rather than `state.cart[0].qty`. You must convert them to arrays
before trying to iterate over them. You cannot set the properties of an array element with a {} but must
set each one individually. The `state` Object is limited to a single dimension

-- Tim Hayward

# Basic PWA Page

Probably the simplest progressive web app, just to get you started.

It

1. Works offline; the assets are installe when the service worker is registered; and fetched from cache or network
2. Is installable; the manifest defines what to launch and how it should appear on the users system
3. Is just this.

-- Paul Kinlan
