//  AW3D.js (dev0.3.4)

    var debugMode;

/*
    * @author anywhere3d
    * http://anywhere3d.org
    * MIT License
*/

    var AW3D = { VERSION: "0.3.4 dev" };

//  Player Holder.
    AW3D.PlayerHolder = function ( name ){
        var holder = new THREE.Object3D();
        holder.position.set( 0, 1, 0 );
        holder.name = name || "PLAYER HOLDER";
        return holder;
    };

//  Player Holder Helper.
    AW3D.PlayerHolderHelper = function ( name ){
        var helper = new THREE.BoxHelper();
        helper.name = name || "HOLDER HELPER";
        helper.visible = true;
        return helper;
    };

//  Player Controller Direction pointer.
    AW3D.DirectionPointer = function ( name ){
        var geometry = new THREE.CylinderGeometry( 0, 1, 20, 12 );
        geometry.rotateX( Math.PI / 2 );  //  BE CAREFULL: is not "mesh.rotation.y = -Math.PI".
        var material = new THREE.MeshStandardMaterial({color:0x00ff00});
        var pointer = new THREE.Mesh(geometry, material);
        pointer.position.set(0, 15, 0);
        pointer.name = name || "PLAYER DIRECTION";
        pointer.visible = true;
        return pointer;
    };

//  Player Sphere.
    AW3D.PlayerSphere = function ( name ){
        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry( 15, 8, 4 ),
            new THREE.MeshBasicMaterial( { color: 0xff0000,  wireframe: true} )
        ); 
        sphere.position.y = 12;
        sphere.name = name || "PLAYER SPHERE";
        sphere.visible = true;
        return sphere;
    };

//  Player pointer.
    AW3D.PlayerPointer = function ( name ){
        var geometry = new THREE.CylinderGeometry( 0, 1, 20, 12 );
        geometry.rotateX( Math.PI / 2 );  //  BE CAREFULL: is not "mesh.rotation.y = -Math.PI". //
        var material = new THREE.MeshNormalMaterial();
        var pointer = new THREE.Mesh(geometry, material);
        pointer.position.set(0, 40, 0);
        pointer.name = name || "PLAYER POINTER";
        pointer.visible = true; // debugMode || false;
        return pointer;
    };

//  OutfitManager.js

