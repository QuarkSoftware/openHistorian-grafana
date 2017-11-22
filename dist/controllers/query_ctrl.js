'use strict';

System.register(['app/plugins/sdk', './../js/constants.js', './../css/query-editor.css!', 'lodash'], function (_export, _context) {
    "use strict";

    var QueryCtrl, FunctionList, Booleans, AngleUnits, TimeUnits, WhereOperators, _, _createClass, OpenHistorianDataSourceQueryCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            QueryCtrl = _appPluginsSdk.QueryCtrl;
        }, function (_jsConstantsJs) {
            FunctionList = _jsConstantsJs.FunctionList;
            Booleans = _jsConstantsJs.Booleans;
            AngleUnits = _jsConstantsJs.AngleUnits;
            TimeUnits = _jsConstantsJs.TimeUnits;
            WhereOperators = _jsConstantsJs.WhereOperators;
        }, function (_cssQueryEditorCss) {}, function (_lodash) {
            _ = _lodash.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('OpenHistorianDataSourceQueryCtrl', OpenHistorianDataSourceQueryCtrl = function (_QueryCtrl) {
                _inherits(OpenHistorianDataSourceQueryCtrl, _QueryCtrl);

                function OpenHistorianDataSourceQueryCtrl($scope, $injector, uiSegmentSrv, templateSrv, $compile) {
                    _classCallCheck(this, OpenHistorianDataSourceQueryCtrl);

                    var _this = _possibleConstructorReturn(this, (OpenHistorianDataSourceQueryCtrl.__proto__ || Object.getPrototypeOf(OpenHistorianDataSourceQueryCtrl)).call(this, $scope, $injector));

                    _this.scope = $scope;
                    _this.compile = $compile;

                    var ctrl = _this;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    _this.target.target = '';
                    _this.target.textEditor = false;
                    _this.segments = _this.target.segments == undefined ? [] : _this.target.segments.map(function (a) {
                        return ctrl.uiSegmentSrv.newSegment({ value: a.text, expandable: true });
                    });
                    _this.queryTypes = ["Element List", "Filter Expression" /*, "Phasor List"*/
                    ];
                    _this.queryType = _this.target.queryType == undefined ? "Element List" : _this.target.queryType;
                    _this.wheres = _this.target.wheres == undefined ? [] : _this.target.wheres.map(function (a) {
                        if (a.type == 'operator') return ctrl.uiSegmentSrv.newOperator(a.text);else if (a.type == 'condition') return ctrl.uiSegmentSrv.newCondition(a.text);else return ctrl.uiSegmentSrv.newSegment(a.value);
                    });
                    _this.functionSegments = _this.target.functionSegments == undefined ? [] : _this.target.functionSegments;
                    _this.topNSegment = _this.target.topNSegment == undefined ? null : _this.target.topNSegment;
                    _this.functions = [];
                    _this.orderBys = _this.target.orderBys == undefined ? [] : _this.target.orderBys.map(function (a) {
                        if (a.type == 'condition') return ctrl.uiSegmentSrv.newCondition(a.value);else return ctrl.uiSegmentSrv.newSegment(a.value);
                    });
                    _this.elementSegment = _this.uiSegmentSrv.newPlusButton();
                    _this.whereSegment = _this.uiSegmentSrv.newPlusButton();
                    _this.filterSegment = _this.target.filterSegment == undefined ? _this.uiSegmentSrv.newSegment('ActiveMeasurement') : _this.uiSegmentSrv.newSegment(_this.target.filterSegment.value);
                    _this.orderBySegment = _this.uiSegmentSrv.newPlusButton();
                    _this.functionSegment = _this.uiSegmentSrv.newPlusButton();

                    _this.phasorSegment = _this.uiSegmentSrv.newPlusButton();
                    _this.phasorSegments = _this.target.phasorSegments == undefined ? [] : _this.target.phasorSegments.map(function (a) {
                        return ctrl.uiSegmentSrv.newSegment({ value: a.text, expandable: true });
                    });
                    _this.typingTimer;

                    _this.target.unwrapPhasorAngle = _this.target.unwrapPhasorAngle == undefined ? false : _this.target.unwrapPhasorAngle;
                    _this.target.labelPhasor = _this.target.labelPhasor == undefined ? true : _this.target.labelPhasor;

                    _this.phasorList = _this.target.phasorList == undefined ? [] : _this.target.phasorList;

                    ctrl.target.overriddenDataFlags = ctrl.target.overriddenDataFlags != undefined ? ctrl.target.overriddenDataFlags : ctrl.datasource.dataFlags;

                    ctrl.target.queryOptions = {};

                    _this.buildFunctionArray();

                    if (_this.queryType == 'Filter Expression') _this.setTargetWithQuery();else if (_this.queryType == 'Phasor List') _this.setTargetWithPhasors();else _this.setTargetWithElements();

                    $('panel-editor-tab .gf-form-group .gf-form-inline a.gf-form-label:contains("Options")').on('click', function (event) {
                        if ($($('panel-editor-tab .gf-form-group div')[6]).children().first()[0] != $('query-troubleshooter')[0]) {
                            var string = '<query-options flags="ctrl.target.overriddenDataFlags" return="ctrl.target.queryOptions"></query-options>';
                            $($('panel-editor-tab .gf-form-group div')[6]).children().first().append(ctrl.compile(string)(ctrl.scope));
                        }
                    });

                    return _this;
                }

                // ran on dom creation


                _createClass(OpenHistorianDataSourceQueryCtrl, [{
                    key: 'link',
                    value: function link(scope, elem, attr, ctrl) {
                        console.log('link');
                    }
                }, {
                    key: 'setTargetWithQuery',
                    value: function setTargetWithQuery() {
                        if (this.wheres.length == 0) return;
                        var filter = this.filterSegment.value + ' ';
                        var topn = this.topNSegment ? 'TOP ' + this.topNSegment + ' ' : '';
                        var where = 'WHERE ';

                        _.each(this.wheres, function (element, index, list) {
                            where += element.value + ' ';
                        });

                        var orderby = '';
                        _.each(this.orderBys, function (element, index, list) {
                            orderby += (index == 0 ? 'ORDER BY ' : '') + element.value + (element.type == 'condition' && index < list.length - 1 ? ',' : '') + ' ';
                        });

                        var query = 'FILTER ' + topn + filter + where + orderby;
                        var functions = '';

                        _.each(this.functions, function (element, index, list) {
                            if (element.value == 'QUERY') functions += query;else functions += element.value;
                        });

                        this.target.target = functions != "" ? functions : query;
                        this.target.topNSegment = this.topNSegment;
                        this.target.filterSegment = this.filterSegment;
                        this.target.orderBys = this.orderBys;
                        this.target.wheres = this.wheres;
                        this.target.functionSegments = this.functionSegments;
                        this.target.queryType = this.queryType;
                        this.panelCtrl.refresh();
                    }
                }, {
                    key: 'setTargetWithElements',
                    value: function setTargetWithElements() {
                        var functions = '';
                        var ctrl = this;
                        _.each(ctrl.functions, function (element, index, list) {
                            if (element.value == 'QUERY') functions += ctrl.segments.map(function (a) {
                                if (ctrl.datasource.templateSrv.variableExists(a.text)) {
                                    return ctrl.datasource.templateSrv.replaceWithText(a.text);
                                } else return a.value;
                            }).join(';');else if (ctrl.datasource.templateSrv.variableExists(element.value)) functions += ctrl.datasource.templateSrv.replaceWithText(element.text);else functions += element.value;
                        });

                        ctrl.target.target = functions != "" ? functions : ctrl.segments.map(function (a) {
                            if (ctrl.datasource.templateSrv.variableExists(a.text)) {
                                return ctrl.datasource.templateSrv.replaceWithText(a.text);
                            } else return a.value;
                        }).join(';');

                        ctrl.target.functionSegments = ctrl.functionSegments;
                        ctrl.target.segments = ctrl.segments;
                        ctrl.target.queryType = ctrl.queryType;
                        ctrl.panelCtrl.refresh();
                    }
                }, {
                    key: 'setTargetWithPhasors',
                    value: function setTargetWithPhasors() {
                        var ctrl = this;

                        var phasors = [];
                        _.each(ctrl.phasorSegments, function (element, index, list) {
                            var phasor = _.find(ctrl.phasorList, function (o) {
                                return o.text.m_Item1 == element.value;
                            });

                            var string = "";
                            if (ctrl.target.labelPhasor) string += "Label(" + phasor.text.m_Item1 + "-Mag,";

                            string += phasor.text.m_Item2;
                            string += ctrl.target.labelPhasor ? ")" : '';
                            string += ";";

                            if (ctrl.target.labelPhasor) string += "Label(" + phasor.text.m_Item1 + "-Angle,";

                            if (ctrl.target.unwrapPhasorAngle) string += "Unwrap(";

                            string += phasor.text.m_Item3;
                            string += ctrl.target.unwrapPhasorAngle ? ")" : '';
                            string += ctrl.target.labelPhasor ? ")" : '';

                            phasors.push(string);
                        });

                        ctrl.target.target = phasors.join(';');

                        ctrl.target.phasorSegments = this.phasorSegments;
                        ctrl.target.phasorList = this.phasorList;
                        ctrl.target.queryType = this.queryType;
                        ctrl.panelCtrl.refresh();
                    }
                }, {
                    key: 'onChangeInternal',
                    value: function onChangeInternal() {
                        this.panelCtrl.refresh(); // Asks the panel to refresh data.
                    }
                }, {
                    key: 'toggleEditorMode',
                    value: function toggleEditorMode() {
                        this.target.textEditor = !this.target.textEditor;
                    }
                }, {
                    key: 'textEditorChanged',
                    value: function textEditorChanged() {
                        this.panelCtrl.refresh(); // Asks the panel to refresh data.
                    }
                }, {
                    key: 'changeQueryType',
                    value: function changeQueryType() {
                        this.target.target = '';
                        this.segments = [];
                        this.wheres = [];
                        this.functions = [];
                        this.functionSegments = [];
                        this.orderBys = [];
                        this.topNSegment = '';
                        this.phasorSegments = [];
                        this.phasorSegment = this.uiSegmentSrv.newPlusButton();
                        this.elementSegment = this.uiSegmentSrv.newPlusButton();
                        this.whereSegment = this.uiSegmentSrv.newPlusButton();
                        this.filterSegment = this.uiSegmentSrv.newSegment('ActiveMeasurements');
                        this.orderBySegment = this.uiSegmentSrv.newPlusButton();
                        this.functionSegment = this.uiSegmentSrv.newPlusButton();
                        this.panelCtrl.refresh();
                    }
                }, {
                    key: 'getElementSegments',
                    value: function getElementSegments(newSegment) {
                        var ctrl = this;
                        var option = null;
                        if (event.target.value != "") option = event.target.value;

                        return this.datasource.metricFindQuery(option).then(function (data) {
                            var altSegments = _.map(data, function (item) {
                                return ctrl.uiSegmentSrv.newSegment({ value: item.text, expandable: item.expandable });
                            });
                            altSegments.sort(function (a, b) {
                                if (a.value < b.value) return -1;
                                if (a.value > b.value) return 1;
                                return 0;
                            });

                            _.each(ctrl.datasource.templateSrv.variables, function (item, index, list) {
                                if (item.type == "query") altSegments.unshift(ctrl.uiSegmentSrv.newCondition('$' + item.name));
                            });

                            if (!newSegment) altSegments.unshift(ctrl.uiSegmentSrv.newSegment('-REMOVE-'));

                            return _.filter(altSegments, function (segment) {
                                return _.find(ctrl.segments, function (x) {
                                    return x.value == segment.value;
                                }) == undefined;
                            });
                        });
                    }
                }, {
                    key: 'addElementSegment',
                    value: function addElementSegment() {
                        // if value is not empty, add new attribute segment
                        if (event.target.text != null) {
                            this.segments.push(this.uiSegmentSrv.newSegment({ value: event.target.text, expandable: true }));
                            this.setTargetWithElements();
                        }

                        // reset the + button
                        var plusButton = this.uiSegmentSrv.newPlusButton();
                        this.elementSegment.value = plusButton.value;
                        this.elementSegment.html = plusButton.html;
                        this.panelCtrl.refresh();
                    }
                }, {
                    key: 'segmentValueChanged',
                    value: function segmentValueChanged(segment, index) {
                        if (segment.value == "-REMOVE-") {
                            var targets = this.target.target.split(';');
                            this.segments.splice(index, 1);
                            targets.splice(index, 1);
                            this.target.target = targets.join(';');
                        } else {
                            var targets = this.target.target.split(';');
                            this.segments[index] = segment;
                            targets[index] = segment.value;
                            this.target.target = targets.join(';');
                        }
                    }
                }, {
                    key: 'getPhasorSegmentsToEdit',
                    value: function getPhasorSegmentsToEdit() {
                        var ctrl = this;
                        var option = null;
                        if (event.target.value != "") option = event.target.value;

                        var ctrl = this;
                        return this.datasource.phasorFindQuery(option).then(function (data) {
                            ctrl.phasorList = JSON.parse(JSON.stringify(data));

                            var altSegments = _.map(data, function (item) {
                                return ctrl.uiSegmentSrv.newSegment({ value: item.text.m_Item1, expandable: item.expandable });
                            });
                            altSegments.sort(function (a, b) {
                                if (a.value < b.value) return -1;
                                if (a.value > b.value) return 1;
                                return 0;
                            });

                            altSegments.unshift(ctrl.uiSegmentSrv.newSegment('-REMOVE-'));

                            return _.filter(altSegments, function (segment) {
                                return _.find(ctrl.phasorSegments, function (x) {
                                    return x.value == segment.value;
                                }) == undefined;
                            });
                        });
                    }
                }, {
                    key: 'getPhasorSegmentsToAddNew',
                    value: function getPhasorSegmentsToAddNew() {
                        var ctrl = this;
                        var option = null;

                        if (event.target.value != "") option = event.target.value;
                        return this.datasource.phasorFindQuery(option).then(function (data) {
                            ctrl.phasorList = JSON.parse(JSON.stringify(data));

                            var altSegments = _.map(data, function (item) {
                                return ctrl.uiSegmentSrv.newSegment({ value: item.text.m_Item1, expandable: item.expandable });
                            });
                            altSegments.sort(function (a, b) {
                                if (a.value < b.value) return -1;
                                if (a.value > b.value) return 1;
                                return 0;
                            });

                            return _.filter(altSegments, function (segment) {
                                return _.find(ctrl.phasorSegments, function (x) {
                                    return x.value == segment.value;
                                }) == undefined;
                            });
                        });
                    }
                }, {
                    key: 'addPhasorSegment',
                    value: function addPhasorSegment() {
                        // if value is not empty, add new attribute segment
                        if (event.target.text != null) {
                            this.phasorSegments.push(this.uiSegmentSrv.newSegment({ value: event.target.text, expandable: true }));
                            this.setTargetWithPhasors();
                        }

                        // reset the + button
                        var plusButton = this.uiSegmentSrv.newPlusButton();
                        this.phasorSegment.value = plusButton.value;
                        this.phasorSegment.html = plusButton.html;
                        this.panelCtrl.refresh();
                    }
                }, {
                    key: 'phasorValueChanged',
                    value: function phasorValueChanged(segment, index) {
                        if (segment.value == "-REMOVE-") {
                            this.phasorSegments.splice(index, 1);
                        } else {
                            this.phasorSegments[index] = segment;
                        }

                        this.setTargetWithPhasors();
                    }
                }, {
                    key: 'topNValueChanged',
                    value: function topNValueChanged() {
                        var ctrl = this;

                        clearTimeout(ctrl.typingTimer);
                        ctrl.typingTimer = setTimeout(function () {
                            ctrl.setTargetWithQuery();
                        }, 1000);
                        event.target.focus();
                    }
                }, {
                    key: 'getWheresToEdit',
                    value: function getWheresToEdit(where, index) {
                        var _this2 = this;

                        if (where.type === 'operator') {
                            return Promise.resolve(this.uiSegmentSrv.newOperators(WhereOperators));
                        } else if (where.type === 'value') {
                            return Promise.resolve(null);
                        } else if (where.type === 'condition') {
                            return Promise.resolve([this.uiSegmentSrv.newCondition('AND'), this.uiSegmentSrv.newCondition('OR')]);
                        } else {
                            return this.datasource.whereFindQuery(this.filterSegment.value).then(function (data) {
                                var altSegments = _.map(data, function (item) {
                                    return _this2.uiSegmentSrv.newSegment({ value: item.text, expandable: item.expandable });
                                });
                                altSegments.sort(function (a, b) {
                                    if (a.value < b.value) return -1;
                                    if (a.value > b.value) return 1;
                                    return 0;
                                });
                                altSegments.unshift(_this2.uiSegmentSrv.newSegment('-REMOVE-'));
                                return _.filter(altSegments, function (segment) {
                                    return _.find(_this2.segments, function (x) {
                                        return x.value == segment.value;
                                    }) == undefined;
                                });
                            });
                        }
                    }
                }, {
                    key: 'whereValueChanged',
                    value: function whereValueChanged(where, index) {

                        if (where.value == "-REMOVE-") {
                            if (index == 0 && this.wheres.length > 3 && this.wheres[index + 3].type == 'condition') this.wheres.splice(index, 4);else if (index > 0 && this.wheres[index - 1].type == 'condition') this.wheres.splice(index - 1, 4);else this.wheres.splice(index, 3);
                        }

                        if (where.type == 'operator') this.wheres[index] = this.uiSegmentSrv.newOperator(where.value);else if (where.type == 'condition') this.wheres[index] = this.uiSegmentSrv.newCondition(where.value);

                        this.setTargetWithQuery();
                    }
                }, {
                    key: 'getWheresToAddNew',
                    value: function getWheresToAddNew() {
                        var ctrl = this;
                        return this.datasource.whereFindQuery(ctrl.filterSegment.value).then(function (data) {
                            var altSegments = _.map(data, function (item) {
                                return ctrl.uiSegmentSrv.newSegment({ value: item.text, expandable: item.expandable });
                            });
                            altSegments.sort(function (a, b) {
                                if (a.value < b.value) return -1;
                                if (a.value > b.value) return 1;
                                return 0;
                            });
                            return _.filter(altSegments, function (segment) {
                                return _.find(ctrl.segments, function (x) {
                                    return x.value == segment.value;
                                }) == undefined;
                            });
                        });
                    }
                }, {
                    key: 'addWhere',
                    value: function addWhere() {
                        if (this.wheres.length > 0) this.wheres.push(this.uiSegmentSrv.newCondition('AND'));

                        this.wheres.push(this.uiSegmentSrv.newSegment(event.target.text));
                        this.wheres.push(this.uiSegmentSrv.newOperator('NOT LIKE'));
                        this.wheres.push(this.uiSegmentSrv.newFake("''", 'value', 'query-segment-value'));

                        // reset the + button
                        var plusButton = this.uiSegmentSrv.newPlusButton();
                        this.whereSegment.value = plusButton.value;
                        this.whereSegment.html = plusButton.html;
                        this.setTargetWithQuery();
                    }
                }, {
                    key: 'getFilterToEdit',
                    value: function getFilterToEdit() {
                        var ctrl = this;
                        return this.datasource.filterFindQuery().then(function (data) {
                            var altSegments = _.map(data, function (item) {
                                return ctrl.uiSegmentSrv.newSegment({ value: item.text, expandable: item.expandable });
                            });
                            altSegments.sort(function (a, b) {
                                if (a.value < b.value) return -1;
                                if (a.value > b.value) return 1;
                                return 0;
                            });

                            return _.filter(altSegments, function (segment) {
                                return _.find(ctrl.segments, function (x) {
                                    return x.value == segment.value;
                                }) == undefined;
                            });
                        });
                    }
                }, {
                    key: 'filterValueChanged',
                    value: function filterValueChanged() {
                        //this.target.policy = this.topNSegment;
                        this.orderBySegment = this.uiSegmentSrv.newPlusButton();
                        this.wheres = [];
                        this.setTargetWithQuery();

                        this.panelCtrl.refresh();
                    }
                }, {
                    key: 'getOrderBysToAddNew',
                    value: function getOrderBysToAddNew() {
                        var ctrl = this;
                        return this.datasource.orderByFindQuery(ctrl.filterSegment.value).then(function (data) {
                            var altSegments = _.map(data, function (item) {
                                return ctrl.uiSegmentSrv.newSegment({ value: item.text, expandable: item.expandable });
                            });
                            altSegments.sort(function (a, b) {
                                if (a.value < b.value) return -1;
                                if (a.value > b.value) return 1;
                                return 0;
                            });

                            return _.filter(altSegments, function (segment) {
                                return _.find(ctrl.orderBys, function (x) {
                                    return x.value == segment.value;
                                }) == undefined;
                            });
                        });
                    }
                }, {
                    key: 'getOrderBysToEdit',
                    value: function getOrderBysToEdit(orderBy) {
                        var _this3 = this;

                        var ctrl = this;
                        if (orderBy.type == 'condition') return Promise.resolve([this.uiSegmentSrv.newCondition('ASC'), this.uiSegmentSrv.newCondition('DESC')]);
                        if (orderBy.type == 'condition') return Promise.resolve([this.uiSegmentSrv.newCondition('ASC'), this.uiSegmentSrv.newCondition('DESC')]);

                        return this.datasource.orderByFindQuery(ctrl.filterSegment.value).then(function (data) {
                            var altSegments = _.map(data, function (item) {
                                return ctrl.uiSegmentSrv.newSegment({ value: item.text, expandable: item.expandable });
                            });
                            altSegments.sort(function (a, b) {
                                if (a.value < b.value) return -1;
                                if (a.value > b.value) return 1;
                                return 0;
                            });

                            if (orderBy.type !== 'plus-button') altSegments.unshift(_this3.uiSegmentSrv.newSegment('-REMOVE-'));

                            return _.filter(altSegments, function (segment) {
                                return _.find(ctrl.orderBys, function (x) {
                                    return x.value == segment.value;
                                }) == undefined;
                            });
                        });
                    }
                }, {
                    key: 'addOrderBy',
                    value: function addOrderBy() {
                        this.orderBys.push(this.uiSegmentSrv.newSegment(event.target.text));
                        this.orderBys.push(this.uiSegmentSrv.newCondition('ASC'));

                        // reset the + button
                        var plusButton = this.uiSegmentSrv.newPlusButton();
                        this.orderBySegment.value = plusButton.value;
                        this.orderBySegment.html = plusButton.html;

                        this.setTargetWithQuery();

                        if (this.queryType == 'Filter Expression') this.setTargetWithQuery();else this.setTargetWithElements();
                    }
                }, {
                    key: 'orderByValueChanged',
                    value: function orderByValueChanged(orderBy, index) {
                        if (event.target.text == "-REMOVE-") this.orderBys.splice(index, 2);else {
                            if (orderBy.type == 'condition') this.orderBys[index] = this.uiSegmentSrv.newCondition(event.target.text);else this.orderBys[index] = this.uiSegmentSrv.newSegment(event.target.text);
                        }
                        this.setTargetWithQuery();
                    }
                }, {
                    key: 'getFunctionsToAddNew',
                    value: function getFunctionsToAddNew() {
                        var _this4 = this;

                        var ctrl = this;
                        var array = [];
                        _.each(Object.keys(FunctionList), function (element, index, list) {
                            array.push(ctrl.uiSegmentSrv.newSegment(element));
                        });

                        if (this.functions.length == 0) array = array.slice(2, array.length);

                        return Promise.resolve(_.filter(array, function (segment) {
                            return _.find(_this4.functions, function (x) {
                                return x.value == segment.value;
                            }) == undefined;
                        }));
                    }
                }, {
                    key: 'getFunctionsToEdit',
                    value: function getFunctionsToEdit(func, index) {
                        var ctrl = this;
                        var remove = [this.uiSegmentSrv.newSegment('-REMOVE-')];
                        if (func.type == 'Operator') return Promise.resolve();else if (func.value == 'Set') return Promise.resolve(remove);

                        return Promise.resolve(remove);
                    }
                }, {
                    key: 'functionValueChanged',
                    value: function functionValueChanged(func, index) {
                        var funcSeg = FunctionList[func.Function];

                        if (func.value == "-REMOVE-") {
                            var l = 1;
                            var fi = _.findIndex(this.functionSegments, function (segment) {
                                return segment.Function == func.Function;
                            });
                            if (func.Function == 'Slice') this.functionSegments[fi + 1].Parameters = this.functionSegments[fi + 1].Parameters.slice(1, this.functionSegments[fi + 1].Parameters.length);else if (fi > 0 && (this.functionSegments[fi - 1].Function == 'Set' || this.functionSegments[fi - 1].Function == 'Slice')) {
                                --fi;
                                ++l;
                            }

                            this.functionSegments.splice(fi, l);
                        } else if (func.Type != 'Function') {
                            var fi = _.findIndex(this.functionSegments, function (segment) {
                                return segment.Function == func.Function;
                            });
                            this.functionSegments[fi].Parameters[func.Index].Default = func.value;
                        }

                        this.buildFunctionArray();

                        if (this.queryType == 'Filter Expression') this.setTargetWithQuery();else this.setTargetWithElements();
                    }
                }, {
                    key: 'addFunctionSegment',
                    value: function addFunctionSegment() {
                        var func = FunctionList[event.target.text];

                        if (func.Function == 'Slice') {
                            this.functionSegments[0].Parameters.unshift(func.Parameters[0]);
                        }

                        this.functionSegments.unshift(JSON.parse(JSON.stringify(func)));
                        this.buildFunctionArray();

                        // reset the + button
                        var plusButton = this.uiSegmentSrv.newPlusButton();
                        this.functionSegment.value = plusButton.value;
                        this.functionSegment.html = plusButton.html;

                        if (this.queryType == 'Filter Expression') this.setTargetWithQuery();else this.setTargetWithElements();
                    }
                }, {
                    key: 'buildFunctionArray',
                    value: function buildFunctionArray() {
                        var ctrl = this;
                        ctrl.functions = [];

                        if (this.functionSegments.length == 0) return;

                        _.each(ctrl.functionSegments, function (element, index, list) {
                            var newElement = ctrl.uiSegmentSrv.newSegment(element.Function);
                            newElement.Type = 'Function';
                            newElement.Function = element.Function;

                            ctrl.functions.push(newElement);

                            if (newElement.value == 'Set' || newElement.value == 'Slice') return;

                            var operator = ctrl.uiSegmentSrv.newOperator('(');
                            operator.Type = 'Operator';
                            ctrl.functions.push(operator);

                            _.each(element.Parameters, function (param, i, j) {
                                var d = ctrl.uiSegmentSrv.newFake(param.Default.toString());
                                d.Type = param.Type;
                                d.Function = element.Function;
                                d.Description = param.Description;
                                d.Index = i;
                                ctrl.functions.push(d);

                                var operator = ctrl.uiSegmentSrv.newOperator(',');
                                operator.Type = 'Operator';
                                ctrl.functions.push(operator);
                            });
                        });

                        var query = ctrl.uiSegmentSrv.newCondition('QUERY');
                        query.Type = 'Query';
                        ctrl.functions.push(query);

                        for (var i in ctrl.functionSegments) {
                            if (ctrl.functionSegments[i].Function != 'Set' && ctrl.functionSegments[i].Function != 'Slice') {
                                var operator = ctrl.uiSegmentSrv.newOperator(')');
                                operator.Type = 'Operator';
                                ctrl.functions.push(operator);
                            }
                        }
                    }
                }, {
                    key: 'getBooleans',
                    value: function getBooleans() {
                        var _this5 = this;

                        return Promise.resolve(Booleans.map(function (value) {
                            return _this5.uiSegmentSrv.newSegment(value);
                        }));
                    }
                }, {
                    key: 'getAngleUnits',
                    value: function getAngleUnits() {
                        var _this6 = this;

                        return Promise.resolve(AngleUnits.map(function (value) {
                            return _this6.uiSegmentSrv.newSegment(value);
                        }));
                    }
                }, {
                    key: 'getTimeSelect',
                    value: function getTimeSelect() {
                        var _this7 = this;

                        return Promise.resolve(TimeUnits.map(function (value) {
                            return _this7.uiSegmentSrv.newSegment(value);
                        }));
                    }
                }, {
                    key: 'inputChange',
                    value: function inputChange(func, index) {
                        var ctrl = this;
                        clearTimeout(this.typingTimer);
                        this.typingTimer = setTimeout(function () {
                            ctrl.functionValueChanged(func, index);
                        }, 1000);
                        event.target.focus();
                    }
                }]);

                return OpenHistorianDataSourceQueryCtrl;
            }(QueryCtrl));

            _export('OpenHistorianDataSourceQueryCtrl', OpenHistorianDataSourceQueryCtrl);

            OpenHistorianDataSourceQueryCtrl.templateUrl = 'partial/query.editor.html';
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map
