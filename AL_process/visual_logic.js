/**
 * Generated by Verge3D Puzzles v.2.11.1
 * Fri Jun 19 2020 17:59:24 GMT+0800 (中国标准时间)
 * Do not edit this file - your changes may get overridden when Puzzles are saved.
 * Refer to https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for information on how to add your own JavaScript to Verge3D apps.
 */

"use strict";

(function() {

// global variables/constants used by puzzles' functions
var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.objClickCallbacks = [];
_pGlob.pickedObject = '';
_pGlob.objHoverCallbacks = [];
_pGlob.hoveredObject = '';
_pGlob.objMovementInfos = {};
_pGlob.objDragOverCallbacks = [];
_pGlob.objDragOverInfoByBlock = {}
_pGlob.dragMoveOrigins = {};
_pGlob.dragScaleOrigins = {};
_pGlob.mediaElements = {};
_pGlob.loadedFiles = {};
_pGlob.loadedFile = '';
_pGlob.animMixerCallbacks = [];
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var _pPhysics = {};

_pPhysics.syncList = [];

// internal info
_pPhysics.collisionData = [];

// goes to collision callback
_pPhysics.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

var PL = v3d.PL = v3d.PL || {};

PL.legacyMode = false;

PL.execInitPuzzles = function() {

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }
    // initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = false;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = true;
_initGlob.output.initOptions.useFullscreen = false;

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}
var color_panel_showing, process_panel_showing;


// autoRotateCamera puzzle
function autoRotateCamera(enabled, speed) {

    if (appInstance.controls && appInstance.controls instanceof v3d.OrbitControls) {
        appInstance.controls.autoRotate = enabled;
        appInstance.controls.autoRotateSpeed = speed;
    } else {
        console.error('autorotate camera: Wrong controls type');
    }
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != "DOCUMENT" && ids[0] != "BODY") {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == "DOCUMENT") {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == "BODY") {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}



// setTimeout puzzle
function registerTimeout(timeout, callback) {
    window.setTimeout(callback, 1000 * timeout);
}



// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = typeof _pGlob != "undefined";
    objFound = runTime ? _pGlob.objCache[objName] : null;
    if (objFound && objFound.name == objName)
        return objFound;
    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime)
                _pGlob.objCache[objName] = objFound;
        }
    });
    return objFound;
}

// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}

// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return (obj.type != "Scene" && obj.type != "AmbientLight" &&
            obj.name != "" && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}

// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}

function swizzleValueSign(newAxis, value) {
    newAxis = newAxis.toLowerCase();

    if (newAxis == 'z') {
        if (typeof value == 'number')
            return -value
        else if (typeof value == 'string' && value != '' && value != "''" && value != '""')
            return String(-Number(value));
        else
            return value;
    } else
        return value;
}

function swizzleVec3(vec, isScale) {

    var dest = []

    dest[0] = vec[0];
    dest[1] = vec[2];
    dest[2] = isScale ? vec[1] : swizzleValueSign('z', vec[1])

    return dest;
}


// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart) {

    var elem = appInstance.container;
    elem.addEventListener(eventType, pickListener);
    if (eventType == "mousedown") {
        var touchEventName = mouseDownUseTouchStart ? "touchstart" : "touchend";
        elem.addEventListener(touchEventName, pickListener);
    }

    var raycaster = new v3d.Raycaster();
    function pickListener(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        if (intersects.length > 0) {
            var obj = intersects[0].object;
            callback(obj, event);
        } else {
            callback(null, event);
        }
    }
}

// utility function used by the whenDraggedOver puzzles
function fireObjectPickingCallbacks(objName, source, index, cbParam) {
    for (var i = 0; i < source.length; i++) {
        var cb = source[i];
        if (objectsIncludeObj([cb[0]], objName)) {
            cb[index](cbParam);
        }
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenClicked puzzle
initObjectPicking(function(obj) {

    // save the object for the pickedObject block
    _pGlob.pickedObject = obj ? getPickedObjectName(obj) : '';

    _pGlob.objClickCallbacks.forEach(function(el) {
        var isPicked = obj && objectsIncludeObj(el.objNames, getPickedObjectName(obj));
        el.callbacks[isPicked ? 0 : 1]();
    });
}, 'mousedown');



// whenClicked puzzle
function registerOnClick(objNames, cbDo, cbIfMissedDo) {
    objNames = retrieveObjectNames(objNames) || [];
    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });
    _pGlob.objClickCallbacks.push({
        objNames: objNamesFiltered,
        callbacks: [cbDo, cbIfMissedDo]
    });
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback, false);
    }
}



