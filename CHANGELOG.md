<a name="1.1.0"></a>
# Release 1.1.0 (2016-07-19)

## Bug fixes

- NOM-2136 fix(util): isEmpty() no longer treating Date as empty  (1ac992f)

## Features

- NOM-2136 feat(Tracker): Allow for empty uid  (e93631c)

## Tests

- NOM-2136 test(): increase coverage thresholds  (7ba4523)

## Chores

- NOM-2136 chore(): fix Karma throwing an error  (0dea740)
- NOM-2136 chore(): bump ct-distribute to the latest available  (aede6f9)


<a name="1.0.1"></a>
# Release 1.0.1 (2015-12-21)

## Chores

- NOM-1734 chore(distribute): use extracted to separate module ct-distribute  (a6eabbd)

## Unclassified

- Replace node-uuid with uuid and fix cookies  (ac51135)
- Replace browserify with webpack  (7b7e7fe)
- Replace cookie-cutter with browser-cookies  (3f27cb7)


<a name="1.0.0"></a>
# Release 1.0.0 (2015-09-10)

## Breaking changes

- NOM-1734 refactor(Tracking, Tracker, loader): move configuration of API endpoint from build to runtime phase  (09f07c8)

    Build script does not replace endpoint placeholder anymore and it is undefined by default, hence runtime configuration is expected to take place:

    1. To be able to use Tracker it's API endpoint has to be configured before sending first event. Tracking#createTracker() has been enhanced to accept second parameter containing Tracker compatible configuration object.

    2. Loader snippet expects 3 parameters now: list of trackers, URL used to load full tracking lib and tracking API endpoint.


## Bug fixes

- fix(Tracker): allow to pass empty object as an event payload  (92ee6c1)
- NOM-1690 fix(Tracker): use unified API endpoint  (f47bc99)
- NOM-1588 fix(util): handle new String(), new Number() and new Boolean() correctly  (696ca79)

## Features

- NOM-1665 feat(Tracker, loader): allow to configure API endpoint on build  (98ba698)
- NOM-1588 feat(Tracking): add async tracking library loader  (fb085e8)
- NOM-1588 feat(Tracker): minimise sending of `uid` and `identity` object to not flood web services unnecessarily  (d88d29a)
- NOM-1588 feat(Tracker): add Tracker#trackPageView()  (77715a0)

    Tracker#trackPageView() is a syntactic sugar over Tracker#track() that uses predefined event name. Event name can be changed using Tracker#configure()
- NOM-1588 feat(Tracker): evaluate JavaScript code returned by web services  (a05b229)
- NOM-1588 feat(Tracker): add Tracker#identify()  (5e9988f)

    Tracker#identify() purpose is to send unique identifier and optional custom user related payload of identification data on every request to allow binding it with cookie on web services side
- NOM-1588 feat(Tracker): add Tracker#configure()  (1ac7a6f)
- NOM-1588 feat(Tracking, Tracker): add Tracking#createTracker() factory function and Tracker#track()  (7b9077f)

## Tests

- NOM-1666 test(Tracker): add axios-mock to improve XHR responses faking axios-mock automatically returns resolved Promise with configured data payload  (ff258cf)
- NOM-1588 test(Tracker): fix whitelisted params test when invoking Tracker#configure()  (0b60aae)

## Documentation changes

- NOM-1734 docs(): fix Markdown formatting  (17b7d71)
- NOM-1588 docs(Tracking, util): update inline docs  (e0a27e5)

## Chores
- NOM-1734 chore(distribute): extract message templates into dedicated functions  (a81aac5)
- NOM-1734 chore(distribute): add unix newline char when writing bower.json  (6d9fadf)
- NOM-1734 chore(build): lint bin/* files as well  (ee90003)
- NOM-1734 chore(build): force strict mode for replacer  (2a9081e)
- NOM-1734 chore(distribute): add distribution helper script and make app Bower friendly  (6ae8a71)
- NOM-1668 chore(test): run tests on pre-push  (7dc052e)
- NOM-1667 chore(test): generate JUnit reports when running tests  (f1084bb)
- NOM-1664 chore(test): test coverage now works with Browserify  (c143d0e)
- NOM-1588 chore(test): fix typos and rephrase test descriptions  (78a7947)
- NOM-1588 chore(build, dependencies): remove mistakenly left Gruntfile and get rid of Bower  (b899e56)
- NOM-1588 chore(build): build using Browserify and remove Grunt as it's not needed now  (961cee2)
- NOM-1588 chore(linter): replace JSHint with ESLint  (e5a06ac)

## Code refactoring
- NOM-1588 refactor(Tracker): use more generic name for prefixing function  (d9418ab)
- NOM-1588 refactor(Tracker): simplify `if` tests and make Tracker#identity empty object as default  (ed5241a)
- NOM-1588 refactor(main): use CherryTechEventTracking instead of CherrytechEventTracking for globally exposed object  (fa52f5e)
