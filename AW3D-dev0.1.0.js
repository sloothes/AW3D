//  AW3D.Outift.js

/*!
* @author anywhere3d
* http://anywhere3d.org
* MIT License
*/

    var AW3D = { VERSION: '0.1.0' };

//  Player Holder.
    AW3D.PlayerHolder = function (){
        var holder = new THREE.Object3D();
        holder.position.set( 0, 1, 0 ); // startPoint.
        holder.name = "PLAYER_HOLDER";
        return holder;
    }

//  Player Holder Helper.
    AW3D.PlayerHolderHelper = function (){
        var helper = new THREE.BoxHelper();
        helper.name = "PLAYER_HOLDER_HELPER";
        helper.visible = debugMode || false;
        return helper;
    }

//  Player Controller Direction pointer.
    AW3D.DirectionPointer = function (){
        var geometry = new THREE.CylinderGeometry( 0, 1, 20, 12 );
        geometry.rotateX( Math.PI / 2 );  //  BE CAREFULL: is not "mesh.rotation.y = -Math.PI". //
        var material = new THREE.MeshStandardMaterial({color:0x00ff00});
        var pointer = new THREE.Mesh(geometry, material);
        pointer.position.set(0, 15, 0);
        pointer.name = "PLAYER_DIRECTION";
        pointer.visible = debugMode || false;
        return pointer;
    }

//  Player Sphere.
    AW3D.PlayerSphere = function (){
        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry( 15, 8, 4 ),
            new THREE.MeshBasicMaterial( { color: 0xff0000,  wireframe: true} )
        ); 
        sphere.position.y = 12.5;
        sphere.name = "PLAYER_SPHERE";
        sphere.visible = debugMode || false;
        return sphere;
    }

//  Player pointer.
    AW3D.PlayerPointer = function (){
        var geometry = new THREE.CylinderGeometry( 0, 1, 20, 12 );
        geometry.rotateX( Math.PI / 2 );  //  BE CAREFULL: is not "mesh.rotation.y = -Math.PI". //
        var material = new THREE.MeshNormalMaterial();
        var pointer = new THREE.Mesh(geometry, material);
        pointer.position.set(0, 40, 0);
        pointer.name = "PLAYER_POINTER";
        pointer.visible = debugMode || false;
        return pointer;
    }



//  AW3D Outfit.js

