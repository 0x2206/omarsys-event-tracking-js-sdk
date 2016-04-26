'use strict';

(function () {
    window.__ctet.plugins.loadScript = loadScript;

    function loadScript(src, callback) {
        var doc = document,
            script = doc.createElement('script');

        script.type = 'text/javascript';
        script.async = true;

        if (!callback || 'function' != typeof callback) {
            callback = null;
        }

        if (undefined !== script.onreadystatechange) {
            script.onreadystatechange = function () {
                if (4 === this.readyState || 'complete' === this.readyState || 'loaded' === this.readyState) {
                    invokeCallback();
                    removeScript();
                }
            };
        } else {
            script.onload = function () {
                invokeCallback();
                removeScript();
            };

            script.onerror = removeScript;
        }

        script.src = src;
        doc.getElementsByTagName('head')[0].appendChild(script);

        function invokeCallback() {
            if (callback) {
                callback();
                callback = null;
            }
        }

        function removeScript() {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
                script = null;
            }
        }
    }
})();
