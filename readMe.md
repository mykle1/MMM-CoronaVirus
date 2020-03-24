## MMM-CoronaVirus

* A lite version. Simply stats.
* Top line = world total stats
* Middle line = User chooses a country that is always displayed
* Bottom line = A rotation of all countries

* Alternately, you can show just one, any two, or all three lines by simple css rule

## Examples

![](images/2.png)

* Click image above for life-size view

## Installation

* `git clone https://github.com/mykle1/MMM-CoronaVirus` into the `~/MagicMirror/modules` directory.

* Annotated .css file included for your convenience.

## Config.js entry and options
```
{
  disabled: false,
  module: 'MMM-CoronaVirus',
  position: 'bottom bar',
  config: {
    country: "USA",             // Choose a country to always be shown (eg. UK, Germany, France , etc.)
    useHeader: false,           // False if you don't want a header
    header: "",                 // Any text you want. useHeader must be true
    rotateInterval: 45 * 1000,  // in ms. Switch to next country in rotation
          }
},
```

## Special thanks to cowboysdude for continuous support and wizardry
