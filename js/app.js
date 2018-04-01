const canvas = select('canvas');
const colors = ['#ff7c4c', '#330d00', '#000000', '#ffc3a0', '#4c3a30'];
const maxCats = 100;

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
}

window.addEventListener('resize', resize);
resize();

const cats = [];
let target = new Vector(canvas.width / 2, canvas.height / 2)

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const cat of cats) {
        cat.applyForce(cat.seek(target));
        if (cats.length > 1) cat.applyForce(cat.separate(cats));
        cat.update();
        cat.show();
    }
    window.requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
    target.set(e.offsetX, e.offsetY);
});

canvas.addEventListener('click', (e) => {
    if (cats.length < maxCats) cats.push(new Cat(canvas, colors[Math.floor(random(colors.length))]));
});

animate();