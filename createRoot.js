
function createRoot(canvas) {
  // Check against mistaken use of createRoot
  let prevRoot = roots.get(canvas);
  let prevFiber = prevRoot == null ? void 0 : prevRoot.fiber;
  let prevStore = prevRoot == null ? void 0 : prevRoot.store;
  if (prevRoot) console.warn('R3F.createRoot should only be called once!'); // Report when an error was detected in a previous render
  // https://github.com/pmndrs/react-three-fiber/pull/2261

  const logRecoverableError = typeof reportError === 'function' ? // In modern browsers, reportError will dispatch an error event,
  // emulating an uncaught JavaScript error.
  reportError : // In older browsers and test environments, fallback to console.error.
  console.error; // Create store

  const store = prevStore || createStore(invalidate, advance); // Create renderer

  const fiber = prevFiber || reconciler.createContainer(store, ConcurrentRoot, null, false, null, '', logRecoverableError, null); // Map it

  if (!prevRoot) roots.set(canvas, {
    fiber,
    store
  }); // Locals

  let onCreated;
  let configured = false;
  return {
    configure(props = {}) {
      let {
        gl: glConfig,
        size,
        events,
        onCreated: onCreatedCallback,
        shadows = false,
        linear = false,
        flat = false,
        legacy = false,
        orthographic = false,w
        frameloop = 'always',
        dpr = [1, 2],
        performance,
        raycaster: raycastOptions,
        camera: cameraOptions,
        onPointerMissed
      } = props;
      let state = store.getState(); // Set up renderer (one time only!)

      let gl = state.gl;
      if (!state.gl) state.set({
        gl: gl = createRendererInstance(glConfig, canvas) // calls WebGLRenderer with canvas powerPreference: 'high-performance',
    // canvas: canvas,
    // antialias: true,
    // alpha: true,
    // ...gl
      }); // Set up raycaster (one time only!)

      let raycaster = state.raycaster;
      if (!raycaster) state.set({
        raycaster: raycaster = new THREE.Raycaster()
      }); // Set raycaster options

      const {
        params,
        ...options
      } = raycastOptions || {};
      if (!is.equ(options, raycaster, shallowLoose)) applyProps(raycaster, { ...options
      });
      if (!is.equ(params, raycaster.params, shallowLoose)) applyProps(raycaster, {
        params: { ...raycaster.params,
          ...params
        }
      }); // Create default camera (one time only!)

      if (!state.camera) {
        const isCamera = cameraOptions instanceof THREE.Camera;
        const camera = isCamera ? cameraOptions : orthographic ? new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000) : new THREE.PerspectiveCamera(75, 0, 0.1, 1000);

        if (!isCamera) {
          camera.position.z = 5;
          if (cameraOptions) applyProps(camera, cameraOptions); // Always look at center by default

          if (!(cameraOptions != null && cameraOptions.rotation)) camera.lookAt(0, 0, 0);
        }

        state.set({
          camera
        });
      } // Set up XR (one time only!)


      if (!state.xr) {
        // Handle frame behavior in WebXR
        const handleXRFrame = (timestamp, frame) => {
          const state = store.getState();
          if (state.frameloop === 'never') return;
          advance(timestamp, true, state, frame);
        }; // Toggle render switching on session


        const handleSessionChange = () => {
          const state = store.getState();
          state.gl.xr.enabled = state.gl.xr.isPresenting;
          state.gl.xr.setAnimationLoop(state.gl.xr.isPresenting ? handleXRFrame : null);
          if (!state.gl.xr.isPresenting) invalidate(state);
        }; // WebXR session manager


        const xr = {
          connect() {
            const gl = store.getState().gl;
            gl.xr.addEventListener('sessionstart', handleSessionChange);
            gl.xr.addEventListener('sessionend', handleSessionChange);
          },

          disconnect() {
            const gl = store.getState().gl;
            gl.xr.removeEventListener('sessionstart', handleSessionChange);
            gl.xr.removeEventListener('sessionend', handleSessionChange);
          }

        }; // Subscribe to WebXR session events

        if (gl.xr) xr.connect();
        state.set({
          xr
        });
      } // Set shadowmap


      if (gl.shadowMap) {
        const isBoolean = is.boo(shadows);

        if (isBoolean && gl.shadowMap.enabled !== shadows || !is.equ(shadows, gl.shadowMap, shallowLoose)) {
          const old = gl.shadowMap.enabled;
          gl.shadowMap.enabled = !!shadows;
          if (!isBoolean) Object.assign(gl.shadowMap, shadows);else gl.shadowMap.type = THREE.PCFSoftShadowMap;
          if (old !== gl.shadowMap.enabled) gl.shadowMap.needsUpdate = true;
        }
      } // Safely set color management if available.
      // Avoid accessing THREE.ColorManagement to play nice with older versions


      if ('ColorManagement' in THREE) {
        setDeep(THREE, legacy, ['ColorManagement', 'legacyMode']);
      }

      const outputEncoding = linear ? THREE.LinearEncoding : THREE.sRGBEncoding;
      const toneMapping = flat ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
      if (gl.outputEncoding !== outputEncoding) gl.outputEncoding = outputEncoding;
      if (gl.toneMapping !== toneMapping) gl.toneMapping = toneMapping; // Update color management state

      if (state.legacy !== legacy) state.set(() => ({
        legacy
      }));
      if (state.linear !== linear) state.set(() => ({
        linear
      }));
      if (state.flat !== flat) state.set(() => ({
        flat
      })); // Set gl props

      if (glConfig && !is.fun(glConfig) && !isRenderer(glConfig) && !is.equ(glConfig, gl, shallowLoose)) applyProps(gl, glConfig); // Store events internally

      if (events && !state.events.handlers) state.set({
        events: events(store)
      }); // Check pixelratio

      if (dpr && state.viewport.dpr !== calculateDpr(dpr)) state.setDpr(dpr); // Check size, allow it to take on container bounds initially

      size = size || (canvas.parentElement ? {
        width: canvas.parentElement.clientWidth,
        height: canvas.parentElement.clientHeight,
        top: canvas.parentElement.clientTop,
        left: canvas.parentElement.clientLeft
      } : {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      });

      if (!is.equ(size, state.size, shallowLoose)) {
        state.setSize(size.width, size.height, size.updateStyle, size.top, size.left);
      } // Check frameloop


      if (state.frameloop !== frameloop) state.setFrameloop(frameloop); // Check pointer missed

      if (!state.onPointerMissed) state.set({
        onPointerMissed
      }); // Check performance

      if (performance && !is.equ(performance, state.performance, shallowLoose)) state.set(state => ({
        performance: { ...state.performance,
          ...performance
        }
      })); // Set locals

      onCreated = onCreatedCallback;
      configured = true;
      return this;
    },

    render(children) {
      // The root has to be configured before it can be rendered
      if (!configured) this.configure();
      reconciler.updateContainer( /*#__PURE__*/React.createElement(Provider, {
        store: store,
        children: children,
        onCreated: onCreated,
        rootElement: canvas
      }), fiber, null, () => undefined);
      return store;
    },

    unmount() {
      unmountComponentAtNode(canvas);
    }

  };
}

function render(children, canvas, config) {
  console.warn('R3F.render is no longer supported in React 18. Use createRoot instead!');
  const root = createRoot(canvas);
  root.configure(config);
  return root.render(children);
}