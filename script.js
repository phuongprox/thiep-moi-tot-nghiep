document.addEventListener("DOMContentLoaded", () => {
    
    const stageWrapper = document.getElementById("stageWrapper");
    const envelopeContainer = document.getElementById("envelopeContainer");
    const btnReopenEnvelope = document.getElementById("btnReopenEnvelope");
    const particlesContainer = document.getElementById("particlesContainer");

    // ==========================================================================
    // A. XỬ LÝ KỊCH BẢN TƯƠNG TÁC MỞ PHONG BÌ ➔ HIỆN THIỆP
    // ==========================================================================
    if (envelopeContainer) {
        envelopeContainer.addEventListener("click", function startEnvelopeSequence() {
            // Khóa click trùng lặp trong suốt chu kỳ thực thi hiệu ứng chuyển cảnh
            envelopeContainer.removeEventListener("click", startEnvelopeSequence);
            
            // Bước 1: Kích hoạt lật 3D nắp thư ra phía sau
            stageWrapper.classList.add("step-open-flap");

            // Bước 2 & 3: Sau 500ms (nắp lật xong), trượt thiệp lên và phóng đại chiếm sân khấu chính
            setTimeout(() => {
                stageWrapper.classList.add("step-reveal-card");
                
                // Khởi chạy dòng chảy hiện tuần tự cho các dòng thông tin sự kiện
                animateInfoBlocks(true);
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
            }, index * 140); // Mỗi khối thông tin xuất hiện/ẩn cách nhau 140ms
        });
    }

    // ==========================================================================
    // B. XỬ LÝ TÍNH NĂNG NÂNG CAO: ĐÓNG THIỆP LẠI ➔ QUAY VỀ PHONG BÌ BAN ĐẦU
    // ==========================================================================
    if (btnReopenEnvelope) {
        btnReopenEnvelope.addEventListener("click", () => {
            // Bước 1: Ẩn tuần tự các dòng thông tin trước khi co thiệp
            animateInfoBlocks(false);

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
                            setTimeout(() => {
                                stageWrapper.classList.add("step-reveal-card");
                                animateInfoBlocks(true);
                            }, 550);
                        });
                    }, 400);

                }, 200);
            }, 200);
        });
    }

    // ==========================================================================
    // C. TỐI ƯU HIỆU NĂNG: TẠO HIỆU ỨNG CÁNH HOA / TRÁI TIM RƠI TỰ ĐỘNG
    // ==========================================================================
    const particleTypes = ["🌸", "❤️", "✨"];
    const maxParticles = 15; // Giới hạn số lượng đối tượng cùng xuất hiện để bảo vệ CPU/RAM

    function createParticle() {
        if (particlesContainer.children.length >= maxParticles) return;

        const particle = document.createElement("div");
        const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        
        particle.innerText = randomType;
        particle.style.position = "absolute";
        particle.style.userSelect = "none";
        particle.style.pointerEvents = "none";
        
        // Thiết lập các thông số ngẫu nhiên ban đầu ứng dụng requestAnimationFrame giả lập
        const startX = Math.random() * window.innerWidth;
        let startY = -20;
        const speedY = 0.7 + Math.random() * 1.2; // Tốc độ rơi chậm, lãng mạn
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
            
            // Di chuyển mượt mà thông qua việc gán trực tiếp tọa độ
            particle.style.transform = `translate3d(${speedX * startY}px, ${startY}px, 0) rotate(${currentRotation}deg)`;

            // Nếu đối tượng rơi ra khỏi rìa màn hình dưới thì tiến hành dọn dẹp giải phóng bộ nhớ
            if (startY < window.innerHeight) {
                requestAnimationFrame(updateFrame);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(updateFrame);
    }

    // Tạo các hạt rơi tự động với chu kỳ giãn cách đều đặn
    setInterval(createParticle, 800);
});