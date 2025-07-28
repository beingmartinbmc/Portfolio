"use strict";
(self["webpackChunkPersonal_Portfolio_Angular"] = self["webpackChunkPersonal_Portfolio_Angular"] || []).push([["main"],{

/***/ 92:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 5072);


class AppComponent {
  constructor() {
    this.title = 'Personal-Portfolio-Angular';
  }
  static {
    this.ɵfac = function AppComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 1,
      vars: 0,
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterOutlet],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxnS0FBZ0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 635:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 92);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 5072);
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./profile/profile.component */ 300);
/* harmony import */ var _profile_profile_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./profile/profile.module */ 4219);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser/animations */ 3835);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);










const routes = [{
  path: '',
  component: _profile_profile_component__WEBPACK_IMPORTED_MODULE_1__.ProfileComponent
}];
const config = {
  useHash: true
};
class AppModule {
  static {
    this.ɵfac = function AppModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent]
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterModule.forRoot(routes, config), _profile_profile_module__WEBPACK_IMPORTED_MODULE_2__.ProfileModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClientModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__.BrowserAnimationsModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__.BrowserModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterModule, _profile_profile_module__WEBPACK_IMPORTED_MODULE_2__.ProfileModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClientModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__.BrowserAnimationsModule]
  });
})();

/***/ }),

/***/ 4990:
/*!**************************************************!*\
  !*** ./src/app/profile/about/about.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AboutComponent: () => (/* binding */ AboutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class AboutComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function AboutComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AboutComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AboutComponent,
      selectors: [["app-about"]],
      decls: 42,
      vars: 0,
      consts: [["id", "about", 1, "section"], [1, "container"], ["data-aos", "fade-up", "data-aos-offset", "10", 1, "card"], [1, "row"], [1, "col-lg-6", "col-md-12"], [1, "card-body"], [1, "h4", "mt-0", "title"], ["align", "justify"], [1, "col-sm-4"], [1, "text-uppercase"], [1, "col-sm-8"], [1, "row", "mt-4"]],
      template: function AboutComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "About Me");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "An Energetic and Ambitious Person who has developed a mature and responsible outlook to solve any task I undertake");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Being an Engineer graduate and a Software Developer, I'm excellent in working with others to achieve an objective on time ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "I try to learn as much as I can each day to become even a better coder, programmer, and a human");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 4)(15, "div", 5)(16, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Basic Information");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 3)(19, "div", 8)(20, "strong", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Date of Birth:");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "March 19, 1998");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 11)(25, "div", 8)(26, "strong", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Email:");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "ankit.sharma199803@gmail.com");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 11)(31, "div", 8)(32, "strong", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Location:");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Uttar Pradesh, India");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 11)(37, "div", 8)(38, "strong", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "Language:");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "English, Hindi");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()()();
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhYm91dC5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9hYm91dC9hYm91dC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsZ0tBQWdLIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 9382:
/*!******************************************************!*\
  !*** ./src/app/profile/contact/contact.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactComponent: () => (/* binding */ ContactComponent)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 6443);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 4456);





const _c0 = a0 => ({
  "is-invalid": a0
});
class ContactComponent {
  constructor(http) {
    this.http = http;
    this.model = {};
  }
  ngOnInit() {}
  onSubmit(name, subject, email, message) {
    const headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.post('https://formspree.io/f/mbjpqzgz', {
      name,
      subject,
      replyto: email,
      message
    }, {
      headers
    }).subscribe(response => {
      console.log(response);
    });
  }
  static {
    this.ɵfac = function ContactComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ContactComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ContactComponent,
      selectors: [["app-contact"]],
      decls: 51,
      vars: 16,
      consts: [["f", "ngForm"], ["name", "ngModel"], ["subject", "ngModel"], ["email", "ngModel"], ["message", "ngModel"], ["id", "contact", 1, "section"], [1, "cc-contact-information"], [1, "container"], [1, "cc-contact"], [1, "row"], [1, "col-md-9"], ["data-aos", "zoom-in", 1, "card", "mb-0"], [1, "h4", "text-center", "title"], [1, "col-md-6"], [1, "card-body"], ["name", "form", "novalidate", "", 3, "ngSubmit"], [1, "p", "pb-3"], [1, "row", "mb-3"], [1, "col"], [1, "input-group"], ["name", "name", "placeholder", "Name", "required", "", "type", "text", 1, "form-control", 3, "ngModelChange", "ngModel", "ngClass"], [1, "input-container"], ["name", "subject", "placeholder", "Subject", "required", "", "type", "text", 1, "form-control", 3, "ngModelChange", "ngModel", "ngClass"], ["name", "email", "pattern", "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$", "placeholder", "E-mail", "required", "", "type", "text", 1, "form-control", 3, "ngModelChange", "ngModel", "ngClass"], [1, "form-group"], ["name", "message", "placeholder", "Your Message", "required", "", 1, "form-control", 3, "ngModelChange", "ngModel", "ngClass"], ["type", "submit", 1, "btn", "bg-primary", 2, "font-weight", "bold", "color", "blanchedalmond", 3, "click"], [1, "mb-0"], [2, "margin-top", "40px"], ["href", "https://info.flagcounter.com/hZ3l"], ["src", "https://s04.flagcounter.com/count2/hZ3l/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_10/viewers_0/labels_1/pageviews_1/flags_0/percent_0/", "alt", "Flag Counter", "border", "0"]],
      template: function ContactComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 5)(1, "div", 6)(2, "div", 7)(3, "div", 8)(4, "div", 9)(5, "div", 10)(6, "div", 11)(7, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Contact Me");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 9)(10, "div", 13)(11, "div", 14)(12, "form", 15, 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function ContactComponent_Template_form_ngSubmit_12_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
            const f_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](13);
            f_r2.form.valid;
            return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](f_r2.resetForm());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 16)(15, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Feel free to contact me ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 17)(18, "div", 18)(19, "div", 19)(20, "input", 20, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayListener"]("ngModelChange", function ContactComponent_Template_input_ngModelChange_20_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayBindingSet"](ctx.model.name, $event) || (ctx.model.name = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "div", 17)(23, "div", 18)(24, "div", 21)(25, "input", 22, 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayListener"]("ngModelChange", function ContactComponent_Template_input_ngModelChange_25_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayBindingSet"](ctx.model.subject, $event) || (ctx.model.subject = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 17)(28, "div", 18)(29, "div", 19)(30, "input", 23, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayListener"]("ngModelChange", function ContactComponent_Template_input_ngModelChange_30_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayBindingSet"](ctx.model.email, $event) || (ctx.model.email = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "div", 17)(33, "div", 18)(34, "div", 24)(35, "textarea", 25, 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayListener"]("ngModelChange", function ContactComponent_Template_textarea_ngModelChange_35_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayBindingSet"](ctx.model.message, $event) || (ctx.model.message = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 9)(38, "div", 18)(39, "button", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ContactComponent_Template_button_click_39_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
            const name_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](21);
            const subject_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](26);
            const email_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](31);
            const message_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](36);
            return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx.onSubmit(name_r3.value, subject_r4.value, email_r5.value, message_r6.value));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](40, " Send ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "div", 13)(42, "div", 14)(43, "p", 27)(44, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Email");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "ankit.sharma199803@gmail.com");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "p", 28)(49, "a", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](50, "img", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()()()()()()()()();
        }
        if (rf & 2) {
          const f_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](13);
          const name_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](21);
          const subject_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](26);
          const email_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](31);
          const message_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayProperty"]("ngModel", ctx.model.name);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](8, _c0, f_r2.submitted && name_r3.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayProperty"]("ngModel", ctx.model.subject);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](10, _c0, f_r2.submitted && subject_r4.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayProperty"]("ngModel", ctx.model.email);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](12, _c0, f_r2.submitted && email_r5.invalid));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtwoWayProperty"]("ngModel", ctx.model.message);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](14, _c0, f_r2.submitted && message_r6.invalid));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.PatternValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgForm],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjb250YWN0LmNvbXBvbmVudC5zY3NzIn0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9jb250YWN0L2NvbnRhY3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLG9LQUFvSyIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 2698:
