define(["require","../module","text!./filters.xml","qpf","./filter","./source","../viewport/index","_","knockout"],function(e){var t=e("../module"),n=e("text!./filters.xml"),r=e("qpf"),i=e("./filter"),s=e("./source"),o=e("../viewport/index"),u=e("_"),a=e("knockout"),f=new t({name:"filters",xml:n,filters:a.observableArray(s.filters),FilterView:i,seachKeyword:a.observable(""),colorAdjust:{brightness:a.observable(0),contrast:a.observable(1),exposure:a.observable(0),gamma:a.observable(1),saturation:a.observable(1)}}),l;return f.on("start",function(){l=f.mainComponent.$el.find("#Histogram").qpf("get")[0],l.image=o.processor.canvas,l.update(),l.refresh()}),a.computed(function(){o.colorAdjustLayer.set({brightness:f.colorAdjust.brightness(),contrast:f.colorAdjust.contrast(),exposure:f.colorAdjust.exposure(),gamma:f.colorAdjust.gamma(),saturation:f.colorAdjust.saturation()}),o.update()}),o.on("update",function(){l.update(),l.refresh()}),f.seachKeyword.subscribe(function(e){e?f.filters(u.filter(f.filters(),function(t){return t.name.indexOf(e.toLowerCase())>=0||t.title.indexOf(e)>=0})):f.filters(s.filters)}),f});