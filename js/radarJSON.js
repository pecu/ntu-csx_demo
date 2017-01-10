var chart = {
    "_type": {
        "location": "server",
        "name": "chart"
    },
    "owner": 1042,
    "key": 10861,
    "permission": {
        "list": [{
            "perm": "fork",
            "type": "global",
            "target": null,
            "username": "and anonymous user",
            "displayname": "Everyone"
        }, {
            "perm": "write",
            "type": "token",
            "target": "1iwfkeg96y",
            "username": "token",
            "displayname": "1iwfkeg96y"
        }],
        "switch": "publish"
    },
    "name": "雷達圖",
    "theme": null,
    "parent": 1020,
    "description": "a standard, multiple radar chart",
    "basetype": ["6"],
    "visualencoding": ["2", "5"],
    "category": ["1", "5"],
    "tags": ["weather", "temperature", "circular", "cycle", "period"],
    "likes": null,
    "searchable": true,
    "doc": {
        "name": "document",
        "size": 0,
        "type": "html",
        "lines": 1,
        "content": ""
    },
    "style": {
        "name": "stylesheet",
        "size": 0,
        "type": "css",
        "lines": 1,
        "content": ""
    },
    "code": {
        "name": "code",
        "size": 11202,
        "type": "javascript",
        "lines": 262,
        "content": "{\n  sample: function() {\n    var list = d3.range(9 + Math.round(Math.random() * 3));\n    var count = d3.range(Math.round(Math.random() * 2) + 2);\n    return {\n      order: [{name: \"Month\", data: list.map(function(d,i) { return plotdb.data.sample.month[i].substring(0,3); })}],\n      radius: count.map(function(d,i) {\n        return {\n          name: \"Value \" + d,\n          data: list.map(function(d,i) { return Math.round(Math.random() * 90 + 10); })\n        };\n      })\n    };\n  },\n  dimension: {\n    radius: { type: [plotdb.Number], require: true, multiple: true, desc: \"radius of point on radar line\" },\n    order: { type: [plotdb.String], desc: \"order of data point\" }\n  },\n  config: {\n    fontFamily: {},\n    background: {},\n    textFill: {},\n    fontSize: {},\n    margin: {},\n    padding: {default: 10},\n    palette: {},\n    strokeWidth: {},\n    lineSmoothing: {},\n    legendLabel: {},\n    legendShow: {},\n    rAxisShow: {},\n    rAxisLabel: {},\n    rAxisTickPadding: {},\n    rAxisTickCount: {rebindOnChange: true},\n    aAxisShow: {},\n    aAxisLabel: {},\n    aAxisTickPadding: {},\n    nodeShow: {},\n    nodeSize: {default: 8},\n    nodeStrokeWidth: {default: 2},\n    nodeFill: {default: \"#fff\"},\n    gridShow: {},\n    gridStroke: {},\n    gridStrokeWidth: {},\n    gridDashArray: {},\n    gridBackground: {},\n    popupShow: {}\n  },\n  init: function() {\n    var that = this;\n    this.svg = d3.select(this.root).append(\"svg\");\n    this.allGroup = this.svg.append(\"g\");\n    this.legendGroup = this.svg.append(\"g\").attr({class: \"legend-group\"});\n    this.gridGroup = this.allGroup.append(\"g\").attr({class: \"grid-group\"});\n    this.aAxisGroup = this.allGroup.append(\"g\").attr({class: \"axis angle\"});\n    this.rAxisGroup = this.allGroup.append(\"g\").attr({class: \"axis radius\"});\n    this.popup = plotd3.html.tooltip(this.root).on(\"mousemove\", function(d,i,popup) {\n      var name = that.names[d3.select(this.parentNode).datum().idx];\n      var order = that.orders[i];\n      popup.select(\".title\").text(name + \" @ \" + order);\n      popup.select(\".value\").text(d);\n    });\n    this.line = d3.svg.line().tension(0.5)\n      .x(function(d,i) { return that.rScale(d) * Math.sin( that.aScale(that.orders[i]) ); })\n      .y(function(d,i) { return that.rScale(d) * -Math.cos( that.aScale(that.orders[i]) ); });\n    this.overlap = plotd3.rwd.overlap();\n  },\n  parse: function() {\n    this.orders = d3.map(this.data, function(d,i) { return d.order; }).keys();\n    this.parsed = d3.transpose(this.data.map(function(it) { return it.radius; }));\n    this.parsed.map(function(d,i) { d.idx = i; });\n    this.names = this.dimension.radius.fieldName || [\"1\",\"2\",\"3\"];\n    this.radiusRange = d3.extent(this.parsed\n      .map(function(it) { return d3.extent(it); })\n      .reduce(function(a,b) { return a.concat(b); }, []));\n    if(this.radiusRange[0] == this.radiusRange[1]) this.radiusRange[1]++;\n  },\n  bind: function() {\n    var that = this, sel;\n    sel = this.allGroup.selectAll(\"path.data\").data(this.parsed);\n    sel.exit().attr(\"class\",\"\").transition(\"exit\").duration(500).attr(\"opacity\",0).remove();\n    sel.enter().append(\"path\").attr({class: \"data\", opacity: 0});\n    sel = this.allGroup.selectAll(\"g.data-group\").data(this.parsed);\n    sel.exit().attr(\"class\",\"\").transition(\"exit\").duration(500).attr(\"opacity\",0).remove();\n    sel.enter().append(\"g\").attr({class: \"data-group\", opacity: 0});\n    this.allGroup.selectAll(\"g.data-group\").each(function(d,i) {\n      var sel = d3.select(this).selectAll(\"circle.node\").data(d);\n      sel.exit().attr(\"class\",\"\").transition(\"exit\").duration(500).attr(\"opacity\",0).remove();\n      sel = sel.enter().append(\"circle\").attr({class: \"node\", opacity: 0});\n      if(that.config.popupShow) that.popup.nodes(sel);\n    });\n\n    sel = this.gridGroup.selectAll(\"circle.grid.radius\").data(this.rTicks);\n    sel.exit().attr(\"class\",\"\").transition(\"exit\").duration(500).attr(\"opacity\",0).remove();\n    sel.enter().append(\"circle\").attr({class: \"grid radius\",opacity: 0, r: 0}).sort(d3.descending);\n    this.gridGroup.selectAll(\"circle.grid.radius\").sort(function(a,b) { return b - a;});\n    sel = this.gridGroup.selectAll(\"line.grid.angle\").data(this.aTicks);\n    sel.exit().attr(\"class\",\"\").transition(\"exit\").duration(500).attr(\"opacity\",0).remove();\n    sel.enter().append(\"line\").attr({class: \"grid angle\",opacity: 0});\n    sel = this.aAxisGroup.selectAll(\"g\").data(this.aTicks);\n    sel.exit().attr(\"class\",\"\").transition(\"exit\").duration(500).attr(\"opacity\",0).remove();\n    sel.enter().append(\"g\").attr({class: \"tick\"}).each(function(d,i) {\n      d3.select(this).append(\"text\").attr(\"opacity\", 0);\n    });\n  },\n  resize: function() {\n    var that = this;\n    var box = this.root.getBoundingClientRect();\n    var width = this.width = box.width;\n    var height = this.height = box.height;\n    width = width - this.config.padding;\n    height = height - this.config.padding;\n    this.svg.attr({\n      width: width + \"px\", height: height + \"px\",\n      viewBox: [0, 0, width, height].join(\" \"),\n      preserveAspectRatio: \"xMidYMid\"\n    });\n    this.line.interpolate(this.config.lineSmoothing);\n    this.popup.fontSize(this.config.fontSize);\n    this.cScale = plotdb.Palette.scale.ordinal(this.config.palette);\n    this.legend = plotd3.rwd.legend()\n      .scale(this.cScale)\n      .orient(\"bottom\")\n      .size([this.width - 2 * this.config.margin, this.config.fontSize])\n      .label(this.config.legendLabel || \" \")\n      .fontSize(this.config.fontSize);\n    this.legend.tickValues(this.names);\n    this.legendGroup.call(this.legend).selectAll(\".legend\").on(\"mouseover\", function(d,i) {\n      that.activeGroup = i + 1; that.render();\n    }).on(\"mouseout\", function(d,i) {\n      that.activeGroup = null; that.render();\n    });\n    this.legendSize = (this.config.legendShow ? this.legend.offset() : [0,0]);\n    var mw = width;\n    var mh = height - (this.config.legendShow ? this.legendSize[1] + this.config.fontSize : 0);\n    this.size = ((mw>mh?mh:mw) - that.config.margin * 2 - that.config.fontSize * 2)/2;\n    if(this.size <= 10) this.size = 10;\n    this.rScale = d3.scale.linear()\n      .domain([0,this.radiusRange[1]])\n      .range([0,this.size]).nice(5);\n    this.rTicks = this.rScale.ticks(this.config.rAxisTickCount);\n    this.rTicks.sort(function(a,b) { return b - a; });\n    this.niceRRange = this.rScale.domain();\n    this.rAxis = plotd3.rwd.axis()\n      .scale(this.rScale)\n      .orient(\"radius\")\n      .angle(Math.PI /(this.data.length || 1))\n      .showGrid(false)\n      .tickValues(this.rTicks)\n      .fontSize(this.config.fontSize);\n    this.rAxisGroup.call(this.rAxis).select(\".domain\").remove();\n    this.aScale = d3.scale.ordinal()\n      .domain(this.orders.concat(\"\"))\n      .rangePoints([0, 2 * Math.PI]);\n    this.aTicks = d3.range(this.data.length);\n  },\n  render: function() {\n    var that = this,sel;\n    if(this.config.fontFamily) d3.select(this.root).style(\"font-family\", this.config.fontFamily);\n    d3.select(this.root).style(\"background-color\", this.config.background);\n    this.svg.selectAll(\"text\").attr({\n      \"font-size\": that.config.fontSize,\n      \"fill\": that.config.textFill\n    });\n    this.allGroup.attr({\n      transform: [\n        \"translate(\",\n        (this.width)/2,\n        (this.height - (this.config.legendShow\n          ? this.legendSize[1] + this.config.fontSize \n          : 0))/2,\n        \")\"\n      ].join(\" \")\n    });\n    this.legendGroup.attr({\n      transform: [\"translate(\",\n\t\t(this.width - this.legendSize[0])/2,\n        (this.height - this.legendSize[1] - this.config.padding),\n        \")\"].join(\" \"),\n      display: (this.config.legendShow ? \"block\" : \"none\")\n    });\n    this.gridGroup.attr({\n      display: (this.config.gridShow ? \"block\" : \"none\")\n    }).selectAll(\"circle.grid.radius\").attr({\n      cx: 0, cy: 0, fill: this.config.gridBackground, stroke: this.config.gridStroke, \n      \"stroke-width\": this.config.gridStrokeWidth, \"stroke-dasharray\": this.config.gridDashArray\n    }).transition(\"morph\").duration(500).attr({\n      r: function(d,i) { return that.rScale(d); },\n      opacity: 1\n    });\n\n    this.gridGroup.selectAll(\"line.grid.angle\").attr({\n      stroke: this.config.gridStroke,\n      \"stroke-width\": this.config.gridStrokeWidth,\n      \"stroke-dasharray\": this.config.gridDashArray\n    }).transition(\"morph\").duration(500).attr({\n      x1: 0, y1: 0,\n      x2: function(d,i) {\n        return that.rScale(that.niceRRange[1]) * Math.sin( that.aScale(that.orders[d]) );\n      },\n      y2: function(d,i) {\n        return that.rScale(that.niceRRange[1]) * -Math.cos( that.aScale(that.orders[d]) );\n      },\n      opacity: 1\n    });\n    this.aAxisGroup.attr({\n      display: (this.config.aAxisShow ? \"block\" : \"none\")\n    });\n    this.rAxisGroup.attr({\n      display: (this.config.rAxisShow ? \"block\" : \"none\")\n    });\n    this.aAxisGroup.selectAll(\".tick text\").attr({\n      \"font-size\": that.config.fontSize,\n      \"text-anchor\": \"middle\",\n      dy: \"0.38em\",\n    }).text(function(d,i) { return that.orders[i] || i; }).transition(\"morph\").duration(function() {\n      return d3.select(this).attr(\"transform\") ? 500 : 0;\n    }).attr({\n      transform: function(d,i) {\n        var r = (that.rScale(that.niceRRange[1]) + 1 * that.config.fontSize);\n        var x = r * Math.sin( that.aScale(that.orders[d]) );\n        var y = r * -Math.cos( that.aScale(that.orders[d]) );\n        var a = (360 * i / that.data.length);\n        return [\"translate(\", x, y, \") rotate(\", a, \")\"].join(\" \");\n      },\n    });\n    this.aAxisGroup.selectAll(\"text\").transition(\"opacity\").duration(500).attr({ opacity: 1 });\n    this.allGroup.selectAll(\"path.data\").each(function(d,i) {\n      var strokeColor = that.cScale(that.names[i]);\n      var rgb = d3.rgb(strokeColor);\n      var fillColor = [\"rgba(\",rgb.r,\",\",rgb.g,\",\",rgb.b,\",\",0.2,\")\"].join(\"\");\n      d3.select(this).attr({\n        fill: fillColor,\n        stroke: strokeColor,\n        \"stroke-width\": that.config.strokeWidth\n      }).transition(\"morph\").duration(500).attr({\n        d: function(d,i) { return that.line(d,i) +\"Z\"; },\n      });    \n    }).transition(\"opacity\").duration(500).attr({\n      opacity: function(d,i) { return (!that.activeGroup || that.activeGroup == i+1 ? 1 : 0.1); }\n    });\n    this.allGroup.selectAll(\"g.data-group\").each(function(d,i) {\n      var node = d3.select(this);\n      var strokeColor = that.cScale(that.names[i]);\n      var rgb = d3.rgb(strokeColor);\n      var fillColor = [\"rgba(\",rgb.r,\",\",rgb.g,\",\",rgb.b,\",\",0.2,\")\"].join(\"\");\n      node.selectAll(\"circle.node\").attr({\n        fill: \"#fff\", stroke: strokeColor, \"stroke-width\": that.config.nodeStrokeWidth,\n        display: (that.config.nodeShow ? \"block\" : \"none\")\n      }).transition(\"morph\").duration(500).attr({\n        cx: function(d,i) { return that.rScale(d) * Math.sin( that.aScale(that.orders[i]) ); },\n        cy: function(d,i) { return that.rScale(d) * -Math.cos( that.aScale(that.orders[i]) ); },\n        r: that.config.nodeSize/2,\n        opacity: 1\n      });\n    });\n    this.allGroup.selectAll(\"g.data-group\").transition(\"opacity\").duration(500).attr({\n      opacity: function(d,i) { return (!that.activeGroup || that.activeGroup == i+1 ? 1 : 0.1); }\n    });\n\n  }\n}"
    },
    "assets": [],
    "config": {
        "fontFamily": {
            "name": "Font",
            "type": [{
                "name": "String",
                "default": "",
                "level": 2,
                "basetype": []
            }],
            "default": "Arial",
            "category": "Global Settings",
            "value": "'Varela Round', 'Noto Sans TC', '微軟正黑體', sans-serif"
        },
        "background": {
            "name": "Background",
            "type": [{
                "name": "Color",
                "level": 10,
                "default": "#dc4521",
                "Gray": "#cccccc",
                "Positive": "#3f7ab5",
                "Negative": "#d93510",
                "Neutral": "#cccccc",
                "Empty": "#ffffff",
                "subtype": {
                    "negative": "negative",
                    "positive": "positive",
                    "neutral": "neutral"
                }
            }],
            "default": "#ffffff",
            "category": "Global Settings",
            "value": "#ffffff"
        },
        "textFill": {
            "name": "Text Color",
            "type": [{
                "name": "Color",
                "level": 10,
                "default": "#dc4521",
                "Gray": "#cccccc",
                "Positive": "#3f7ab5",
                "Negative": "#d93510",
                "Neutral": "#cccccc",
                "Empty": "#ffffff",
                "subtype": {
                    "negative": "negative",
                    "positive": "positive",
                    "neutral": "neutral"
                }
            }],
            "default": "#000000",
            "category": "Global Settings",
            "value": "#5b5b5b"
        },
        "fontSize": {
            "name": "Font Size",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": 13,
            "category": "Global Settings",
            "value": "20"
        },
        "margin": {
            "name": "Margin",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": 10,
            "category": "Global Settings",
            "value": "10"
        },
        "padding": {
            "default": 10,
            "name": "Padding",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "category": "Global Settings",
            "value": "15"
        },
        "palette": {
            "name": "Palette",
            "type": [{
                "name": "Palette",
                "level": 30,
                "re": {},
                "default": {
                    "colors": [{
                        "hex": "#1d3263"
                    }, {
                        "hex": "#226c87"
                    }, {
                        "hex": "#f8d672"
                    }, {
                        "hex": "#e48e11"
                    }, {
                        "hex": "#e03215"
                    }, {
                        "hex": "#ab2321"
                    }]
                },
                "plotdb": {
                    "colors": [{
                        "hex": "#ed1d78"
                    }, {
                        "hex": "#c59b6d"
                    }, {
                        "hex": "#8cc63f"
                    }, {
                        "hex": "#28aae2"
                    }]
                },
                "qualitative": {
                    "colors": [{
                        "hex": "#c05ae0"
                    }, {
                        "hex": "#cf2d0c"
                    }, {
                        "hex": "#e9ab1e"
                    }, {
                        "hex": "#86ffb5"
                    }, {
                        "hex": "#64dfff"
                    }, {
                        "hex": "#003f7d"
                    }]
                },
                "binary": {
                    "colors": [{
                        "hex": "#ff8356"
                    }, {
                        "hex": "#0076a1"
                    }]
                },
                "sequential": {
                    "colors": [{
                        "hex": "#950431"
                    }, {
                        "hex": "#be043e"
                    }, {
                        "hex": "#ec326d"
                    }, {
                        "hex": "#fc82a9"
                    }, {
                        "hex": "#febed2"
                    }, {
                        "hex": "#fee6ee"
                    }]
                },
                "diverging": {
                    "colors": [{
                        "hex": "#74001a"
                    }, {
                        "hex": "#cd2149"
                    }, {
                        "hex": "#f23971"
                    }, {
                        "hex": "#ff84ab"
                    }, {
                        "hex": "#ffc3d7"
                    }, {
                        "hex": "#f2f2dd"
                    }, {
                        "hex": "#b8d9ed"
                    }, {
                        "hex": "#81b1d0"
                    }, {
                        "hex": "#3d8bb7"
                    }, {
                        "hex": "#0071a8"
                    }, {
                        "hex": "#003558"
                    }]
                },
                "subtype": {
                    "qualitative": "qualitative",
                    "binary": "binary",
                    "sequential": "sequential",
                    "diverging": "diverging"
                },
                "scale": {}
            }],
            "default": {
                "colors": [{
                    "hex": "#f4502a"
                }, {
                    "hex": "#f1c227"
                }, {
                    "hex": "#008a6d"
                }, {
                    "hex": "#00acdb"
                }, {
                    "hex": "#0064a8"
                }]
            },
            "category": "Global Settings",
            "value": {
                "key": "cfa",
                "name": "Code for Africa",
                "_type": {
                    "name": "palette",
                    "location": "sample"
                },
                "colors": [{
                    "hex": "#bf40bf"
                }, {
                    "hex": "#f4502a",
                    "idx": 0
                }, {
                    "hex": "#f1c227",
                    "idx": 1
                }, {
                    "hex": "#008a6d",
                    "idx": 2
                }, {
                    "hex": "#00acdb",
                    "idx": 3
                }, {
                    "hex": "#0064a8",
                    "idx": 4
                }]
            }
        },
        "strokeWidth": {
            "name": "Stroke Width",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "desc": "Default Stroke width",
            "default": "2",
            "category": "Global Settings",
            "value": "2"
        },
        "lineSmoothing": {
            "name": "Line Smoothing",
            "default": "linear",
            "type": [{
                "default": "",
                "name": "Choice",
                "level": 20,
                "values": ["linear", "step", "step-before", "step-after", "basis", "bundle", "cardinal", "monotone"]
            }],
            "category": "Line",
            "value": "linear"
        },
        "legendLabel": {
            "name": "Label",
            "type": [{
                "name": "String",
                "default": "",
                "level": 2,
                "basetype": []
            }],
            "category": "Legend",
            "value": ""
        },
        "legendShow": {
            "name": "Show Legend",
            "type": [{
                "name": "Boolean",
                "default": true,
                "level": 8,
                "basetype": [{
                    "name": "Order",
                    "level": 4,
                    "basetype": [{
                        "name": "String",
                        "default": "",
                        "level": 2,
                        "basetype": []
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": true,
            "category": "Legend",
            "value": true
        },
        "rAxisShow": {
            "name": "Show Axis",
            "type": [{
                "name": "Boolean",
                "default": true,
                "level": 8,
                "basetype": [{
                    "name": "Order",
                    "level": 4,
                    "basetype": [{
                        "name": "String",
                        "default": "",
                        "level": 2,
                        "basetype": []
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": true,
            "category": "Radial Axis",
            "value": true
        },
        "rAxisLabel": {
            "name": "Label",
            "type": [{
                "name": "String",
                "default": "",
                "level": 2,
                "basetype": []
            }],
            "default": "",
            "category": "Radial Axis",
            "value": ""
        },
        "rAxisTickPadding": {
            "name": "Tick Padding",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": 4,
            "category": "Radial Axis",
            "value": "1"
        },
        "rAxisTickCount": {
            "rebindOnChange": true,
            "name": "Tick Count",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": 6,
            "category": "Radial Axis",
            "desc": "Hint on number of tick. Actual number will be decided by program",
            "value": "5"
        },
        "aAxisShow": {
            "name": "Show Axis",
            "type": [{
                "name": "Boolean",
                "default": true,
                "level": 8,
                "basetype": [{
                    "name": "Order",
                    "level": 4,
                    "basetype": [{
                        "name": "String",
                        "default": "",
                        "level": 2,
                        "basetype": []
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": true,
            "category": "Angular Axis",
            "value": true
        },
        "aAxisLabel": {
            "name": "Label",
            "type": [{
                "name": "String",
                "default": "",
                "level": 2,
                "basetype": []
            }],
            "default": "",
            "category": "Angular Axis",
            "value": ""
        },
        "aAxisTickPadding": {
            "name": "Tick Padding",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": 4,
            "category": "Angular Axis",
            "value": "3"
        },
        "nodeShow": {
            "name": "Show Data Dot",
            "type": [{
                "name": "Boolean",
                "default": true,
                "level": 8,
                "basetype": [{
                    "name": "Order",
                    "level": 4,
                    "basetype": [{
                        "name": "String",
                        "default": "",
                        "level": 2,
                        "basetype": []
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": true,
            "category": "Dot",
            "value": true
        },
        "nodeSize": {
            "default": 8,
            "name": "Dot Size",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "category": "Dot",
            "value": "8"
        },
        "nodeStrokeWidth": {
            "default": 2,
            "name": "Stroke Width",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "category": "Dot",
            "value": "2"
        },
        "nodeFill": {
            "default": "#fff",
            "name": "Fill Color",
            "type": [{
                "name": "Color",
                "level": 10,
                "default": "#dc4521",
                "Gray": "#cccccc",
                "Positive": "#3f7ab5",
                "Negative": "#d93510",
                "Neutral": "#cccccc",
                "Empty": "#ffffff",
                "subtype": {
                    "negative": "negative",
                    "positive": "positive",
                    "neutral": "neutral"
                }
            }],
            "desc": "fill Dot with this color",
            "category": "Dot",
            "value": "#ffffff"
        },
        "gridShow": {
            "name": "Show Grid",
            "type": [{
                "name": "Boolean",
                "default": true,
                "level": 8,
                "basetype": [{
                    "name": "Order",
                    "level": 4,
                    "basetype": [{
                        "name": "String",
                        "default": "",
                        "level": 2,
                        "basetype": []
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": true,
            "category": "Grid",
            "value": true
        },
        "gridStroke": {
            "name": "Color",
            "type": [{
                "name": "Color",
                "level": 10,
                "default": "#dc4521",
                "Gray": "#cccccc",
                "Positive": "#3f7ab5",
                "Negative": "#d93510",
                "Neutral": "#cccccc",
                "Empty": "#ffffff",
                "subtype": {
                    "negative": "negative",
                    "positive": "positive",
                    "neutral": "neutral"
                }
            }],
            "default": "#ccc",
            "category": "Grid",
            "value": "#ffffff"
        },
        "gridStrokeWidth": {
            "name": "Stroke Width",
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": 1,
            "category": "Grid",
            "value": "2"
        },
        "gridDashArray": {
            "name": "Dash Style",
            "type": [{
                "name": "String",
                "default": "",
                "level": 2,
                "basetype": []
            }],
            "default": "2 4",
            "category": "Grid",
            "desc": "SVG style dash array. '2 4' means 2px line and 4px space.",
            "value": "2 2"
        },
        "gridBackground": {
            "name": "Background",
            "type": [{
                "name": "Color",
                "level": 10,
                "default": "#dc4521",
                "Gray": "#cccccc",
                "Positive": "#3f7ab5",
                "Negative": "#d93510",
                "Neutral": "#cccccc",
                "Empty": "#ffffff",
                "subtype": {
                    "negative": "negative",
                    "positive": "positive",
                    "neutral": "neutral"
                }
            }],
            "default": "#fff",
            "category": "Grid",
            "value": "#e8e8e8"
        },
        "popupShow": {
            "name": "show Popup",
            "desc": "show Popup when user hovers over elements",
            "type": [{
                "name": "Boolean",
                "default": true,
                "level": 8,
                "basetype": [{
                    "name": "Order",
                    "level": 4,
                    "basetype": [{
                        "name": "String",
                        "default": "",
                        "level": 2,
                        "basetype": []
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "default": true,
            "category": "Popup",
            "rebindOnChange": true,
            "value": true
        }
    },
    "dimlen": 2,
    "dimension": {
        "radius": {
            "type": [{
                "name": "Number",
                "default": 0,
                "level": 8,
                "basetype": [{
                    "name": "Numstring",
                    "default": "",
                    "level": 6,
                    "basetype": [{
                        "name": "Order",
                        "level": 4,
                        "basetype": [{
                            "name": "String",
                            "default": "",
                            "level": 2,
                            "basetype": []
                        }],
                        "order": {}
                    }],
                    "order": {}
                }],
                "order": {}
            }],
            "require": true,
            "multiple": true,
            "desc": "radius of point on radar line",
            "fields": [{
                "dataset": 3001,
                "location": "server",
                "name": "評審1",
                "datatype": "Number",
                "data": ["4", "3", "3", "1", "5"],
                "key": 48040,
                "hash": null,
                "datasetname": "專題報告評分"
            }, {
                "dataset": 3001,
                "location": "server",
                "name": "評審2",
                "datatype": "Number",
                "data": ["3", "2", "1", "3", "4"],
                "key": 48041,
                "hash": null,
                "datasetname": "專題報告評分"
            }, {
                "dataset": 3001,
                "location": "server",
                "name": "評審3",
                "datatype": "Number",
                "data": ["5", "4", "3", "2", "1"],
                "key": 48042,
                "hash": null,
                "datasetname": "專題報告評分"
            }, {
                "dataset": 3001,
                "location": "server",
                "name": "評審4",
                "datatype": "Number",
                "data": ["2", "3", "1", "2", "3"],
                "key": 48043,
                "hash": null,
                "datasetname": "專題報告評分"
            }, {
                "dataset": 3001,
                "location": "server",
                "name": "評審5",
                "datatype": "Number",
                "data": ["1", "2", "4", "5", "1"],
                "key": 48044,
                "hash": null,
                "datasetname": "專題報告評分"
            }, {
                "dataset": 3001,
                "location": "server",
                "name": "評審6",
                "datatype": "Number",
                "data": ["5", "4", "5", "4", "4"],
                "key": 48045,
                "hash": null,
                "datasetname": "專題報告評分"
            }],
            "fieldName": ["評審1", "評審2", "評審3", "評審4", "評審5", "評審6"]
        },
        "order": {
            "type": [{
                "name": "String",
                "default": "",
                "level": 2,
                "basetype": []
            }],
            "desc": "order of data point",
            "fields": [{
                "dataset": 3001,
                "location": "server",
                "name": "項目",
                "datatype": "String",
                "data": ["創意", "實踐", "溝通協作", "專題報告表現", "專業技術"],
                "key": 48051,
                "hash": null,
                "datasetname": "專題報告評分"
            }],
            "fieldName": "項目"
        }
    },
    "library": ["d3/3.5.12/min", "plotd3/0.1.0"],
    "ownername": "kchen",
    "createdtime": "2016-11-24T10:16:39.000Z",
    "modifiedtime": "2017-01-09T19:10:17.000Z",
    "local": null,
    "inherit": [],
    "metashow": null,
    "footer": null,
    "data": [{
        "radius": [4, 3, 5, 2, 1, 5],
        "order": "創意"
    }, {
        "radius": [3, 2, 4, 3, 2, 4],
        "order": "實踐"
    }, {
        "radius": [3, 1, 3, 1, 4, 5],
        "order": "溝通協作"
    }, {
        "radius": [1, 3, 2, 2, 5, 4],
        "order": "專題報告表現"
    }, {
        "radius": [5, 4, 1, 3, 1, 4],
        "order": "專業技術"
    }],
};