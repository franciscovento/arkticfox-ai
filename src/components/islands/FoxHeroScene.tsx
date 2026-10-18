import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { useProgress } from '@react-three/drei/core/Progress.js';
import { useAnimations } from '@react-three/drei/core/useAnimations.js';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  ACESFilmicToneMapping,
  BackSide,
  Box3,
  BufferAttribute,
  BufferGeometry,
  Group,
  InstancedMesh,
  LoopRepeat,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  Quaternion,
  ShaderMaterial,
  Texture,
  Vector3,
  type AnimationAction,
  type DirectionalLight,
  type Material,
} from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { prefersReducedMotion } from '@/motion/reduced';
import { dur } from '@/motion/tokens';
import { readFoxPalette, type FoxPalette } from './fox/palette';
import { backdropTime } from './fox/backdrop';
import { applyFoxPlateDom, readFoxPlate, type FoxPlate } from './fox/plate';
import {
  FOX_SCALE,
  FOX_URL,
  IDLE_AFTER_MS,
  PATH_FORWARD,
  PATH_LENGTH,
  STRIDE,
  TRAVEL_BANK_MAX,
  TRAVEL_MPS,
  frameFor,
  pointOnPath,
} from './fox/path';
import {
  createHillGeometry,
  createPineGeometry,
  createToonMaterial,
  createToonRamp,
  farSlots,
  hillSlots,
  pineSlots,
  placeSlots,
  stoneSlots,
  type ScenerySlot,
} from './fox/scenery';

useGLTF.preload(FOX_URL, false, false);

const CLIP_WALK = 'Walk';
const CLIP_SIT = 'Sit';
const FADE = dur.reveal * 0.5;
const SNOW_COUNT = 200;
const TURN_TAU = dur.reveal * 0.55;
const UP = new Vector3(0, 1, 0);
const _aim = new Vector3();
const _cam = new Vector3();
const _look = new Vector3();
const _nose = new Vector3();
const _want = new Vector3();
const _desired = new Quaternion();
const _headInv = new Quaternion();
const _headDelta = new Quaternion();
const _pivot = new Object3D();

type ClipName = typeof CLIP_WALK | typeof CLIP_SIT;
type Facing = 'forward' | 'back' | 'camera';

type Ride = {
  progress: number;
  moving: boolean;
  reduced: boolean;
  /** +1 scroll down (advance), -1 scroll up (retreat). */
  direction: 1 | -1;
  /** Signed meters along the path. Scroll down grows it; scroll up shrinks it. */
  along: number;
  /** Unsigned meters. The walk cycle plays forward while the body faces travel. */
  steps: number;
  point: Vector3;
};

type RideRef = RefObject<Ride>;

function useReducedFlag(): boolean {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return reduced;
}

function publish(
  state: string,
  progress: number,
  facing: Facing,
  align: number,
  nose: string,
  life: string,
  head: string,
) {
  const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
  if (!stage) return;
  if (stage.dataset.foxState !== state) stage.dataset.foxState = state;
  const next = progress.toFixed(3);
  if (stage.dataset.foxProgress !== next) stage.dataset.foxProgress = next;
  if (stage.dataset.foxFacing !== facing) stage.dataset.foxFacing = facing;
  const alignText = align.toFixed(2);
  if (stage.dataset.foxAlign !== alignText) stage.dataset.foxAlign = alignText;
  if (stage.dataset.foxNose !== nose) stage.dataset.foxNose = nose;
  if (stage.dataset.foxLife !== life) stage.dataset.foxLife = life;
  if (stage.dataset.foxHead !== head) stage.dataset.foxHead = head;
  if (stage.dataset.foxOffset !== 'off') stage.dataset.foxOffset = 'off';
}

function hideLoader() {
  document.querySelector('[data-fox-loader]')?.classList.add('is-done');
}

