(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{100:function(e,t,a){},157:function(e,t,a){},167:function(e,t,a){e.exports=a(399)},172:function(e,t,a){},174:function(e,t,a){},395:function(e,t,a){},399:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),i=a(65),c=a.n(i);a(172),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var r=a(402),o=a(403),s=a(165),u=a(2),m=a(3),h=a(5),p=a(4),d=a(6),g=(a(174),a(21)),v=a.n(g),E=(a(100),function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){return l.a.createElement("div",{className:"header"},l.a.createElement("h1",null,"Been There"),l.a.createElement("nav",{className:"main-nav"},l.a.createElement("ul",null,l.a.createElement("li",null,l.a.createElement("span",{className:"yellow-bg"},"About")),l.a.createElement("li",null,l.a.createElement("span",{className:"yellow-bg"},"Account")),l.a.createElement("li",null,l.a.createElement("span",{className:"yellow-bg",onClick:this.props.onClick},"Sign Out")))))}}]),t}(n.Component)),f=a(44),b=function(e){function t(){return Object(u.a)(this,t),Object(h.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(d.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.props,t=e.pins,a=e.onClick;return l.a.createElement(f.GoogleMap,{defaultCenter:{lat:22.37514,lng:91.797224},defaultZoom:3,onClick:this.handleMapClick},t.map(function(e){return l.a.createElement(f.Marker,{position:{lat:e.lat,lng:e.lng},key:"".concat(e.name),onClick:function(){return a(e.city,e.name)}},l.a.createElement(f.InfoWindow,null,l.a.createElement("div",null,e.name)))}))}}]),t}(n.Component),y=Object(f.withGoogleMap)(b),k=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={currentLatLng:{lat:-33.870937,lng:151.204588}},a}return Object(d.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.props,t=e.pins,a=e.onClick;return l.a.createElement("div",{className:"map"},l.a.createElement(y,{googleMapURL:"https://maps.googleapis.com/maps/api/js?key=".concat("AIzaSyB7SLqsEtoex-htI--MdJqOM_JJRai-A9g","&libraries=geometry,drawing,places"),loadingElement:l.a.createElement("div",{style:{height:"100%"}}),containerElement:l.a.createElement("div",{style:{height:"90vh",width:"100vw"}}),mapElement:l.a.createElement("div",{style:{height:"100%"}}),onClick:a,pins:t}))}}]),t}(n.Component),C=function(e){function t(e){return Object(u.a)(this,t),Object(h.a)(this,Object(p.a)(t).call(this,e))}return Object(d.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.props.pin;return l.a.createElement("div",null,e.lat?l.a.createElement("div",null,l.a.createElement("h2",null,l.a.createElement("span",{className:"yellow"},e.name)),l.a.createElement("p",{className:"category"},e.category),l.a.createElement("img",{src:e.images}),l.a.createElement("p",{className:"description"},e.description)):l.a.createElement("p",null,"Click on a marker to see more information about the place."))}}]),t}(n.Component),w=(a(400),a(166)),S=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={nameInput:"",categoryInput:"",descriptionInput:"",imageInput:"",latInput:"",lngInput:"",cityInput:""},a}return Object(d.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.placeData,t=e.geocodedPrediction,a=e.originalPrediction.description.split(",")[0],n=t.geometry.location.lat(),l=t.geometry.location.lng();this.setState({nameInput:a,latInput:n,lngInput:l,cityInput:t.address_components[3].short_name})}},{key:"handleNameChange",value:function(e){this.setState({nameInput:e.target.value})}},{key:"handleCategoryChange",value:function(e){this.setState({categoryInput:e.target.value})}},{key:"handleDescriptionChange",value:function(e){this.setState({descriptionInput:e.target.value})}},{key:"handleImageChange",value:function(e){this.setState({imageInput:e.target.value})}},{key:"render",value:function(){var e=this,t=this.state,a=t.nameInput,n=t.categoryInput,i=t.descriptionInput,c=t.imageInput,r=t.latInput,o=t.lngInput,s=t.cityInput;return l.a.createElement("form",{onSubmit:function(t,l,u,m,h,p,d,g){return e.props.onSubmit(t,a,n,i,c,r,o,s)}},l.a.createElement("div",null,l.a.createElement("label",null,"Name"),l.a.createElement("input",{type:"text",value:a,onChange:function(t){return e.handleNameChange(t)}})),l.a.createElement("div",null,l.a.createElement("label",null,"Category"),l.a.createElement("input",{type:"text",value:n,onChange:function(t){return e.handleCategoryChange(t)}})),l.a.createElement("div",null,l.a.createElement("label",null,"Description"),l.a.createElement("input",{type:"text",value:i,onChange:function(t){return e.handleDescriptionChange(t)}})),l.a.createElement("div",null,l.a.createElement("label",null,"Image"),l.a.createElement("input",{type:"text",value:c,onChange:function(t){return e.handleImageChange(t)}})),l.a.createElement("input",{type:"submit",value:"Add Place"}),l.a.createElement("input",{type:"hidden",value:r}),l.a.createElement("input",{type:"hidden",value:o}),l.a.createElement("input",{type:"hidden",value:s}))}}]),t}(n.Component),O=function(e){function t(){var e;return Object(u.a)(this,t),(e=Object(h.a)(this,Object(p.a)(t).call(this))).state={search:"",value:"",placeData:{geocodedPrediction:{},originalPrediction:{}},showAddPlaceForm:!1},e}return Object(d.a)(t,e),Object(m.a)(t,[{key:"handleInputChange",value:function(e){console.log(e.target.value),this.setState({search:e.target.value,value:e.target.value})}},{key:"handleSelectSuggest",value:function(e,t){console.log("SELECTED:",e,t),this.setState({search:"",value:t.description,placeData:{geocodedPrediction:e,originalPrediction:t},showAddPlaceForm:!0})}},{key:"handleFocus",value:function(){this.setState({showAddPlaceForm:!1})}},{key:"render",value:function(){var e=this,t=this.state,a=t.search,n=t.value,i=t.placeData,c=t.showAddPlaceForm;return l.a.createElement("div",null,l.a.createElement(w.a,{googleMaps:window.google.maps,autocompletionRequest:{input:a},onSelectSuggest:function(t,a){return e.handleSelectSuggest(t,a)},textNoResults:"Sorry, place not found",customRender:function(e){return l.a.createElement("div",{className:"customWrapper"},e?e.description:"Sorry, place not found")}},l.a.createElement("input",{type:"text",value:n,placeholder:"Search for a place",onChange:function(t){return e.handleInputChange(t)},onFocus:function(){return e.handleFocus()}})),c&&l.a.createElement(S,{placeData:i,onSubmit:this.props.onSubmit}))}}]),t}(n.Component),j=function(e){function t(e){return Object(u.a)(this,t),Object(h.a)(this,Object(p.a)(t).call(this,e))}return Object(d.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("p",null,"Filter Places Component"))}}]),t}(n.Component),I=function(e){function t(e){return Object(u.a)(this,t),Object(h.a)(this,Object(p.a)(t).call(this,e))}return Object(d.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){return l.a.createElement("div",null,l.a.createElement("p",null,"Search Cities Component"))}}]),t}(n.Component),P=(a(395),function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={showSideBar:!0,showPinDetail:!0,showAddPlace:!1,showFilterPlaces:!1,showSearchCities:!1},a}return Object(d.a)(t,e),Object(m.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.pinAdded!==e.pinAdded&&this.setState({showAddPlace:!1})}},{key:"handleClick",value:function(){console.log("clicked")}},{key:"handleAddPlaceClick",value:function(){this.setState({showAddPlace:!0})}},{key:"handleFilterPlacesClick",value:function(){this.setState({showFilterPlaces:!0})}},{key:"handleSearchCitiesClick",value:function(){this.setState({showSearchCities:!0})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"sidebar"},l.a.createElement("div",{className:"sidebar-header"},l.a.createElement("i",{className:"material-icons"},"pin_drop"),l.a.createElement("button",{onClick:function(){return e.handleClick()},className:"open-close"},l.a.createElement("i",{className:"material-icons"},"close"))),l.a.createElement("div",{className:"sidebar-place-detail"},l.a.createElement("h3",null,l.a.createElement("span",{className:"yellow-bg"},"Place Details")),this.state.showPinDetail&&l.a.createElement(C,{pin:this.props.pin})),l.a.createElement("div",{className:"sidebar-add-place"},l.a.createElement("h3",null,l.a.createElement("span",{className:"yellow-bg",onClick:function(){return e.handleAddPlaceClick()}},"Add New Place")),this.state.showAddPlace&&l.a.createElement(O,{pinAdded:this.props.pinAdded,onSubmit:this.props.onSubmit})),l.a.createElement("div",{className:"sidebar-filter-places"},l.a.createElement("h3",null,l.a.createElement("span",{className:"yellow-bg",onClick:function(){return e.handleFilterPlacesClick()}},"Filter Places")),this.state.showFilterPlaces&&l.a.createElement(j,null)),l.a.createElement("div",{className:"sidebar-search-cities"},l.a.createElement("h3",null,l.a.createElement("span",{className:"yellow-bg",onClick:function(){return e.handleSearchCitiesClick()}},"Search by City")),this.state.showSearchCities&&l.a.createElement(I,null)))}}]),t}(n.Component)),N="http://localhost:3000/user",A=function(e){function t(){var e;return Object(u.a)(this,t),(e=Object(h.a)(this,Object(p.a)(t).call(this))).state={pins:[],selectedPin:{},wasPinAdded:!1},e}return Object(d.a)(t,e),Object(m.a)(t,[{key:"componentWillMount",value:function(){if("localStorage"in window){var e=localStorage.getItem("authToken");e?v.a.defaults.headers.common.Authorization="Bearer ".concat(e):this.props.history.push({pathname:"/login"}),this.fetchPins()}}},{key:"fetchPins",value:function(){var e=this;v.a.get("".concat(N,"/beenthere")).then(function(t){e.setState({pins:t.data})}).catch(function(t){e.props.history.push({pathname:"/login",state:{message:"Please login again",error:t}})})}},{key:"handleSignOut",value:function(){localStorage.removeItem("authToken"),this.props.history.push("/login")}},{key:"handleMarkerClick",value:function(e,t){var a=this;v.a.get("".concat(N,"/pin/").concat(e,"/").concat(t)).then(function(e){console.log("PIN:",e),a.setState({selectedPin:e.data})}).catch(console.warn)}},{key:"handleAddMarkerSubmit",value:function(e,t,a,n,l,i,c,r){var o=this;e.preventDefault(),v.a.post("".concat(N,"/pin"),{name:t,category:a,description:n,images:l,lat:i,lng:c,city:r}).then(function(e){o.setState({pins:Object(s.a)(o.state.pins).concat([e.data.pinToPush]),selectedPin:e.data.newPin,wasPinAdded:!0})}).catch(console.warn)}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"App"},l.a.createElement(E,{onClick:function(){return e.handleSignOut()}}),l.a.createElement("div",{className:"main-container"},l.a.createElement(P,{pin:this.state.selectedPin,pinAdded:this.state.wasPinAdded,onSubmit:function(t,a,n,l,i,c,r,o){return e.handleAddMarkerSubmit(t,a,n,l,i,c,r,o)}}),l.a.createElement(k,{pins:this.state.pins,onClick:function(t,a){return e.handleMarkerClick(t,a)}})))}}]),t}(n.Component),D=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(h.a)(this,Object(p.a)(t).call(this,e))).state={isLogin:!0},a}return Object(d.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){this.setState({isLogin:this.props.isLogin})}},{key:"render",value:function(){return l.a.createElement("div",{className:"header"},l.a.createElement("h1",null,"Been There"),l.a.createElement("nav",{className:"main-nav"},l.a.createElement("ul",null,l.a.createElement("li",null,l.a.createElement("span",{className:"yellow-bg"},this.state.isLogin?"Sign Up":"Login")))))}}]),t}(n.Component),M=(a(157),function(e){function t(){var e;return Object(u.a)(this,t),(e=Object(h.a)(this,Object(p.a)(t).call(this))).state={emailInput:"",passwordInput:"",error:""},e}return Object(d.a)(t,e),Object(m.a)(t,[{key:"componentDidMount",value:function(){this.props.location.state&&this.setState({error:this.props.location.state.message})}},{key:"handleEmailChange",value:function(e){console.log(e.target.value),this.setState({emailInput:e.target.value})}},{key:"handlePasswordChange",value:function(e){this.setState({passwordInput:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),v.a.post("http://localhost:3000/user/signin",{email:this.state.emailInput,password:this.state.passwordInput}).then(function(e){console.log("RESPONSE: ",e.data.token),v.a.defaults.headers.common.Authorization="Bearer ".concat(e.data.token),"localStorage"in window&&localStorage.setItem("authToken",e.data.token),t.props.history.push("/")}).catch(function(e){console.dir(e.response.data.message),t.setState({error:e.response.data.message})})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"login-container"},l.a.createElement(D,{isLogin:!0}),l.a.createElement("div",{className:"login-box"},l.a.createElement("h2",null,"Login"),l.a.createElement("form",{onSubmit:function(t){return e.handleSubmit(t)}},l.a.createElement("div",null,l.a.createElement("label",null,"Email"),l.a.createElement("input",{type:"email",value:this.state.emailInput,onChange:function(t){return e.handleEmailChange(t)}})),l.a.createElement("div",null,l.a.createElement("label",null,"Password"),l.a.createElement("input",{type:"password",value:this.state.passwordInput,onChange:function(t){return e.handlePasswordChange(t)}})),l.a.createElement("input",{type:"submit",value:"Login"})),l.a.createElement("p",{className:"error-msg"},this.state.error)))}}]),t}(n.Component)),F=function(e){function t(){var e;return Object(u.a)(this,t),(e=Object(h.a)(this,Object(p.a)(t).call(this))).state={emailInput:"",passwordInput:"",error:""},e}return Object(d.a)(t,e),Object(m.a)(t,[{key:"handleEmailChange",value:function(e){console.log(e.target.value),this.setState({emailInput:e.target.value})}},{key:"handlePasswordChange",value:function(e){this.setState({passwordInput:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),v.a.post("http://localhost:3000/user/signup",{email:this.state.emailInput,password:this.state.passwordInput}).then(function(e){console.log("RESPONSE: ",e.data.token),v.a.defaults.headers.common.Authorization="Bearer ".concat(e.data.token),"localStorage"in window&&localStorage.setItem("authToken",e.data.token),t.props.history.push("/")}).catch(function(e){console.dir(e.response.data.message),t.setState({error:e.response.data.message})})}},{key:"render",value:function(){var e=this;return l.a.createElement("div",{className:"login-container"},l.a.createElement(D,{isLogin:!1}),l.a.createElement("div",{className:"login-box"},l.a.createElement("h2",null,"Sign Up"),l.a.createElement("form",{onSubmit:function(t){return e.handleSubmit(t)}},l.a.createElement("div",null,l.a.createElement("label",null,"Email"),l.a.createElement("input",{type:"email",value:this.state.emailInput,onChange:function(t){return e.handleEmailChange(t)}})),l.a.createElement("div",null,l.a.createElement("label",null,"Password"),l.a.createElement("input",{type:"password",value:this.state.passwordInput,onChange:function(t){return e.handlePasswordChange(t)}})),l.a.createElement("input",{type:"submit",value:"Sign Up"})),l.a.createElement("p",{className:"error-msg"},this.state.error)))}}]),t}(n.Component),L=l.a.createElement(r.a,null,l.a.createElement("div",null,l.a.createElement(o.a,{exact:!0,path:"/",component:A}),l.a.createElement(o.a,{exact:!0,path:"/login",component:M}),l.a.createElement(o.a,{exact:!0,path:"/signup",component:F})));c.a.render(L,document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[167,2,1]]]);
//# sourceMappingURL=main.b1d7ff02.chunk.js.map