/*!**********************************************************!*\
  !*** ./src/app/profile/education/education.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EducationComponent: () => (/* binding */ EducationComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class EducationComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function EducationComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || EducationComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: EducationComponent,
      selectors: [["app-education"]],
      decls: 52,
      vars: 0,
      consts: [["id", "education", 1, "section"], [1, "container", "cc-education"], [1, "h4", "text-center", "mb-4", "title"], [1, "card"], [1, "row"], ["data-aos", "fade-right", "data-aos-duration", "500", "data-aos-offset", "50", 1, "col-md-3", "bg-primary"], [1, "card-body", "cc-education-header"], [1, "h5"], ["data-aos", "fade-left", "data-aos-duration", "500", "data-aos-offset", "50", 1, "col-md-9"], [1, "card-body"], [1, "h4"], [1, "category"]],
      template: function EducationComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Education");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3)(5, "div", 4)(6, "div", 5)(7, "div", 6)(8, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "2016-2020");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Bachelor Degree");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 8)(13, "div", 9)(14, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Bachelor of Technology in Computer Science");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "h4", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "GLA University");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "ul")(19, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Completed BTech in Computer Science with ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "8.03 GPA");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, ".");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 3)(25, "div", 4)(26, "div", 5)(27, "div", 6)(28, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "2016");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Intermediate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 8)(33, "div", 9)(34, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Physics, Chemistry, Maths");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "h4", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Ess Ess Convent School (CBSE)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 3)(39, "div", 4)(40, "div", 5)(41, "div", 6)(42, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "2014");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, "High School");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 8)(47, "div", 9)(48, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "Science and Computers");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "h4", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, "St. Conrad's Inter College (ICSE)");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()();
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJlZHVjYXRpb24uY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9lZHVjYXRpb24vZWR1Y2F0aW9uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSx3S0FBd0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 280:
/*!************************************************************!*\
  !*** ./src/app/profile/experience/experience.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExperienceComponent: () => (/* binding */ ExperienceComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _time_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../time.service */ 8220);