function useRide(reduced: boolean): RideRef {
  const ride = useRef<Ride>({
    progress: reduced ? 0.12 : 0,
    moving: false,
    reduced,
    direction: 1,
    along: reduced ? 0.12 * PATH_LENGTH : 0,
    steps: 0,
    point: pointOnPath(reduced ? 0.12 : 0, new Vector3()),
  });

  useEffect(() => {
    ride.current.reduced = reduced;
  }, [reduced]);

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
    let frame = 0;
    let scrollPos = ride.current.progress;
    let primed = false;
    let lastScrollAt = 0;
    let lastTick = performance.now();
    let bank = 0;

    const tick = (now: number) => {
      const rideNow = ride.current;
      const dt = Math.min(0.1, Math.max(0, (now - lastTick) / 1000));
      lastTick = now;
      if (!stage || rideNow.reduced) {
        rideNow.progress = 0.12;
        rideNow.along = 0.12 * PATH_LENGTH;
        rideNow.moving = false;
        bank = 0;
      } else {
        const total = stage.offsetHeight - window.innerHeight;
        const top = stage.getBoundingClientRect().top + window.scrollY;
        const scrolled = window.scrollY - top;
        const next =
          total <= 0 ? 0 : Math.min(1, Math.max(0, scrolled / total));
        if (!primed) {
          primed = true;
          scrollPos = next;
          rideNow.moving = false;
        } else if (Math.abs(next - scrollPos) > 0.00012) {
          const dir: 1 | -1 = next > scrollPos ? 1 : -1;
          if (dir !== rideNow.direction) bank = 0;
          rideNow.direction = dir;
          bank = Math.min(
            TRAVEL_BANK_MAX,
            bank + Math.abs(next - scrollPos) * PATH_LENGTH,
          );
          scrollPos = next;
          lastScrollAt = now;
        }
        const recent = now - lastScrollAt < IDLE_AFTER_MS;
        const cruising = recent || bank > 0.0005;
        if (cruising) {
          const step = TRAVEL_MPS * dt;
          rideNow.along += rideNow.direction * step;
          rideNow.steps += step;
          bank = Math.max(0, bank - step);
          rideNow.moving = true;
        } else {
          bank = 0;
          rideNow.moving = false;
        }
        rideNow.progress = rideNow.along / PATH_LENGTH;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return ride;
}

function facingFor(ride: Ride): Facing {
  if (ride.reduced || !ride.moving) return 'camera';
  return ride.direction > 0 ? 'forward' : 'back';
}

/** Body aim only. The head stays on the clip. lookAt points local +Z at the target. */
function aimBody(facing: Facing, progress: number, point: Vector3, narrow: boolean) {
  if (facing === 'forward') _aim.copy(point).add(PATH_FORWARD);
  else if (facing === 'back') _aim.copy(point).sub(PATH_FORWARD);
  else {
    frameFor(progress, narrow, _cam, _look);
    _aim.set(_cam.x, point.y, _cam.z);
  }
  _pivot.position.copy(point);
  _pivot.up.copy(UP);
  _pivot.lookAt(_aim);
  _desired.copy(_pivot.quaternion);
}

function capTextures(root: Object3D, max: number) {
  const seen = new Set<Texture>();
  root.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.material) return;
    const materials = (
      Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    ) as Material[];
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (!(value instanceof Texture) || seen.has(value) || !value.image)
          continue;
        const image = value.image as CanvasImageSource & {
          width?: number;
          height?: number;
        };
        if (
          !image.width ||
          !image.height ||
          (image.width <= max && image.height <= max)
        )
          continue;
        seen.add(value);
        const canvas = document.createElement('canvas');
        canvas.width = max;
        canvas.height = max;
        canvas.getContext('2d')?.drawImage(image, 0, 0, max, max);
        value.image = canvas;
        value.needsUpdate = true;
      }
    }
  });
}

