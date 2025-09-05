import * as THREE from 'three'

export default class FlowingWavesBackground {
            constructor(containerId) {
                this.container = document.getElementById(containerId);
                this.scene = null;
                this.camera = null;
                this.renderer = null;
                this.waves = [];
                this.time = 0;
                this.animationId = null;

                this.bindEvents();
            }

            init() {
                // Scene setup
                this.scene = new THREE.Scene();

                // Camera setup
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                this.camera.position.z = 5;

                // Renderer setup
                this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setClearColor(0x000000, 0);
                this.container.appendChild(this.renderer.domElement);

                // Create multiple wave lines
                this.createWaves();

                // Start animation
                this.animate();
            }

            createWaves() {
                const waveCount = 10;

                for (let i = 0; i < waveCount; i++) {
                    const points = [];
                    const segments = 200;

                    // Create wave points
                    for (let j = 0; j <= segments; j++) {
                        const x = -(j/segments * 40 - 20) ;
                        const y = 0;
                        const z = 0;
                        points.push(new THREE.Vector3(x, y, z));
                    }

                    const geometry = new THREE.BufferGeometry().setFromPoints(points);

                    // Create material with varying opacity
                    const material = new THREE.LineBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.15 + (i * 0.05),
                        linewidth: 2
                    });

                    const wave = new THREE.Line(geometry, material);

                    // Position waves
                    wave.position.y = 0;
                    wave.position.z = -1;

                    // Store wave properties
                    wave.userData = {
                        originalY: 1,
                        speed: 1,
                        amplitude: 1.5,
                        frequency: 0.5,
                        phaseOffset: Math.PI * 1.5
                    };

                    this.scene.add(wave);
                    this.waves.push(wave);
                }
            }

            updateWaves() {
                this.waves.forEach((wave, waveIndex) => {
                    const positions = wave.geometry.attributes.position.array;
                    const data = wave.userData;

                    for (let i = 0; i < positions.length; i += 3) {
                        const x = positions[i];

                        // Create flowing wave motion
                        const waveY = Math.sin(x * data.frequency + this.time * data.speed + data.phaseOffset) * data.amplitude * 0.5;
                        const waveY2 = Math.sin(x * data.frequency * 2 + this.time * data.speed * 0.7 + data.phaseOffset) * data.amplitude * 0.5;
                        const waveY3 = Math.sin(x * data.frequency * 0.5 + this.time * data.speed * 1.3 + data.phaseOffset) * data.amplitude * 0.4;

                        positions[i + 1] = data.originalY + waveY + waveY2 + waveY3;
                    }

                    wave.geometry.attributes.position.needsUpdate = true;

                    // Add gentle rotation and movement
                    wave.rotation.z = Math.sin(this.time * 0.2 + waveIndex) * 0.1;
                    wave.position.x = Math.sin(this.time * 0.1 + waveIndex * 0.5) * 0.5;
                });
            }

            animate() {
                this.animationId = requestAnimationFrame(() => this.animate());

                this.time += 0.016; // ~60fps
                this.updateWaves();

                this.renderer.render(this.scene, this.camera);
            }

            onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }

            bindEvents() {
                window.addEventListener('resize', () => this.onWindowResize());
            }

            // Public methods for control
            start() {
                if (!this.animationId) {
                    this.animate();
                }
            }

            stop() {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            }

            dispose() {
                this.stop();

                // Clean up Three.js resources
                this.waves.forEach(wave => {
                    wave.geometry.dispose();
                    wave.material.dispose();
                    this.scene.remove(wave);
                });

                this.renderer.dispose();

                // Remove event listeners
                window.removeEventListener('resize', () => this.onWindowResize());

                // Remove canvas from DOM
                if (this.renderer.domElement.parentNode) {
                    this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
                }
            }
        }