class ExperienceComponent {
  constructor(timeService) {
    this.timeService = timeService;
  }
  refreshData() {
    this.timeService.getNumberOfMonths().subscribe(data => {
      this.numberOfMonths = data;
    });
  }
  ngOnInit() {
    this.refreshData();
    this.interval = setInterval(() => {
      this.refreshData();
    }, 5000);
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  static {
    this.ɵfac = function ExperienceComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ExperienceComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_time_service__WEBPACK_IMPORTED_MODULE_0__.TimeService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ExperienceComponent,
      selectors: [["app-experience"]],
      decls: 91,
      vars: 1,
      consts: [["id", "experience", 1, "section"], [1, "container"], [1, "main-timeline"], [1, "timeline"], [1, "icon"], [1, "date-content"], [1, "date-outer"], [1, "date"], [1, "month"], [1, "year"], [1, "timeline-content"], [1, "title"], ["href", "https://www.games24x7.com/"], [1, "description"], ["href", "https://one.walmart.com/content/globaltechindia/en_in.html"], ["href", "https://www.extramarks.com/"]],
      template: function ExperienceComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 5)(6, "div", 6)(7, "span", 7)(8, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "2022/23");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 10)(13, "h5", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "SDE-2 at ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "a", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Games24x7");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, " Working as a backend developer in Platform services, for both RummyCircle and My11Circle. Technologies: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Java 11, Spring Boot, Neptune DB, MongoDB, ElasticSearch, Druid, Kafka, AWS, Concurrency");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "p")(23, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Stay: Oct 2022 - Present");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 5)(28, "div", 6)(29, "span", 7)(30, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "1.1 years");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "2021/22");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "div", 10)(35, "h5", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "SDE-1 at ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "a", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, "Games24x7");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](40, " Working as a backend developer in My11Circle team. Technologies: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](42, "Java 11, Spring Boot, Kafka, RabbitMQ, Zookeeper, MySQL, JSP, K8s, Docker, AWS");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](43, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "p")(45, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](46, "Stay: Oct 2021 - Oct 2022");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](48, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](49, "div", 5)(50, "div", 6)(51, "span", 7)(52, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](53, "4 months");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](54, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](55, "2021");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](56, "div", 10)(57, "h5", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](58, "SWE IN2 at ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "a", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](60, "Walmart Global Tech");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](61, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](62, " Worked as a full-stack developer at Walmart Global Tech. Technologies: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](63, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](64, "Java 8, Spring Boot, OneOps, WCNP, Angular 8, DB2");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](65, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](66, "p")(67, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](68, "Stay: May 2021 - Oct 2021");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](69, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](70, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](71, "div", 5)(72, "div", 6)(73, "span", 7)(74, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](75, "1.3 years");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](76, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](77, "2020/21");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](78, "div", 10)(79, "h5", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](80, "SDE 1 at ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](81, "a", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](82, "Extramarks Education");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](83, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](84, " Got hands on project experience, worked in a collaborative environment. Created from scratch projects and deployed it into production environment. Broke Monolithic architecture to Microservices and discussed the whole architecture with the team. Technologies: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](85, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](86, "Java 8/11, Spring Boot, OAuth2.0 + JWT, AWS Cognito, Docker, MySQL 8+");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](87, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](88, "p")(89, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](90, "Stay: Jan 2020 - March 2021");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx.numberOfMonths, " years");
        }
      },
      styles: ["body[_ngcontent-%COMP%] {\n  background-color: #f7f7f7;\n  margin-top: 20px;\n}\n\n.main-timeline[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.main-timeline[_ngcontent-%COMP%]:before {\n  content: \"\";\n  display: block;\n  width: 2px;\n  height: 100%;\n  background: #c6c6c6;\n  margin: 0 auto;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%] {\n  margin-bottom: 40px;\n  position: relative;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:after {\n  content: \"\";\n  display: block;\n  clear: both;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  line-height: 18px;\n  margin: auto;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]:before, \n.main-timeline[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]:after {\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  transition: all 0.33s ease-out 0s;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]:before {\n  background: #fff;\n  border: 2px solid #232323;\n  left: -3px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%]:after {\n  border: 2px solid #c6c6c6;\n  left: 3px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:hover   .icon[_ngcontent-%COMP%]:before {\n  left: 3px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:hover   .icon[_ngcontent-%COMP%]:after {\n  left: -3px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .date-content[_ngcontent-%COMP%] {\n  width: 50%;\n  float: left;\n  margin-top: 22px;\n  position: relative;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .date-content[_ngcontent-%COMP%]:before {\n  content: \"\";\n  width: 36.5%;\n  height: 2px;\n  background: #c6c6c6;\n  margin: auto 0;\n  position: absolute;\n  top: 0;\n  right: 10px;\n  bottom: 0;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%] {\n  width: 125px;\n  height: 125px;\n  font-size: 16px;\n  text-align: center;\n  margin: auto;\n  z-index: 1;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%]:before, \n.main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%]:after {\n  content: \"\";\n  width: 125px;\n  height: 125px;\n  margin: 0 auto;\n  border-radius: 50%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  transition: all 0.33s ease-out 0s;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%]:before {\n  background: #fff;\n  border: 2px solid #232323;\n  left: -6px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%]:after {\n  border: 2px solid #c6c6c6;\n  left: 6px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:hover   .date-outer[_ngcontent-%COMP%]:before {\n  left: 6px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:hover   .date-outer[_ngcontent-%COMP%]:after {\n  left: -6px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  width: 100%;\n  margin: auto;\n  position: absolute;\n  top: 27%;\n  left: 0;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .month[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 700;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .year[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 30px;\n  font-weight: 700;\n  color: #232323;\n  line-height: 36px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline-content[_ngcontent-%COMP%] {\n  width: 50%;\n  padding: 20px 0 20px 50px;\n  float: right;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  font-size: 19px;\n  font-weight: 700;\n  line-height: 24px;\n  margin: 0 0 15px 0;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:nth-child(2n)   .date-content[_ngcontent-%COMP%] {\n  float: right;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:nth-child(2n)   .date-content[_ngcontent-%COMP%]:before {\n  left: 10px;\n}\n\n.main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:nth-child(2n)   .timeline-content[_ngcontent-%COMP%] {\n  padding: 20px 50px 20px 0;\n  text-align: right;\n}\n\n@media only screen and (max-width: 991px) {\n  .main-timeline[_ngcontent-%COMP%]   .date-content[_ngcontent-%COMP%] {\n    margin-top: 35px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .date-content[_ngcontent-%COMP%]:before {\n    width: 22.5%;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .timeline-content[_ngcontent-%COMP%] {\n    padding: 10px 0 10px 30px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: 17px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:nth-child(2n)   .timeline-content[_ngcontent-%COMP%] {\n    padding: 10px 30px 10px 0;\n  }\n}\n@media only screen and (max-width: 767px) {\n  .main-timeline[_ngcontent-%COMP%]:before {\n    margin: 0;\n    left: 7px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%] {\n    margin-bottom: 20px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:last-child {\n    margin-bottom: 0;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n    margin: auto 0;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .date-content[_ngcontent-%COMP%] {\n    width: 95%;\n    float: right;\n    margin-top: 0;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .date-content[_ngcontent-%COMP%]:before {\n    display: none;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%] {\n    width: 110px;\n    height: 110px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%]:before, \n   .main-timeline[_ngcontent-%COMP%]   .date-outer[_ngcontent-%COMP%]:after {\n    width: 110px;\n    height: 110px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n    top: 30%;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .year[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .timeline-content[_ngcontent-%COMP%], \n   .main-timeline[_ngcontent-%COMP%]   .timeline[_ngcontent-%COMP%]:nth-child(2n)   .timeline-content[_ngcontent-%COMP%] {\n    width: 95%;\n    text-align: center;\n    padding: 10px 0;\n  }\n  .main-timeline[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    margin-bottom: 10px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4cGVyaWVuY2UuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx5QkFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsV0FBQTtFQUNBLGNBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxXQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7QUFDRjs7QUFFQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0FBQ0Y7O0FBRUE7O0VBRUUsV0FBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsaUNBQUE7QUFDRjs7QUFFQTtFQUNFLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxVQUFBO0FBQ0Y7O0FBRUE7RUFDRSx5QkFBQTtFQUNBLFNBQUE7QUFDRjs7QUFFQTtFQUNFLFNBQUE7QUFDRjs7QUFFQTtFQUNFLFVBQUE7QUFDRjs7QUFFQTtFQUNFLFVBQUE7RUFDQSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsV0FBQTtFQUNBLFNBQUE7QUFDRjs7QUFFQTtFQUNFLFlBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7QUFDRjs7QUFFQTs7RUFFRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLGlDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxnQkFBQTtFQUNBLHlCQUFBO0VBQ0EsVUFBQTtBQUNGOztBQUVBO0VBQ0UseUJBQUE7RUFDQSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRSxVQUFBO0FBQ0Y7O0FBRUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLE9BQUE7QUFDRjs7QUFFQTtFQUNFLGVBQUE7RUFDQSxnQkFBQTtBQUNGOztBQUVBO0VBQ0UsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBQUNGOztBQUVBO0VBQ0UsVUFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLFlBQUE7QUFDRjs7QUFFQTtFQUNFLFVBQUE7QUFDRjs7QUFFQTtFQUNFLHlCQUFBO0VBQ0EsaUJBQUE7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsZ0JBQUE7RUFDRjtFQUNBO0lBQ0UsWUFBQTtFQUNGO0VBQ0E7SUFDRSx5QkFBQTtFQUNGO0VBQ0E7SUFDRSxlQUFBO0VBQ0Y7RUFDQTtJQUNFLHlCQUFBO0VBQ0Y7QUFDRjtBQUVBO0VBQ0U7SUFDRSxTQUFBO0lBQ0EsU0FBQTtFQUFGO0VBRUE7SUFDRSxtQkFBQTtFQUFGO0VBRUE7SUFDRSxnQkFBQTtFQUFGO0VBRUE7SUFDRSxjQUFBO0VBQUY7RUFFQTtJQUNFLFVBQUE7SUFDQSxZQUFBO0lBQ0EsYUFBQTtFQUFGO0VBRUE7SUFDRSxhQUFBO0VBQUY7RUFFQTtJQUNFLFlBQUE7SUFDQSxhQUFBO0VBQUY7RUFFQTs7SUFFRSxZQUFBO0lBQ0EsYUFBQTtFQUFGO0VBRUE7SUFDRSxRQUFBO0VBQUY7RUFFQTtJQUNFLGVBQUE7RUFBRjtFQUVBOztJQUVFLFVBQUE7SUFDQSxrQkFBQTtJQUNBLGVBQUE7RUFBRjtFQUVBO0lBQ0UsbUJBQUE7RUFBRjtBQUNGIiwiZmlsZSI6ImV4cGVyaWVuY2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5e1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xuICBtYXJnaW4tdG9wOjIwcHg7XG59XG5cbi5tYWluLXRpbWVsaW5lIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlXG59XG5cbi5tYWluLXRpbWVsaW5lOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMnB4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQ6ICNjNmM2YzY7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDBcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lIHtcbiAgbWFyZ2luLWJvdHRvbTogNDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlXG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjbGVhcjogYm90aFxufVxuXG4ubWFpbi10aW1lbGluZSAuaWNvbiB7XG4gIHdpZHRoOiAxOHB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICBtYXJnaW46IGF1dG87XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC5pY29uOmJlZm9yZSxcbi5tYWluLXRpbWVsaW5lIC5pY29uOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMzNzIGVhc2Utb3V0IDBzXG59XG5cbi5tYWluLXRpbWVsaW5lIC5pY29uOmJlZm9yZSB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogMnB4IHNvbGlkICMyMzIzMjM7XG4gIGxlZnQ6IC0zcHhcbn1cblxuLm1haW4tdGltZWxpbmUgLmljb246YWZ0ZXIge1xuICBib3JkZXI6IDJweCBzb2xpZCAjYzZjNmM2O1xuICBsZWZ0OiAzcHhcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOmhvdmVyIC5pY29uOmJlZm9yZSB7XG4gIGxlZnQ6IDNweFxufVxuXG4ubWFpbi10aW1lbGluZSAudGltZWxpbmU6aG92ZXIgLmljb246YWZ0ZXIge1xuICBsZWZ0OiAtM3B4XG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLWNvbnRlbnQge1xuICB3aWR0aDogNTAlO1xuICBmbG9hdDogbGVmdDtcbiAgbWFyZ2luLXRvcDogMjJweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlXG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLWNvbnRlbnQ6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDM2LjUlO1xuICBoZWlnaHQ6IDJweDtcbiAgYmFja2dyb3VuZDogI2M2YzZjNjtcbiAgbWFyZ2luOiBhdXRvIDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMTBweDtcbiAgYm90dG9tOiAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyIHtcbiAgd2lkdGg6IDEyNXB4O1xuICBoZWlnaHQ6IDEyNXB4O1xuICBmb250LXNpemU6IDE2cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luOiBhdXRvO1xuICB6LWluZGV4OiAxXG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmJlZm9yZSxcbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDEyNXB4O1xuICBoZWlnaHQ6IDEyNXB4O1xuICBtYXJnaW46IDAgYXV0bztcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIHRyYW5zaXRpb246IGFsbCAwLjMzcyBlYXNlLW91dCAwc1xufVxuXG4ubWFpbi10aW1lbGluZSAuZGF0ZS1vdXRlcjpiZWZvcmUge1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXI6IDJweCBzb2xpZCAjMjMyMzIzO1xuICBsZWZ0OiAtNnB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgYm9yZGVyOiAycHggc29saWQgI2M2YzZjNjtcbiAgbGVmdDogNnB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTpob3ZlciAuZGF0ZS1vdXRlcjpiZWZvcmUge1xuICBsZWZ0OiA2cHhcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOmhvdmVyIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgbGVmdDogLTZweFxufVxuXG4ubWFpbi10aW1lbGluZSAuZGF0ZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW46IGF1dG87XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAyNyU7XG4gIGxlZnQ6IDBcbn1cblxuLm1haW4tdGltZWxpbmUgLm1vbnRoIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogNzAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC55ZWFyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICMyMzIzMjM7XG4gIGxpbmUtaGVpZ2h0OiAzNnB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZS1jb250ZW50IHtcbiAgd2lkdGg6IDUwJTtcbiAgcGFkZGluZzogMjBweCAwIDIwcHggNTBweDtcbiAgZmxvYXQ6IHJpZ2h0XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTlweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gIG1hcmdpbjogMCAwIDE1cHggMFxufVxuXG4ubWFpbi10aW1lbGluZSAuZGVzY3JpcHRpb24ge1xuICBtYXJnaW4tYm90dG9tOiAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTpudGgtY2hpbGQoMm4pIC5kYXRlLWNvbnRlbnQge1xuICBmbG9hdDogcmlnaHRcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOm50aC1jaGlsZCgybikgLmRhdGUtY29udGVudDpiZWZvcmUge1xuICBsZWZ0OiAxMHB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTpudGgtY2hpbGQoMm4pIC50aW1lbGluZS1jb250ZW50IHtcbiAgcGFkZGluZzogMjBweCA1MHB4IDIwcHggMDtcbiAgdGV4dC1hbGlnbjogcmlnaHRcbn1cblxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA5OTFweCkge1xuICAubWFpbi10aW1lbGluZSAuZGF0ZS1jb250ZW50IHtcbiAgICBtYXJnaW4tdG9wOiAzNXB4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLmRhdGUtY29udGVudDpiZWZvcmUge1xuICAgIHdpZHRoOiAyMi41JVxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC50aW1lbGluZS1jb250ZW50IHtcbiAgICBwYWRkaW5nOiAxMHB4IDAgMTBweCAzMHB4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLnRpdGxlIHtcbiAgICBmb250LXNpemU6IDE3cHhcbiAgfVxuICAubWFpbi10aW1lbGluZSAudGltZWxpbmU6bnRoLWNoaWxkKDJuKSAudGltZWxpbmUtY29udGVudCB7XG4gICAgcGFkZGluZzogMTBweCAzMHB4IDEwcHggMFxuICB9XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY3cHgpIHtcbiAgLm1haW4tdGltZWxpbmU6YmVmb3JlIHtcbiAgICBtYXJnaW46IDA7XG4gICAgbGVmdDogN3B4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lIHtcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOmxhc3QtY2hpbGQge1xuICAgIG1hcmdpbi1ib3R0b206IDBcbiAgfVxuICAubWFpbi10aW1lbGluZSAuaWNvbiB7XG4gICAgbWFyZ2luOiBhdXRvIDBcbiAgfVxuICAubWFpbi10aW1lbGluZSAuZGF0ZS1jb250ZW50IHtcbiAgICB3aWR0aDogOTUlO1xuICAgIGZsb2F0OiByaWdodDtcbiAgICBtYXJnaW4tdG9wOiAwXG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLmRhdGUtY29udGVudDpiZWZvcmUge1xuICAgIGRpc3BsYXk6IG5vbmVcbiAgfVxuICAubWFpbi10aW1lbGluZSAuZGF0ZS1vdXRlciB7XG4gICAgd2lkdGg6IDExMHB4O1xuICAgIGhlaWdodDogMTEwcHhcbiAgfVxuICAubWFpbi10aW1lbGluZSAuZGF0ZS1vdXRlcjpiZWZvcmUsXG4gIC5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgICB3aWR0aDogMTEwcHg7XG4gICAgaGVpZ2h0OiAxMTBweFxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC5kYXRlIHtcbiAgICB0b3A6IDMwJVxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC55ZWFyIHtcbiAgICBmb250LXNpemU6IDI0cHhcbiAgfVxuICAubWFpbi10aW1lbGluZSAudGltZWxpbmUtY29udGVudCxcbiAgLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOm50aC1jaGlsZCgybikgLnRpbWVsaW5lLWNvbnRlbnQge1xuICAgIHdpZHRoOiA5NSU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHBhZGRpbmc6IDEwcHggMFxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC50aXRsZSB7XG4gICAgbWFyZ2luLWJvdHRvbTogMTBweFxuICB9XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9leHBlcmllbmNlL2V4cGVyaWVuY2UuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx5QkFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsV0FBQTtFQUNBLGNBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxXQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7QUFDRjs7QUFFQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0FBQ0Y7O0FBRUE7O0VBRUUsV0FBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsaUNBQUE7QUFDRjs7QUFFQTtFQUNFLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxVQUFBO0FBQ0Y7O0FBRUE7RUFDRSx5QkFBQTtFQUNBLFNBQUE7QUFDRjs7QUFFQTtFQUNFLFNBQUE7QUFDRjs7QUFFQTtFQUNFLFVBQUE7QUFDRjs7QUFFQTtFQUNFLFVBQUE7RUFDQSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsV0FBQTtFQUNBLFNBQUE7QUFDRjs7QUFFQTtFQUNFLFlBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7QUFDRjs7QUFFQTs7RUFFRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLGlDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxnQkFBQTtFQUNBLHlCQUFBO0VBQ0EsVUFBQTtBQUNGOztBQUVBO0VBQ0UseUJBQUE7RUFDQSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRSxVQUFBO0FBQ0Y7O0FBRUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLE9BQUE7QUFDRjs7QUFFQTtFQUNFLGVBQUE7RUFDQSxnQkFBQTtBQUNGOztBQUVBO0VBQ0UsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBQUNGOztBQUVBO0VBQ0UsVUFBQTtFQUNBLHlCQUFBO0VBQ0EsWUFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLFlBQUE7QUFDRjs7QUFFQTtFQUNFLFVBQUE7QUFDRjs7QUFFQTtFQUNFLHlCQUFBO0VBQ0EsaUJBQUE7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsZ0JBQUE7RUFDRjtFQUNBO0lBQ0UsWUFBQTtFQUNGO0VBQ0E7SUFDRSx5QkFBQTtFQUNGO0VBQ0E7SUFDRSxlQUFBO0VBQ0Y7RUFDQTtJQUNFLHlCQUFBO0VBQ0Y7QUFDRjtBQUVBO0VBQ0U7SUFDRSxTQUFBO0lBQ0EsU0FBQTtFQUFGO0VBRUE7SUFDRSxtQkFBQTtFQUFGO0VBRUE7SUFDRSxnQkFBQTtFQUFGO0VBRUE7SUFDRSxjQUFBO0VBQUY7RUFFQTtJQUNFLFVBQUE7SUFDQSxZQUFBO0lBQ0EsYUFBQTtFQUFGO0VBRUE7SUFDRSxhQUFBO0VBQUY7RUFFQTtJQUNFLFlBQUE7SUFDQSxhQUFBO0VBQUY7RUFFQTs7SUFFRSxZQUFBO0lBQ0EsYUFBQTtFQUFGO0VBRUE7SUFDRSxRQUFBO0VBQUY7RUFFQTtJQUNFLGVBQUE7RUFBRjtFQUVBOztJQUVFLFVBQUE7SUFDQSxrQkFBQTtJQUNBLGVBQUE7RUFBRjtFQUVBO0lBQ0UsbUJBQUE7RUFBRjtBQUNGO0FBQ0EsdzRRQUF3NFEiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5e1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xuICBtYXJnaW4tdG9wOjIwcHg7XG59XG5cbi5tYWluLXRpbWVsaW5lIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlXG59XG5cbi5tYWluLXRpbWVsaW5lOmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMnB4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQ6ICNjNmM2YzY7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDBcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lIHtcbiAgbWFyZ2luLWJvdHRvbTogNDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlXG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBjbGVhcjogYm90aFxufVxuXG4ubWFpbi10aW1lbGluZSAuaWNvbiB7XG4gIHdpZHRoOiAxOHB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGxpbmUtaGVpZ2h0OiAxOHB4O1xuICBtYXJnaW46IGF1dG87XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICBib3R0b206IDA7XG4gIHJpZ2h0OiAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC5pY29uOmJlZm9yZSxcbi5tYWluLXRpbWVsaW5lIC5pY29uOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMzNzIGVhc2Utb3V0IDBzXG59XG5cbi5tYWluLXRpbWVsaW5lIC5pY29uOmJlZm9yZSB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogMnB4IHNvbGlkICMyMzIzMjM7XG4gIGxlZnQ6IC0zcHhcbn1cblxuLm1haW4tdGltZWxpbmUgLmljb246YWZ0ZXIge1xuICBib3JkZXI6IDJweCBzb2xpZCAjYzZjNmM2O1xuICBsZWZ0OiAzcHhcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOmhvdmVyIC5pY29uOmJlZm9yZSB7XG4gIGxlZnQ6IDNweFxufVxuXG4ubWFpbi10aW1lbGluZSAudGltZWxpbmU6aG92ZXIgLmljb246YWZ0ZXIge1xuICBsZWZ0OiAtM3B4XG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLWNvbnRlbnQge1xuICB3aWR0aDogNTAlO1xuICBmbG9hdDogbGVmdDtcbiAgbWFyZ2luLXRvcDogMjJweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlXG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLWNvbnRlbnQ6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDM2LjUlO1xuICBoZWlnaHQ6IDJweDtcbiAgYmFja2dyb3VuZDogI2M2YzZjNjtcbiAgbWFyZ2luOiBhdXRvIDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMTBweDtcbiAgYm90dG9tOiAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyIHtcbiAgd2lkdGg6IDEyNXB4O1xuICBoZWlnaHQ6IDEyNXB4O1xuICBmb250LXNpemU6IDE2cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luOiBhdXRvO1xuICB6LWluZGV4OiAxXG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmJlZm9yZSxcbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDEyNXB4O1xuICBoZWlnaHQ6IDEyNXB4O1xuICBtYXJnaW46IDAgYXV0bztcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIHRyYW5zaXRpb246IGFsbCAwLjMzcyBlYXNlLW91dCAwc1xufVxuXG4ubWFpbi10aW1lbGluZSAuZGF0ZS1vdXRlcjpiZWZvcmUge1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXI6IDJweCBzb2xpZCAjMjMyMzIzO1xuICBsZWZ0OiAtNnB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgYm9yZGVyOiAycHggc29saWQgI2M2YzZjNjtcbiAgbGVmdDogNnB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTpob3ZlciAuZGF0ZS1vdXRlcjpiZWZvcmUge1xuICBsZWZ0OiA2cHhcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOmhvdmVyIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgbGVmdDogLTZweFxufVxuXG4ubWFpbi10aW1lbGluZSAuZGF0ZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW46IGF1dG87XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAyNyU7XG4gIGxlZnQ6IDBcbn1cblxuLm1haW4tdGltZWxpbmUgLm1vbnRoIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogNzAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC55ZWFyIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6ICMyMzIzMjM7XG4gIGxpbmUtaGVpZ2h0OiAzNnB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZS1jb250ZW50IHtcbiAgd2lkdGg6IDUwJTtcbiAgcGFkZGluZzogMjBweCAwIDIwcHggNTBweDtcbiAgZmxvYXQ6IHJpZ2h0XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTlweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gIG1hcmdpbjogMCAwIDE1cHggMFxufVxuXG4ubWFpbi10aW1lbGluZSAuZGVzY3JpcHRpb24ge1xuICBtYXJnaW4tYm90dG9tOiAwXG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTpudGgtY2hpbGQoMm4pIC5kYXRlLWNvbnRlbnQge1xuICBmbG9hdDogcmlnaHRcbn1cblxuLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOm50aC1jaGlsZCgybikgLmRhdGUtY29udGVudDpiZWZvcmUge1xuICBsZWZ0OiAxMHB4XG59XG5cbi5tYWluLXRpbWVsaW5lIC50aW1lbGluZTpudGgtY2hpbGQoMm4pIC50aW1lbGluZS1jb250ZW50IHtcbiAgcGFkZGluZzogMjBweCA1MHB4IDIwcHggMDtcbiAgdGV4dC1hbGlnbjogcmlnaHRcbn1cblxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA5OTFweCkge1xuICAubWFpbi10aW1lbGluZSAuZGF0ZS1jb250ZW50IHtcbiAgICBtYXJnaW4tdG9wOiAzNXB4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLmRhdGUtY29udGVudDpiZWZvcmUge1xuICAgIHdpZHRoOiAyMi41JVxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC50aW1lbGluZS1jb250ZW50IHtcbiAgICBwYWRkaW5nOiAxMHB4IDAgMTBweCAzMHB4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLnRpdGxlIHtcbiAgICBmb250LXNpemU6IDE3cHhcbiAgfVxuICAubWFpbi10aW1lbGluZSAudGltZWxpbmU6bnRoLWNoaWxkKDJuKSAudGltZWxpbmUtY29udGVudCB7XG4gICAgcGFkZGluZzogMTBweCAzMHB4IDEwcHggMFxuICB9XG59XG5cbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY3cHgpIHtcbiAgLm1haW4tdGltZWxpbmU6YmVmb3JlIHtcbiAgICBtYXJnaW46IDA7XG4gICAgbGVmdDogN3B4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lIHtcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4XG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOmxhc3QtY2hpbGQge1xuICAgIG1hcmdpbi1ib3R0b206IDBcbiAgfVxuICAubWFpbi10aW1lbGluZSAuaWNvbiB7XG4gICAgbWFyZ2luOiBhdXRvIDBcbiAgfVxuICAubWFpbi10aW1lbGluZSAuZGF0ZS1jb250ZW50IHtcbiAgICB3aWR0aDogOTUlO1xuICAgIGZsb2F0OiByaWdodDtcbiAgICBtYXJnaW4tdG9wOiAwXG4gIH1cbiAgLm1haW4tdGltZWxpbmUgLmRhdGUtY29udGVudDpiZWZvcmUge1xuICAgIGRpc3BsYXk6IG5vbmVcbiAgfVxuICAubWFpbi10aW1lbGluZSAuZGF0ZS1vdXRlciB7XG4gICAgd2lkdGg6IDExMHB4O1xuICAgIGhlaWdodDogMTEwcHhcbiAgfVxuICAubWFpbi10aW1lbGluZSAuZGF0ZS1vdXRlcjpiZWZvcmUsXG4gIC5tYWluLXRpbWVsaW5lIC5kYXRlLW91dGVyOmFmdGVyIHtcbiAgICB3aWR0aDogMTEwcHg7XG4gICAgaGVpZ2h0OiAxMTBweFxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC5kYXRlIHtcbiAgICB0b3A6IDMwJVxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC55ZWFyIHtcbiAgICBmb250LXNpemU6IDI0cHhcbiAgfVxuICAubWFpbi10aW1lbGluZSAudGltZWxpbmUtY29udGVudCxcbiAgLm1haW4tdGltZWxpbmUgLnRpbWVsaW5lOm50aC1jaGlsZCgybikgLnRpbWVsaW5lLWNvbnRlbnQge1xuICAgIHdpZHRoOiA5NSU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHBhZGRpbmc6IDEwcHggMFxuICB9XG4gIC5tYWluLXRpbWVsaW5lIC50aXRsZSB7XG4gICAgbWFyZ2luLWJvdHRvbTogMTBweFxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 9834:
/*!****************************************************!*\
  !*** ./src/app/profile/footer/footer.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FooterComponent: () => (/* binding */ FooterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class FooterComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function FooterComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FooterComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FooterComponent,
      selectors: [["app-footer"]],
      decls: 9,
      vars: 0,
      consts: [[1, "footer"], [1, "container", "text-center"], ["href", "https://www.linkedin.com/in/ankit-sharma-5b1b35158/", "rel", "tooltip", "target", "_blank", "title", "Follow me on Linkedin", 1, "cc-linkedin", "btn", "btn-link"], ["aria-hidden", "true", 1, "fa", "fa-linkedin"], ["href", "https://github.com/beingmartinbmc", "rel", "tooltip", "target", "_blank", "title", "Follow me on Github", 1, "cc-github", "btn", "btn-link"], ["aria-hidden", "true", 1, "fa", "fa-github"], [1, "text-center", "text-muted"]],
      template: function FooterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "footer", 0)(1, "div", 1)(2, "a", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "i", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "i", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6)(7, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "\u00A9 All rights reserved.");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmb290ZXIuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9mb290ZXIvZm9vdGVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxvS0FBb0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 9702:
