/*!
 * VERSION: beta 1.9.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
	"use strict";
	_gsScope._gsDefine("easing.Back", ["easing.Ease"], function (Ease) {
		var w = (_gsScope.GreenSockGlobals || _gsScope),
			gs = w.com.greensock,
			_2PI = Math.PI * 2,
			_HALF_PI = Math.PI / 2,
			_class = gs._class,
			_create = function (n, f) {
				var C = _class("easing." + n, function () {
					}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				return C;
			},
			_easeReg = Ease.register || function () {
			}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
			_wrap = function (name, EaseOut, EaseIn, EaseInOut, aliases) {
				var C = _class("easing." + name, {
					easeOut: new EaseOut(),
					easeIn: new EaseIn(),
					easeInOut: new EaseInOut()
				}, true);
				_easeReg(C, name);
				return C;
			},
			EasePoint = function (time, value, next) {
				this.t = time;
				this.v = value;
				if (next) {
					this.next = next;
					next.prev = this;
					this.c = next.v - value;
					this.gap = next.t - time;
				}
			},
//Back
			_createBack = function (n, f) {
				var C = _class("easing." + n, function (overshoot) {
						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
						this._p2 = this._p1 * 1.525;
					}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				p.config = function (overshoot) {
					return new C(overshoot);
				};
				return C;
			},
			Back = _wrap("Back",
				_createBack("BackOut", function (p) {
					return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
				}),
				_createBack("BackIn", function (p) {
					return p * p * ((this._p1 + 1) * p - this._p1);
				}),
				_createBack("BackInOut", function (p) {
					return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
				})
			);
//Sine
		_wrap("Sine",
			_create("SineOut", function (p) {
				return Math.sin(p * _HALF_PI);
			}),
			_create("SineIn", function (p) {
				return -Math.cos(p * _HALF_PI) + 1;
			}),
			_create("SineInOut", function (p) {
				return -0.5 * (Math.cos(Math.PI * p) - 1);
			})
		);
		_class("easing.EaseLookup", {
			find: function (s) {
				return Ease.map[s];
			}
		}, true);
		return Back;
	}, true);
});
if (_gsScope._gsDefine) {
	_gsScope._gsQueue.pop()();
}
