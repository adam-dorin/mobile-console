# Mobile-Console

## Description
#### This repo are my efforts in making a console that can be used on mobile devices.

## Features:

1. Intercepts all console.log and outputs them into a visible console
2. The console can be made visible by adding activateMobileDebugger=true to your url, either to the hash or some other part of the url.
3. All JS errors will be outputed into the console

## Dependencies :

None

## Installation:

1. Download or clone this repo
2. Include debuger.js as the very first tag after opening the head tag of the page
3. Make sure debuger.css may be accessed through the base path such as www.example.com/debuger.css
##

## TODO:

1. ~~base64 the arrow image;~~
2. ~~Handle objects and arrays passed throught the console.log ( duplicate for error and warn )~~
3. Test out with some actual developments
4. ~~Minify the js and css~~
5. ~~Distribute css and via a CDN~~ [https://cdn.jsdelivr.net/gh/adam-dorin/mobile-console@1.0/dist/debuger.js][https://cdn.jsdelivr.net/gh/adam-dorin/mobile-console@1.0/dist/debuger.js]
6. Add display trees for all the Objects types
7. Handle ajax errors
8. Find a way to intercept and log all the requests made by the current page.
    + Intercept all xhr based requests
    + Intercept all file requests .css, .js , files images audio/video etc.
9. Implement a more nicer design
