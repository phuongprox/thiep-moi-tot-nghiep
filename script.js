document.addEventListener("DOMContentLoaded", () => {
    
    const stageWrapper = document.getElementById("stageWrapper");
    const envelopeContainer = document.getElementById("envelopeContainer");
    const btnReopenEnvelope = document.getElementById("btnReopenEnvelope");
    const particlesContainer = document.getElementById("particlesContainer");
    const cardSparklesContainer = document.getElementById("cardSparklesContainer");
    
    // Khởi tạo đối tượng nhạc nền ẩn
    const bgMusic = document.getElementById("bgMusic");
    
    // Biến quản lý vòng lặp tạo lấp lánh trong thiệp
    let sparkleIntervalId = null;

    // ==========================================================================
    // A. XỬ LÝ KỊCH BẢN TƯƠNG TÁC MỞ PHONG BÌ ➔ HIỆN THIỆP & PHÁT NHẠC
    // ==========================================================================
    if (envelopeContainer) {
        envelopeContainer.addEventListener("click", function startEnvelopeSequence() {
            // Khóa click trùng lặp trong suốt chu kỳ thực thi hiệu ứng chuyển cảnh
            envelopeContainer.removeEventListener("click", startEnvelopeSequence);
            
            // Bước 1: Kích hoạt lật 3D nắp thư ra phía sau
            stageWrapper.classList.add("step-open-flap");
            
            // Kích hoạt phát nhạc nền mượt mà khi khách tương tác chạm mở bao thư
            if (bgMusic) {
                bgMusic.play().catch(error => {
                    console.log("Trình duyệt chặn phát âm thanh tự động:", error);
                });
            }

            // Bước 2 & 3: Sau 500ms (nắp lật xong), trượt thiệp lên và phóng đại chiếm sân khấu chính
            setTimeout(() => {
                stageWrapper.classList.add("step-reveal-card");
                
                // Khởi chạy dòng chảy hiện tuần tự cho các dòng thông tin sự kiện
                animateInfoBlocks(true);
                
                // KÍCH HOẠT HIỆU ỨNG LẤP LÁNH BÊN TRONG THIỆP
                startCardSparkles();
            }, 550);
        });
    }

    // Hàm điều phối hiệu ứng hiện sole (Staggered Animation) cho cột trái
    function animateInfoBlocks(isAppearing) {
        const blocks = document.querySelectorAll(".info-block-item");
        blocks.forEach((block, index) => {
            setTimeout(() => {
                if (isAppearing) {
                    block.style.opacity = "1";
                    block.style.transform = "translateY(0)";
                } else {
                    block.style.opacity = "0";
                    block.style.transform = "translateY(12px)";
                }
            }, index * 140);
        });
    }

    // ==========================================================================
    // B. XỬ LÝ TÌNH NĂNG NÂNG CAO: ĐÓNG THIỆP LẠI ➔ QUAY VỀ BAN ĐẦU & TẮT NHẠC
    // ==========================================================================
    if (btnReopenEnvelope) {
        btnReopenEnvelope.addEventListener("click", () => {
            // Bước 1: Ẩn tuần tự các dòng thông tin trước khi co thiệp
            animateInfoBlocks(false);
            
            // TẮT HIỆU ỨNG LẤP LÁNH TRONG THIỆP
            stopCardSparkles();
            
            // Tự động tắt nhạc nền và reset thời gian về ban đầu khi quay về phong bì đóng
            if (bgMusic) {
                bgMusic.pause();
                bgMusic.currentTime = 0;
            }

            setTimeout(() => {
                // Bước 2: Thu nhỏ thiệp, trả phong bì về vị trí cũ
                stageWrapper.classList.remove("step-reveal-card");
                
                setTimeout(() => {
                    // Bước 3: Đóng nắp phong bì, hiện lại dấu sáp niêm phong
                    stageWrapper.classList.remove("step-open-flap");
                    
                    // Bước 4: Tái cấu trúc lại trình lắng nghe click để có thể mở lại nhiều lần
                    setTimeout(() => {
                        envelopeContainer.addEventListener("click", function startEnvelopeSequence() {
                            envelopeContainer.removeEventListener("click", startEnvelopeSequence);
                            stageWrapper.classList.add("step-open-flap");
                            
                            if (bgMusic) {
                                bgMusic.play().catch(e => console.log(e));
                            }

                            setTimeout(() => {
                                stageWrapper.classList.add("step-reveal-card");
                                animateInfoBlocks(true);
                                startCardSparkles(); // Bật lại lấp lánh khi mở lại
                            }, 550);
                        });
                    }, 400);

                }, 200);
            }, 200);
        });
    }

    // ==========================================================================
    // C. LOGIC SINH HIỆU ỨNG LẤP LÁNH NỘI BỘ TẤM THIỆP (CARD SPARKLES)
    // ==========================================================================
    const sparkleIcons = ["✦", "✧", "✨"];

    function createSingleSparkle() {
        if (!cardSparklesContainer) return;
        
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle-element";
        sparkle.innerText = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
        
        // Tạo tọa độ ngẫu nhiên dựa trên chiều rộng/cao thực tế của nội dung cuộn thiệp
        const posX = Math.random() * 100; // Tỷ lệ %
        const posY = Math.random() * 100; // Tỷ lệ %
        
        sparkle.style.left = `${posX}%`;
        sparkle.style.top = `${posY}%`;
        
        // Kích thước ngẫu nhiên từ 10px đến 22px
        sparkle.style.fontSize = `${10 + Math.random() * 12}px`;
        
        // Ngẫu nhiên đổi màu giữa vàng kim nhẹ và xanh ngọc lấp lánh cho sinh động
        const colors = ["#ffdf00", "#fff3a8", "#90e0ef", "#ffffff"];
        sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        cardSparklesContainer.appendChild(sparkle);
        
        // Tự động xóa thẻ div ngôi sao sau khi chạy xong animation css (1.5 giây)
        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }

    function startCardSparkles() {
        // Cứ mỗi 300ms tạo ra một ngôi sao lấp lánh mới ngẫu nhiên
        if (!sparkleIntervalId) {
            sparkleIntervalId = setInterval(createSingleSparkle, 300);
        }
    }

    function stopCardSparkles() {
        if (sparkleIntervalId) {
            clearInterval(sparkleIntervalId);
            sparkleIntervalId = null;
        }
        if (cardSparklesContainer) {
            cardSparklesContainer.innerHTML = ""; // Xóa sạch các ngôi sao đang chạy dở
        }
    }

    // ==========================================================================
    // D. TẠO HIỆU ỨNG CÁNH HOA / TRÁI TIM RƠI TỰ ĐỘNG Ở NỀN NGOÀI (BACKGROUND)
    // ==========================================================================
    const particleTypes = ["🌸", "❤️", "✨"];
    const maxParticles = 15;

    function createParticle() {
        if (particlesContainer.children.length >= maxParticles) return;

        const particle = document.createElement("div");
        const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        
        particle.innerText = randomType;
        particle.style.position = "absolute";
        particle.style.userSelect = "none";
        particle.style.pointerEvents = "none";
        
        const startX = Math.random() * window.innerWidth;
        let startY = -20;
        const speedY = 0.7 + Math.random() * 1.2;
        const speedX = (Math.random() - 0.5) * 0.5;
        const rotationSpeed = (Math.random() - 0.5) * 2;
        let currentRotation = Math.random() * 360;
        
        particle.style.left = `${startX}px`;
        particle.style.fontSize = `${12 + Math.random() * 12}px`;
        particle.style.opacity = 0.3 + Math.random() * 0.5;
        
        particlesContainer.appendChild(particle);

        function updateFrame() {
            startY += speedY;
            currentRotation += rotationSpeed;
            
            particle.style.transform = `translate3d(${speedX * startY}px, ${startY}px, 0) rotate(${currentRotation}deg)`;

            if (startY < window.innerHeight) {
                requestAnimationFrame(updateFrame);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(updateFrame);
    }

    setInterval(createParticle, 800);
});