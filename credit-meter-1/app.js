(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    /* AMD. Register as an anonymous module. */
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    /*
     * Node.
     *
     * Does not work with strict CommonJS, but
     * only CommonJS-like environments that support
     * module.exports, like Node.
     */
    module.exports = factory();
  } else {
    /* Browser globals (root is window). */
    root.pureknob = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function PureKnob() {
    /*
     * Creates a knob element.
     */
    this.createKnob = function (width, height) {
      const heightString = height.toString();
      const widthString = width.toString();
      const smaller = width < height ? width : height;
      const fontSize = 0.2 * smaller;
      const fontSizeString = fontSize.toString();
      const canvas = document.createElement("canvas");
      const div = document.createElement("div");

      div.style.display = "inline-block";
      div.style.height = heightString + "px";
      div.style.position = "relative";
      div.style.textAlign = "center";
      div.style.width = widthString + "px";
      div.appendChild(canvas);

      // const input = document.createElement("input");
      // input.style.appearance = "textfield";
      // input.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      // input.style.border = "none";
      // input.style.color = "#ff8800";
      // input.style.fontFamily = "sans-serif";
      // input.style.fontSize = fontSizeString + "px";
      // input.style.height = heightString + "px";
      // input.style.margin = "auto";
      // input.style.padding = "0px";
      // input.style.textAlign = "center";
      // input.style.width = widthString + "px";

      // const inputDiv = document.createElement("div");
      // inputDiv.style.bottom = "0px";
      // inputDiv.style.display = "none";
      // inputDiv.style.left = "0px";
      // inputDiv.style.position = "absolute";
      // inputDiv.style.right = "0px";
      // inputDiv.style.top = "0px";
      // inputDiv.appendChild(input);
      // div.appendChild(inputDiv);

      /*
       * The knob object.
       */
      const knob = {
        _canvas: canvas,
        _div: div,
        _height: height,
        // _input: input,
        // _inputDiv: inputDiv,
        _previousVal: 0,
        _width: width,

        /*
         * Notify listeners about value changes.
         */
        _notifyUpdate: function () {
          const properties = this._properties;
          const value = properties.val;
        },

        /*
         * Properties of this knob.
         */
        _properties: {
          angleEnd: 2.0 * Math.PI,
          angleOffset: -0.5 * Math.PI,
          angleStart: 0,
          colorBG: "#181818",
          colorFG: "#ff8800",
          colorLabel: "#ffffff",
          fnStringToValue: function (string) {
            return parseInt(string);
          },
          fnValueToString: function (value) {
            return value.toString();
          },
          label: null,
          needle: false,
          readonly: false,
          textScale: 1.0,
          trackWidth: 0.4,
          valMin: 0,
          valMax: 100,
          val: 0,
        },

        /*
         * Commit value, indicating that it is no longer temporary.
         */
        commit: function () {
          const properties = this._properties;
          const value = properties.val;
          this._previousVal = value;
          this.redraw();
          this._notifyUpdate();
        },

        /*
         * Returns the value of a property of this knob.
         */
        getProperty: function (key) {
          const properties = this._properties;
          const value = properties[key];
          return value;
        },

        /*
         * Returns the current value of the knob.
         */
        getValue: function () {
          const properties = this._properties;
          const value = properties.val;
          return value;
        },

        /*
         * Return the DOM node representing this knob.
         */
        node: function () {
          const div = this._div;
          return div;
        },

        /*
         * Redraw the knob on the canvas.
         */
        redraw: function () {
          this.resize();
          const properties = this._properties;
          const needle = properties.needle;
          const angleStart = properties.angleStart;
          const angleOffset = properties.angleOffset;
          const angleEnd = properties.angleEnd;
          const actualStart = angleStart + angleOffset;
          const actualEnd = angleEnd + angleOffset;
          const value = properties.val;
          const valueToString = properties.fnValueToString;
          const valueStr = valueToString(value);
          const valMin = properties.valMin;
          const valMax = properties.valMax;
          const relValue = (value - valMin) / (valMax - valMin);
          const relAngle = relValue * (angleEnd - angleStart);
          const angleVal = actualStart + relAngle;
          const colorTrack = properties.colorBG;
          const colorFilling = properties.colorFG;
          const textScale = properties.textScale;
          const trackWidth = properties.trackWidth;
          const height = this._height;
          const width = this._width;
          const smaller = width < height ? width : height;
          const centerX = 0.5 * width;
          const centerY = 0.5 * height;
          const radius = 0.4 * smaller;
          const labelY = centerY + radius;
          const lineWidth = Math.round(trackWidth * radius);
          const labelSize = Math.round(0.8 * lineWidth);
          const labelSizeString = labelSize.toString();
          const fontSize = 0.2 * smaller * textScale;
          const fontSizeString = fontSize.toString();
          const canvas = this._canvas;
          const ctx = canvas.getContext("2d");

          /*
           * Draw the track.
           */
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, actualStart, actualEnd);
          ctx.lineCap = "butt";
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = colorTrack;
          ctx.stroke();

          /*
           * Draw the filling.
           */
          ctx.beginPath();

          /*
           * Check if we're in needle mode.
           */
          if (needle) {
            ctx.arc(centerX, centerY, radius, angleVal - 0.1, angleVal + 0.1);
          } else {
            ctx.arc(centerX, centerY, radius, actualStart, angleVal);
          }

          ctx.lineCap = "butt";
          ctx.lineWidth = lineWidth;
          let gradient = ctx.createLinearGradient(0, 0, 100, 300);
          gradient.addColorStop(0, colorFilling);
          gradient.addColorStop(1, "#212121");

          ctx.strokeStyle = gradient; // color fill for meter
          ctx.stroke();

          /*
           * Draw the number.
           */
          ctx.font = fontSizeString + "px sans-serif";
          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(valueStr, centerX, centerY);
        },

        /*
         * This is called as the canvas or the surrounding DIV is resized.
         */
        resize: function () {
          const canvas = this._canvas;
          canvas.style.height = "100%";
          canvas.style.width = "100%";
          canvas.height = this._height;
          canvas.width = this._width;
        },

        /*
         * Sets the value of a property of this knob.
         */
        setProperty: function (key, value) {
          this._properties[key] = value;
          this.redraw();
        },

        /*
         * Sets the value of this knob.
         */
        setValue: function (value) {
          this.setValueFloating(value);
          this.commit();
        },

        /*
         * Sets floating (temporary) value of this knob.
         */
        setValueFloating: function (value) {
          const properties = this._properties;
          const valMin = properties.valMin;
          const valMax = properties.valMax;

          /*
           * Clamp the actual value into the [valMin; valMax] range.
           */
          if (value < valMin) {
            value = valMin;
          } else if (value > valMax) {
            value = valMax;
          }

          value = Math.round(value);
          this.setProperty("val", value);
        },
      };
      return knob;
    };
  }

  return new PureKnob();
});