function matGetColors(matName) {

    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat) return [];

    if (mat.isMeshNodeMaterial)
        return Object.keys(mat.nodeRGBMap);
    else if (mat.isMeshStandardMaterial)
        return ['color', 'emissive'];
    else
        return []
}


// setMaterialColor puzzle
function setMaterialColor(matName, colName, r, g, b) {
    var colors = matGetColors(matName);

    if (colors.indexOf(colName) < 0) return;

    var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.isMeshNodeMaterial) {
            var rgbIdx = mat.nodeRGBMap[colName];
            mat.nodeRGB[rgbIdx].x = r;
            mat.nodeRGB[rgbIdx].y = g;
            mat.nodeRGB[rgbIdx].z = b;
        } else {
            mat[colName].r = r;
            mat[colName].g = g;
            mat[colName].b = b;
        }
        mat.needsUpdate = true;

        if (mat === appInstance.worldMaterial)
            appInstance.updateEnvironment(mat);
    }
}



function matGetReplaceableTextures(matName) {

    var textures = [];

    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat) return [];

    switch (mat.type) {
    case 'MeshNodeMaterial':
        textures = Object.values(mat.nodeTextures);
        break;

    case 'MeshBlenderMaterial':
        textures = [
            mat.map, mat.lightMap, mat.aoMap, mat.emissiveMap,
            mat.bumpMap, mat.normalMap, mat.displacementMap,
            mat.specularMap, mat.alphaMap, mat.envMap
        ];
        break;

    case 'MeshStandardMaterial':
        textures = [
            mat.map, mat.lightMap, mat.aoMap, mat.emissiveMap,
            mat.bumpMap, mat.normalMap, mat.displacementMap,
            mat.roughnessMap, mat.metalnessMap, mat.alphaMap, mat.envMap
        ]
        break;

    case 'MeshPhongMaterial':
        textures = [
            mat.map, mat.lightMap, mat.aoMap, mat.emissiveMap,
            mat.bumpMap, mat.normalMap, mat.displacementMap,
            mat.specularMap, mat.alphaMap, mat.envMap
        ];
        break;
    }

    return textures.filter(function(elem) {
        // check "Texture" type exactly
        return elem && (elem.constructor == v3d.Texture || elem.constructor == v3d.DataTexture);
    });
}


// replaceTexture puzzle
function replaceTexture(matName, texName, url) {
    var textures = matGetReplaceableTextures(matName).filter(function(elem) {
        return elem.name == texName;
    });

    if (!textures.length) return;

    var isHDR = (url.search(/\.hdr$/) > 0);

    if (!isHDR) {
        var loader = new v3d.ImageLoader();
        loader.setCrossOrigin('Anonymous');
    } else {
        var loader = new v3d.FileLoader();
        loader.setResponseType('arraybuffer');
    }

    loader.load(url, function(image) {
        // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
        var isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:imag\/jpeg/) === 0;

        textures.forEach(function(elem) {

            if (!isHDR) {
                elem.image = image;
            } else {
                // parse loaded HDR buffer
                var rgbeLoader = new v3d.RGBELoader();
                var texData = rgbeLoader._parser(image);

                // NOTE: reset params since the texture may be converted to float
                elem.type = v3d.UnsignedByteType;
                elem.encoding = v3d.RGBEEncoding;

                elem.image = {
                    data: texData.data,
                    width: texData.width,
                    height: texData.height
                }

                elem.magFilter = v3d.LinearFilter;
                elem.minFilter = v3d.LinearFilter;
                elem.generateMipmaps = false;
                elem.isDataTexture = true;

            }

            elem.format = isJPEG ? v3d.RGBFormat : v3d.RGBAFormat;
            elem.needsUpdate = true;

            // update world material if it is using this texture
            var wMat = appInstance.worldMaterial;
            if (wMat)
                for (var texName in wMat.nodeTextures)
                    if (wMat.nodeTextures[texName] == elem)
                        appInstance.updateEnvironment(wMat);

        });

    });
}



function matGetValues(matName) {

    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat) return [];

    if (mat.isMeshNodeMaterial)
        return Object.keys(mat.nodeValueMap);
    else if (mat.isMeshStandardMaterial)
        return ['metalness', 'roughness', 'bumpScale', 'emissiveIntensity', 'envMapIntensity'];
    else
        return []
}


