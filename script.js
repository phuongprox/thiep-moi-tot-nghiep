document.getElementById('envelopeWrapper').addEventListener('click', function() {
    const isAlreadyOpen = this.classList.contains('open');
    
    if (!isAlreadyOpen) {
        // Thêm class 'open' để kích hoạt hiệu ứng CSS mở bao thư
        this.classList.add('open');
        
        // Đổi dòng chữ gợi ý hướng dẫn
        document.getElementById('hintText').innerHTML = "Chúc mừng ngày tốt nghiệp! 🎉";

        // Kích hoạt hiệu ứng bắn pháo hoa từ 2 góc màn hình sau 400ms
        setTimeout(() => {
            var duration = 3 * 1000;
            var end = Date.now() + duration;

            (function frame() {
                // Bắn pháo hoa bên trái
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.8 }
                });
                // Bắn pháo hoa bên phải
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.8 }
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }, 400); 
    } else {
        // Nếu click lần nữa thì đóng lại
        this.classList.remove('open');
        document.getElementById('hintText').innerHTML = "Chạm hoặc Click vào bao thư để mở nhé! ✨";
    }
});