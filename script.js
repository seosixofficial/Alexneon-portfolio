// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.custom-cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Add slight delay for the glow
        setTimeout(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }, 50);
    });

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .back-to-top');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- 2. Smooth Scrolling (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        direction: 'vertical',
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 3. Page Loader ---
    const loaderProgress = document.querySelector('.loader-progress');
    const pageLoader = document.querySelector('.page-loader');

    gsap.to(loaderProgress, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(pageLoader, {
                yPercent: -100,
                duration: 1,
                ease: 'power4.inOut',
                onComplete: initAnimations // Start animations after load
            });
        }
    });

    // --- 4. Lottie Animations ---
    const contactLottie = lottie.loadAnimation({
        container: document.getElementById('contact-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        // Mail/Message animation
        path: 'https://assets8.lottiefiles.com/packages/lf20_u25cckyh.json'
    });

    const bttLottie = lottie.loadAnimation({
        container: document.getElementById('btt-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: false,
        // Up arrow/gear animation
        path: 'https://assets1.lottiefiles.com/packages/lf20_3rwvasiw.json'
    });

    document.getElementById('back-to-top').addEventListener('mouseenter', () => {
        bttLottie.play();
    });
    document.getElementById('back-to-top').addEventListener('mouseleave', () => {
        bttLottie.stop();
    });
    document.getElementById('back-to-top').addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    });


    // --- 5. Main GSAP Animations (Called after loader) ---
    function initAnimations() {
        
        // Hero Text Reveal
        const nameTitle = new SplitType('.name-title', { types: 'chars' });
        
        gsap.from(nameTitle.chars, {
            y: 100,
            opacity: 0,
            rotationX: -90,
            stagger: 0.05,
            duration: 1,
            ease: 'back.out(1.7)'
        });

        gsap.from('.intro-text, .hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            stagger: 0.2
        });

        gsap.from('#hero-character', {
            scale: 0.5,
            opacity: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.8
        });

        // Skills Section Progress Bars
        const skillItems = document.querySelectorAll('.skill-item');
        
        // Staggered Entrance for the Skill Containers
        gsap.from(skillItems, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: ".skills-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        skillItems.forEach((item, index) => {
            const bar = item.querySelector('.skill-progress');
            const percentText = item.querySelector('.skill-percent');
            const targetWidth = bar.getAttribute('data-width');
            const targetVal = parseFloat(percentText.getAttribute('data-target'));
            
            bar.style.width = '0%';
            
            gsap.to(bar, {
                width: targetWidth,
                duration: 1.5,
                delay: index * 0.2 + 0.2, // Match the stagger delay
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ".skills-grid",
                    start: 'top 85%'
                }
            });

            gsap.to({ val: 0 }, {
                val: targetVal,
                duration: 1.5,
                delay: index * 0.2 + 0.2, // Match the stagger delay
                ease: "power3.out",
                onUpdate: function() {
                    percentText.innerHTML = Math.round(this.targets()[0].val) + "%";
                },
                scrollTrigger: {
                    trigger: ".skills-grid",
                    start: 'top 85%'
                }
            });
        });

        // Education Timeline Animation
        const timelineLine = document.querySelector('.timeline-progress');
        if (timelineLine) {
            gsap.to(timelineLine, {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-container",
                    start: "top 60%",
                    end: "bottom 60%",
                    scrub: 1
                }
            });
        }

        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item) => {
            const isLeft = item.classList.contains('left');
            gsap.fromTo(item, 
                { x: isLeft ? -100 : 100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                        onEnter: () => {
                        gsap.to(item.querySelector('.timeline-dot'), {
                            backgroundColor: "#ccff00",
                            boxShadow: "0 0 15px rgba(204, 255, 0, 0.6)",
                            duration: 0.5
                        });
                    },
                    onLeaveBack: () => {
                        gsap.to(item.querySelector('.timeline-dot'), {
                            backgroundColor: "#050505",
                            boxShadow: "none",
                            duration: 0.5
                        });
                    }
                }
            });
        });

        // Vertical Scroll Animation for Projects
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
            const isLeft = i % 2 === 0;
            
            gsap.from(card, {
                x: isLeft ? -200 : 200,
                y: -150,
                opacity: 0,
                rotation: isLeft ? -10 : 10,
                scale: 0.9,
                duration: 1.5,
                ease: "back.out(1.2)", // Smooth, gentle bounce
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    toggleActions: "play reverse play reverse"
                }
            });
        });

        // 3D Tilt Effect on Project Cards
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: 'power2.out',
                    duration: 0.5
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: 'power2.out',
                    duration: 0.5
                });
            });
        });
    }

    // --- 6. Global Three.js Particle Background ---
    initThreeJSBackground();
    
    // --- 6.5 Hero Particles ---
    initHeroParticles();

    function initThreeJSBackground() {
        const container = document.getElementById('particle-object-container');
        if (!container) return;

        const canvas = document.getElementById('bg-canvas');
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesCount = 3000;
        const color1 = new THREE.Color(0x90ee90); // Light Green
        const color2 = new THREE.Color(0xccff00); // Neon Lime Green

        // Geometries/Shapes arrays
        const posRandom = new Float32Array(particlesCount * 3);
        const posSphere = new Float32Array(particlesCount * 3);
        const posCube = new Float32Array(particlesCount * 3);
        const posTorus = new Float32Array(particlesCount * 3);
        
        const colorsArray = new Float32Array(particlesCount * 3);
        const sizesArray = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            
            // Random
            posRandom[i3] = (Math.random() - 0.5) * 100;
            posRandom[i3+1] = (Math.random() - 0.5) * 100;
            posRandom[i3+2] = (Math.random() - 0.5) * 100;

            // Sphere
            const phi = Math.acos( -1 + ( 2 * i ) / particlesCount );
            const theta = Math.sqrt( particlesCount * Math.PI ) * phi;
            const r = 15;
            posSphere[i3] = r * Math.cos(theta) * Math.sin(phi);
            posSphere[i3+1] = r * Math.sin(theta) * Math.sin(phi);
            posSphere[i3+2] = r * Math.cos(phi);

            // Cube
            let xC = Math.random() * 2 - 1;
            let yC = Math.random() * 2 - 1;
            let zC = Math.random() * 2 - 1;
            let absX = Math.abs(xC), absY = Math.abs(yC), absZ = Math.abs(zC);
            let maxC = Math.max(absX, absY, absZ);
            if(maxC === absX) xC = Math.sign(xC);
            else if(maxC === absY) yC = Math.sign(yC);
            else zC = Math.sign(zC);
            const sCube = 10;
            posCube[i3] = xC * sCube;
            posCube[i3+1] = yC * sCube;
            posCube[i3+2] = zC * sCube;

            // Torus
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI * 2;
            const RTorus = 10;
            const rTube = 4;
            posTorus[i3] = (RTorus + rTube * Math.cos(v)) * Math.cos(u);
            posTorus[i3+1] = rTube * Math.sin(v);
            posTorus[i3+2] = (RTorus + rTube * Math.cos(v)) * Math.sin(u);

            const mixRatio = Math.random();
            const mixedColor = color1.clone().lerp(color2, mixRatio);
            colorsArray[i3] = mixedColor.r;
            colorsArray[i3+1] = mixedColor.g;
            colorsArray[i3+2] = mixedColor.b;
            
            sizesArray[i] = Math.random();
        }

        const geometry = new THREE.BufferGeometry();
        // Base positions that will be morphed
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posRandom), 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

        // Custom Shader Material for Morphing and Repel
        const vertexShader = `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (200.0 / -mvPosition.z); // Adjusted size multiplier
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        const fragmentShader = `
            varying vec3 vColor;
            void main() {
                // Procedural soft circle
                float dist = distance(gl_PointCoord, vec2(0.5));
                if (dist > 0.5) discard;
                float alpha = 1.0 - (dist * 2.0); // Soft edge
                
                gl_FragColor = vec4(vColor, alpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);

        // Morph target states
        let currentPositions = new Float32Array(posRandom);
        let targetPositions = posRandom;

        // Global scroll progress for parallel morphing
        let globalScrollProgress = 0;

        // Determine shape and highlight text based on scroll through the 'About' section
        const diffItemsNodeList = document.querySelectorAll('.diff-item');
        
        ScrollTrigger.create({
            trigger: "#about",
            start: "top top", // When top of #about hits top of viewport
            end: "bottom bottom", // When bottom of #about hits bottom of viewport
            onUpdate: (self) => {
                globalScrollProgress = self.progress;

                // Reset
                diffItemsNodeList.forEach(item => item.classList.remove('active'));

                if (globalScrollProgress < 0.25) {
                    if(diffItemsNodeList[0]) diffItemsNodeList[0].classList.add('active');
                } else if (globalScrollProgress < 0.5) {
                    if(diffItemsNodeList[1]) diffItemsNodeList[1].classList.add('active');
                } else if (globalScrollProgress < 0.75) {
                    if(diffItemsNodeList[2]) diffItemsNodeList[2].classList.add('active');
                } else {
                    if(diffItemsNodeList[3]) diffItemsNodeList[3].classList.add('active');
                }
            }
        });

        // Fade out particles when reaching Technical Arsenal
        gsap.to("#particle-object-container", {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top 80%",
                end: "top 20%",
                scrub: true
            }
        });

        let mouseX = 0;
        let mouseY = 0;
        let windowHalfX = container.clientWidth / 2;
        let windowHalfY = container.clientHeight / 2;

        // Use a raycaster to find intersection point in 3D for repel
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(-1000, -1000);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // interaction plane

        container.addEventListener('mousemove', (event) => {
            const rect = container.getBoundingClientRect();
            const clientX = event.clientX - rect.left;
            const clientY = event.clientY - rect.top;

            mouseX = (clientX - windowHalfX);
            mouseY = (clientY - windowHalfY);
            
            mouse.x = (clientX / container.clientWidth) * 2 - 1;
            mouse.y = -(clientY / container.clientHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            const time = clock.getElapsedTime();
            
            // Raycast for mouse repel position in 3D world
            raycaster.setFromCamera(mouse, camera);
            const intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersectPoint);

            const positions = geometry.attributes.position.array;

            // Calculate parallel morphing variables based on scroll progress
            let shape1, shape2, lerpFactor;
            const p = globalScrollProgress * 3; // map 0-1 to 0-3
            
            if (p < 1) {
                shape1 = posRandom; shape2 = posSphere; lerpFactor = p;
            } else if (p < 2) {
                shape1 = posSphere; shape2 = posCube; lerpFactor = p - 1;
            } else {
                shape1 = posCube; shape2 = posTorus; lerpFactor = p - 2;
            }

            // Smooth ease for the lerp transition (cosine ease-in-out)
            const easedFactor = 0.5 - 0.5 * Math.cos(lerpFactor * Math.PI);

            // Morphing and Repel Logic
            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                
                // Interpolate exact position between shape1 and shape2 based on scroll
                let tx = shape1[i3] + (shape2[i3] - shape1[i3]) * easedFactor;
                let ty = shape1[i3+1] + (shape2[i3+1] - shape1[i3+1]) * easedFactor;
                let tz = shape1[i3+2] + (shape2[i3+2] - shape1[i3+2]) * easedFactor;

                // Add slight rotation to the shapes
                const angle = time * 0.2;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);
                const rx = tx * cosA - tz * sinA;
                const rz = tx * sinA + tz * cosA;
                tx = rx;
                tz = rz;

                // Mouse Repel
                const pVec = new THREE.Vector3(positions[i3], positions[i3+1], positions[i3+2]);
                const dist = pVec.distanceTo(intersectPoint);
                const repelRadius = 15;
                
                if (dist < repelRadius) {
                    const force = (repelRadius - dist) / repelRadius; // 0 to 1
                    const dir = pVec.clone().sub(intersectPoint).normalize();
                    tx += dir.x * force * 10;
                    ty += dir.y * force * 10;
                    tz += dir.z * force * 10;
                }

                // Lerp current to target
                currentPositions[i3] += (tx - currentPositions[i3]) * 0.05;
                currentPositions[i3+1] += (ty - currentPositions[i3+1]) * 0.05;
                currentPositions[i3+2] += (tz - currentPositions[i3+2]) * 0.05;

                positions[i3] = currentPositions[i3];
                positions[i3+1] = currentPositions[i3+1];
                positions[i3+2] = currentPositions[i3+2];
            }

            geometry.attributes.position.needsUpdate = true;

            // Optional: rotate the whole mesh slightly based on mouse
            particlesMesh.rotation.y = mouseX * 0.0005;
            particlesMesh.rotation.x = mouseY * 0.0005;

            renderer.render(scene, camera);
        }

        animateParticles();

        window.addEventListener('resize', () => {
            windowHalfX = container.clientWidth / 2;
            windowHalfY = container.clientHeight / 2;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // --- 7. Matter.js 2D Physics Playground ---
    initPhysicsPlayground();

    function initPhysicsPlayground() {
        const container = document.getElementById('physics-container');
        if (!container) return;

        const Engine = Matter.Engine,
              Render = Matter.Render,
              Runner = Matter.Runner,
              MouseConstraint = Matter.MouseConstraint,
              Mouse = Matter.Mouse,
              World = Matter.World,
              Bodies = Matter.Bodies;

        const engine = Engine.create();
        const world = engine.world;

        // Create renderer
        const render = Render.create({
            element: container,
            engine: engine,
            options: {
                width: container.clientWidth,
                height: container.clientHeight,
                background: 'transparent',
                wireframes: false
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add walls
        const wallOptions = { isStatic: true, render: { fillStyle: 'transparent' } };
        World.add(world, [
            Bodies.rectangle(container.clientWidth/2, container.clientHeight + 25, container.clientWidth, 50, wallOptions), // Bottom
            Bodies.rectangle(-25, container.clientHeight/2, 50, container.clientHeight, wallOptions), // Left
            Bodies.rectangle(container.clientWidth + 25, container.clientHeight/2, 50, container.clientHeight, wallOptions) // Right
        ]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        World.add(world, mouseConstraint);
        render.mouse = mouse;

        // Function to drop items
        const neonColor = '#ccff00';
        container.addEventListener('click', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const types = ['circle', 'rectangle', 'polygon'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            let body;
            const commonOptions = {
                restitution: 0.8, // Bouncy
                render: {
                    fillStyle: Math.random() > 0.5 ? neonColor : 'transparent',
                    strokeStyle: neonColor,
                    lineWidth: 2
                }
            };

            if (type === 'circle') {
                body = Bodies.circle(x, y, 20 + Math.random() * 20, commonOptions);
            } else if (type === 'rectangle') {
                body = Bodies.rectangle(x, y, 40 + Math.random() * 40, 20 + Math.random() * 20, commonOptions);
            } else {
                body = Bodies.polygon(x, y, Math.floor(Math.random() * 3) + 3, 20 + Math.random() * 20, commonOptions);
            }

            World.add(world, body);
        });

        // Resize handler
        window.addEventListener('resize', () => {
            render.canvas.width = container.clientWidth;
            render.canvas.height = container.clientHeight;
            Matter.Body.setPosition(world.bodies[0], { x: container.clientWidth/2, y: container.clientHeight + 25 });
        });
    }

    function initHeroParticles() {
        const canvas = document.getElementById('hero-particles');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const count = 50;

        for(let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 2 + 1,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5 - 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;

                if(p.x < 0) p.x = width;
                if(p.x > width) p.x = 0;
                if(p.y < 0) p.y = height;
                if(p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(204, 255, 0, ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }
        draw();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

});