// setMaterialValue puzzle
function setMaterialValue(matName, valName, value) {
    var colors = matGetValues(matName);

    if (colors.indexOf(valName) < 0) return;

    var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.isMeshNodeMaterial) {
            var valIdx = mat.nodeValueMap[valName];
            mat.nodeValue[valIdx] = value;
        } else
            mat[valName] = value;

        if (mat === appInstance.worldMaterial)
            appInstance.updateEnvironment(mat);
    }
}



color_panel_showing = false;
process_panel_showing = false;
autoRotateCamera(true, 2);

setHTMLElemStyle('display', 'block', ['process_button', 'color_button'], true);

registerOnClick(["ALL_OBJECTS"], function() {
  autoRotateCamera(false, 2);
  registerTimeout(10, function() {
    autoRotateCamera(true, 2);
  });
}, function() {});

eventHTMLElem('click', 'color_button', true, function(event) {
  if (color_panel_showing == false) {
    setHTMLElemStyle('display', 'block', 'sub_panel_color', true);
    color_panel_showing = true;
  } else {
    setHTMLElemStyle('display', 'none', 'sub_panel_color', true);
    color_panel_showing = false;
  }
  if (process_panel_showing == true) {
    setHTMLElemStyle('display', 'none', 'sub_panel_process', true);
    process_panel_showing = false;
  }
});

eventHTMLElem('click', 'process_button', true, function(event) {
  if (process_panel_showing == false) {
    setHTMLElemStyle('display', 'block', 'sub_panel_process', true);
    process_panel_showing = true;
  } else {
    setHTMLElemStyle('display', 'none', 'sub_panel_process', true);
    process_panel_showing = false;
  }
  if (color_panel_showing == true) {
    setHTMLElemStyle('display', 'none', 'sub_panel_color', true);
    color_panel_showing = false;
  }
});

eventHTMLElem('click', 'silver_button', true, function(event) {
  setMaterialColor("Material", "RGB", 0.492, 0.492, 0.492);
  setHTMLElemStyle('display', 'none', 'sub_panel_color', true);
  color_panel_showing = false;
});

eventHTMLElem('click', 'black_button', true, function(event) {
  setMaterialColor("Material", "RGB", 0.01, 0.01, 0.01);
  setHTMLElemStyle('display', 'none', 'sub_panel_color', true);
  color_panel_showing = false;
});

eventHTMLElem('click', 'golden_button', true, function(event) {
  setMaterialColor("Material", "RGB", 0.753, 0.472, 0.104);
  setHTMLElemStyle('display', 'none', 'sub_panel_color', true);
  color_panel_showing = false;
});

eventHTMLElem('click', 'champagne_button', true, function(event) {
  setMaterialColor("Material", "RGB", 0.307, 0.252, 0.144);
  setHTMLElemStyle('display', 'none', 'sub_panel_color', true);
  color_panel_showing = false;
});

eventHTMLElem('click', 'rosegolden_button', true, function(event) {
  setMaterialColor("Material", "RGB", 0.686, 0.361, 0.345);
  setHTMLElemStyle('display', 'none', 'sub_panel_color', true);
  color_panel_showing = false;
});

eventHTMLElem('click', 'drawmill_button', true, function(event) {
  replaceTexture("Material", "clean.jpg", 'lasi.jpg');
  setMaterialValue("Material", "Value", 0.3);
  setHTMLElemStyle('display', 'none', 'sub_panel_process', true);
  process_panel_showing = false;
});

eventHTMLElem('click', 'cataphoresis_button', true, function(event) {
  replaceTexture("Material", "clean.jpg", 'dianyong.jpg');
  setMaterialValue("Material", "Value", 0.2);
  setHTMLElemStyle('display', 'none', 'sub_panel_process', true);
  process_panel_showing = false;
});

eventHTMLElem('click', 'sandblast_button', true, function(event) {
  replaceTexture("Material", "clean.jpg", 'pengsha.jpg');
  setMaterialValue("Material", "Value", 0.5);
  setHTMLElemStyle('display', 'none', 'sub_panel_process', true);
  process_panel_showing = false;
});

eventHTMLElem('click', 'polish_button', true, function(event) {
  replaceTexture("Material", "clean.jpg", 'clean.jpg');
  setMaterialValue("Material", "Value", 0.1);
  setHTMLElemStyle('display', 'none', 'sub_panel_process', true);
  process_panel_showing = false;
});

} // end of PL.init function

if (window.v3dApp) {
    // backwards compatibility for old player projects
    PL.legacyMode = true;
    PL.init(window.v3dApp);
}

})(); // end of closure

/* ================================ end of code ============================= */