/*!****************************************************!*\
  !*** ./src/app/profile/header/header.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderComponent: () => (/* binding */ HeaderComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class HeaderComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function HeaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || HeaderComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: HeaderComponent,
      selectors: [["app-header"]],
      decls: 31,
      vars: 0,
      consts: [[1, "profile-page", "sidebar-collapse"], ["color-on-scroll", "400", 1, "navbar", "navbar-expand-lg", "fixed-top", "navbar-transparent", "bg-primary"], [1, "container"], [1, "navbar-translate"], ["href", "#", "rel", "tooltip", 1, "navbar-brand"], ["aria-controls", "navigation", "aria-expanded", "false", "aria-label", "Toggle navigation", "data-target", "#navigation", "data-toggle", "collapse", "type", "button", 1, "navbar-toggler", "navbar-toggler"], [1, "navbar-toggler-bar", "bar1"], [1, "navbar-toggler-bar", "bar2"], [1, "navbar-toggler-bar", "bar3"], ["id", "navigation", 1, "collapse", "navbar-collapse", "justify-content-end"], [1, "navbar-nav"], [1, "nav-item", 2, "color", "black"], ["href", "#about", 1, "nav-link", "smooth-scroll"], [1, "nav-item"], ["href", "#experience", 1, "nav-link", "smooth-scroll"], ["href", "#publications", 1, "nav-link", "smooth-scroll"], ["href", "#skill", 1, "nav-link", "smooth-scroll"], ["href", "#education", 1, "nav-link", "smooth-scroll"], ["href", "#contact", 1, "nav-link", "smooth-scroll"]],
      template: function HeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "header")(1, "div", 0)(2, "nav", 1)(3, "div", 2)(4, "div", 3)(5, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Ankit Sharma");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "span", 6)(9, "span", 7)(10, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 9)(12, "ul", 10)(13, "li", 11)(14, "a", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "About");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "li", 13)(17, "a", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Experience");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "li", 13)(20, "a", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Projects");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "li", 13)(23, "a", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Skills");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "li", 13)(26, "a", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Education");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "li", 13)(29, "a", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Contact");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()()();
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJoZWFkZXIuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxvS0FBb0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 6234:
/*!**************************************************!*\
  !*** ./src/app/profile/intro/intro.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IntroComponent: () => (/* binding */ IntroComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class IntroComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function IntroComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || IntroComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: IntroComponent,
      selectors: [["app-intro"]],
      decls: 25,
      vars: 0,
      consts: [[1, "profile-page"], [1, "wrapper"], ["filter-color", "orange", 1, "page-header", "page-header-small"], [1, "container"], [1, "content-center"], [1, "profile-image"], ["href", "#"], ["alt", "Profile Image", "src", "assets/images/ankit.jpg"], [1, "h2", "title"], [1, "category", "text-white"], ["data-aos", "zoom-in", "data-aos-anchor", "data-aos-anchor", "href", "#contact", 1, "btn", "bg-primary", "smooth-scroll", "mr-2"], ["data-aos", "zoom-in", "data-aos-anchor", "data-aos-anchor", "href", "https://drive.google.com/file/d/1QkKUwjBXfw8MGR2V8z8ryOqA5q6pEfjw/view?usp=sharing", "target", "_blank", 1, "btn", "bg-primary", "smooth-scroll", "mr-2"], [1, "section"], [1, "button-container"], ["href", "https://www.linkedin.com/in/ankit-sharma-5b1b35158/", "rel", "tooltip", "target", "_blank", "title", "Follow me on Linkedin", 1, "btn", "btn-default", "btn-round", "btn-lg", "btn-icon"], ["alt", "LinkedIn", "src", "assets/images/linked.png"], ["href", "https://github.com/beingmartinbmc", "rel", "tooltip", "target", "_blank", "title", "Fork me on Github", 1, "btn", "btn-default", "btn-round", "btn-lg", "btn-icon", 2, "background-color", "white"], ["alt", "Github", "src", "assets/images/github.png"], ["href", "https://stackoverflow.com/users/7972621/ankit-sharma", "rel", "tooltip", "target", "_blank", "title", "Check my answers on Stackoverflow", 1, "btn", "btn-default", "btn-round", "btn-lg", "btn-icon"], ["alt", "Stackoverflow", "src", "assets/images/stackoverflow.png"]],
      template: function IntroComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "a", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "img", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Ankit Sharma");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Software Developer");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Hire Me");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Download CV");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 12)(17, "div", 3)(18, "div", 13)(19, "a", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "img", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "a", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "img", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "a", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "img", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()();
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpbnRyby5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9pbnRyby9pbnRyby5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsZ0tBQWdLIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 712:
/*!********************************************************!*\
  !*** ./src/app/profile/particle/particle.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ParticleComponent: () => (/* binding */ ParticleComponent)
