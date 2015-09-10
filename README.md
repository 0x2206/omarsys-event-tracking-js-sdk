# Event Tracking JavaScript SDK

JavaScript client library for CherryTech Event Tracking system.

## Usage

**Web browser:**

* `bower install cherrytech-event-tracking-js-sdk --save`.

* Asynchronously load library using contents of built `loader.min.js` placed in `<head>`.

* Synchronously load built `tracking.min.js` that exposes `CherryTechEventTracking` global object.

* `npm install cherrytech-event-tracking-js-sdk --save` to use in custom build process. _NOTE_: Building for web browser requires transforming this CommonJS package into browser friendly one, e.g. using [Browserify](http://browserify.org/).

**Node.js:**
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
* To prepare for distribution `npm run distribute -- --bump=[major, minor, patch]`. _NOTE_: Application will not be rebuilt automatically.
* Follow [commit messages guide line](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).
* Package follows [Semantic Versioning](http://semver.org/) rules.
