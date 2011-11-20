Grocery List - A simple, HTML5, offline grocery list application  
=============

Copyright (C) 2011 Thomas James Barrasso  

Author: Thomas James Barrasso   
Name: HTML5 Grocery List  
Version: 1  
License: Apache License, Version 2.0  

About:
-------

This is meant to be a simple app that allows you to add/ remove
items from your grocery list. If you add an item with the same
name as before, the two amounts just add up. All items are saved
even after the browser is closed (or an internet connection is
lost). Happy shopping!

Compatibility:
-------

An attempt was made with graceful degredation, however I have not
tested this app beyond Android 2.3.3, iOS 4.3.3, or Chrome 11.  
  
As for resolution, this app is designed to work on any resolution
from 240x360 up, including desktop browsers (albeit slightly less
than fullscreen). Thus most mobile devices should be supported.

Files:
-------

index.html (HTML base file for app)  
main.js (JavaScript file for entire app functionality)  
main.css (CSS file for entire app styles)  
cache.mf (Cache Manifest file for offline usage. Note: this file  
needs to be served with the mime-type text/cache-manifest.)  

Libraries used:
-------

MooTools 1.3.3
Modernizr 1.7

CSS Built from:
-------

LESS Framework

HTML5 Features used:
-------

sessionStorage (instead of localStorage for better compatibility)
DOCTYPE
Elements (<section>, <footer>, and <header>)
Form attributes (type="number"), and placeholder
Offline Cache (cache manifest file)

CSS3 Features used:
-------

border-radius
text-selection
keyframes (intro fade-in animation)
2d animations (rotate)
rbga
gradients (with IE fallback)
box shadow
background size (love this one!)