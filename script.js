// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;

    // Use FormData and named fields to avoid relying on DOM order
    const fd = new FormData(form);
    const payload = {
        name: fd.get('name') || fd.get('nama') || '',
        email: fd.get('email') || '',
        phone: fd.get('phone') || fd.get('tel') || '',
        message: fd.get('message') || fd.get('pesan') || fd.get('note') || ''
    };

    try {
        console.log('Submitting payload', payload);
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Network response was not ok');
        alert(data.message || 'Terima kasih! Pesan Anda telah dikirim.');
        form.reset();
    } catch (err) {
        console.error('Submit error', err);
        alert('Terjadi kesalahan saat mengirim pesan. Coba lagi nanti.');
    }
}

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.reason-card, .portfolio-item, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});
