"use client";

import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from "ogl";

export default function Galaxy({ transparent = true }: { transparent?: boolean }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({ alpha: transparent, dpr: 2 });
        const gl = renderer.gl;
        containerRef.current.appendChild(gl.canvas);

        gl.clearColor(0, 0, 0, 0);

        const camera = new Camera(gl, { fov: 35 });
        camera.position.set(0, 1, 7);
        camera.lookAt([0, 0, 0]);

        const scene = new Transform();

        // Resize handler
        const resize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
        };
        window.addEventListener("resize", resize, false);
        resize();

        // Create particles geometry
        const numParticles = 2000;
        const position = new Float32Array(numParticles * 3);
        const random = new Float32Array(numParticles * 3);

        for (let i = 0; i < numParticles; i++) {
            const radius = Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;

            position[i * 3 + 0] = Math.cos(theta) * radius;
            position[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // Thin disk
            position[i * 3 + 2] = Math.sin(theta) * radius;

            random[i * 3 + 0] = Math.random();
            random[i * 3 + 1] = Math.random();
            random[i * 3 + 2] = Math.random();
        }

        const geometry = new Geometry(gl, {
            position: { size: 3, data: position },
            random: { size: 3, data: random }
        });

        // Custom shader
        const vertex = /* glsl */ `
      attribute vec3 position;
      attribute vec3 random;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;

      varying vec3 vRandom;

      void main() {
        vRandom = random;

        vec3 pos = position;
        // Simple rotation based on distance from center
        float dist = length(pos.xz);
        float angle = uTime * 0.1 * (1.0 / (dist + 0.1));
        
        float x = pos.x * cos(angle) - pos.z * sin(angle);
        float z = pos.x * sin(angle) + pos.z * cos(angle);
        pos.x = x;
        pos.z = z;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Simple perspective scaling
        gl_PointSize = (20.0 * random.x) / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

        const fragment = /* glsl */ `
      precision highp float;
      varying vec3 vRandom;

      void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float r = dot(cxy, cxy);
        if (r > 1.0) {
            discard;
        }

        // Color based on random attributes
        vec3 color = mix(vec3(0.5, 0.7, 1.0), vec3(1.0, 0.8, 0.5), vRandom.y);
        gl_FragColor = vec4(color, 1.0 - r);
      }
    `;

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 }
            },
            // Ensure blending works correctly
            transparent: true,
            depthWrite: false
        });

        const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });
        particles.setParent(scene);

        let animationId: number;
        const update = (t: number) => {
            animationId = requestAnimationFrame(update);

            program.uniforms.uTime.value = t * 0.001;

            // Slowly rotate the entire system
            particles.rotation.y = t * 0.0001;
            particles.rotation.x = 0.2; // Tilt it slightly so we see it as a disk

            renderer.render({ scene, camera });
        };
        animationId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
            if (containerRef.current && containerRef.current.contains(gl.canvas)) {
                containerRef.current.removeChild(gl.canvas);
            }
            geometry.remove();
            program.remove();
        };
    }, [transparent]);

    return <div ref={containerRef} className="w-full h-full" />;
}
