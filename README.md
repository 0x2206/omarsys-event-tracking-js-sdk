# Event Tracking JavaScript SDK

JavaScript client library for CherryTech Event Tracking system.

## Usage

** Web browser: **

* Asynchronously load library using contents of built `loader.min.js` placed in `<head>`. To instantiate trackers pass their IDs as arguments to IIFE: `!function(){/* code */}('tracker1', 'tracker2');` Those will be attached to global `window` object and ready to use immediately.

* Synchronously load built `tracking.min.js` that exposes `CherryTechEventTracking` global object. To instantiate tracker invoke `var trackerInstance = CherryTechEventTracking.createTracker('id');`

* `npm install cherrytech-event-tracking-js-sdk --save` to use in custom build process. _NOTE_: Building for web browser requires transforming this CommonJS package into browser friendly one, e.g. using [Browserify](http://browserify.org/).

** Node.js: **
```
npm install cherrytech-event-tracking-js-sdk --save
```

and

```javascript
var Tracking = require('cherrytech-event-tracking-js-sdk');
```

## Contributing

* To test `npm test`.
* To build library and loader `npm run build`.
* Follow [commit messages guide line](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).
* Package follows [Semantic Versioning](http://semver.org/) rules.
