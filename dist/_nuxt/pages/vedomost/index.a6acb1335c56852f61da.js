webpackJsonp([2],{PcCy:function(t,e,s){"use strict";e.a={middleware:"storage",head:{style:[{cssText:"@media print{@page {size: landscape}}",type:"text/css"}],bodyAttrs:{class:"with-print-container"}},data:function(){return{from:this.$store.state.opsNumber?"ОПС "+this.$store.state.opsNumber:"",to:"",number:"",weightA:"0.000",weightG:"0.000",canvasImage:new Image,canvasImageLoaded:!1,image:void 0,breakers:[],selectedOperator:void 0,operators:this.$store.getters.selectPeople,pdfMaking:!1}},methods:{setBackground:function(){this.canvasImage.src=this.$sprites.vedomost,this.canvasImage.onload=function(){this.canvasImageLoaded=!0}.bind(this)},generateImage:function(){var t=this,e=this.$refs.vedomost;e&&e.getStage().toImage({width:880,height:1242,callback:function(e){t.image=e,t.$refs.vedomostPreviewImage.children[0].src=e.src,t.setPrintContainer()}})},addDest:function(){this.to&&this.$store.state.saveDest&&this.$store.dispatch("addDest",this.to)},setPrintContainer:function(){document.getElementById("printContainer").innerHTML="";var t=document.createElement("div"),e=document.createElement("div"),s=document.createElement("div");t.classList.add("page"),t.classList.add("vedomost"),t.appendChild(e),t.appendChild(s),e.appendChild(this.image),s.appendChild(this.image.cloneNode(!0)),document.getElementById("printContainer").appendChild(t)},print:function(){this.addDest(),window.print()},savePdf:function(){var t=this;this.pdfMaking=!0;var e={pageOrientation:"landscape",pageSize:"A3",content:[{columns:[{width:590,image:this.image.src},{width:590,image:this.image.src}]}],pageMargins:[0,0,0,0]};pdfMake.createPdf(e).download("vedomost.pdf",function(){return t.pdfMaking=!1})}},computed:{currentOperatorName:function(){var t=this,e=this.operators.find(function(e){return e.value===t.selectedOperator});return e.value?e.text:""}},updated:function(){this.generateImage()},mounted:function(){this.setBackground()}}},WwO3:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("PcCy"),i=s("sT0E"),n=s("VU/8")(a.a,i.a,!1,null,null,null);n.options.__file="pages/vedomost/index.vue",e.default=n.exports},sT0E:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"row"},[s("div",{staticClass:"col-6 text-center"},[s("div",{staticClass:"card"},[s("div",{staticClass:"card-body"},[s("h5",[t._v("Ввод данных")]),s("b-input-group",{staticClass:"mt-2",attrs:{prepend:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Из&nbsp;&nbsp;&nbsp;&nbsp;"}},[s("b-form-input",{attrs:{placeholder:"Отправляющиее учреждение"},model:{value:t.from,callback:function(e){t.from=e},expression:"from"}})],1),s("b-input-group",{staticClass:"mt-2",attrs:{prepend:"В адрес"}},[s("b-form-input",{attrs:{placeholder:"Учреждение назначения"},model:{value:t.to,callback:function(e){t.to=e},expression:"to"}}),s("b-dropdown",{attrs:{slot:"append",disabled:!t.$store.state.savedDest.length,text:"Dropdown",variant:"success"},slot:"append"},[s("i",{staticClass:"fa fa-fw fa-save",attrs:{slot:"button-content"},slot:"button-content"}),t._l(t.$store.state.savedDest,function(e,a){return s("b-dropdown-item",{key:a+"savedDestDropdown",on:{click:function(s){t.to=e}}},[t._v(t._s(e))])})],2)],1),s("b-input-group",{staticClass:"mt-2",attrs:{prepend:"&nbsp;&nbsp;&nbsp;&nbsp;ШИ&nbsp;&nbsp;&nbsp;&nbsp;"}},[s("b-form-input",{attrs:{placeholder:"Мешок № / ШИ"},model:{value:t.number,callback:function(e){t.number=e},expression:"number"}})],1),s("b-input-group",{staticClass:"mt-2",attrs:{prepend:"&nbsp;&nbsp;Вес А&nbsp;&nbsp;"}},[s("b-form-input",{attrs:{placeholder:"Вес АВИА, кг"},model:{value:t.weightA,callback:function(e){t.weightA=e},expression:"weightA"}})],1),s("b-input-group",{staticClass:"mt-2",attrs:{prepend:"&nbsp;&nbsp;Вес Н&nbsp;&nbsp;"}},[s("b-form-input",{attrs:{placeholder:"Вес НАЗЕМНЫЙ, кг"},model:{value:t.weightG,callback:function(e){t.weightG=e},expression:"weightG"}})],1),s("b-input-group",[s("b-form-select",{staticClass:"mb-3 mt-2",attrs:{options:t.operators},model:{value:t.selectedOperator,callback:function(e){t.selectedOperator=e},expression:"selectedOperator"}}),s("b-input-group-append",{staticClass:"mb-3 mt-2"},[s("nuxt-link",{attrs:{to:"/settings"}},[s("b-btn",{attrs:{title:"Добавить сотрудника в программу",variant:"outline-success"}},[s("i",{staticClass:"fa fa-fw fa-plus"})])],1)],1)],1),s("div",{staticClass:"mt-2 btn-group"},[s("button",{staticClass:"btn btn-success",on:{click:function(e){t.print()}}},[t._v("Печать\n            "),s("i",{staticClass:"fa fa-fw fa-print"})]),s("button",{staticClass:"btn btn-primary",class:{disabled:t.pdfMaking},on:{click:function(e){t.savePdf()}}},[t._v("Сохранить документ\n            "),t.pdfMaking?t._e():s("i",{staticClass:"fa fa-fw fa-file-pdf-o"}),t.pdfMaking?s("i",{staticClass:"fa fa-fw fa-spin fa-cog"}):t._e()])])],1)])]),s("div",{staticClass:"col-6 text-center"},[s("div",{staticClass:"card"},[s("div",{staticClass:"card-body"},[s("h5",[t._v("Предварительный просмотр")]),s("v-stage",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],attrs:{config:{height:1242,width:880}}},[s("v-layer",{ref:"vedomost"},[s("v-image",{attrs:{config:{x:0,y:0,width:880,height:1242,image:t.canvasImage}}}),t.canvasImageLoaded?[s("v-text",{attrs:{config:{x:130,y:235,text:t.from,fontSize:24,fontFamily:"Arial",fill:"black",strokeWidth:3}}}),s("v-text",{attrs:{config:{x:180,y:290,text:t.to,fontSize:24,fontFamily:"Arial",fill:"black",strokeWidth:3}}}),s("v-text",{attrs:{config:{x:260,y:360,text:t.number,fontSize:24,fontFamily:"Arial",fill:"black",strokeWidth:3}}}),s("v-text",{attrs:{config:{x:50,y:496,text:t.weightA,width:400,align:"center",fontSize:24,fontFamily:"Arial",fill:"black",strokeWidth:3}}}),s("v-text",{attrs:{config:{x:440,y:496,text:t.weightG,width:400,fontSize:24,align:"center",fontFamily:"Arial",fill:"black",strokeWidth:3}}}),s("v-text",{attrs:{config:{x:90,y:1130,text:t.currentOperatorName,fontSize:20,fontFamily:"Arial",fill:"black",strokeWidth:3}}})]:t._e()],2)],1),s("div",{ref:"vedomostPreviewImage",staticClass:"vedomost-preview mt-1"},[s("img",{pre:!0,attrs:{class:"img-fluid"}})])],1)])])])};a._withStripped=!0;var i={render:a,staticRenderFns:[]};e.a=i}});