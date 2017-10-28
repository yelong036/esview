import {findNode} from '../helper/soul_helper'
import {findElUpward} from '../helper/dom_helper'
import {isPlain}from '../util/assist'
import {deepCopy, getQueryParam} from '../util/assist'

export default {
  namespaced: true,
  state: {
    originSoul: null,//flatten soul of frame with dropPanel
    soul: null,//the view data of current routerPath
    pageSoul: {},//view data of all routerPaths
    editSoul: {},//editable part of soul which you can edit on the right side of drop area
    dragElement: null,//current dragging element
    draggableControls: null,//draggableControls are the draggable items on the left side of dropPanel
    currentRouterPath: '',//current path of window's path, not hash
    editLayer: {},//the cover appears when hover the dropped element
    rightClickMenu: {}//right click menu when right click the dropped element
  },
  getters: {
    soul: ({soul}) => soul,
    pageSoul: ({pageSoul}) => pageSoul,
    editSoul: ({editSoul}) => editSoul,
    dragElement: ({dragElement}) => dragElement,
    draggableControls: ({draggableControls}) => draggableControls,
    currentRouterPath: ({currentRouterPath}) => currentRouterPath,
    editLayer: ({editLayer}) => editLayer,
    rightClickMenu: ({rightClickMenu}) => rightClickMenu
  },
  mutations: {
    setOriginSoul(state, soul){
      //frame with dropPanel
      state.originSoul = deepCopy(soul)
    },
    setSoul: (state, soul) => {
      //soul which is showed
      state.soul = soul
      state.pageSoul[state.currentRouterPath] = soul
    },
    setPageSoul(state, {pageSoul}){
      for (let key in pageSoul) {
        state.soul = pageSoul[key]
        break
      }
      state.pageSoul = pageSoul
    },
    setDraggableControls(state, draggableControls){
      state.draggableControls = draggableControls
    },
    setDragElement(state, element){
      state.dragElement = element
    },
    clear(state,type){
      if(type==='layer'){
        state.editLayer = {
          style: {
            display: 'none'
          }
        }
      }else {
        state.editSoul = {}
        state.rightClickMenu = {}
      }
    },
    setEditLayer(state, bind){
      let rect = bind.el.getBoundingClientRect();
      state.editLayer = {
        style: {
          left: rect.left + 'px',
          top: rect.top + 'px',
          width: rect.width + 'px',
          height: rect.height + 'px',
          display: 'block'
        },
        name: bind.binding.value
      }
    },
    setRightClickMenu(state, el){
      let e = e || window.event;
      //x,y of mouse
      let oX = e.clientX;
      let oY = e.clientY - 20;
      //x,y of menu appears
      state.rightClickMenu = {
        style: {
          display: "block",
          left: oX + "px",
          top: oY + "px"
        },
        uid: el.controlConfig.uid
      }
    },
    changeSoul(state){

      let path = decodeURIComponent(getQueryParam('pageId'))
      if (!path) return
      state.currentRouterPath = path

      if (!state.pageSoul[path]) {

        if (!state.originSoul) return

        const soulCopy = deepCopy(state.originSoul)
        state.pageSoul[path] = soulCopy
        state.soul = soulCopy
      }else {
        state.soul = state.pageSoul[path]
      }
    }
  },
  actions: {}
}