/* harmony export */ });
/* harmony import */ var particles_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! particles.ts */ 7476);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);


const _c0 = ["canvas"];
class ParticleComponent {
  constructor() {}
  ngOnInit() {
    this.myParams = {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ffffff'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: 'img/github.svg',
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 10,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      }
    };
    this.particles = new particles_ts__WEBPACK_IMPORTED_MODULE_0__.Particles('particles-js', this.objectToStringMap(this.myParams)).start();
  }
  ngAfterViewInit() {
    // this.canvas.nativeElement;
  }
  objectToStringMap(obj) {
    const strMap = new Map();
    for (const k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }
  jsonToStringMap(jsonStr) {
    return this.objectToStringMap(JSON.parse(jsonStr));
  }
  static {
    this.ɵfac = function ParticleComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ParticleComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ParticleComponent,
      selectors: [["app-particle"]],
      viewQuery: function ParticleComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.canvas = _t.first);
        }
      },
      decls: 2,
      vars: 0,
      consts: [["canvas", ""], ["id", "particles-js"]],
      template: function ParticleComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div", 1, 0);
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwYXJ0aWNsZS5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9wYXJ0aWNsZS9wYXJ0aWNsZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0Esb0tBQW9LIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 300:
/*!**********************************************!*\
  !*** ./src/app/profile/profile.component.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfileComponent: () => (/* binding */ ProfileComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-spinner */ 1249);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header/header.component */ 9702);
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./footer/footer.component */ 9834);
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./about/about.component */ 4990);
/* harmony import */ var _intro_intro_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./intro/intro.component */ 6234);
/* harmony import */ var _contact_contact_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./contact/contact.component */ 9382);
/* harmony import */ var _education_education_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./education/education.component */ 2698);
/* harmony import */ var _experience_experience_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./experience/experience.component */ 280);
/* harmony import */ var _skills_skills_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./skills/skills.component */ 5856);
/* harmony import */ var _publications_publications_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./publications/publications.component */ 7926);











