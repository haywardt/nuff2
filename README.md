# HELPERS!
Use the area below as a chat window. Most recent comments at the top.
The broken stuff is in a file called `broken.js` so you don't have to read
the rest of my code unless you want to.

--------------------------------------------------------------------

you:  
Tim: Thanks for offering to help!  

---------------------------------------------------------------------



# To Do
- ~~update innerText rather than innerHTML on content objects.~~
- ignore proxy calls when changes dont occur
- ignore `blur` when content doesn't change.
- deal with buttons and anchors
- decide if we should work with `contenteditable` since it doesn't fire a `change` event. Could use `input`
  - add `blur` to all content editable at startup and to cloned `template` elements
- ~~figure out repeating elements~~
- create a state.get that retrieves arraylike keys into an array
- figure out where `state` and `api` are glued together.


# Good-Nuff

- When any element on the front end changes it is reflected on the backend in Object `state`
- When any property of Object `state` changes on the back end it is reflected on the frontend elements
- Things in Object `state` are private to this cookieholder
- Things in Object `api` are shared amoung all those with the same value of `state.groupSecret`
- **Warning**: array objects in `state` are not really arrays, but are top level properties written 
in the form of an array(ie:`state["cart[0].qty"]` rather than `state.cart[0].qty`. You must convert them to arrays 
before trying to iterate over them. You cannot set the properties of an array element with a {} but must 
set each one individually.

-- Tim Hayward

# Basic PWA Page

Probably the simplest progressive web app, just to get you started.

It

1. Works offline; the assets are installe when the service worker is registered; and fetched from cache or network
2. Is installable; the manifest defines what to launch and how it should appear on the users system
3. Is just this.

-- Paul Kinlan