/*!
* @author anywhere3d
* http://anywhere3d.org
* MIT License
*/

    AW3D.Outfit = function( player ){
        
        var player = player || localPlayer;

        var outfit = {
    
            direction: new THREE.Object3D(),
        
        //  If outfits are children of direction we do not need 
        //  updatePosition() or updateRotation(). Just use outfit.update() [direction].
        
            update: function(){
            
            //  var self = this;

            //  Update avatar rotation y.

                var direction = player.controller.direction - Math.PI;

                this.direction.rotation.y = direction;

            //  Update avatar position.

                var x = player.controller.center.x;
                var y = player.controller.center.y - player.controller.radius;
                var z = player.controller.center.z;
                
            //  var position = new THREE.Vector3(x, y, z);
            //  this.direction.position.copy( position );

                this.direction.position.set( x, y, z );
            },

            

        //  Update avatar position.

            updatePosition: function(){
                
                console.warn("DEPRECATED:", 
                    "outfit.updatePosition() is deprecated.", 
                    "Use outfit.update() instead." );
            },


        //  Update avatar rotation.
        
            updateRotation: function( y ){

                console.warn("DEPRECATED:", 
                    "outfit.updateRotation(y) is deprecated.", 
                    "Use outfit.update() instead." );
            },


            addToScene: function(name, asset){

                console.warn("DEPRECATED", 
                    "outfit.addToScene(name, asset) is deprecated.", 
                    "Use outfit.direction.add(asset) instead." );

                if ( !name || name == null || !asset ) return;
                this[ name ] = asset.clone();
                this.direction.add( this[ name ] );
                this.AnimationsHandler.refresh();

            },


            addsToScene: function(){

                console.warn("DEPRECATED:", 
                    "outfit.addsToScene() is deprecated.", 
                    "Use native threejs add() function.",
                    "e.g. outfit.direction.add(arg1, arg2, ..., argN) instead." );

                for (var i in arguments){
                    var name = Object.keys(arguments[i])[0];
                    var asset = Object.values(arguments[i])[0];
                    if ( !name || name == null || !asset ) continue;
                    this[ name ] = asset.clone();
                    this.direction.add( this[ name ] );
                }

                this.AnimationsHandler.refresh();

            },


            set: function(){

            //  Object style argument: "{name: asset}".
            //  debugMode && console.log("outfit.set(arguments):", arguments);

                for (var i in arguments){

                    var name = Object.keys(arguments[i])[0];
                    var asset = Object.values(arguments[i])[0];
                //  debugMode && console.log(name + ":", asset);

                    if ( !name || name == null || !asset ) continue;
                    if (!!this[ name ]) this.remove( name );

                    this[ name ] = asset.clone();
                }

                this.AnimationsHandler.refresh();

            },

            add: function(){

            //  Object style argument: "{name: asset}".
            //  debugMode && console.log("outfit.add(arguments):", arguments);

                for (var i in arguments) {
                    
                    var name = Object.keys(arguments[i])[0];
                    var asset = Object.values(arguments[i])[0];
                //  debugMode && console.log(name + ":", asset);

                    if ( !name || name == null || !asset ) continue;
                    if (!!this[ name ]) this.remove( name );

                    this[ name ] = asset.clone();
                    this.direction.add( this[ name ] );
                }

                this.AnimationsHandler.refresh(); 

            },

        //  scene.remove() always returns "undefined" (does not throw error).

            remove: function(){

                if ( arguments.length == 0 ) return;
                
                var self = this;

                for (var i in arguments){
                    var name = arguments[i];
                    self.direction.remove( self[ name ] );
                //  Dispose geometry.
                //      self[ name ].geometry.dispose();
                //  Dispose materials.
                //  if ( !!self[ name ].material.materials ){
                //      self[ name ].material.materials.forEach(function(material){
                //  TODO: Dispose textures.
                //          material.dispose();
                //      });
                //  } else {
                //      self[ name ].material.dispose();
                //  }
                    self[ name ] = null;
                    delete self[ name ];
                }

                this.AnimationsHandler.refresh();

            },

            removeFromScene: function(){

                var self = this;

                if ( arguments.length == 0 ) {

                //  "aparts" has renamed to "outfits".
                    self.outfits.forEach( function( name ){
                        self.remove( name );
                    });

                } else {

                    for (var i in arguments){
                        self.remove( name );
                    }
                }
    
                this.AnimationsHandler.refresh();

            },


            removeTexture: function( outfit, map, index ){
            //  outfit: outfit name from outfits (e.g "body", "hair", "dress", etc.)
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
    
            gender: {
                male    : false,
                female  : false,
                shemale : false,
                trans   : false,
            },
    
            genitals: { 
                vagina   : false,
                penis    : false,
                attached : false,
            },
    
        // "aparts" has renamed to "outfits".
    
            outfits: [
                "skeleton",
                "body", 
                "bodypaint",
                "makeup", 
                "hairs",
                "bra", 
                "panties", 
                "boxers", 
                "tshirt",
                "skirt",
                "trousers", 
                "dress", 
                "shoes",
                "coat", 
                "penis", 
                "vagina" 
            ],
    
            setGender: function( gender ){
                var self = this;
                Object.keys(this.gender).forEach( function( name ){
                    self.gender[ name ] = ( name == gender );
                });
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
            },
    
            getdata: function( name ){
                
                if ( !name ) return;
    
                var data = {};
    
                data[ name ] = {}
                data[ name ].materials = [];
            
            //  Materials.
            
                if ( !!this[ name ].material.materials ){
    
                    this[ name ].material.materials.forEach( function(material, i){
                        data[ name ].materials.push( toJSON(material) );
                    });
    
                } else {
    
                    var material = this[ name ].material;
                    data[ name ].materials.push( toJSON(material) );
    
                }

                data[ name ].scale   = this[ name ].scale;
                data[ name ].visible = this[ name ].visible;

                return data[ name ];
            
                function toJSON( material ){
                    var json = {};
                    
                    json.type = material.type;
                    if (!!material.map)     json.map     = material.map.sourceFile;
                    if (!!material.bumpMap) json.bumpMap = material.bumpMap.sourceFile;
                    
                    var options = {}
                    options.name = material.name;
                    options.uuid = material.uuid;
                    options.shininess = material.shininess;
                    options.color = material.color.getHex();
                    options.emissive = material.emissive.getHex();
                    options.transparent = material.transparent;
                    options.opacity = material.opacity;
                    options.skinning = material.skinning;
    
                    json.options = options;
                    return json;
                }
    
            },
    
            promise: function( fn ){
                return new Promise(function(resolve, reject){
                    if ( !fn ) resolve();
                    if ( fn instanceof Function ) resolve( fn() );
                    else resolve();
                });
            },
    
            AnimationsHandler: []
    
        };
    
        outfit.AnimationsHandler.reset = function(){
            this.length = 0; // reset array.
        };
    
        outfit.AnimationsHandler.stop = function(){
            this.forEach( function( anim ){
                if (!!anim ) anim.stop();
            });
        };
    
        outfit.AnimationsHandler.jump = function(){
            this.forEach( function( anim ){
                if (!!anim ) anim.jump();
            });
        };
    
        outfit.AnimationsHandler.play = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.play(name);
                });
            }
        };
    
        outfit.AnimationsHandler.weightOff = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.weightOff(name);
                });
            }
        };
    
        outfit.AnimationsHandler.weightOn = function(){
            for (var i in arguments){
                var name = arguments[i];
                this.forEach( function( anim ){
                    if (!!anim ) anim.weightOn(name);
                });
            }
        };
    
        outfit.AnimationsHandler.refresh = function(){
        //  outfit.AnimationsHandler is an "OutfitAnimationHandler" (array).
    
            this.stop();
            this.fill(null);
            this.reset();
    
        //  "aparts" has renamed to "outfits".
            player.outfit.outfits.forEach( function(name, i){
                if ( !!player.outfit[ name ] ){
    
                    var handler = new AW3D.AnimationHandler( player.outfit[ name ], player.outfit.getGender() );
    
                //  debugMode && console.log( "new AW3D.AnimationHandler(" + name + ", " + player.outfit.getGender() + ")" );
    
                    player.outfit.AnimationsHandler.push( handler );
                }
            });
    
            player.outfit.AnimationsHandler.play("idle");
    
        };
        
        return outfit;
    
    };