class ProfileComponent {
  constructor(spinner) {
    this.spinner = spinner;
    this.myStyle = {};
    this.myParams = {};
    this.width = 100;
    this.height = 100;
  }
  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.particles2();
  }
  particles2() {
    this.myStyle = {
      position: 'fixed',
      width: '100%',
      height: '100%',
      'z-index': -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
    this.myParams = {
      particles: {
        number: {
          value: 200
        },
        color: {
          value: '#ff0000'
        },
        shape: {
          type: 'triangle'
        }
      }
    };
  }
  particles() {
    this.myStyle = {
      position: 'fixed',
      width: '100%',
      height: '100%',
      'z-index': -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
    this.myParams = {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ffffff'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: 'img/github.svg',
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 10,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      }
    };
  }
  static {
    this.ɵfac = function ProfileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](ngx_spinner__WEBPACK_IMPORTED_MODULE_10__.NgxSpinnerService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
      type: ProfileComponent,
      selectors: [["app-profile"]],
      decls: 10,
      vars: 0,
      consts: [[1, "page-content"]],
      template: function ProfileComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "app-header");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](2, "app-intro")(3, "app-about")(4, "app-skills")(5, "app-experience")(6, "app-publications")(7, "app-education")(8, "app-contact");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](9, "app-footer");
        }
      },
      dependencies: [_header_header_component__WEBPACK_IMPORTED_MODULE_0__.HeaderComponent, _footer_footer_component__WEBPACK_IMPORTED_MODULE_1__.FooterComponent, _about_about_component__WEBPACK_IMPORTED_MODULE_2__.AboutComponent, _intro_intro_component__WEBPACK_IMPORTED_MODULE_3__.IntroComponent, _contact_contact_component__WEBPACK_IMPORTED_MODULE_4__.ContactComponent, _education_education_component__WEBPACK_IMPORTED_MODULE_5__.EducationComponent, _experience_experience_component__WEBPACK_IMPORTED_MODULE_6__.ExperienceComponent, _skills_skills_component__WEBPACK_IMPORTED_MODULE_7__.SkillsComponent, _publications_publications_component__WEBPACK_IMPORTED_MODULE_8__.PublicationsComponent],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9maWxlLmNvbXBvbmVudC5zY3NzIn0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxvS0FBb0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 4219:
/*!*******************************************!*\
  !*** ./src/app/profile/profile.module.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfileModule: () => (/* binding */ ProfileModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 316);
/* harmony import */ var _profile_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./profile.component */ 300);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header/header.component */ 9702);
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./footer/footer.component */ 9834);
/* harmony import */ var _intro_intro_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./intro/intro.component */ 6234);
/* harmony import */ var _about_about_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./about/about.component */ 4990);
/* harmony import */ var _contact_contact_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./contact/contact.component */ 9382);
/* harmony import */ var _education_education_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./education/education.component */ 2698);
/* harmony import */ var _experience_experience_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./experience/experience.component */ 280);
/* harmony import */ var _skills_skills_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./skills/skills.component */ 5856);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _profile_publications_publications_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../profile/publications/publications.component */ 7926);
/* harmony import */ var _particle_particle_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./particle/particle.component */ 712);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 7580);

// import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';





// import {NgxSpinnerModule} from 'ngx-spinner';






// import {ParticlesModule} from 'angular-particle';


class ProfileModule {
  static {
    this.ɵfac = function ProfileModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ProfileModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
      type: ProfileModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule,
      // SnotifyModule,
      _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](ProfileModule, {
    declarations: [_profile_component__WEBPACK_IMPORTED_MODULE_0__.ProfileComponent, _header_header_component__WEBPACK_IMPORTED_MODULE_1__.HeaderComponent, _footer_footer_component__WEBPACK_IMPORTED_MODULE_2__.FooterComponent, _about_about_component__WEBPACK_IMPORTED_MODULE_4__.AboutComponent, _intro_intro_component__WEBPACK_IMPORTED_MODULE_3__.IntroComponent, _contact_contact_component__WEBPACK_IMPORTED_MODULE_5__.ContactComponent, _education_education_component__WEBPACK_IMPORTED_MODULE_6__.EducationComponent, _experience_experience_component__WEBPACK_IMPORTED_MODULE_7__.ExperienceComponent, _skills_skills_component__WEBPACK_IMPORTED_MODULE_8__.SkillsComponent, _profile_publications_publications_component__WEBPACK_IMPORTED_MODULE_9__.PublicationsComponent, _particle_particle_component__WEBPACK_IMPORTED_MODULE_10__.ParticleComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule,
    // SnotifyModule,
    _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule]
  });
})();

/***/ }),