/*
    * @author anywhere3d
    * http://anywhere3d.com
    * MIT License
*/

    AW3D.OutfitManager = function(){

        try {

        //  signals.js

            var Signal = signals.Signal;
            this.changed = new Signal();

        } catch(err){

            console.warn(err);
        }


        this.eventTimeout = undefined;
        this.direction = new THREE.Object3D();

        this.gender = {
            male    : false,
            female  : false,
            shemale : false,
            trans   : false,
        };

        this.genitals = { 
            vagina   : false,
            penis    : false,
            attached : false,
        };

    //  Layers. (aparts-holders).

        this.layers = [
            "body",
            "head",
            "face",
            "hairs",
            "upper", // chest.
            "lower", // hips.
            "torso", // (chest & hips).
            "arms",
            "legs",
            "hands",
            "feet",
            "genitals", 
            "skeleton",
        ];

    //  Slots. (clothes-category-model).

        this.slots = [
            "body",
            "hairs",
            "eyes",
            "hat",
            "glasses",
            "stockings",
            "underwears",
            "tshirt",
            "skirt",
            "trousers",
            "costume",
            "dress",
            "shoes",
            "coat",
            "penis", 
            "vagina",
            "skeleton",
        ];

    //  (Images-Canvas-Textures).

        this.stickers = [
            "skin",
            "makeup",
            "tattoo",
            "bodypaint",
            "neck",
            "chest",
            "belly",
            "upperlimb",
            "arm",
            "forearm",
            "wrist",
            "hand",
            "lowerlimb",
            "thigh",
            "leg",
            "foot",
            "butt",
            "back",
            "scapula",
            "lumbar",
        ];

    //  Models.

        this.attachments = [
            "helmet",
            "face",
            "mask",
            "teeth",
            "beard",
            "eyelash",
            "glasses",
            "ears",
            "belly",
            "gun",
            "wepon",
            "knife",
            "sword",
            "bistol",
            "watch",
            "jewelry",
            "earings",
            "necklace",
            "bracelet",
            "bag",
            "handbag",
            "cape",
            "coat",
            "horn",
            "tail",
            "penis", 
        ];


    //  Outfit.AnimationsHandler is an simple array where player
    //  player.outfit keeps the AW3D.AnimationHandler instances.

        this.AnimationsHandler = [];

    //  AnimationsHandler is a simple array.

        this.AnimationsHandler.reset = function(){
            this.length = 0; // reset array.
        };

        this.AnimationsHandler.stop = function(){
            this.forEach( function( anim ){
                if (!!anim ) anim.stop();
            });
        };

        this.AnimationsHandler.jump = function(){
            this.forEach( function( anim ){
                if (!!anim ) anim.jump();
            });
        };

        this.AnimationsHandler.play = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.play(name);
                });
            }
        };

        this.AnimationsHandler.weightOff = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.weightOff(name);
                });
            }
        };

        this.AnimationsHandler.weightOn = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.weightOn(name);
                });
            }
        };

        this.AnimationsHandler.fadeIn = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.fadeIn(name);
                });
            }
        };

        this.AnimationsHandler.fadeOut = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.fadeOut(name);
                });
            }
        };

        var outfit = this;

        this.AnimationsHandler.refresh = function(){

            this.stop();
            this.fill(null);
            this.reset();
    
        //  "outfits" has been renamed to "slots".
            outfit.slots.forEach( function(name, i){

                if ( !!outfit[ name ] ){
    
                    var handler = new AW3D.AnimationHandler( outfit[ name ], outfit.getGender() );

                    outfit.AnimationsHandler.push( handler );
                }
            });
    
            outfit.AnimationsHandler.play("idle");
    
        };

    //  Outfit EventDispatcher.
        Object.assign( this, THREE.EventDispatcher.prototype );  // important!

    };

    AW3D.OutfitManager.prototype = {

        constructor: AW3D.OutfitManager,

        refresh: function(){
            this.AnimationsHandler.refresh();
        },


        get: function(){

            var results = {};

            var _get = ( arg ) => {

                if ( typeof( arg ) == "string" ) {
                    if ( !!this[arg] ) results[arg] =  this[arg];
                }

                if ( arg instanceof Array ) {
                    arg.forEach( ( key ) => {
                        _get( key );
                    });
                }
            };

            if ( arguments.length > 0 ){

                for (var i in arguments){

                    if ( !arguments[i] ) continue;

                    _get( arguments[i] );

                }

            } else {

                this.slots.forEach( (name) => { _get( name ); });

            }

            return results;

        },

        set: function(){

            for (var i in arguments){

                if (!arguments[i]) continue;

                var name = Object.keys(arguments[i])[0];
                var asset = Object.values(arguments[i])[0];
            //  debugMode && console.log(name + ":", asset);

                if ( !name || name == null || !asset ) continue;
                if (!!this[ name ]) this.remove( name );

                this[ name ] = asset;
            //  this[ name ] = asset.clone();

            }

            this.AnimationsHandler.refresh();

        //  Send "change" event only when last 
        //  add has been completed (delay:100ms).
            var msec = 50;
            clearTimeout( this.eventTimeout );
            this.eventTimeout = setTimeout( () => {
                this.dispatchEvent( {type:"change"} );
                this.changed && this.changed.dispatch();
            }, msec);

            return this;

        },

        add: function(){

            for (var i in arguments) {

                if (!arguments[i]) continue;

                var name = Object.keys(arguments[i])[0];
                var asset = Object.values(arguments[i])[0];
            //  debugMode && console.log(name + ":", asset);

                if ( !name || name == null || !asset ) continue;
                if (!!this[ name ]) this.remove( name );

                this[ name ] = asset;
            //  this[ name ] = asset.clone();
                this.direction.add( this[ name ] );

            }

            this.AnimationsHandler.refresh(); 

        //  Send "change" event only when last 
        //  add has been completed (delay:100ms).
            var msec = 50;
            clearTimeout( this.eventTimeout );
            this.eventTimeout = setTimeout( () => {
                this.dispatchEvent( {type:"change"} );
                this.changed && this.changed.dispatch();
            }, msec);

            return this;
        },

        remove: function(){

            if ( arguments.length == 0 ) return;

            for (var i in arguments){

                if ( !arguments[i] ) continue;
                if ( !this.slots.includes( arguments[i] ) ) continue;

                var name = arguments[i];

            //  Remove from scene (does not throw error).
                this.direction.remove( this[ name ] );

            //  Dispose geometry.
                !!this[ name ] && this[ name ].geometry.dispose();

            //  Dispose bones texture. !important
                !!this[ name ] && !!this[ name ].skeleton 
                && this[ name ].skeleton.boneTexture.dispose();

            //  this[ name ] = null;
                delete this[ name ];    
            }

        //  Send "change" event only when last 
        //  remove has been completed (delay:100ms).
            var msec = 50;
            clearTimeout( this.eventTimeout );
            this.eventTimeout = setTimeout( () => {
                this.dispatchEvent( {type:"change"} );
                this.changed && this.changed.dispatch();
            }, msec);

            return this;
        },

        removeFromScene: function(){

            if ( arguments.length == 0 ) {

            //  "outfits" has been renamed to "slots"
                this.slots.forEach( ( name ) => {
                    this.remove( name );
                });

            } else {

                for (var i in arguments){
                    this.remove( name );
                }
            }

            return this;

        },

        removeAll: function() { 

            return this.removeFromScene();

        },

        removeTexture: function( outfit, map, index ){

            //  outfit: outfit name from slots (e.g "body", "hair", "dress", etc.)
            //  map   : material map name (e.g. "map", "bumpMap", "normalMap", etc.)
            //  index : material index of multimaterial ("null" for simple material).

            if ( !this[ outfit ] ) return;
            if ( !this[ outfit ].material ) return;

            //  Material.

            if ( index == null || isNaN(index) || typeof(index) != "number" ) {

                if ( !this[ outfit ].material[ map ] ) return;

                this[ outfit ].material[ map ].dispose();
                this[ outfit ].material[ map ] = null;
                this[ outfit ].material.needsUpdate = true;

                return;
            }

            //  MultiMaterial.

            if ( typeof(index) == "number" && index > -1 ) {

                if ( !this[ outfit ].material.materials ) return;
                if ( !this[ outfit ].material.materials[ index ] ) return;
                if ( !this.body.material.materials[ index ][ map ] ) return;

                this[ outfit ].material.materials[ index ][ map ].dispose();
                this[ outfit ].material.materials[ index ][ map ] = null;
                this[ outfit ].material.materials[ index ].needsUpdate = true;

                return;
            }
        },

        setGender: function( gender ){

            var self = this;

            Object.keys(this.gender).forEach( function( name ){
                self.gender[ name ] = ( name == gender );
            });

        //  Direction scale.
            switch ( this.getGender() ){

                case "male":
                    this.direction.scale.set(1, 1, 1);
                    break;

                case "female":
                    this.direction.scale.set(0.95, 0.95, 0.95);
                    break;

                default:
                    this.direction.scale.set(1, 1, 1);
            }

            this.AnimationsHandler.refresh();

            return this;
        },

        getGender: function(){

            var self = this;

            if (arguments.length > 0){

                return self.gender[ arguments[0] ];

            } else {

                return Object.keys(this.gender).find( function( name ){
                    return self.gender[ name ];
                });

            }
        },

        resetGender: function(){

            var self = this;

            Object.keys(this.gender).forEach( function( name ){
                self.gender[ name ] = false;
            });

            this.direction.scale.set(1, 1, 1);
            this.AnimationsHandler.refresh();

            return this;
        },

    /*
        getdata: function( name ){

            if ( !name ) return;
            if ( !this[ name ] ) return;
            if ( !this.slots.includes( name ) ) return;

            var data = {};

            data[ name ] = {};
            data[ name ].name      = name;
            data[ name ].visible   = this[ name ].visible;
            data[ name ].scale     = this[ name ].scale.toArray();
            data[ name ].geometry  = this[ name ].geometry.sourceFile;


        //  Validation...


        //  Materials.

            data[ name ].materials = [];

            if ( !!this[ name ].material.materials ){

                this[ name ].material.materials.forEach( function(material, i){
                    data[ name ].materials.push( toJSON(material) );
                });

            } else {

                var material = this[ name ].material;
                data[ name ].materials.push( toJSON(material) );

            }

            return data[ name ];

            function toJSON( material ){

                var json = {};
                json.type = material.type;

                if (!!material.map) json.map = material.map.sourceFile;
                if (!!material.aoMap) json.aoMap = material.aoMap.sourceFile;
                if (!!material.envMap) json.envMap = material.envMap.sourceFile;
                if (!!material.bumpMap) json.bumpMap = material.bumpMap.sourceFile;
                if (!!material.alphaMap) json.alphaMap = material.alphaMap.sourceFile;
                if (!!material.lightMap) json.lightMap = material.lightMap.sourceFile;
                if (!!material.normalMap) json.normalMap = material.normalMap.sourceFile;
                if (!!material.emissiveMap) json.emissiveMap = material.emissiveMap.sourceFile;
                if (!!material.specularMap) json.specularMap = material.specularMap.sourceFile;
                if (!!material.roughnessMap) json.roughnessMap = material.roughnessMap.sourceFile;
                if (!!material.metalnessMap) json.metalnessMap = material.metalnessMap.sourceFile;
                if (!!material.displacementMap) json.displacementMap = material.displacementMap.sourceFile;

                var options = {};

            //  options.uuid = material.uuid;
                options.name = material.name;
                options.color = material.color.getHex();
                options.side = material.side;
                options.opacity = material.opacity;
                options.shading = material.shading;
                options.emissive = material.emissive.getHex();
                options.skinning = material.skinning;
                options.transparent = material.transparent;
            //  options.shininess = material.shininess; // TODO: to debug this.
                options.roughness = material.roughness;
                options.metalness = material.metalness;

                if (!!material.roughnessMap) options.roughness = material.roughness;
                if (!!material.metalnessMap) options.metalness = material.metalness;
                if (!!material.specularMap) options.specular = material.specular.getHex();
                if (!!material.uniforms) options.uniforms = material.uniforms;
                if (!!material.vertexShader) options.vertexShader = material.vertexShader;
                if (!!material.fragmentShader) options.fragmentShader = material.fragmentShader;
                if (!!material.vertexColors) options.vertexColors = material.vertexColors;
                if (!!material.bumpMap) options.bumpScale = material.bumpScale;
                if (!!material.normalMap) options.normalScale = material.normalScale.toArray();
                if (!!material.displacementMap) options.displacementScale = material.displacementScale;
                if (!!material.displacementMap) options.displacementBias = material.displacementBias;
                if (!!material.emissiveMap) options.emissiveIntensity = material.emissiveIntensity;
                if (!!material.lightMap) options.lightMapIntensity = material.lightMapIntensity;
                if (!!material.envMap) options.reflectivity = material.reflectivity;
                if (!!material.aoMap) options.aoMapIntensity = material.aoMapIntensity;

                json.options = options;
                return json;
            }
        },

    */

        getPose: function( name ){

            var name = name || "body";
            if ( !this[ name ] ) return;
            if ( !this.slots.includes( name ) ) return;

            var pose = [];

            for (var i in this[ name ].skeleton.bones) {
                var key = {}; // {"pos":[], "rot":[], "scl":[]};
                key.pos = this[ name ].skeleton.bones[i].position.toArray();
                key.rot = this[ name ].skeleton.bones[i].quaternion.toArray();
                key.scl = this[ name ].skeleton.bones[i].scale.toArray();
                pose.push(key);
            }

            return pose;

        },

        toJSON: function(){

            var data = {};

            if ( arguments.length == 0 ) {

                for (var i = 0; i < this.slots.length; i++) {

                    var name = this.slots[i];

                    if ( !name ) continue;
                    if ( !this[ name ] ) continue;
                    if ( !this.slots.includes( name ) ) continue;

                    data[ name ] = {};
                    data[ name ].name      = name;
                    data[ name ].visible   = this[ name ].visible;
                    data[ name ].scale     = this[ name ].scale.toArray();
                    data[ name ].geometry  = this[ name ].geometry.sourceFile;
                    data[ name ].material = materialtoJSON( this[ name ].material );

                }

            } else {

                for (var i = 0; i < arguments.length; i++){

                    var name = arguments[i];

                    if ( !name ) continue;
                    if ( !this[ name ] ) continue;
                    if ( !this.slots.includes( name ) ) continue;

                    data[ name ] = {};
                    data[ name ].name      = name;
                    data[ name ].visible   = this[ name ].visible;
                    data[ name ].scale     = this[ name ].scale.toArray();
                    data[ name ].geometry  = this[ name ].geometry.sourceFile;
                    data[ name ].material = materialtoJSON( this[ name ].material );

                }

            }

            if ( this.getGender() ) 
                data.gender = this.getGender();

            var data = JSON.stringify( data );

            if ( data === "{}" ) 
                return null;
            else 
                return JSON.parse( data );

        },


    //  fromJSON (v2.0.4).

        fromJSON: async function( json ){

        //  Validation:

            //  VERY IMPORTANT: you must explictly 
            //  make a copy of json. VERY IMPORTANT //

            //  JSON.stringify( json ) is used  
            //  also to create a copy of "json".

        //  Stringify json...

            if ( typeof(json) == "object" ) {

                try {

                    var json = JSON.stringify( json ); // string copy of json.

                } catch(err) {

                    console.error(err);
                    return;
                }

            }

        //  ...to validate json as string...

            if ( typeof(json) == "string" ) {

                if ( !validator.isJSON( json ) ) {

                    console.error("Validation: json not valid");
                    return;
                }

            }

        //  ...and create a fresh copy of json.

            var json = JSON.parse( json ); // (now is a json copy).

        //  debugMode && console.log( {"json": deepCopy(json) });
        //  debugMode && console.log( {"json": JSON.parse( JSON.stringify(json))} );

            var self = this;

        //  Copy gender first.

            this.removeAll();          // important!
            var gender = json.gender;  // important!
            this.setGender( gender );  // important!

        //  Clear gender of json.
            delete json.gender; // (is a copy of json).

        //  DOES ORDER MATTER (for transparency)?

            //  Yes! Order in localPlayer.outfit.direction.children array DOES MATTER.

            //  "body" or "skeleton": index [0], 
            //  "eyes": index [1], 
            //  "hairs": index [2],
            //  "stockings": index [3] ,
            //  "underwears": index [4],
            //  "tshirt": index [5], 
            //  "trousers: index [6],
            //  "costume" or "dress": index [7], 
            //  "shoes": index [8],
            //  "coat": index [9].

        //  So we must deliver the outfit.direction.children array with the following order:
        //  [skeleton, body, eyes, hairs, stockings, underwears, tshirt, trousers, costume, dress, shoes, coat]

            var orderMap = [];

            if (json.skeleton) orderMap.push("skeleton");
            if (json.body) orderMap.push("body");
            if (json.eyes) orderMap.push("eyes");
            if (json.hairs) orderMap.push("hairs");
            if (json.stockings) orderMap.push("stockings");
            if (json.underwears) orderMap.push("underwears");
            if (json.tshirt) orderMap.push("tshirt");
            if (json.trousers) orderMap.push("trousers");
            if (json.costume) orderMap.push("costume");
            if (json.dress) orderMap.push("dress");
            if (json.shoes) orderMap.push("shoes");
            if (json.coat) orderMap.push("coat");

            debugMode && console.log({"orderMap": orderMap});

            for (var i = 0; i < orderMap.length; i++){

                var key = orderMap[i];

                await new Promise(function(resolve, reject){

                    var object = {};

                    object.name      = json[ key ].name;
                    object.visible   = json[ key ].visible;
                    object.material  = json[ key ].material;
                    object.geometry  = json[ key ].geometry;  // url.

                    //  Scale.
                    var vector = new THREE.Vector3();
                    object.scale = vector.fromArray( json[ key ].scale );

                    //  Material.
                    var material = materialfromJSON( object.material );

                    //  Geometry.
                    w3.getHttpObject( object.geometry, function( gson ){

                        var loader = new THREE.JSONLoader();
                        var geometry = loader.parse( gson ).geometry;

                        geometry.name = gson.name;
                        geometry.computeFaceNormals();
                        geometry.computeVertexNormals();
                        geometry.computeBoundingBox();
                        geometry.computeBoundingSphere();
                        geometry.sourceFile = object.geometry;  // important!

                        var skinned = new THREE.SkinnedMesh( geometry, material );
                        skinned.renderDepth = 1;
                        skinned.frustumCulled = false;
                        skinned.position.set( 0, 0, 0 );
                        skinned.rotation.set( 0, 0, 0 );
                        skinned.scale.copy( object.scale );
                        skinned.castShadow = true;
                        skinned.name = object.name;

                    //  "this.add()" refresh each time.
                        resolve( self.add({[key]: skinned}) );

                    });

                });

            }

        },

/*
        //  Recover from json.

            for ( var key in json ) {

                (function(key){

                    var object = {};

                    object.name      = json[ key ].name;
                    object.visible   = json[ key ].visible;
                    object.material  = json[ key ].material;
                    object.geometry  = json[ key ].geometry;  // url.
                    var vector = new THREE.Vector3();
                    object.scale = vector.fromArray( json[ key ].scale );

                //  Copy geometry url to prevent overwritting?
                //  var url = object.geometry;
                //  debugMode && console.log({[`${key} object`]:object});

                //  Material.

                    var material = materialfromJSON( object.material );
                //  debugMode && console.log({[`${key} material`]:material});

                //  Geometry.

                    w3.getHttpObject( object.geometry, function( gson ){

                        var loader = new THREE.JSONLoader();
                        var geometry = loader.parse( gson ).geometry;

                        geometry.sourceFile = object.geometry;  // important!

                        geometry.computeFaceNormals();
                        geometry.computeVertexNormals();
                        geometry.computeBoundingBox();
                        geometry.computeBoundingSphere();
                        geometry.name = gson.name;

                        var skinned = new THREE.SkinnedMesh( geometry, material );

                        skinned.renderDepth = 1;
                        skinned.frustumCulled = false;
                        skinned.position.set( 0, 0, 0 );
                        skinned.rotation.set( 0, 0, 0 );
                        skinned.scale.copy( object.scale );
                        skinned.visible = object.visible; // overwrite object.visible = true.
                        skinned.castShadow = true;
                        skinned.name = object.name;

                    //  "this.add()" refresh each time.
                        self.add({[key]: skinned});

                    });

                })(key);

            }
*/

//  Outfit DNA is an object that contains the outfit data that needed to
//  re-create the player oufit anywhere remotly. It is player outfit assets
//  in transfered structure ( aka like .toJSON() ).
//
//  .toDNA(); .fromDNA(dna); Usage:
//      dna = localPlayer.outfit.toDNA();
//      player = new Player();
//      player.outfit = new AW3D.Outfit(player);
//      player.outfit.fromDNA( dna );

    //  to DNA (v2).

        toDNA: function(){

            return encode( JSON.stringify( this.toJSON() ) );

            function encode( string ) {
                if ( !!window.RawDeflate ) {
                    return window.btoa( RawDeflate.deflate( string ) );
                } else {
                    return string;
                }
            }

        },


    //  from DNA (v2).

        fromDNA: function( dna ){

            //  Validation.

            if ( typeof(dna) == "string" ) {

                if ( validator.isBase64( dna ) ) {

                    return new Promise( (resolve, reject) => {
                        var json = JSON.parse( decode( dna ) );
                        resolve( this.fromJSON(json) );
                    }).catch( function(err){ 
                        console.error(err);
                        throw err; 
                    });

                } else if ( validator.isJSON( dna ) ) {

                    return new Promise( (resolve, reject) => {
                        var json = JSON.parse( dna );
                        resolve( this.fromJSON(json) );
                    }).catch( function(err){ 
                        console.error(err);
                        throw err; 
                    });

                } else {

                    return new Promise( (resolve, reject) => {
                        var err = "DNA is not valid.";
                        console.error( "Error: " + err );
                        reject( "Validation Error: " + err );
                        //  throw Error( err );
                    });

                }

            } else {

                return new Promise( (resolve, reject) => {
                    var err = "Unsupported DNA type: " + typeof(dna);
                    console.error( "Error: " + err );
                    reject( "Validation Error: " + err );
                    //  throw Error( err );
                });

            }

            function decode( string ) {
                if ( !!window.RawDeflate ) {
                    return RawDeflate.inflate( window.atob( string ) );
                } else {
                    return string;
                }
            }

        },

    };


