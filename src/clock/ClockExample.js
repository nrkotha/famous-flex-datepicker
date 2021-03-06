/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2015
 */

/*global define, console*/
/*eslint no-use-before-define:0, no-console:0 */

define(function(require, exports, module) {

    // import dependencies
    require('./styles.css');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var RenderNode = require('famous/core/RenderNode');
    var DatePicker = require('famous-flex/widgets/DatePicker');
    var Timer = require('famous/utilities/Timer');
    var LayoutController = require('famous-flex/LayoutController');
    var ProportionalLayout = require('famous-flex/layouts/ProportionalLayout');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');

    function ClockExample(options) {
        View.apply(this, arguments);

        _createBack.call(this);
        _createSeparators.call(this);
        _createDatePicker.call(this);
    }
    ClockExample.prototype = Object.create(View.prototype);
    ClockExample.prototype.constructor = ClockExample;

    ClockExample.DEFAULT_OPTIONS = {
        sizeRatios: [1.3, 1, 1.3]
    };

    function _createDatePicker() {
        this.datePicker = new DatePicker({
            date: new Date(),
            wheelLayout: {
                itemSize: 80,
                diameter: 200,
                radialOpacity: -1
            },
            scrollController: {
                enabled: false
            },
            classes: ['clock'],
            createRenderables: {
                middle: function() {
                    return this.separators;
                }.bind(this)
            }
        });
        this.datePicker.setComponents([
            new DatePicker.Component.Hour({sizeRatio: this.options.sizeRatios[0]}),
            new DatePicker.Component.Minute({sizeRatio: this.options.sizeRatios[1]}),
            new DatePicker.Component.Second({sizeRatio: this.options.sizeRatios[2]})
        ]);
        this.add(this.datePicker);

        // Update click every second
        var lastSecond = (new Date()).getSeconds();
        var newSecond;
        Timer.every(function() {
            newSecond = (new Date()).getSeconds();
            if (newSecond !== lastSecond) {
                lastSecond = newSecond;
                this.datePicker.setDate(new Date());
            }
        }.bind(this), 1);
    }

    function _createBack() {
        this.back = new Surface({
            classes: ['clock', 'background']
        });
        var mod = new Modifier({
            transform: Transform.translate(0, 0, -1000)
        });
        this.add(mod).add(this.back);
    }

    function _createSeparators() {
        var separator1 = new Surface({
            classes: ['clock-separator', 'clock-separator-1'],
            content: ':'
        });
        var separator2 = new Surface({
            classes: ['clock-separator', 'clock-separator-2'],
            content: ':'
        });
        this.separators = new LayoutController({
            layout: ProportionalLayout,
            layoutOptions: {
                ratios: this.options.sizeRatios
            },
            direction: 0,
            dataSource: [
                separator1,
                new RenderNode(),
                separator2
            ]
        });
    }

    module.exports = ClockExample;
});
