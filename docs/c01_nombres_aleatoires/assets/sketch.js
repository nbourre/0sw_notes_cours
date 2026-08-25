window.sketchUniformDistribution = (p) => {
    let conteneurs = [];

    let binWidth;
    let binNb;

    let height;
    let width;

    p.setup = () =>  {

        p.createCanvas (640, 320);
        p.background (255);
        
        height = p.height;
        width = p.width;

        

        binNb = 20
        binWidth = width / binNb;

        for (var i = 0; i < binNb; i++) {
            conteneurs[i] = 0;
        }
        }

    p.draw = () => {

        let x = p.int(p.random (0, binNb));

        conteneurs[x]++;

        p.fill(170);
        p.rect (x * binWidth, height - conteneurs[x], binWidth - 1, conteneurs[x]);

        if (height - conteneurs[x] <= 0) {
            p.background (255);

            for (var i = 0; i < binNb; i++) {
                conteneurs[i] = 0;
            }
        }

    }
}

window.sketchGaussianDistribution = (p) => {
    let randomCounts = [];

    let height;
    let width;

    p.setup = () =>  {

        p.createCanvas (640, 320);
        p.background (255);

        height = p.height;
        width = p.width;

        let binNb = 50;

        for (var i = 0; i < binNb; i++) {
            randomCounts[i] = 0;
        }
    }

    p.draw = () => {

        p.background (255);

        let num = p.randomGaussian();
        let sd = 5;
        let mean = randomCounts.length / 2;

        let index = p.int (sd * num + mean);
        randomCounts[index]++;

        p.stroke (0);
        p.fill (175);
        let w = width / randomCounts.length;

        for (let x = 0; x < randomCounts.length; x++) {
            p.rect (x * w, height - randomCounts[x], w - 1, randomCounts[x]);
        }

        if (height - randomCounts[index] <= 0) {
            for (let i = 0; i < randomCounts.length; i++) {
                randomCounts[i] = 0;
            }
        }
    }
}

