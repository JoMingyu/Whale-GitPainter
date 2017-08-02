var app = angular.module('app', []);

app
.controller('startCtrl', function($scope) {
    $scope.color = 'rgba(135, 86, 255, 1)';
    $scope.color2 = 'rgba(112, 255, 253, 1)';
})

app
.directive('cpick', function() {
  function link(scope, element, attrs, ngModel) {
    if (!ngModel) return;
    scope.transparency = 1;
    scope.brightness = 0;
    scope.red = 0;
    scope.green = 0;
    scope.blue = 0;
    scope.hex = '#000';
    scope.grayscale = [ 
        'rgba(255,255,255,1)',
        'rgba(200,200,200,1)',
        'rgba(150,150,150,1)',
        'rgba(100,100,100,1)',
        'rgba(50,50,50,1)',
        'rgba(0,0,0,1)',
    ];
    scope.presets = [
        'rgba(255, 82, 92, 1)',
        'rgba(247, 51, 255, 1)',
        'rgba(123, 172, 255, 1)',
        'rgba(147, 255, 159, 1)',
        'rgba(255, 244, 89, 1)',
        'rgba(255, 157, 74, 1)',
    ];
    var canvas = element.find('#color-canvas')[0],
        module = element.find('.cpick-module')[0],
        canvaswrapper = element.find('.cpick')[0],
        previewEl = element.find('.cpick-preview')[0],
        indicatorEl = element.find('.cpick-indicator')[0],
        transparencyEl = element.find('.cpick-transparency')[0],
        darknessEl = element.find('.darkness')[0],
        brightnessEl = element.find('.cpick-brightness')[0],
        brightIndicatorEl = element.find('.cpick-brightness-indicator')[0],
        transIndicatorEl = element.find('.cpick-transparency-indicator')[0],
        ctx = canvas.getContext('2d'),
        inputEl = element.find('.cpick-expression>input'),
        selectedIndex,
        tempColor,
        previousTarget,
        workingStack = new Array();
    
    var cdown = false, tdown = false, bdown = false, updateModel = false;

    function drawBg() {
        canvas.width = canvaswrapper.offsetWidth;
        canvas.height = canvaswrapper.offsetHeight;
        var image = new Image(),
            url= '\\images\\hsl-color-circle-min3.png';
        image.src = url + '?' + new Date().getTime();
        image.setAttribute('crossOrigin', '');
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    };
    function setBrightness(bright) {
        var brightH = angular.element(brightnessEl)[0].offsetHeight;
        var brightY = brightH * bright;
        scope.brightness = bright;
        angular.element(brightIndicatorEl).css({
            'top': brightY.toFixed(2) + 'px',
            'bottom': 'auto'
        });
    };
    function changeBrightness(e) {
        if (bCanPreview && bdown) {
            // get coordinates of current position
            var brightY = Math.floor(e.pageY - angular.element(brightnessEl).offset().top);
            var brightH = angular.element(brightnessEl)[0].offsetHeight;
            var bright =  brightY / brightH * 1;
            angular.element(brightIndicatorEl).css({
                'top': brightY.toFixed(2) + 'px',
                'bottom': 'auto'
            });
            colorUpdate(false, false, false, false, bright);
        }        
    };
    function setTransparency(trans) {
        var transH = angular.element(transparencyEl)[0].offsetHeight;
        var transY = transH * trans;
        angular.element(transIndicatorEl).css({
            'top': transY.toFixed(2) + 'px',
            'bottom': 'auto'
        });
    };
    function changeTransparency(e) {
        if (bCanPreview && tdown) {
            // get coordinates of current position
            var transY = Math.floor(e.pageY - angular.element(transparencyEl).offset().top);
            var transH = angular.element(transparencyEl)[0].offsetHeight;
            var trans =  transY / transH * 1;
            angular.element(transIndicatorEl).css({
                'top': transY + 'px',
                'bottom': 'auto'
            });
            colorUpdate(false, false, false, trans)
        }
    };
    
    scope.rgbaStringToUpdate = function(rgba) {
        setBrightness(0);
        rgba = rgba.substring(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(/,\s*/);
        colorUpdate(rgba[0], rgba[1], rgba[2], rgba[3]);
        setTransparency(rgba[3]);
    };
    
    scope.resetColor = function(){
        var paintBoxEl = element.find('.paint-box');
        for(var i = 0; i < 5; i++){
            angular.element(paintBoxEl[i]).css({
                'background-color': originColors[i]
            });
            saveColor(i, originColors[i]);
        }
    }

    function shadeRGBColor(color, percent) {
        var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
        //return "rgba("+(Math.round((t-R)*p)+R)+", "+(Math.round((t-G)*p)+G)+", "+(Math.round((t-B)*p)+B)+", "+scope.transparency+")";
        return {
            red: (Math.round((t-R)*p)+R),
            green: (Math.round((t-G)*p)+G),
            blue: (Math.round((t-B)*p)+B)
        };
        
    };

    function colorUpdate(r, g, b, a, d) {
        if (r) {scope.red = r;}
        if (g) {scope.green = g;}
        if (b) {scope.blue = b;}
        if (a) {scope.transparency = a};
        if (d) {scope.brightness = d};
        // update preview color
        var rgb = "rgb("+scope.red+", "+scope.green+", "+scope.blue+")";
        var rgba = "rgba("+scope.red+", "+scope.green+", "+scope.blue+", "+scope.transparency+")";
        var darkness = shadeRGBColor(rgb, -scope.brightness);
        var drgb = "rgb("+darkness.red+", "+darkness.green+", "+darkness.blue+")";
        var drgba = "rgba("+darkness.red+", "+darkness.green+", "+darkness.blue+","+scope.transparency+")";
        angular.element(transparencyEl).css({
            'background': '-moz-linear-gradient(top, rgba(50,50,50,0) 0%, '+drgb+' 100% )',
            'background': '-webkit-linear-gradient(top, rgba(50,50,50,0) 0%, '+drgb+' 100% )',
            'background': 'linear-gradient(to bottom, rgba(50,50,50,0) 0%, '+drgb+' 100% )',
            'filter': 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#000222\', endColorstr=\'#001e5799\',GradientType=0 )'
        });
        angular.element(brightnessEl).css({
            'background': '-moz-linear-gradient(top, '+rgb+' 0%, #000 100%)',
            'background': '-webkit-linear-gradient(top, '+rgb+' 0%, #000 100%)',
            'background': 'linear-gradient(to bottom, '+rgb+' 0%, #000 100%)',
            'filter': 'progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#000222\', endColorstr=\'#001e5799\',GradientType=0 )'
        });
        angular.element(previewEl).css({'background-color': drgba});
        canvaswrapper.style.opacity = scope.transparency;
        darknessEl.style.opacity = scope.brightness;
        var dColor = scope.blue + 256 * scope.green + 65536 * scope.red;
        scope.hex = '#' + ('0000' + dColor.toString(16)).substr(-6);

        // update preview <input>
        // HEX
        angular.element(inputEl[0]).val(scope.hex);
        // RGB
        angular.element(inputEl[1]).val(scope.red);
        angular.element(inputEl[2]).val(scope.green);
        angular.element(inputEl[3]).val(scope.blue);
        angular.element(inputEl[4]).val(scope.transparency);
        // HSL
        var hsl = rgbToHsl(scope.red, scope.green, scope.blue);
        angular.element(inputEl[5]).val(hsl[0]);
        angular.element(inputEl[6]).val(hsl[1]);
        angular.element(inputEl[7]).val(hsl[2]);
        angular.element(inputEl[8]).val(scope.transparency);

        // set less more
        var paintBoxEl = element.find('.paint-box.active');
        angular.element(paintBoxEl).css({
            'background-color': drgba
        });

        scope.rgba = drgba;
        myEfficientFn();

        saveColor(selectedIndex, drgba);
    };

    $(".cpick-painter-preview>div").click(function(e){
        if(previousTarget !== e.target){
            tempColor = [];
        }

        var $boxes = $(".cpick-painter-preview>div").toArray();
        $boxes.forEach(function(element) {
            if(element.classList.contains("active")){
                element.classList.remove("active");
            }
        }, this);
        e.target.classList.add("active");
        selectedIndex = $boxes.indexOf(e.target);

        previousTarget = e.target;
    });

    $(document).keyup(function(e){
        if (e.ctrlKey && e.keyCode == 90) {
            var previousColor = workingStack.pop();

            var paintBoxEl = element.find('.paint-box.active');
            angular.element(paintBoxEl).css({
                'background-color': 'rgba(' + previousColor[0] + ',' + previousColor[1] + ',' + previousColor[2] + ',' + previousColor[3] + ');'
            });
        }
    });

    $(".cpick-expression>input").keyup(function(e){
        var colors = $(".cpick-expression>input");
        var index = inputEl.toArray().indexOf(e.target);
        if(e.keyCode == 13){
            if(index == 0){
                // var hex = colors[0].value;
                var rgb = hexToRgb(colors[0].value);
                colorUpdate(rgb.r, rgb.g, rgb.b);
            }
            else if(index >= 1 && index <= 4){
                // var rgb = "rgba("
                // for(var i = 1; i <= 3; i++){
                //     rgb += colors[i].value + ",";
                // }
                // rgb += colors[4].value + ");"

                colorUpdate(colors[1].value, colors[2].value, colors[3].value, colors[4].value);
            }
            else if(index >= 5 && index <= 8){
                // var hsl = "hsla("
                // for(var i = 5; i <= 7; i++){
                //     hsl += colors[i].value + ",";
                // }
                // hsl += colors[8].value + ");"
                var rgb = hslToRgb(parseFloat(colors[5].value) / 360,
                                    parseFloat(colors[6].value) / 100,
                                    parseFloat(colors[7].value) / 100);
                colorUpdate(rgb.r, rgb.g, rgb.b);
            }
        }
    });

    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: Math.round(r * 255),
                 g: Math.round(g * 255),
                 b: Math.round(b * 255)};
    }

    function rgbToHsl(r, g, b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }

    function changeColor(e) {
      if (bCanPreview && cdown) {
        canvas.style.cursor = 'none';
        // get coordinates of current position
        var canvasOffset = angular.element(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
        angular.element(indicatorEl).css({
            'left': canvasX + 'px',
            'top': canvasY + 'px'
        });
        // get current pixel
        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;
        tempColor = pixel;
        colorUpdate(pixel[0], pixel[1], pixel[2]);
      }
    };

    function debounce(func, wait, immediate) {
    	var timeout;
    	return function() {
    		var context = this, args = arguments;
    		var later = function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		var callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	};
    };
    
    var myEfficientFn = debounce(function() {
        scope.value = scope.rgba;
        ngModel.$setViewValue(scope.value);
        ngModel.$commitViewValue(true);
        ngModel.$render();
        scope.$apply();
    }, 250);
        
    var bCanPreview = true;
    angular.element(canvas).mousemove(function(e) {
        changeColor(e);
    }).mousedown(function(e){
        cdown = true;
        changeColor(e);
    });
    angular.element(canvas).mouseup(function(e) {
        cdown = false;
        canvas.style.cursor = 'crosshair';
        workingStack.push(tempColor);
    });
    
    angular.element( brightnessEl ).mousemove(function(e) {
        changeBrightness(e);
    }).mousedown(function(e){
        bdown = true;
        changeBrightness(e);
    });
    angular.element( brightnessEl ).mouseup(function(e) {
        bdown = false;
        canvas.style.cursor = 'crosshair';
    });    
    
    angular.element(transparencyEl).mousemove(function(e) {
        changeTransparency(e);
    }).mousedown(function(e){
        tdown = true;
        changeTransparency(e);
    });
    angular.element(transparencyEl).mouseup(function(e) {
        tdown = false;
        canvas.style.cursor = 'crosshair';
    });
    
    angular.element(module).mousedown(function(e) {
        e.stopPropagation();
    });
    
    angular.element(module).mouseup(function(e) {
        tdown = false;
        cdown = false;
        bdown = false;
        canvas.style.cursor = 'crosshair';
    }).mouseleave(function(e) {
        tdown = false;
        cdown = false;
        bdown = false;
        canvas.style.cursor = 'crosshair';
    });

    ngModel.$render = function(){
        scope.value = ngModel.$modelValue;
        whale.storage.sync.get(undefined, items => {
            for (let i = 0; i < 5; i++) {
                let colorCode = items[i];
                if (colorCode !== undefined) {
                    contribColors[i] = colorCode;
                } else {
                    contribColors[i] = originColors[i];
                }
                var box = element.find(".paint-box")[i];
                angular.element(box).css({
                    'background-color': contribColors[i]
                });
            }
            repoColor = items[5];
        });
    };
    
    setTimeout(function(){
        var rgba = scope.value;
        rgba = rgba.substring(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(/,\s*/);
        colorUpdate(rgba[0], rgba[1], rgba[2], rgba[3]);
        setTransparency(rgba[3]);
    },300);
    
    drawBg();
  }

  return {
    require: "?ngModel",
    scope: {
        value: "=ngModel"
    },
    link: link,
    template:
    '<div class="cpick-preview" ng-model="value">'+
        '<div class="cpick-module">'+
            '<div class="cpick">'+
                '<canvas id="color-canvas"></canvas>'+
                '<div class="darkness"></div>'+
            '</div>'+
            '<div class="cpick-indicator"></div>'+
            '<div class="cpick-brightness">'+
                '<div class="cpick-brightness-indicator"></div>'+
            '</div>'+
            '<div class="cpick-transparency">'+
                '<div class="cpick-transparency-indicator"></div>'+
            '</div>'+
            //'<div style="color:black">{{rgba}}</div>'+
            '<div class="cpick-grayscale">'+
                '<div class="cpick-square" ng-repeat="scale in grayscale" ng-style="{\'background-color\': scale}" ng-click="rgbaStringToUpdate(scale)"></div>'+
            '</div>'+
            '<div class="cpick-presets">'+
                '<div class="cpick-square" ng-repeat="preset in presets" ng-style="{\'background-color\': preset}" ng-click="rgbaStringToUpdate(preset)"></div>'+
            '</div>'+
            '<div class="cpick-expression">'+
                '<span>HEX</span>'+
                '<input type="text">'+
            '</div>'+
            '<div class="cpick-expression">'+
                '<span>RGB</span>'+
                'R<input type="text">'+
                'G<input type="text">'+
                'B<input type="text">'+
                'A<input type="text">'+
            '</div>'+
            '<div class="cpick-expression">'+
                '<span>HSL</span>'+
                'H<input type="text">'+
                'S<input type="text">'+
                'L<input type="text">'+
                'A<input type="text">'+
            '</div>'+
            '<div class="cpick-painter-preview">'+
                '<div class="paint-box"></div>'+
                '<div class="paint-box"></div>'+
                '<div class="paint-box"></div>'+
                '<div class="paint-box"></div>'+
                '<div class="paint-box"></div>'+
            '</div>'+
            '<button class="cpick-reset" ng-click="resetColor()">Clear All</button>'+
        '</div>'+
    '</div>'
    
  };

});