function fadeTo(
  actions: Record<string, AnimationAction | null>,
  from: ClipName,
  to: ClipName,
) {
  const next = actions[to];
  const prev = actions[from];
  if (!next || next === prev) return;
  next.enabled = true;
  next.setLoop(LoopRepeat, Infinity);
  next.reset().fadeIn(FADE).play();
  next.paused = true;
  prev?.fadeOut(FADE);
}

function Sky({ palette }: { palette: FoxPalette }) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        fog: false,
        toneMapped: false,
        depthWrite: false,
        uniforms: {
          highColor: { value: palette.skyHigh },
          midColor: { value: palette.skyMid },
          lowColor: { value: palette.skyLow },
          glowColor: { value: palette.horizon },
        },
        vertexShader: `
          varying float vHeight;
          void main() {
            vHeight = normalize(position).y * 0.5 + 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying float vHeight;
          uniform vec3 highColor;
          uniform vec3 midColor;
          uniform vec3 lowColor;
          uniform vec3 glowColor;
          void main() {
            float h = clamp(vHeight, 0.0, 1.0);
            vec3 color = mix(lowColor, midColor, smoothstep(0.02, 0.48, h));
            color = mix(color, highColor, smoothstep(0.22, 0.92, h));
            float blush = smoothstep(0.0, 0.7, 1.0 - h);
            color = mix(color, glowColor, blush * 0.28);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }),
    [palette],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh
      renderOrder={-1}
      position={[0, 0, -10]}
      frustumCulled={false}
      material={material}
    >
      <sphereGeometry args={[64, 20, 12]} />
    </mesh>
  );
}

function LoopField({ palette }: { palette: FoxPalette }) {
  const camera = useThree((state) => state.camera);
  const pines = useMemo(() => pineSlots(), []);
  const far = useMemo(() => farSlots(), []);
  const hills = useMemo(() => hillSlots(), []);
  const stones = useMemo(() => stoneSlots(), []);
  const ramp = useMemo(
    () => createToonRamp(palette.snowShade, palette.white),
    [palette.snowShade, palette.white],
  );
  const pineGeo = useMemo(
    () => createPineGeometry(palette.foliage, palette.cap, palette.trunk),
    [palette.foliage, palette.cap, palette.trunk],
  );
  const hillGeo = useMemo(() => createHillGeometry(), []);
  const pineMat = useMemo(
    () => createToonMaterial(ramp, palette.white, true),
    [ramp, palette.white],
  );
  const hillMat = useMemo(
    () => createToonMaterial(ramp, palette.snow, false),
    [ramp, palette.snow],
  );
  const farMat = useMemo(
    () => createToonMaterial(ramp, palette.mist, false),
    [ramp, palette.mist],
  );
  const stoneMat = useMemo(
    () => createToonMaterial(ramp, palette.snowShade, false),
    [ramp, palette.snowShade],
  );
  const pathMat = useMemo(() => {
    const material = createToonMaterial(ramp, palette.trail, false);
    material.polygonOffset = true;
    material.polygonOffsetFactor = -1;
    return material;
  }, [ramp, palette.trail]);
  const groundMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: palette.snow,
        roughness: 1,
        metalness: 0,
      }),
    [palette.snow],
  );
  const pineRef = useRef<InstancedMesh>(null);
  const farRef = useRef<InstancedMesh>(null);
  const hillRef = useRef<InstancedMesh>(null);
  const stoneRef = useRef<InstancedMesh>(null);
  const groundRef = useRef<Mesh>(null);
  const pathRef = useRef<Mesh>(null);

  useEffect(
    () => () => {
      ramp.dispose();
      pineGeo.dispose();
      hillGeo.dispose();
      pineMat.dispose();
      hillMat.dispose();
      farMat.dispose();
      stoneMat.dispose();
      pathMat.dispose();
      groundMat.dispose();
    },
    [ramp, pineGeo, hillGeo, pineMat, hillMat, farMat, stoneMat, pathMat, groundMat],
  );

  const place = useCallback(() => {
    const z = camera.position.z;
    if (pineRef.current) placeSlots(pineRef.current, pines, z, () => 0);
    if (farRef.current) placeSlots(farRef.current, far, z, () => 0);
    if (hillRef.current) {
      placeSlots(
        hillRef.current,
        hills,
        z,
        (slot: ScenerySlot) => -slot.scale * 0.58,
      );
    }
    if (stoneRef.current) {
      placeSlots(
        stoneRef.current,
        stones,
        z,
        (slot: ScenerySlot) => -slot.scale * 0.35,
      );
    }
    if (groundRef.current) {
      groundRef.current.position.x = camera.position.x;
      groundRef.current.position.z = z;
    }
    if (pathRef.current) pathRef.current.position.z = z;
  }, [camera, far, hills, pines, stones]);

  useLayoutEffect(() => {
    place();
  }, [place]);

  useFrame(() => {
    place();
  });

  return (
    <group>
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        material={groundMat}
      >
        <planeGeometry args={[120, 120]} />
      </mesh>
      <mesh
        ref={pathRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.62, 0.02, 0]}
        material={pathMat}
      >
        <planeGeometry args={[1.55, 72]} />
      </mesh>
      <instancedMesh
        ref={pineRef}
        args={[pineGeo, pineMat, pines.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={farRef}
        args={[pineGeo, farMat, far.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={hillRef}
        args={[hillGeo, hillMat, hills.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={stoneRef}
        args={[hillGeo, stoneMat, stones.length]}
        frustumCulled={false}
      />
    </group>
  );
}

function Snow({ palette }: { palette: FoxPalette }) {
  const ref = useRef<Points>(null);
  const camera = useThree((state) => state.camera);
  const geometry = useMemo(() => {
    const values = new Float32Array(SNOW_COUNT * 3);
    for (let i = 0; i < SNOW_COUNT; i++) {
      values[i * 3] = (Math.random() - 0.5) * 14;
      values[i * 3 + 1] = Math.random() * 8;
      values[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(values, 3));
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points || document.hidden) return;
    const dt = Math.min(delta, 0.05);
    const attr = points.geometry.attributes.position;
    const values = attr.array as Float32Array;
    for (let i = 0; i < SNOW_COUNT; i++) {
      let y = values[i * 3 + 1] - dt * (0.32 + (i % 7) * 0.06);
      if (y < -0.4) y = 7.2;
      values[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
    points.position.x = camera.position.x;
    points.position.z = camera.position.z;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={palette.white}
        size={0.04}
        transparent
        opacity={0.72}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Fox({
  ride,
  reduced,
  palette,
}: {
  ride: RideRef;
  reduced: boolean;
  palette: FoxPalette;
}) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const gltf = useGLTF(FOX_URL, false, false);
  const model = useMemo(() => {
    const cloned = cloneSkeleton(gltf.scene);
    capTextures(cloned, 2048);
    const box = new Box3().setFromObject(cloned);
    const center = box.getCenter(new Vector3());
    cloned.position.set(-center.x, -box.min.y, -center.z);
    cloned.traverse((node) => {
      node.frustumCulled = false;
    });
    return cloned;
  }, [gltf.scene]);
  const { actions, mixer } = useAnimations(gltf.animations, group);
  const active = useRef<ClipName>(CLIP_SIT);
  const turned = useRef(false);
  const head = useMemo(() => model.getObjectByName('Head') ?? null, [model]);
  const headRest = useRef(new Quaternion());
  const narrow = useThree((state) => state.size.width < 768);
  const blob = useMemo(
    () =>
      new MeshStandardMaterial({
        color: palette.ink,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        roughness: 1,
        metalness: 0,
      }),
    [palette.ink],
  );

  useEffect(() => () => blob.dispose(), [blob]);

  useLayoutEffect(() => {
    model.traverse((node) => {
      const mesh = node as Mesh;
      if (!mesh.isMesh) return;
      const list = (
        Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      ) as MeshStandardMaterial[];
      for (const material of list) {
        if (!material.emissive) continue;
        material.emissive.copy(palette.white);
        material.emissiveIntensity = 0.07;
      }
    });
  }, [model, palette.white]);

  useLayoutEffect(() => {
    const rig = group.current;
    const sit = actions[CLIP_SIT];
    const walk = actions[CLIP_WALK];
    if (!rig || !sit || !walk) {
      publish('error', 0, 'camera', 0, '0,0', 'off', '0.00');
      hideLoader();
      return;
    }
    sit.reset().fadeIn(0).play();
    sit.setLoop(LoopRepeat, Infinity);
    sit.paused = reduced;
    mixer.update(0);
    if (head) headRest.current.copy(head.quaternion);
    pointOnPath(ride.current.progress, ride.current.point);
    rig.position.copy(ride.current.point);
    aimBody('camera', ride.current.progress, ride.current.point, narrow);
    rig.quaternion.copy(_desired);
    turned.current = true;
    _nose.set(0, 0, 1).applyQuaternion(rig.quaternion);
    publish(
      reduced ? 'reduced' : 'sit',
      ride.current.progress,
      'camera',
      1,
      `${_nose.x.toFixed(3)},${_nose.z.toFixed(3)}`,
      reduced ? 'off' : 'clip',
      '0.00',
    );
    hideLoader();
    invalidate();
  }, [actions, head, invalidate, mixer, narrow, reduced, ride]);

  // Priority 1 runs after the mixer (priority 0). This callback only reads the head.
  useFrame((_, delta) => {
    const rig = group.current;
    if (!rig) return;
    const rideNow = ride.current;
    if (!actions[CLIP_SIT] || !actions[CLIP_WALK]) return;
    const clip: ClipName =
      !rideNow.reduced && rideNow.moving ? CLIP_WALK : CLIP_SIT;
    if (active.current !== clip) {
      fadeTo(actions, active.current, clip);
      active.current = clip;
    }
    let life = 'off';
    if (clip === CLIP_WALK) {
      const walk = actions[CLIP_WALK];
      if (walk) {
        const duration = walk.getClip().duration || 1;
        walk.paused = true;
        const cycle = (rideNow.steps / STRIDE) % duration;
        walk.time = cycle < 0 ? cycle + duration : cycle;
      }
    } else {
      const sit = actions[CLIP_SIT];
      if (sit) {
        sit.paused = rideNow.reduced;
        if (rideNow.reduced) sit.time = 0;
      }
      if (!rideNow.reduced) life = 'clip';
    }
    let headText = '0.00';
    if (head) {
      _headInv.copy(headRest.current).invert();
      _headDelta.copy(_headInv).multiply(head.quaternion);
      const w = Math.min(1, Math.abs(_headDelta.w));
      headText = ((2 * Math.acos(w) * 180) / Math.PI).toFixed(2);
    }
    pointOnPath(rideNow.progress, rideNow.point);
    rig.position.copy(rideNow.point);
    const facing = facingFor(rideNow);
    aimBody(facing, rideNow.progress, rideNow.point, narrow);
    const dt = Math.min(Math.max(delta, 0), 0.25);
    if (rideNow.reduced || !turned.current) rig.quaternion.copy(_desired);
    else {
      rig.quaternion.slerp(_desired, 1 - Math.exp(-dt / TURN_TAU));
      if (rig.quaternion.angleTo(_desired) < 0.04) rig.quaternion.copy(_desired);
    }
    turned.current = true;
    _nose.set(0, 0, 1).applyQuaternion(rig.quaternion);
    _want.set(0, 0, 1).applyQuaternion(_desired);
    publish(
      rideNow.reduced ? 'reduced' : rideNow.moving ? 'walk' : 'sit',
      rideNow.progress,
      facing,
      _nose.dot(_want),
      `${_nose.x.toFixed(3)},${_nose.z.toFixed(3)}`,
      life,
      headText,
    );
  }, 1);

  return (
    <group ref={group} scale={FOX_SCALE}>
      <primitive object={model} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        material={blob}
      >
        <circleGeometry args={[0.42, 24]} />
      </mesh>
    </group>
  );
}

function CameraRig({
  ride,
  reduced,
  palette,
}: {
  ride: RideRef;
  reduced: boolean;
  palette: FoxPalette;
}) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);
  const scene = useThree((state) => state.scene);
  const look = useRef(new Vector3());
  const primed = useRef(false);
  const key = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);

  useLayoutEffect(() => {
    if (key.current) scene.add(key.current.target);
    if (rim.current) scene.add(rim.current.target);
    if (fill.current) scene.add(fill.current.target);
  }, [scene]);

  const aim = (snap: boolean, delta: number) => {
    const { point } = ride.current;
    const narrow = size.width < 768;
    frameFor(ride.current.progress, narrow, _cam, _look);
    const blend =
      snap || reduced || !primed.current
        ? 1
        : 1 - Math.exp(-delta / (dur.hover * 0.72));
    camera.position.lerp(_cam, blend);
    look.current.lerp(_look, blend);
    primed.current = true;
    const fov = narrow ? 44 : 30;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(look.current);

    const keyLight = key.current;
    const rimLight = rim.current;
    if (keyLight) {
      keyLight.position.copy(camera.position).addScaledVector(UP, 1.4);
      keyLight.target.position.copy(point);
      keyLight.target.updateMatrixWorld();
    }
    if (rimLight) {
      rimLight.position
        .copy(point)
        .addScaledVector(PATH_FORWARD, -1.3)
        .addScaledVector(UP, 0.75);
      rimLight.target.position.copy(point).addScaledVector(UP, 0.4);
      rimLight.target.updateMatrixWorld();
    }
    const fillLight = fill.current;
    if (fillLight) {
      fillLight.position.copy(camera.position);
      fillLight.target.position.copy(point).addScaledVector(UP, 0.35);
      fillLight.target.updateMatrixWorld();
    }
  };

  useLayoutEffect(() => {
    aim(true, 0);
  }, [size.width, size.height, reduced]);

  useFrame((_, delta) => {
    aim(false, Math.min(delta, 0.1));
  });

  return (
    <>
      <hemisphereLight args={[palette.skyHigh, palette.snowShade, 0.7]} />
      <directionalLight ref={key} color={palette.white} intensity={1.1} />
      <directionalLight ref={fill} color={palette.white} intensity={0.42} />
      <directionalLight ref={rim} color={palette.coral} intensity={0.22} />
    </>
  );
}

function clockDrift(current: number, target: number, duration: number) {
  const raw = Math.abs(current - target);
  return Math.min(raw, duration - raw);
}

/**
 * Forward cruise plays at rate 1. Reverse seeks the all-intra file one frame
 * at a time: browsers will not play a negative rate. The clock holds when sitting.
 */
function VideoClock({ ride }: { ride: RideRef }) {
  const seeking = useRef(false);
  const soughtAt = useRef(0);

  useFrame(() => {
    const video = document.querySelector<HTMLVideoElement>('[data-fox-video]');
    if (!video || video.hidden) return;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    if (ride.current.reduced) {
      video.pause();
      if (video.currentTime > 0.001) video.currentTime = 0;
      return;
    }
    const target = backdropTime(ride.current.along, duration);
    const drift = clockDrift(video.currentTime, target, duration);
    if (!ride.current.moving) {
      video.pause();
      if (drift > 0.04) video.currentTime = target;
      return;
    }
    if (ride.current.direction < 0) {
      video.pause();
      const due = !seeking.current || performance.now() - soughtAt.current > 42;
      if (due && drift > 1 / 48) {
        seeking.current = true;
        soughtAt.current = performance.now();
        video.onseeked = () => {
          seeking.current = false;
        };
        video.currentTime = target;
      }
      return;
    }
    video.playbackRate = 1;
    if (video.paused) {
      if (drift > 0.04) video.currentTime = target;
      void video.play().catch(() => undefined);
      return;
    }
    if (drift > 0.25) video.currentTime = target;
  });

  return null;
}

function PlateClear({ plate, palette }: { plate: FoxPlate; palette: FoxPalette }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useLayoutEffect(() => {
    if (plate === 'video') {
      scene.background = null;
      scene.fog = null;
      gl.setClearColor(palette.night, 0);
      return;
    }
    scene.background = palette.skyMid;
    gl.setClearColor(palette.skyMid, 1);
  }, [gl, palette.night, palette.skyMid, plate, scene]);

  return null;
}

/**
 * A useFrame with priority above 0 turns off R3F's automatic render.
 * The fox reads bones at priority 1, after the mixer. This presents last.
 */
function Present() {
  useFrame((state) => {
    state.gl.render(state.scene, state.camera);
  }, 2);
  return null;
}

function World({ reduced, plate }: { reduced: boolean; plate: FoxPlate }) {
  const palette = useMemo(() => readFoxPalette(), []);
  const ride = useRide(reduced);
  ride.current.reduced = reduced;
  const filmed = plate === 'video';

  return (
    <>
      <PlateClear plate={plate} palette={palette} />
      <Present />
      {filmed ? null : <color attach="background" args={[palette.skyMid]} />}
      {filmed ? null : <fogExp2 attach="fog" args={[palette.horizon, 0.05]} />}
      {filmed ? null : <Sky palette={palette} />}
      <Fox ride={ride} reduced={reduced} palette={palette} />
      <CameraRig ride={ride} reduced={reduced} palette={palette} />
      {filmed ? null : <LoopField palette={palette} />}
      {filmed ? <VideoClock ride={ride} /> : null}
      {filmed || reduced ? null : <Snow palette={palette} />}
    </>
  );
}

function LoadBridge() {
  const { progress } = useProgress();

  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('[data-fox-loader-bar]');
    if (bar) bar.style.transform = `scaleX(${Math.min(1, progress / 100)})`;
  }, [progress]);

  return null;
}

type BoundaryProps = { children: ReactNode };
type BoundaryState = { failed: boolean };

class WebglBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    hideLoader();
    document
      .querySelector('[data-fox-stage]')
      ?.setAttribute('data-fox-state', 'error');
  }

  render() {
    if (this.state.failed) {
      return (
        <img
          src="/media/hero-snowfield.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
      );
    }
    return this.props.children;
  }
}

export default function FoxHeroScene({ plate = 'scene' }: { plate?: FoxPlate }) {
  const reduced = useReducedFlag();
  const [active, setActive] = useState<FoxPlate>(() => readFoxPlate(plate));

  useEffect(() => {
    const sync = () => setActive(readFoxPlate(plate));
    sync();
    window.addEventListener('fox-plate', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('fox-plate', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [plate]);

  useEffect(() => {
    applyFoxPlateDom(active);
  }, [active]);

  return (
    <>
      <LoadBridge />
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <WebglBoundary>
          <Canvas
            className="h-full w-full"
            dpr={[1, 1.5]}
            frameloop={reduced ? 'demand' : 'always'}
            camera={{ fov: 32, near: 0.08, far: 90, position: [-1.65, 1.12, 8.65] }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
            }}
            onCreated={({ gl, invalidate }) => {
              gl.toneMapping = ACESFilmicToneMapping;
              gl.toneMappingExposure = 1;
              if (reduced) invalidate();
            }}
          >
            <World reduced={reduced} plate={active} />
          </Canvas>
        </WebglBoundary>
      </div>
    </>
  );
}
