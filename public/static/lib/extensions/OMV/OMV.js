/*!
 * LMV v7.9.0
 * 
 * Copyright 2019 Bimfish, Inc.
 * All rights reserved.
 * 
 * This computer source code and related instructions and comments are the
 * unpublished confidential and proprietary information of Bimfish, Inc.
 * and are protected under Federal copyright and state trade secret law.
 * They may not be disclosed to, copied or used by any third party without
 * the prior written consent of Bimfish, Inc.
 * 
 * Bimfish Forge Viewer Usage Limitations:
 * 
 * The Bimfish Forge viewer can only be used to view files generated by
 * Bimfish Forge services. The Bimfish Forge Viewer JavaScript must be
 * delivered from an Bimfish hosted URL.
 */
Bimfish.Extensions.OMV=function(e){var n={};function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(i,o,function(n){return e[n]}.bind(null,o));return i},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s="./extensions/OMV/OMV.js")}({"./extensions/OMV/ConfettiController.js":
/*!**********************************************!*\
  !*** ./extensions/OMV/ConfettiController.js ***!
  \**********************************************/
/*! exports provided: ConfettiController */function(e,n,t){"use strict";t.r(n),t.d(n,"ConfettiController",(function(){return i}));var i=function(e){var n=this;function t(e){var t=n.viewer.model.getFragmentList().getGeometry(e).vb,o=i(e),s=new THREE.Vector3(t[3],t[4],t[5]),r=2*o.distanceTo(s);return parseFloat(r.toFixed(1))}function i(e){var t=n.viewer.model.getFragmentList().getGeometry(e).vb;return new THREE.Vector3(t[0],t[1],t[2])}function o(e,o){var s=n.viewer,r=s.impl.getFragmentProxy(s.model,e);r.getAnimTransform();var a=o/t(e),l=new THREE.Matrix4;r.getOriginalWorldMatrix(l),l.getInverse(l);var c=i(e);r.scale=new THREE.Vector3(a,a,a),r.position.x=l.elements[12]*(a-1)-c.x*(a-1),r.position.y=l.elements[13]*(a-1)-c.y*(a-1),r.position.z=l.elements[14]*(a-1)-c.z*(a-1),r.updateAnimTransform()}this.viewer=e,this.diameter=null,this.resizeConfetti=function(e){if(e!==this.diameter){var n=this.viewer,t=n.model.getData().instanceTree;this.diameter=e,this.findMeasuredPoints((function(i){for(var s=0;s<i.length;s++)t.enumNodeFragments(i[s],(function(t){o(t,e),s===i.length-1&&n.impl.sceneUpdated(!0)}),!1)}))}},this.getDiameterFromGeom=function(e){var n=this.viewer,i=n.model.getData().instanceTree;n.model.isLoadDone();this.findMeasuredPoints((function(n){i.enumNodeFragments(n[0],(function(n){var i=t(n);e(i)}),!1)}))},this.findMeasuredPoints=function(e){var n=this.viewer;this.findInspectionPoints((function(t){var i={propFilter:["Surface Inspection Point"],ignoreHidden:!1};n.model.getBulkProperties(t,i,(function(n){var t=n.filter((function(e){return"projected"===function(e,n){for(var t=0;t<e.length;++t){var i=e[t];if(i.displayName===n)return i.displayValue}return null}(e.properties,"Surface Inspection Point")}));e(t)}))}))},this.findInspectionPoints=function(e){this.viewer.model.findProperty("Surface Inspection Point").then((function(n){e(n)}))}}},"./extensions/OMV/OMV.js":
/*!*******************************!*\
  !*** ./extensions/OMV/OMV.js ***!
  \*******************************/
/*! exports provided: OMV */function(e,n,t){"use strict";t.r(n),t.d(n,"OMV",(function(){return r}));var i=t(/*! ./ConfettiController */"./extensions/OMV/ConfettiController.js"),o=t(/*! ./OMVPanel */"./extensions/OMV/OMVPanel.js"),s=t(/*! ./OMVLocales */"./extensions/OMV/OMVLocales.js");function r(e,n){Bimfish.Viewing.Extension.call(this,e,n),this._configButtonId=null,this._default_geom_diameter=void 0,this._panel=null,this.confettiController=null,this.hasUI=Bimfish.Viewing.GuiViewer3D&&e instanceof Bimfish.Viewing.GuiViewer3D,this.openPanel=this.openPanel.bind(this),this._initialiseConfetti=this._initialiseConfetti.bind(this),this._initButtonConfig=this._initButtonConfig.bind(this)}r.prototype=Object.create(Bimfish.Viewing.Extension.prototype),r.prototype.constructor=r,r.prototype.load=function(){return!!this.hasUI&&(this.extendLocalization(s.locales),this.viewer.model&&this.viewer.model.isLoadDone()?this._initialiseConfetti():this.viewer.addEventListener(Bimfish.Viewing.GEOMETRY_LOADED_EVENT,this._initialiseConfetti,{once:!0}),!0)},r.prototype.unload=function(){return this.viewer.removeEventListener(Bimfish.Viewing.GEOMETRY_LOADED_EVENT,this._initialiseConfetti),null!==this._configButtonId&&(this.viewer.viewerSettingsPanel.removeConfigButton(this._configButtonId),this._configButtonId=null),this._panel&&(this._panel.uninitialize(),this._panel=null),this.confettiController=null,!0},r.prototype._initialiseConfetti=function(){var e=this;this.confettiController=new i.ConfettiController(this.viewer),this.confettiController.getDiameterFromGeom((function(n){e.viewer&&(e._default_geom_diameter=n,e.setConfettiDiameter(n),e._initButtonConfig())}))},r.prototype.setConfettiDiameter=function(e){return void 0===e&&(e=this._default_geom_diameter),void 0!==e&&(this.confettiController.resizeConfetti(e),this._panel&&this._panel.syncUI(),!0)},r.prototype.openPanel=function(){this._panel||(this._panel=new o.OMVPanel(this.viewer,this.confettiController,"On-Machine Verification")),this._panel.setVisible(!0)},r.prototype._initButtonConfig=function(){var e=this.viewer.getSettingsPanel();e?this._configButtonId=e.addConfigButton("On-Machine Verification",this.openPanel):this.addEventListener(av.TOOLBAR_CREATED_EVENT,this._initButtonConfig,{once:!0})},Bimfish.Viewing.theExtensionManager.registerExtension("Bimfish.OMV",r)},"./extensions/OMV/OMVLocales.js":
/*!**************************************!*\
  !*** ./extensions/OMV/OMVLocales.js ***!
  \**************************************/
/*! exports provided: locales */function(e,n,t){"use strict";t.r(n),t.d(n,"locales",(function(){return V}));var i=t(/*! ../../res/locales/en/nobundle-omv.loc.json */"./res/locales/en/nobundle-omv.loc.json"),o=t(/*! ../../res/locales/cs/nobundle-omv.loc.json */"./res/locales/cs/nobundle-omv.loc.json"),s=t(/*! ../../res/locales/de/nobundle-omv.loc.json */"./res/locales/de/nobundle-omv.loc.json"),r=t(/*! ../../res/locales/es/nobundle-omv.loc.json */"./res/locales/es/nobundle-omv.loc.json"),a=t(/*! ../../res/locales/fr/nobundle-omv.loc.json */"./res/locales/fr/nobundle-omv.loc.json"),l=t(/*! ../../res/locales/fr-CA/nobundle-omv.loc.json */"./res/locales/fr-CA/nobundle-omv.loc.json"),c=t(/*! ../../res/locales/it/nobundle-omv.loc.json */"./res/locales/it/nobundle-omv.loc.json"),f=t(/*! ../../res/locales/ja/nobundle-omv.loc.json */"./res/locales/ja/nobundle-omv.loc.json"),u=t(/*! ../../res/locales/ko/nobundle-omv.loc.json */"./res/locales/ko/nobundle-omv.loc.json"),d=t(/*! ../../res/locales/pl/nobundle-omv.loc.json */"./res/locales/pl/nobundle-omv.loc.json"),p=t(/*! ../../res/locales/pt-BR/nobundle-omv.loc.json */"./res/locales/pt-BR/nobundle-omv.loc.json"),m=t(/*! ../../res/locales/ru/nobundle-omv.loc.json */"./res/locales/ru/nobundle-omv.loc.json"),h=t(/*! ../../res/locales/tr/nobundle-omv.loc.json */"./res/locales/tr/nobundle-omv.loc.json"),v=t(/*! ../../res/locales/zh-HANS/nobundle-omv.loc.json */"./res/locales/zh-HANS/nobundle-omv.loc.json"),g=t(/*! ../../res/locales/zh-HANT/nobundle-omv.loc.json */"./res/locales/zh-HANT/nobundle-omv.loc.json"),b=t(/*! ../../res/locales/nl/nobundle-omv.loc.json */"./res/locales/nl/nobundle-omv.loc.json"),O=t(/*! ../../res/locales/sv/nobundle-omv.loc.json */"./res/locales/sv/nobundle-omv.loc.json"),P=t(/*! ../../res/locales/da/nobundle-omv.loc.json */"./res/locales/da/nobundle-omv.loc.json"),V={en:i,cs:o,de:s,es:r,fr:a,"fr-CA":l,it:c,ja:f,ko:u,pl:d,"pt-BR":p,ru:m,tr:h,"zh-HANS":v,"zh-HANT":g,nl:b,sv:O,da:P}},"./extensions/OMV/OMVPanel.js":
/*!************************************!*\
  !*** ./extensions/OMV/OMVPanel.js ***!
  \************************************/
/*! exports provided: OMVPanel */function(e,n,t){"use strict";function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}t.r(n),t.d(n,"OMVPanel",(function(){return s}));var o="configTab",s=function(e,n,t){var i="adsk_omv_panel_"+e.id;Bimfish.Viewing.UI.SettingsPanel.call(this,e.container,i,t,{heightAdjustment:90}),this.setGlobalManager(e.globalManager),this.container.classList.add("viewer-settings-panel"),this.viewer=e,this.confettiController=n,this._onSetConfettiDiameter=this._onSetConfettiDiameter.bind(this),this.addTab(o,"Probing",{className:"config"}),this.selectTab(o),this.inspectionSettingsLabel=this.addLabel(o,"Inspection Points"),this.sliderId=this.addSlider(o,"Confetti diameter",.5,40,1,this._onSetConfettiDiameter),this.confettiSizeSlider=this.getControl(this.sliderId),this.confettiSizeSlider.sliderElement.step=this.confettiSizeSlider.stepperElement.step=.1,this.createFooter()};s.prototype=Object.create(Bimfish.Viewing.UI.SettingsPanel.prototype),s.prototype.constructor=s,s.prototype.syncUI=function(){this.confettiSizeSlider.setValue(this.confettiController.diameter)},s.prototype._onSetConfettiDiameter=function(e){var n=null,t=i(e);"object"===t&&e.detail&&e.detail.value?n=parseFloat(e.detail.value):"number"===t&&(n=e),n&&this.confettiController.resizeConfetti(n)}},"./res/locales/cs/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/cs/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"cs","@@context":"Rozšíření ověření na stroji","On-Machine Verification":"Ověření na stroji","Probing":"Sondování","Inspection Points":"Kontrolní body","Confetti diameter":"Průměr konfety"}')},"./res/locales/da/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/da/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"da","@@context":"Udvidelse af verificering på maskine","On-Machine Verification":"Verificering på maskine","Probing":"Tester","Inspection Points":"Inspektionpunkter","Confetti diameter":"Confetti-diameter"}')},"./res/locales/de/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/de/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"de","@@context":"Prüfungen an der Maschine selbst Extension","On-Machine Verification":"Prüfungen an der Maschine","Probing":"Antasten","Inspection Points":"Inspektionspunkte","Confetti diameter":"Durchmesser Konfetti"}')},"./res/locales/en/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/en/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"en","@@context":"On-Machine Verification extension","On-Machine Verification":"On-Machine Verification","Probing":"Probing","Inspection Points":"Inspection Points","Confetti diameter":"Confetti diameter"}')},"./res/locales/es/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/es/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"es","@@context":"Ampliación de la verificación en la máquina","On-Machine Verification":"Verificación en la máquina","Probing":"Sondeo","Inspection Points":"Puntos de inspección","Confetti diameter":"Diámetro de confeti"}')},"./res/locales/fr-CA/nobundle-omv.loc.json":
/*!*************************************************!*\
  !*** ./res/locales/fr-CA/nobundle-omv.loc.json ***!
  \*************************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"fr-CA","@@context":"Extension de vérification sur la machine","On-Machine Verification":"Vérification sur la machine","Probing":"Palpage","Inspection Points":"Points d\'inspection","Confetti diameter":"Diamètre des confettis"}')},"./res/locales/fr/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/fr/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"fr","@@context":"Extension de vérification sur la machine","On-Machine Verification":"Vérification sur la machine","Probing":"Palpage","Inspection Points":"Points d\'inspection","Confetti diameter":"Diamètre des confettis"}')},"./res/locales/it/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/it/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"it","@@context":"Estensione verifica sulla macchina","On-Machine Verification":"Verifica sulla macchina","Probing":"Sonda","Inspection Points":"Punti di ispezione","Confetti diameter":"Diametro ravvicinati"}')},"./res/locales/ja/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/ja/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"ja","@@context":"機上検証エクステンション","On-Machine Verification":"機上検証","Probing":"検出中","Inspection Points":"検査点","Confetti diameter":"紙吹雪の直径"}')},"./res/locales/ko/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/ko/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"ko","@@context":"켜기-기계 검증 확장","On-Machine Verification":"켜기-기계 검증","Probing":"프로브","Inspection Points":"검사 점","Confetti diameter":"색종이 지름"}')},"./res/locales/nl/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/nl/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"nl","@@context":"Extensie voor verificatie op machine","On-Machine Verification":"Verificatie op machine","Probing":"Zoeken","Inspection Points":"Inspectiepunten","Confetti diameter":"Confettidiameter"}')},"./res/locales/pl/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/pl/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"pl","@@context":"Rozszerzenie On-Machine Verification","On-Machine Verification":"On-Machine Verification","Probing":"Sondowanie","Inspection Points":"Punkty kontrolne","Confetti diameter":"Średnica confetti"}')},"./res/locales/pt-BR/nobundle-omv.loc.json":
/*!*************************************************!*\
  !*** ./res/locales/pt-BR/nobundle-omv.loc.json ***!
  \*************************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"pt","@@context":"Extensão Verificação na máquina","On-Machine Verification":"Verificação na máquina","Probing":"Sondagem","Inspection Points":"Pontos de inspeção","Confetti diameter":"Diâmetro do confete"}')},"./res/locales/ru/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/ru/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"ru","@@context":"Расширение «Контроль на станке»","On-Machine Verification":"Контроль на станке","Probing":"Измерение щупом","Inspection Points":"Контрольные точки","Confetti diameter":"Диаметр конфетти"}')},"./res/locales/sv/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/sv/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"sv","@@context":"On-Machine Verification-tillägg","On-Machine Verification":"On-Machine Verification","Probing":"Sondering","Inspection Points":"Inspektionspunkter","Confetti diameter":"Konfettidiameter"}')},"./res/locales/tr/nobundle-omv.loc.json":
/*!**********************************************!*\
  !*** ./res/locales/tr/nobundle-omv.loc.json ***!
  \**********************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"tr","@@context":"Makine Üzerinde Doğrulama uzantısı","On-Machine Verification":"Makine Üzerinde Doğrulama","Probing":"Problama","Inspection Points":"Denetim Noktaları","Confetti diameter":"Konfeti çapı"}')},"./res/locales/zh-HANS/nobundle-omv.loc.json":
/*!***************************************************!*\
  !*** ./res/locales/zh-HANS/nobundle-omv.loc.json ***!
  \***************************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"zh-Hans","@@context":"计算机验证扩展","On-Machine Verification":"计算机验证","Probing":"正在探测","Inspection Points":"检验点","Confetti diameter":"彩色纸屑直径"}')},"./res/locales/zh-HANT/nobundle-omv.loc.json":
/*!***************************************************!*\
  !*** ./res/locales/zh-HANT/nobundle-omv.loc.json ***!
  \***************************************************/
/*! exports provided: @@locale, @@context, On-Machine Verification, Probing, Inspection Points, Confetti diameter, default */function(e){e.exports=JSON.parse('{"@@locale":"zh-Hant","@@context":"在機驗證延伸","On-Machine Verification":"在機驗證","Probing":"正在探測","Inspection Points":"檢測點","Confetti diameter":"五色點直徑"}')}});