//===========================================================================================
// Network Options
//----------------------
var options = {
  autoResize: true,
  height: '100%',
  width: '100%',
  locale: 'en',
//  locales: locales,
  clickToUse: false,

// ---- CONFIGURE ----

  configure: {
    enabled: false,
  },

// ---- EDGES ----

  edges:{
    arrows: {
      to:     {enabled: true, scaleFactor:1},
      middle: {enabled: false, scaleFactor:1},
      from:   {enabled: false, scaleFactor:1}
    },
    color: '#444444',
    shadow: true,
    smooth: true,
  },

// ---- NODES ----

   nodes:{
    shape: 'dot',
    color: {
      background: '#EEEEEE',
      border: 'black',
      highlight: 'white'
    },
    borderWidth: 2,
    shadow: true
  },

// ---- GROUPS ----

  groups:{
    useDefaultGroups: false,
    BMC_COMPUTERSYSTEM: {
        shape: 'image',
        image: '/images/graph_images/BMC_COMPUTERSYSTEM.png',
        size: 30,
        color: {
          background: '#CCDDEE',
          border: "#000000"
        },
        borderWidth:3
    },
    BMC_PROCESSOR: {
        shape: 'square',
        color: '#0AA00A',
        size: 10
    },
    BMC_PRODUCT: {
        size: 16,
        color: '#00CC00'
    },
    BMC_OPERATINGSYSTEM: {
        color: '#0000CC'
    },
    BMC_SOFTWARESERVER: {
        color: '#389BB8',
        size: 12
    },
    BMC_IPENDPOINT: {
        color: '#D4A9FF',  
        shape: 'square',    
        size: 10
    },
    BMC_NETWORKPORT: {
        color: '#997A5C',
        shape: 'square', 
        size: 10
    },
    BMC_LANENDPOINT: {
        color: '#FF6666',
        shape: 'square', 
        size: 10
    },
    BMC_APPLICATION: {
        color: '#CCCC00',
        size: 30
    },
    BMC_IPCONNECTIVITYSUBNET: {
        size: 10,
        shape: 'star',
        color: '#CCCCFF'
    },
    'BMC.CORE:BMC_CONCRETECOLLECTION': {
        color: '#FF9900',
        size: 10
    },
    BMC_APPLICATIONSERVICE: {
        shape: 'dot',
        color: '#FFFF90',
        size: 25
    },
    BMC_DATABASE: {
        color:"#CC0000",
        size: 15,
        shape: 'image',
        image: '/images/graph_images/BMC_DATABASE.png'
    },
    BMC_MAINFRAME: {
        shape: 'diamond',
        color: '#CC00CC'
    }, 
    BMC_VIRTUALSYSTEMENABLER: {
        shape: 'square',
        color: '#CCCC00'
    },   
  },

// ---- LAYOUT ----

  layout:{
    hierarchical: false,
    improvedLayout: false
  },

// ---- INTERACTION ----

  interaction:{
    dragNodes:true,
    dragView: true,
    hideEdgesOnDrag: false,
    hideNodesOnDrag: false,
    hover: false,
    hoverConnectedEdges: true,
    keyboard: {
      enabled: false,
      speed: {x: 10, y: 10, zoom: 0.02},
      bindToWindow: true
    },
    multiselect: false,
    navigationButtons: false,
    selectable: true,
    selectConnectedEdges: true,
    tooltipDelay: 300,
    zoomView: true
  },

// ---- MANIPULATION ----

  manipulation: false,

// ---- PHYSICS ----

  physics:{
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true
    },
    timestep: 0.5,
    adaptiveTimestep: true
  }
};