//  AW3D AnimationHandler.js

/*
    * @author anywhere3d
    * http://anywhere3d.org
    * MIT License
*/


//  Reset THREE.AnimationHandler.animations array.
    THREE.AnimationHandler.animations.length = 0;
    AnimationManager = THREE.AnimationHandler;

    AW3D.AnimationHandler = function ( mesh, gender ) {

        this.mesh = mesh;
        this.gender = gender; // IMPORTANT //
        this.actions = {};

    //  This create the animations of skinned mesh. 
        this.reloadActions(); // IMPORTANT //

    };

    AW3D.AnimationHandler.prototype = {

        constructor: AW3D.AnimationHandler,

        findAction: function(action){
            return THREE.AnimationHandler.animations.filter( function(animation){
                return (animation == action); // boolean.
            }); // BE CAREFULL: returns new array with resutls.
        },

        findByUuid: function( name ){
            return THREE.AnimationHandler.animations.filter( function(animation){
                return (animation.uuid == this.actions[ name ].uuid); // boolean.
            }); // BE CAREFULL: returns new array with resutls.
        },

        findByName: function( name ){
            return THREE.AnimationHandler.animations.filter( function(animation){
                return (animation.data.name == name); // boolean.
            }); // BE CAREFULL: returns new array with resutls.
        },

    //  To stop an animation, find the animation in
    //  THREE.AnimationHandler.animations and stop it from there.

        stop: function stop(){
            var self = this;
            Object.keys( self.actions ).forEach(function(name, i){
                var action = self.actions[name];
                self.findAction(action).forEach(function(animation){
                    animation.stop();
                });
            });
        },

    //  To delete an action, stop the animation in 
    //  THREE.AnimationHandler.animations and then delete it from this.actions.

        delete: function( name ){
            var action = this.actions[ name ];
            this.findAction( action ).forEach(function(animation){
                animation.stop();
            });
            delete this.actions[ name ];
        },

        reset: function reset(){
            for (var i in arguments){
                var name = arguments[i];
                this.actions[ name ].weight = 1;
                this.actions[ name ].timeScale = 1;
                this.actions[ name ].currentTime = 0;
            }
        },

        resetAll: function(){
            var self = this;
            Object.keys( self.actions ).forEach(function(name, i){
                self.reset( name );
            });
        },

        deleteAll: function(){
            var self = this;
            Object.keys( self.actions ).forEach(function(name, i){
                self.delete[ name ]
            });
        },

        play: function play(){
            for (var i in arguments){
                var name = arguments[i];
                if ( !this.actions[ name ] ) return;
                this.actions[ name ].play(0);
            }
        },

    //  To pause an animation, find the animation 
    //  in THREE.AnimationHandler.animations and set timeScale to 0.
    
        pause: function pause(){
            for (var i in arguments){
                var name = arguments[i];
                var action = this.actions[ name ];
                this.findAction( action ).forEach(function(animation){
                    animation.timeScale = 0;
                });
            }
        },

    //  To unpause an animation, find the animation 
    //  in THREE.AnimationHandler.animations and set timeScale to 1.

        continue: function(){
            for (var i in arguments){
                var name = arguments[i];
                var action = this.actions[ name ];
                this.findAction( action ).forEach(function(animation){
                    animation.timeScale = 1;
                });
            }
        },

        weightOff: function(){
            for (var i in arguments){
                var name = arguments[i];
                var action = this.actions[ name ];
                this.findAction( action ).forEach(function(animation){
                    animation.weight = 0;
                });
            }
        },

        weightOn: function(){
            for (var i in arguments){
                var name = arguments[i];
                var action = this.actions[ name ];
                this.findAction( action ).forEach(function(animation){
                    animation.weight = 1;
                });
            }
        },

        fadeIn: function(){
            var fades = [];
            for (var i in arguments){
                var name = arguments[i];
                var animation = this.actions[ name ];
                fades.push(function fade(){
                    var requestId = requestAnimationFrame( fade );
                    animation.timeScale = 1; // !important
                    animation.weight += ( 0.05 * (1 - animation.weight) );
                    animation.play(animation.currentTime, animation.weight);
                    debugMode && console.log( "fadeIn: ", round(animation.weight, 3) );
                    if ( round(animation.weight, 3) > 0.9 ){
                        cancelAnimationFrame( requestId );
                        animation.weight = 1;
                        animation.timeScale = 1;
                        animation.play(animation.currentTime, 1);
                    }
                });
            }

        //  Call all functions in fades.
            while (fades.length){ 
                fades.shift().call(); 
            }
        },

        fadeOut: function(){
            var fades = [];
            for (var i in arguments){
                var name = arguments[i];
                var action = this.actions[ name ];
                this.findAction( action ).forEach(function(animation){
                    fades.push(function fade(){
                        var requestId = requestAnimationFrame( fade );
                        animation.timeScale = 1; // !important
                        animation.weight -= ( 0.05 * animation.weight );
                        animation.play(animation.currentTime, animation.weight);
                        debugMode && console.log( "fadeOut:", round(animation.weight, 3) );
                        if ( round(animation.weight, 3) < 0.1 ){
                            cancelAnimationFrame( requestId );
                            animation.stop();
                            animation.weight = 1;
                            animation.timeScale = 1;
                        }
                    });
                });
            }

        //  Call all functions in fades.
            while (fades.length){ 
                fades.shift().call(); 
            }
        },

        idle: function idle(){
            this.actions.idle.play(0);
        },

        jump: function jump(){
            this.actions.jump.play(0);
        },

        run: function run(){
            this.actions.run.play(0);
        },

        walk: function walk(){
            this.actions.walk.play(0);
        },
    
    //  --------------------------------------------------------  //

    //  IMPORTANT: This create the animations of skinned mesh.

        loadAction: function(){

            for (var i in arguments){
                var name = arguments[i];
            //  var data = Animations[ name ];
                var data;
                switch(this.gender){
                    case "male":
                        data = MaleAnimations[ name ];
                        break;
                    case "female":
                        data = FemaleAnimations[ name ];
                        break;
                    case false:
                        data = Animations[ name ];
                        break;
                    default:
                        data = Animations[ name ];
                }
            
                var action = new THREE.Animation( this.mesh, data );
                action.uuid = THREE.Math.generateUUID();
                action.weight = 1;
                action.timeScale = 1;
                action.currentTime = 0;
                this.actions[ name ] = action;
            }
        },

        reloadActions: function(){
            var self = this;

            this.stop();
            this.deleteAll();
            this.actions = {};

            if (!!this.gender && this.gender == "male") {
                Object.keys( MaleAnimations ).forEach(function(name, i){
                    self.loadAction( name );
                });
            }
            
            if (!!this.gender && this.gender == "female") {
                Object.keys( FemaleAnimations ).forEach(function(name, i){
                    self.loadAction( name );
                });
            }

            if ( !this.gender ) {
                Object.keys( Animations ).forEach(function(name, i){
                    self.loadAction( name );
                });
            }

            if ( !!this.gender && this.gender != "male" && this.gender != "female" ){
                console.warn("AW3D.AnimationHandler:",
                    `reloadActions(${this.gender}): Gender exists but is not male or female.`
                );
            }

            if (!!this.actions.jump) this.actions.jump.loop = false;
        }

    };