/***/ 7926:
/*!****************************************************************!*\
  !*** ./src/app/profile/publications/publications.component.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PublicationsComponent: () => (/* binding */ PublicationsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class PublicationsComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function PublicationsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PublicationsComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PublicationsComponent,
      selectors: [["app-publications"]],
      decls: 63,
      vars: 0,
      consts: [["id", "publications", 1, "section"], [1, "container", "cc-education"], [1, "h4", "text-center", "mb-4", "title"], [1, "card"], [1, "row"], ["data-aos", "fade-right", "data-aos-duration", "500", "data-aos-offset", "50", 1, "col-md-3", 2, "text-align", "center"], [1, "card-body", 2, "margin", "auto"], ["href", "https://github.com/beingmartinbmc/SortMe", "target", "_blank"], ["alt", "SortMe", "border", "0", "height", "200", "src", "assets/images/SortMe.gif", "width", "200"], ["data-aos", "fade-left", "data-aos-duration", "500", "data-aos-offset", "50", 1, "col-md-9"], [1, "card-body"], [1, "h5", "mb-3"], ["align", "justify"], ["href", "https://github.com/beingmartinbmc/LearnTrees", "target", "_blank"], ["alt", "SortMe", "border", "0", "height", "200", "src", "assets/images/trees.gif", "width", "400"], ["href", "https://github.com/beingmartinbmc/AutocompleteEngine", "target", "_blank"], ["alt", "SortMe", "border", "0", "height", "200", "src", "assets/images/trie.gif", "width", "400"], ["href", "https://sersc.org/journals/index.php/IJCA/article/view/18866", "target", "_blank"], ["alt", "SortMe", "border", "0", "height", "200", "src", "assets/images/umpire.png", "width", "400"]],
      template: function PublicationsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Projects");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3)(5, "div", 4)(6, "div", 5)(7, "div", 6)(8, "a", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "img", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 9)(11, "div", 10)(12, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "SortMe");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " Part of Algorithmic Visualization. Visualizing various sorting algorithms. Algorithms included BubbleSort, SelectionSort, InsertionSort, MergeSort, QuickSort, and HeapSort ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " One can clearly observe the difference in the time taken by O(n\u00B2) and O(nlogn) Comparisons");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 3)(19, "div", 4)(20, "div", 5)(21, "div", 6)(22, "a", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "img", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 9)(25, "div", 10)(26, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "LearnTrees");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "p", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, " Part of Algorithmic Visualization. Learning application for datastructures and algorithms. It provides the visualisation for trees ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "BST, AVL, and RB");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, " Helps to figure out the Rotations performed in a Data Tree");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 3)(35, "div", 4)(36, "div", 5)(37, "div", 6)(38, "a", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "img", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 9)(41, "div", 10)(42, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "Autocomplete Engine");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "p", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, " Implemented an auto-complete feature from scratch using Tries. Used a word file around (900K-1M) and provided real time suggestions. Moving a step ahead, built a spell checker ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, "(threshold level 2) ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 3)(49, "div", 4)(50, "div", 5)(51, "div", 6)(52, "a", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](53, "img", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 9)(55, "div", 10)(56, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Umpire Gesture Recognition");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "p", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, " Implemented an umpire gesture recognition system using ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "b");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "Digital Image Processing Filters");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, ". Underlying Idea of the research paper was to maintain scoreboard efficiently. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()();
        }
      },
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwdWJsaWNhdGlvbnMuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9wdWJsaWNhdGlvbnMvcHVibGljYXRpb25zLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw0S0FBNEsiLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 5856:
/*!****************************************************!*\
  !*** ./src/app/profile/skills/skills.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SkillsComponent: () => (/* binding */ SkillsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);

class SkillsComponent {
  constructor() {}
  ngOnInit() {}
  static {
    this.ɵfac = function SkillsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SkillsComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SkillsComponent,
      selectors: [["app-skills"]],
      decls: 90,
      vars: 0,
      consts: [["id", "skill", 1, "section"], [1, "container"], [1, "h4", "text-center", "mb-4", "title"], ["data-aos", "fade-up", "data-aos-anchor-placement", "top-bottom", 1, "card"], [1, "card-body"], [1, "row"], [1, "col-md-6"], [1, "progress-container", "progress-primary"], [1, "progress-badge"], [1, "progress"], ["aria-valuemax", "100", "aria-valuemin", "0", "aria-valuenow", "60", "data-aos", "progress-full", "data-aos-duration", "2000", "data-aos-offset", "10", "role", "progressbar", 1, "progress-bar", "bg-skills", 2, "width", "90%"], [1, "progress-value"], ["aria-valuemax", "100", "aria-valuemin", "0", "aria-valuenow", "60", "data-aos", "progress-full", "data-aos-duration", "2000", "data-aos-offset", "10", "role", "progressbar", 1, "progress-bar", "bg-skills", 2, "width", "80%"], ["aria-valuemax", "100", "aria-valuemin", "0", "aria-valuenow", "60", "data-aos", "progress-full", "data-aos-duration", "2000", "data-aos-offset", "10", "role", "progressbar", 1, "progress-bar", "bg-skills", 2, "width", "85%"], ["aria-valuemax", "100", "aria-valuemin", "0", "aria-valuenow", "60", "data-aos", "progress-full", "data-aos-duration", "2000", "data-aos-offset", "10", "role", "progressbar", 1, "progress-bar", "bg-skills", 2, "width", "75%"]],
      template: function SkillsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Skills");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3)(5, "div", 4)(6, "div", 5)(7, "div", 6)(8, "div", 7)(9, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Java 11");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "90%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 6)(16, "div", 7)(17, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Spring Framework");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "80%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 5)(24, "div", 6)(25, "div", 7)(26, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Data Structure & Algorithms");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "90%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 6)(33, "div", 7)(34, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Databases");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](37, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "85%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 5)(41, "div", 6)(42, "div", 7)(43, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Backend Web Development");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](46, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "80%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "div", 6)(50, "div", 7)(51, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Concurrency");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](54, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, "90%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 5)(58, "div", 6)(59, "div", 7)(60, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, "Microservices");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](63, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "90%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 6)(67, "div", 7)(68, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, "Messaging Queues");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](71, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "85%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "div", 6)(75, "div", 7)(76, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](77, "AWS");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](79, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](81, "85%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "div", 6)(83, "div", 7)(84, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](85, "Redis");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](87, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, "95%");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()()()()();
        }
      },
      styles: ["html[_ngcontent-%COMP%] {\n  background-color: black;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNraWxscy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHVCQUFBO0FBQ0YiLCJmaWxlIjoic2tpbGxzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiaHRtbCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcHJvZmlsZS9za2lsbHMvc2tpbGxzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsdUJBQUE7QUFDRjtBQUNBLDRTQUE0UyIsInNvdXJjZXNDb250ZW50IjpbImh0bWwge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 8220:
/*!*********************************!*\
  !*** ./src/app/time.service.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeService: () => (/* binding */ TimeService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 1536);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);


class TimeService {
  constructor() {}
  getNumberOfMonths() {
    // added date
    const joinedDate = new Date('10/1/2022');
    const currentDate = new Date();
    const difference = currentDate.getTime() - joinedDate.getTime();
    const days = difference / (1000 * 3600 * 24);
    const temp = days / 30;
    const years = temp / 12;
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.of)(Number(years.toFixed(2)));
  }
  static {
    this.ɵfac = function TimeService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || TimeService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: TimeService,
      factory: TimeService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 5312:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
/* harmony import */ var ng_snotify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ng-snotify */ 8923);

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
  production: false,
  //baseUrl : `${window.location.protocol}//${window.location.hostname}/portfolio/`,
  baseUrl: `http://localhost:4200/`,
  snotifyConfig: {
    showProgressBar: true,
    position: ng_snotify__WEBPACK_IMPORTED_MODULE_0__.SnotifyPosition.rightTop
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

/***/ }),

/***/ 4429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 436);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 635);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 5312);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
  (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map