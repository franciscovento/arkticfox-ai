import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { useProgress } from '@react-three/drei/core/Progress.js';
import { useAnimations } from '@react-three/drei/core/useAnimations.js';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Component,
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
import {
  DRIFTS,
  FOX_SCALE,
  FOX_URL,
  IDLE_AFTER_MS,
  PATH_FORWARD,
  PATH_LENGTH,
  STRIDE,
  buildTrail,
  frameFor,
  pointOnPath,
} from './fox/path';
import { makeSnowTexture } from './fox/snowTexture';

useGLTF.preload(FOX_URL, false, false);

const CLIP_WALK = 'Walk';
const CLIP_SIT = 'Sit';
const FADE = dur.reveal * 0.5;
const SNOW_COUNT = 380;
const TURN_TAU = dur.reveal * 0.55;
const UP = new Vector3(0, 1, 0);
const _point = new Vector3();
const _aim = new Vector3();
const _cam = new Vector3();
const _look = new Vector3();
const _nose = new Vector3();
const _want = new Vector3();
const _desired = new Quaternion();
const _pivot = new Object3D();

type ClipName = typeof CLIP_WALK | typeof CLIP_SIT;
type Facing = 'forward' | 'back' | 'camera';

type Ride = {
  progress: number;
  moving: boolean;
  reduced: boolean;
  /** +1 scroll down (advance), -1 scroll up (retreat). */
  direction: 1 | -1;
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
    point: pointOnPath(reduced ? 0.12 : 0, new Vector3()),
  });

  useEffect(() => {
    ride.current.reduced = reduced;
  }, [reduced]);

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>('[data-fox-stage]');
    let frame = 0;
    let last = ride.current.progress;
    let primed = false;
    let lastChange = performance.now();

    const tick = () => {
      const rideNow = ride.current;
      if (!stage || rideNow.reduced) {
        rideNow.progress = 0.12;
        rideNow.moving = false;
      } else {
        const total = stage.offsetHeight - window.innerHeight;
        const top = stage.getBoundingClientRect().top + window.scrollY;
        const scrolled = window.scrollY - top;
        const next =
          total <= 0 ? 0 : Math.min(1, Math.max(0, scrolled / total));
        if (!primed) {
          primed = true;
          last = next;
          rideNow.moving = false;
        } else if (Math.abs(next - last) > 0.00012) {
          rideNow.direction = next > last ? 1 : -1;
          last = next;
          lastChange = performance.now();
          rideNow.moving = true;
        } else if (performance.now() - lastChange > IDLE_AFTER_MS) {
          rideNow.moving = false;
        }
        rideNow.progress = next;
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
            vec3 color = mix(lowColor, midColor, smoothstep(0.0, 0.42, h));
            color = mix(color, highColor, smoothstep(0.35, 1.0, h));
            float band = exp(-pow((h - 0.38) * 7.0, 2.0));
            color = mix(color, glowColor, band * 0.28);
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
      <sphereGeometry args={[72, 40, 28]} />
    </mesh>
  );
}

function SnowField({ palette }: { palette: FoxPalette }) {
  const trail = useMemo(() => buildTrail(0.7), []);
  const ground = useMemo(
    () => makeSnowTexture(palette.snow, palette.snowShade, palette.ice),
    [palette],
  );
  const driftMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: palette.snow,
        roughness: 1,
        metalness: 0,
      }),
    [palette.snow],
  );

  useEffect(
    () => () => {
      trail.dispose();
      ground.dispose();
      driftMaterial.dispose();
    },
    [trail, ground, driftMaterial],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial
          map={ground}
          color={palette.snow}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh geometry={trail}>
        <meshStandardMaterial
          color={palette.trail}
          roughness={1}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      {DRIFTS.map(([x, z, radius, height], index) => (
        <mesh
          key={index}
          position={[x, radius * 0.28 * height * 0.42, z]}
          scale={[radius, radius * 0.28 * height, radius * 0.86]}
          material={driftMaterial}
        >
          <sphereGeometry args={[1, 28, 18]} />
        </mesh>
      ))}
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
        color={palette.snow}
        size={0.05}
        transparent
        opacity={0.78}
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
  const progressPrev = useRef(ride.current.progress);
  const turned = useRef(false);
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
    const rig = group.current;
    const sit = actions[CLIP_SIT];
    const walk = actions[CLIP_WALK];
    if (!rig || !sit || !walk) {
      publish('error', 0, 'camera', 0, '0,0');
      hideLoader();
      return;
    }
    sit.reset().fadeIn(0).play();
    sit.setLoop(LoopRepeat, Infinity);
    sit.paused = true;
    mixer.update(0);
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
    );
    hideLoader();
    invalidate();
  }, [actions, invalidate, mixer, narrow, reduced, ride]);

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
    const deltaProgress = rideNow.progress - progressPrev.current;
    progressPrev.current = rideNow.progress;
    if (clip === CLIP_WALK) {
      const walk = actions[CLIP_WALK];
      if (walk) {
        const duration = walk.getClip().duration || 1;
        walk.paused = true;
        walk.time =
          (walk.time + (Math.abs(deltaProgress) * PATH_LENGTH) / STRIDE) %
          duration;
      }
    } else {
      const sit = actions[CLIP_SIT];
      if (sit) sit.paused = true;
    }
    pointOnPath(rideNow.progress, rideNow.point);
    rig.position.copy(rideNow.point);
    const facing = facingFor(rideNow);
    aimBody(facing, rideNow.progress, rideNow.point, narrow);
    const dt = Math.min(delta, 0.05);
    if (rideNow.reduced || !turned.current) rig.quaternion.copy(_desired);
    else {
      rig.quaternion.slerp(_desired, 1 - Math.exp(-dt / TURN_TAU));
      if (rig.quaternion.angleTo(_desired) < 0.02) rig.quaternion.copy(_desired);
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
    );
  });

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

  useLayoutEffect(() => {
    if (key.current) scene.add(key.current.target);
    if (rim.current) scene.add(rim.current.target);
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
    const fov = narrow ? 38 : 32;
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
  };

  useLayoutEffect(() => {
    aim(true, 0);
  }, [size.width, size.height, reduced]);

  useFrame((_, delta) => {
    aim(false, Math.min(delta, 0.05));
  });

  return (
    <>
      <hemisphereLight args={[palette.skyLow, palette.snowShade, 0.85]} />
      <directionalLight ref={key} color={palette.white} intensity={1.45} />
      <directionalLight ref={rim} color={palette.coral} intensity={0.72} />
    </>
  );
}

function World({ reduced }: { reduced: boolean }) {
  const palette = useMemo(() => readFoxPalette(), []);
  const ride = useRide(reduced);
  ride.current.reduced = reduced;

  return (
    <>
      <color attach="background" args={[palette.skyMid]} />
      <fogExp2 attach="fog" args={[palette.skyLow, 0.04]} />
      <Sky palette={palette} />
      <SnowField palette={palette} />
      <Fox ride={ride} reduced={reduced} palette={palette} />
      <CameraRig ride={ride} reduced={reduced} palette={palette} />
      {reduced ? null : <Snow palette={palette} />}
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

export default function FoxHeroScene() {
  const reduced = useReducedFlag();

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
              alpha: false,
              powerPreference: 'high-performance',
              stencil: false,
            }}
            onCreated={({ gl, invalidate }) => {
              gl.toneMapping = ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.06;
              if (reduced) invalidate();
            }}
          >
            <World reduced={reduced} />
          </Canvas>
        </WebglBoundary>
      </div>
    </>
  );
}