//  deepCopy.js

    function deepCopy(obj) {
        if (Object.prototype.toString.call(obj) === "[object Array]") {
            var out = [], i = 0, len = obj.length;
            for ( ; i < len; i++ ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === "object") {
            var out = {}, i;
            for ( i in obj ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    }

//  round.js  source: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round"

    function round(number, precision) {
        var shift = function (number, precision, reverseShift) {
            if (reverseShift) {
                precision = -precision;
            }  
            numArray = ("" + number).split("e");
            return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
        };
        return shift(Math.round(shift(number, precision, false)), precision, true);
    }




//  materialtoJson.js (v1.4)

//  MATERIAL TO JSON.
//  Return a promise with the 
//  material json object resolved.

    function materialtoJSON( material ){


    //  MULTIMATERIAL.

        if ( material.type == "MultiMaterial" ) {


        //  multimaterial to json.

            var multjson = {

                _id: "",
                type: material.type,
                uuid: material.uuid || THREE.Math.generateUUID(),

            };


        //  materials to json.

            multjson.materials = [];

            for ( var i = 0; i < material.materials.length; i++ ){

                multjson.materials.push( materialtoJSON( material.materials[i] ) );

            }


            debugMode && console.log( "multimaterial to json:", multjson );

            return multjson;

        }


    //  MATERIAL.

        var json = {};

        for ( var name in material ){

            if ( material[ name ] == undefined ) continue;         // important!
            if ( material[ name ] instanceof Function ) continue;  // important!

            switch( name ){

                case "defines":
                case "program":
                case "_listeners":
                case "needsUpdate":
                case "_needsUpdate":
                case "__webglShader":
                break;


            //  uuid.

                case "uuid":
                    json.uuid = material.uuid || THREE.Math.generateUUID();
                break;


            //  name && _id.

                case "name":
                    json._id = material[ name ];
                    json[ name ] = material[ name ];
                break;


            //  default.

                default:
                    json[ name ] = material[ name ];
                break;


            //  texture to json.

                case "map":
                case "bumpMap":
                case "alphaMap":
                case "normalMap":
                case "emissiveMap":
                case "displacementMap":
                case "metalnessMap":
                case "roughnessMap":
                case "specularMap":
                case "lightMap":
                case "aoMap":

                    if ( !(material[ name ] instanceof THREE.Texture) ) {
                        throw `${name} is not instance of THREE.Texture`;
                    }

                    json[ name ] = texturetoJSON( material[ name ] );

                break;


            //  three color to hex.

                case "color":
                case "emissive":
                case "specular":

                    if ( !(material[ name ] instanceof THREE.Color) ) {
                        throw `${name} is not instance of THREE.Color`;
                    }

                    json[ name ] = material[ name ].getHex();

                break;


            //  vector2 to array.

                case "normalScale":

                    if ( !(material[ name ] instanceof THREE.Vector2) ) {
                        throw `${name} is not instance of THREE.Vector2`;
                    }

                    json[ name ] = material[ name ].toArray();

                break;


            //  cube texture (TODO).

                case "envMap":

                    // TODO //

                break;

            }

        }


    //  debugMode && console.log({"material to json": json});

        return json;

    }


//  TEXTURE TO JSON.
//  Return a promise resolved 
//  with the texture json object.

    function texturetoJSON( texture ){

        var json = {};

        for (var name in texture ){

            if ( texture[ name ] == undefined ) continue;
            if ( texture[ name ] instanceof Function ) continue;


            switch (name){

                case "_listeners":
                break;


            //  uuid.

                case "uuid":
                    json[ name ] = texture[ name ] || THREE.Math.generateUUID();
                break;


            //  default.

                default:
                    json[ name ] = texture[ name ];
                break;


            //  vector2 to array.

                case "offset":
                case "repeat":
                    json[ name ] = texture[ name ].toArray();
                break;


            //  image to json.

                case "image":
                    json[ name ] = texture.sourceFile || getDataURL( texture[ name ] ); // important!
                break;

            }

        }

        return json;

    }


//  IMAGE TO JSON.
//  Return a promise with the 
//  image json object resolved.

    function imagetoJSON( image ){

        return {
            uuid: THREE.Math.generateUUID(),
            src: image.src || getDataURL( image ),
        };

    }



//  materialfromJson.js (v1.4)

//  MATERIAL FROM JSON.
//  Return a promise with the material resolved.

    function materialfromJSON( json ){

   //  MULTIMATERIAL.

       if ( json.type == "MultiMaterial" ) {


           var materials = [];

           for ( var i = 0; i < json.materials.length; i++ ){

               materials.push( materialfromJSON( json.materials[i] ) );

           }


       //  Create multimaterial.

           var multimaterial = new THREE.MeshFaceMaterial(materials);

           multimaterial.uuid = json.uuid || THREE.Math.generateUUID();

           return multimaterial;

        }


    //  MATERIAL.

        var options = {};

        for (var name in json){

            if ( json[ name ] == undefined ) continue; // important!

            switch (name){

                case "_id":
                break;

            //  uuid.

                case "uuid":
                    options.uuid = json.uuid || THREE.Math.generateUUID();
                break;


            //  default.

                default:
                    options[ name ] = json[ name ];
                break;


            //  texture from json.

                case "alphaMap":
                case "aoMap":
                case "bumpMap":
                case "displacementMap":
                case "emissiveMap":
                case "lightMap":
                case "map":
                case "metalnessMap":
                case "normalMap":
                case "roughnessMap":
                case "specularMap":

                        options[ name ] = texturefromJSON( json[ name ] );

                break;


            //  three color to hex.

                case "color":
                case "emissive":
                case "specular":

                    options[ name ] = new THREE.Color();
                    options[ name ].setHex( json[ name ] );

                break;


            //  vector2 from array.

                case "normalScale":

                    options[ name ] = new THREE.Vector2();
                    options[ name ].fromArray( json[ name ] );

                break;


            //  cube texture (TODO).

                case "envMap":

                    // TODO //

                break;

            }

        }

        return new THREE[ options.type ](options);

    }

//  TEXTURE FROM JSON.
//  Return a promise with the texture resolved.

    function texturefromJSON( json ){

        var texture = new THREE.Texture();

        for ( var name in json ){


            switch (name){


            //  default.

                default:
                    texture[ name ] = json[ name ];
                break;


            //  array to vector2.

                case "offset":
                case "repeat":

                    if ( json[ name ].length != 2) break;

                    texture[ name ] = new THREE.Vector2();
                    texture[ name ].fromArray( json[ name ] );

                break;


            //  wrapS & wrapT.

                case "wrap":

                    if ( json[ name ].length != 2) break;
                    if ( !( json[ name ] instanceof Array ) ) break;

                    texture.wrapS = json[ name ][0];
                    texture.wrapT = json[ name ][1];

                break;


            //  image from json.

                case "image":

                    (function (){

                        var img = new Image();
                        img.crossOrigin = "anonymous";
                        $(img).one("load", function(){
                            texture.image = this;
                            texture.needsUpdate = true;
                        }).attr({src: json.image});

                    })();

                break;

            }

        }

        return texture;

    }

//  IMAGE FROM JSON.
//  Return a promise with the image resolved.

    function imagefromJSON( json, onImageLoad ){

        var img = new Image();
        img.crossOrigin = "anonymous";

        if ( onImageLoad ) {
            img.addEventListener("load", onImageLoad);
        }

        img.src = json.src;

        return img;

    }

//  makePowerOfTwo.js

    function makePowerOfTwo( image, natural ) {

        var canvas = document.createElement( "canvas" );

        if ( natural ){
            canvas.width = THREE.Math.nearestPowerOfTwo( image.naturalWidth );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.naturalHeight );
        } else {
            canvas.width = THREE.Math.nearestPowerOfTwo( image.width );
            canvas.height = THREE.Math.nearestPowerOfTwo( image.height );
        }

        var context = canvas.getContext( "2d" );
        context.drawImage( image, 0, 0, canvas.width, canvas.height );

    //  debugMode && console.warn( "outfitLoader:makePowerOfTwo(img):", 
    //  "Image resized to:", canvas.width, "x", canvas.height );

        return canvas;
    }

//  getDataURL.js

    function getDataURL( image ) {

        var canvas;

        if ( image.toDataURL !== undefined ) {

            canvas = image;

        } else {

            canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' );
            canvas.width = image.width;
            canvas.height = image.height;

            canvas.getContext( '2d' ).drawImage( image, 0, 0, image.width, image.height );

        }

        if ( canvas.width > 2048 || canvas.height > 2048 ) {

            return canvas.toDataURL( 'image/jpeg', 0.6 );

        } else {

            return canvas.toDataURL( 'image/png' );

        }

    }



















/*
    //  Validation.

    if (!!validator) {

        var err = "Can not create JSON. One or more textures source url are missing.";

        if ( !!this[ name ].material.materials ) {

            this[ name ].material.materials.forEach( function(material, i){
                if (!!material.map && typeof(material.map.sourceFile) == "string" && !validator.isURL(material.map.sourceFile) ) throw Error(err);
                if (!!material.aoMap && typeof(material.aoMap.sourceFile) == "string" && !validator.isURL(material.aoMap.sourceFile) ) throw Error(err);
                if (!!material.envMap && typeof(material.envMap.sourceFile) == "string" && !validator.isURL(material.envMap.sourceFile) ) throw Error(err);
                if (!!material.bumpMap && typeof(material.bumpMap.sourceFile) == "string" && !validator.isURL(material.bumpMap.sourceFile) ) throw Error(err);
                if (!!material.alphaMap && typeof(material.alphaMap.sourceFile) == "string" && !validator.isURL(material.alphaMap.sourceFile) ) throw Error(err);
                if (!!material.lightMap && typeof(material.lightMap.sourceFile) == "string" && !validator.isURL(material.lightMap.sourceFile) ) throw Error(err);
                if (!!material.normalMap && typeof(material.normalMap.sourceFile) == "string" && !validator.isURL(material.normalMap.sourceFile) ) throw Error(err);
                if (!!material.emissiveMap && typeof(material.emissiveMap.sourceFile) == "string" && !validator.isURL(material.emissiveMap.sourceFile) ) throw Error(err);
                if (!!material.specularMap && typeof(material.specularMap.sourceFile) == "string" && !validator.isURL(material.specularMap.sourceFile) ) throw Error(err);
                if (!!material.roughnessMap && typeof(material.roughnessMap.sourceFile) == "string" && !validator.isURL(material.roughnessMap.sourceFile) ) throw Error(err);
                if (!!material.metalnessMap && typeof(material.metalnessMap.sourceFile) == "string" && !validator.isURL(material.metalnessMap.sourceFile) ) throw Error(err);
                if (!!material.displacementMap && typeof(material.displacementMap.sourceFile) == "string" && !validator.isURL(material.displacementMap.sourceFile) ) throw Error(err);
            });

        } else {

            var material = this[ name ].material;
            if (!!material.map && typeof(material.map.sourceFile) == "string" && !validator.isURL(material.map.sourceFile) ) throw Error(err);
            if (!!material.aoMap && typeof(material.aoMap.sourceFile) == "string" && !validator.isURL(material.aoMap.sourceFile) ) throw Error(err);
            if (!!material.envMap && typeof(material.envMap.sourceFile) == "string" && !validator.isURL(material.envMap.sourceFile) ) throw Error(err);
            if (!!material.bumpMap && typeof(material.bumpMap.sourceFile) == "string" && !validator.isURL(material.bumpMap.sourceFile) ) throw Error(err);
            if (!!material.alphaMap && typeof(material.alphaMap.sourceFile) == "string" && !validator.isURL(material.alphaMap.sourceFile) ) throw Error(err);
            if (!!material.lightMap && typeof(material.lightMap.sourceFile) == "string" && !validator.isURL(material.lightMap.sourceFile) ) throw Error(err);
            if (!!material.normalMap && typeof(material.normalMap.sourceFile) == "string" && !validator.isURL(material.normalMap.sourceFile) ) throw Error(err);
            if (!!material.emissiveMap && typeof(material.emissiveMap.sourceFile) == "string" && !validator.isURL(material.emissiveMap.sourceFile) ) throw Error(err);
            if (!!material.specularMap && typeof(material.specularMap.sourceFile) == "string" && !validator.isURL(material.specularMap.sourceFile) ) throw Error(err);
            if (!!material.roughnessMap && typeof(material.roughnessMap.sourceFile) == "string" && !validator.isURL(material.roughnessMap.sourceFile) ) throw Error(err);
            if (!!material.metalnessMap && typeof(material.metalnessMap.sourceFile) == "string" && !validator.isURL(material.metalnessMap.sourceFile) ) throw Error(err);
            if (!!material.displacementMap && typeof(material.displacementMap.sourceFile) == "string" && !validator.isURL(material.displacementMap.sourceFile) ) throw Error(err);

        }

    } else {

        console.warn("Can not validate texture source.");

    }
*/

/*
        //  Re-generation.

            var promises = [];

            for ( var key in json ) {
                if ( json[ key ].visible ) promises.push( recoverfromJson( key ) );
            }

            debugMode && console.log("promises:", promises);

            //  If one of theses promises will not resolved(*)
            //  (or not rejected) we do not get any results.

            Promise.all(promises).then( ( results ) => {

            //  Clean up results array.
                results = results.filter(Boolean); // important!
                debugMode && console.log( "filtered results:", results );

            //  Restore outfit.
                this.removeAll();
                this.setGender( gender );
                this.add.apply( this, results );   // WARNING: DO NOT MODIFY. //
                this.AnimationsHandler.refresh();

            });

            //  --------------------------------------------------------------------------------  //
            //  IMPORTANT NOTE: .add() and .remove() are sending a "change" event for every use.
            //  --------------------------------------------------------------------------------  //

            //  Clear promises array from unresolved promises.
            //  source: "https://stackoverflow.com/questions/30362733/handling-errors-in-promise-all/46024590#46024590".
            //  const results = await Promise.all(promises.map(p => p.catch(e => e)));
            //  const validResults = results.filter(result => !(result instanceof Error));

            function recoverfromJson( key ){

                //  VERY IMPORTANT: need to be a copy of json explictly. VERY IMPORTANT //
                //  var json = JSON.parse( JSON.stringify( json ) ); (it is a copy already). 
                //  Copy json properties, to prevent overwritting.       //  IMPORTANT  //

                var object = {};

                object.name      = json[ key ].name;
                object.visible   = json[ key ].visible;
                object.materials = json[ key ].materials;
                object.geometry  = json[ key ].geometry;  // url.

                object.scale = new THREE.Vector3().fromArray( json[ key ].scale );

            //  Copy key to prevent overwritting.

                var url = object.geometry;
                debugMode && console.log(`${key}: ${url}`);

                return new Promise( function( resolve, reject ){

                //  Materials.
                    var materials = [];

                    object.materials.forEach(function( material, index ){

                    //  Make a copy of json material.
                        var material = deepCopy( material );  // !important.

                        materials.push( new Promise( function(resolve, reject){

                        //  Restore normalScale vector.                  
                            if ( !!material.options.normalScale ){
                                material.options.normalScale = new THREE.Vector2()
                                    .fromArray( material.options.normalScale ); // !important.
                            }

                        //  Textures.
                            var textures = [];

                            if (!!material.map) textures.push( loadMapTexture( "map" ) );
                            if (!!material.aoMap) textures.push( loadMapTexture( "aoMap" ) );
                            if (!!material.envMap) textures.push( loadMapTexture( "envMap" ) );
                            if (!!material.bumpMap) textures.push( loadMapTexture( "bumpMap" ) );
                            if (!!material.alphaMap) textures.push( loadMapTexture( "alphaMap" ) );
                            if (!!material.lightMap) textures.push( loadMapTexture( "lightMap" ) );
                            if (!!material.normalMap) textures.push( loadMapTexture( "normalMap" ) );
                            if (!!material.emissiveMap) textures.push( loadMapTexture( "emissiveMap" ) );
                            if (!!material.specularMap) textures.push( loadMapTexture( "specularMap" ) );
                            if (!!material.roughnessMap) textures.push( loadMapTexture( "roughnessMap" ) );
                            if (!!material.metalnessMap) textures.push( loadMapTexture( "metalnessMap" ) );
                            if (!!material.displacementMap) textures.push( loadMapTexture( "displacementMap" ) );


                       //  Materials.

                            promises.push( Promise.all(textures).then(function( result ){

                                switch ( material.type ) {
                                    case "MeshBasicMaterial":
                                        resolve( new THREE.MeshBasicMaterial( material.options ) );    // multimaterialPromises.push resolve.
                                        break;
                                    case "MeshDepthMaterial":
                                        resolve( new THREE.MeshDepthMaterial( material.options ) );    // multimaterialPromises.push resolve.
                                        break;
                                    case "MeshLambertMaterial":
                                        resolve( new THREE.MeshLambertMaterial( material.options ) );  // multimaterialPromises.push resolve.
                                        break;
                                    case "MeshNormalMaterial":
                                        resolve( new THREE.MeshNormalMaterial( material.options ) );   // multimaterialPromises.push resolve.
                                        break;
                                    case "MeshPhongMaterial":
                                        resolve( new THREE.MeshPhongMaterial( material.options ) );    // multimaterialPromises.push resolve.
                                        break;
                                    case "MeshPhysicalMaterial":
                                        resolve( new THREE.MeshPhysicalMaterial( material.options ) ); // multimaterialPromises.push resolve.
                                        break;
                                    case "MeshStandardMaterial":
                                        resolve( new THREE.MeshStandardMaterial( material.options ) ); // multimaterialPromises.push resolve.
                                        break;
                                    default:
                                        resolve( new THREE.MeshStandardMaterial( material.options ));  // multimaterialPromises.push resolve.
                                }

                            }));

                            function loadMapTexture( name ){
                                return new Promise(function(resolve, reject){
                                    var src = material[ name ];
                                    var img = new Image();
                                    img.crossOrigin = "anonymous"; // !important.
                                    $(img).one("load", function(){
                                        material.options[ name ] = new THREE.Texture( img );
                                        material.options[ name ].sourceFile = src;
                                        material.options[ name ].needsUpdate = true;
                                        $(img).remove();
                                        resolve( material.options[ name ] );
                                    });
                                    img.src = src;
                                });
                            }

                        }));

                    });


                    promises.push( Promise.all(materials).then(function( result ){

                        if ( result.length == 0 )
                            var material = new THREE.MeshStandardMaterila({skinning:true});

                        if ( result.length == 1 ) 
                            var material = result[0];

                        if ( result.length > 1 )
                            var material = new THREE.MeshFaceMaterial( result );  //  MultiMaterial.

                    //  Geometry.

                        w3.getHttpObject( url, function( obj ){

                            var loader = new THREE.JSONLoader();
                            var geometry = loader.parse( obj ).geometry;

                            geometry.sourceFile = url;  // important!

                            geometry.computeFaceNormals();
                            geometry.computeVertexNormals();
                            geometry.computeBoundingBox();
                            geometry.computeBoundingSphere();
                            geometry.name = obj.name;

                            var skinned = new THREE.SkinnedMesh( geometry, material );

                            skinned.renderDepth = 1;
                            skinned.frustumCulled = false;
                            skinned.position.set( 0, 0, 0 );
                            skinned.rotation.set( 0, 0, 0 );
                            skinned.scale.copy( object.scale );
                            skinned.visible = object.visible; // overwrite object.visible = true.
                            skinned.castShadow = true;

                            resolve( {[key]: skinned} );

                        });

                    }));

                });

            }  

            //  end recoverfromJson.

        },

        //  end fromJSON.
*/
